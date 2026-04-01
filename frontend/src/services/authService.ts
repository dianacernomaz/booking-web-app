import axios from 'axios';
import { getApiClient } from '../api/httpClient';

export interface SessionUser {
    email: string;
    fullName: string;
    initials: string;
    role?: 'admin' | 'user';
}

export interface StoredUser {
    id?: string;
    fullName: string;
    email: string;
    phone?: string;
    birthDate?: string;
    city?: string;
    country?: string;
    bio?: string;
    role?: 'admin' | 'user';
}

interface AuthResponse {
    id: string;
    email: string;
    fullName: string;
    initials: string;
    role: 'admin' | 'user';
}

const USER_KEY = 'sb_user';
const SESSION_KEY = 'sb_session';
const SESSION_CHANGED_EVENT = 'sb_session_changed';

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

function normalizeEmail(email: string) {
    return email.trim().toLowerCase();
}

function saveSession(user: StoredUser) {
    const session: SessionUser = {
        email: user.email,
        fullName: user.fullName,
        initials:
            user.fullName
                .split(' ')
                .map((part) => part[0] || '')
                .join('')
                .toUpperCase()
                .slice(0, 2) || 'U',
        role: user.role || 'user',
    };

    writeJson(USER_KEY, user);
    writeJson(SESSION_KEY, session);
    window.dispatchEvent(new Event(SESSION_CHANGED_EVENT));
    return session;
}

function toStoredUser(payload: {
    id?: string;
    fullName: string;
    email: string;
    phone?: string;
    birthDate?: string;
    city?: string;
    country?: string;
    bio?: string;
    role?: 'admin' | 'user';
}) {
    return {
        id: payload.id,
        fullName: payload.fullName,
        email: normalizeEmail(payload.email),
        phone: payload.phone ?? '',
        birthDate: payload.birthDate ?? '',
        city: payload.city ?? '',
        country: payload.country ?? '',
        bio: payload.bio ?? '',
        role: payload.role ?? 'user',
    } satisfies StoredUser;
}

function extractError(error: unknown, fallback: string) {
    if (axios.isAxiosError<{ message?: string }>(error)) {
        return error.response?.data?.message || fallback;
    }

    return fallback;
}

export const authService = {
    async login({ email, password }: { email: string; password: string }) {
        try {
            const { data } = await getApiClient().post<AuthResponse>('/auth/login', {
                email,
                password,
            });

            const user = await this.fetchUserProfile(data.email);
            saveSession(user);
            return { ok: true as const, user: readJson<SessionUser>(SESSION_KEY)! };
        } catch (error) {
            return { ok: false as const, error: extractError(error, 'Email sau parola incorecta.') };
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
            const response = await getApiClient().post<AuthResponse>('/auth/register', data);
            const user = await this.fetchUserProfile(response.data.email);
            saveSession(user);
            return { ok: true as const, user: readJson<SessionUser>(SESSION_KEY)! };
        } catch (error) {
            return { ok: false as const, error: extractError(error, 'Există deja un cont cu acest email.') };
        }
    },

    getSession() {
        return readJson<SessionUser>(SESSION_KEY);
    },

    getCurrentUser() {
        return readJson<StoredUser>(USER_KEY);
    },

    async fetchUserProfile(email: string) {
        const { data } = await getApiClient().get<{
            id: string;
            fullName: string;
            email: string;
            phone?: string;
            birthDate?: string;
            city?: string;
            country?: string;
            bio?: string;
            role?: 'admin' | 'user';
        }>(`/users/${encodeURIComponent(email)}`);

        const user = toStoredUser(data);
        writeJson(USER_KEY, user);
        return user;
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
            const { data } = await getApiClient().put<{
                id: string;
                fullName: string;
                email: string;
                phone?: string;
                birthDate?: string;
                city?: string;
                country?: string;
                bio?: string;
                role?: 'admin' | 'user';
            }>(`/users/${encodeURIComponent(currentUser.email)}/profile`, profile);

            const updatedUser = toStoredUser({ ...currentUser, ...data });
            saveSession(updatedUser);
            return { ok: true as const, user: updatedUser };
        } catch (error) {
            return { ok: false as const, error: extractError(error, 'Actualizarea profilului a esuat.') };
        }
    },

    async updateCurrentUserPassword(currentPassword: string, newPassword: string) {
        const currentUser = readJson<StoredUser>(USER_KEY);
        if (!currentUser) {
            return { ok: false as const, error: 'Nu exista utilizator autentificat.' };
        }

        try {
            await getApiClient().put(`/users/${encodeURIComponent(currentUser.email)}/password`, {
                currentPassword,
                newPassword,
            });

            return { ok: true as const };
        } catch (error) {
            return { ok: false as const, error: extractError(error, 'Parola curenta este incorecta.') };
        }
    },

    async deleteCurrentUser() {
        const currentUser = readJson<StoredUser>(USER_KEY);
        if (!currentUser) {
            return { ok: false as const, error: 'Nu exista utilizator autentificat.' };
        }

        try {
            await getApiClient().delete(`/users/${encodeURIComponent(currentUser.email)}`);
            localStorage.removeItem(USER_KEY);
            localStorage.removeItem(SESSION_KEY);
            window.dispatchEvent(new Event(SESSION_CHANGED_EVENT));
            return { ok: true as const };
        } catch (error) {
            return { ok: false as const, error: extractError(error, 'Stergerea contului a esuat.') };
        }
    },

    logout() {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(SESSION_KEY);
        window.dispatchEvent(new Event(SESSION_CHANGED_EVENT));
    },
};
