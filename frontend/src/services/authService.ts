import { axiosClient, SESSION_CHANGED_EVENT, SESSION_KEY, USER_KEY } from '../providers/axiosClient';

export interface SessionUser {
    email: string;
    fullName: string;
    initials: string;
    role?: 'admin' | 'user';
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

function saveSession(session: SessionUser, user?: StoredUser | null) {
    writeJson(SESSION_KEY, session);
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
            const { data: user } = await axiosClient.get<StoredUser>('/users/profile', {
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
            const { data: user } = await axiosClient.get<StoredUser>('/users/profile', {
                params: { email: session.email },
            });

            saveSession(session, user);
            return { ok: true as const, user: session };
        } catch (error) {
            return { ok: false as const, error: normalizeApiError(error, 'Inregistrare esuata.') };
        }
    },

    async fetchCurrentUser(email: string) {
        const { data } = await axiosClient.get<StoredUser>('/users/profile', {
            params: { email },
        });
        writeJson(USER_KEY, data);
        return data;
    },

    getSession() {
        return readJson<SessionUser>(SESSION_KEY);
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
            const { data: user } = await axiosClient.put<StoredUser>('/users/profile', {
                currentEmail: currentUser.email,
                ...profile,
            });

            const session: SessionUser = {
                email: user.email,
                fullName: user.fullName,
                initials: buildInitials(user.fullName || user.email),
                role: user.role || 'user',
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
            await axiosClient.put('/users/password', {
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
            await axiosClient.delete('/users', {
                params: { email: session.email },
            });
            localStorage.removeItem(USER_KEY);
            localStorage.removeItem(SESSION_KEY);
            window.dispatchEvent(new Event(SESSION_CHANGED_EVENT));
            return { ok: true as const };
        } catch (error) {
            return { ok: false as const, error: normalizeApiError(error, 'Nu am putut sterge contul.') };
        }
    },

    logout() {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(SESSION_KEY);
        window.dispatchEvent(new Event(SESSION_CHANGED_EVENT));
    },
};
