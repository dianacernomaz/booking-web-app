import { axiosClient, SESSION_CHANGED_EVENT, SESSION_KEY, USER_KEY } from '../axios/axiosClient';
import { decodeToken } from '../utils/jwt';

export interface SessionUser {
    userId?: string;
    email: string;
    fullName: string;
    initials: string;
    role?: 'admin' | 'user';
    token?: string;
}

export interface StoredUser {
    fullName: string;
    email: string;
    phone?: string;
    birthDate?: string;
    city?: string;
    country?: string;
    bio?: string;
    password: string;
    role?: 'admin' | 'user';
}

function readJson<T>(key: string): T | null {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    try {
        return JSON.parse(raw) as T;
    } catch {
        return null;
    }
}

function writeJson(key: string, value: unknown) {
    localStorage.setItem(key, JSON.stringify(value));
}

function decodeJwtPayload(token?: string) {
    if (!token) return null;

    try {
        const payload = token.split('.')[1];
        const normalized = payload.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(payload.length / 4) * 4, '=');
        return JSON.parse(atob(normalized)) as {
            exp?: number;
            userId?: string;
            role?: 'admin' | 'user';
            email?: string;
            'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: 'admin' | 'user';
            'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'?: string;
        };
    } catch {
        return null;
    }
}

function isTokenExpired(token?: string) {
    const payload = decodeJwtPayload(token);
    if (!payload?.exp) return false;
    return payload.exp * 1000 <= Date.now();
}

function normalizeSession(session: SessionUser): SessionUser {
    const payload = decodeJwtPayload(session.token);
    return {
        ...session,
        userId: session.userId ?? (payload?.userId ? Number(payload.userId) : undefined),
        email: session.email || payload?.email || payload?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '',
        role: session.role || payload?.role || payload?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'user',
    };
}

function saveSession(session: SessionUser, user?: StoredUser | null) {
    writeJson(SESSION_KEY, normalizeSession(session));
    if (user) {
        writeJson(USER_KEY, user);
    }
    window.dispatchEvent(new Event(SESSION_CHANGED_EVENT));
}

function buildInitials(fullName: string) {
    return fullName
        .split(' ')
        .map((part) => part[0] || '')
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'U';
}

function normalizeApiError(error: unknown, fallback: string) {
    if (typeof error === 'object' && error && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } };
        return apiError.response?.data?.message || fallback;
    }

    return fallback;
}

export const authService = {
    async login({ email, password }: { email: string; password: string }) {
        try {
            const { data: session } = await axiosClient.post<SessionUser>('/auth/login', { email, password });
            
            // Extract role and userId directly from the JWT token
            if (session.token) {
                const decoded = decodeToken(session.token);
                if (decoded) {
                    session.userId = decoded.userId;
                    if (decoded.role === 'admin' || decoded.role === 'user') {
                        session.role = decoded.role;
                    }
                }
            }

            const { data: user } = await axiosClient.get<StoredUser>('/auth/profile', {
                params: { email: session.email },
            });

            saveSession(session, user);
            return { ok: true as const, user: session };
        } catch (error) {
            return { ok: false as const, error: normalizeApiError(error, 'Email sau parola incorecta.') };
        }
    },

    async register(data: {
        fullName: string;
        email: string;
        phone?: string;
        birthDate?: string;
        password: string;
    }) {
        try {
            const { data: session } = await axiosClient.post<SessionUser>('/auth/register', data);
            saveSession(session);

            const { data: user } = await axiosClient.get<StoredUser>('/auth/profile', {
                params: { email: session.email },
            });

            saveSession(session, user);
            return { ok: true as const, user: session };
        } catch (error) {
            return { ok: false as const, error: normalizeApiError(error, 'Inregistrare esuata.') };
        }
    },

    async fetchCurrentUser(email: string) {
        const { data } = await axiosClient.get<StoredUser>('/auth/profile', {
            params: { email },
        });
        writeJson(USER_KEY, data);
        return data;
    },

    getSession() {
        const session = readJson<SessionUser>(SESSION_KEY);
        if (!session) return null;
        if (isTokenExpired(session.token)) {
            localStorage.removeItem(USER_KEY);
            localStorage.removeItem(SESSION_KEY);
            window.dispatchEvent(new Event(SESSION_CHANGED_EVENT));
            return null;
        }
        return normalizeSession(session);
    },

    getCurrentUser() {
        return readJson<StoredUser>(USER_KEY);
    },

    async updateCurrentUserProfile(profile: {
        fullName: string;
        email: string;
        phone?: string;
        city?: string;
        country?: string;
        bio?: string;
    }) {
        const currentUser = readJson<StoredUser>(USER_KEY);
        if (!currentUser) {
            return { ok: false as const, error: 'Nu exista utilizator autentificat.' };
        }

        try {
            const { data: user } = await axiosClient.put<StoredUser>('/auth/profile', {
                currentEmail: currentUser.email,
                ...profile,
            });

            const currentSession = readJson<SessionUser>(SESSION_KEY);
            const session: SessionUser = {
                userId: currentSession?.userId,
                token: currentSession?.token,
                email: user.email,
                fullName: user.fullName,
                initials: buildInitials(user.fullName || user.email),
                role: user.role || 'user',
                token: currentSession?.token,
            };

            saveSession(session, user);
            return { ok: true as const, user };
        } catch (error) {
            return { ok: false as const, error: normalizeApiError(error, 'Nu am putut actualiza profilul.') };
        }
    },

    async updateCurrentUserPassword(currentPassword: string, newPassword: string) {
        const session = readJson<SessionUser>(SESSION_KEY);
        if (!session) {
            return { ok: false as const, error: 'Nu exista utilizator autentificat.' };
        }

        try {
            await axiosClient.post('/auth/change-password', {
                email: session.email,
                currentPassword,
                newPassword,
            });
            return { ok: true as const };
        } catch (error) {
            return { ok: false as const, error: normalizeApiError(error, 'Parola curenta este incorecta.') };
        }
    },

    async deleteCurrentUser() {
        const session = readJson<SessionUser>(SESSION_KEY);
        if (!session) {
            return { ok: false as const, error: 'Nu exista utilizator autentificat.' };
        }

        try {
            await axiosClient.delete('/auth/account', {
                params: { email: session.email },
            });
            localStorage.removeItem(USER_KEY);
            localStorage.removeItem(SESSION_KEY);
            window.dispatchEvent(new Event(SESSION_CHANGED_EVENT));
            return { ok: true as const };
        } catch (error) {
            return { ok: false as const, error: normalizeApiError(error, 'Nu am putut șterge contul.') };
        }
    },

    logout() {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(SESSION_KEY);
        window.dispatchEvent(new Event(SESSION_CHANGED_EVENT));
    },

    async getAdminUsers() {
        const { data } = await axiosClient.get<StoredUser[]>('/auth/admin/users');
        return data;
    },

    async updateUserRole(email: string, role: string) {
        const { data } = await axiosClient.patch('/auth/admin/user-role', null, {
            params: { email, role },
        });
        return data;
    },
};
