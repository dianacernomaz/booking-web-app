export interface SessionData {
    email: string;
    fullName: string;
    initials: string;
    role?: 'admin' | 'user';
    token?: string;
}

const SESSION_KEY = 'sb_session';
const USER_KEY = 'sb_user';

function readJson<T>(key: string): T | null {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    try {
        return JSON.parse(raw) as T;
    } catch {
        return null;
    }
}

export function buildInitials(fullName: string) {
    return fullName
        .split(' ')
        .map((part) => part[0] || '')
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

export function getSession() {
    return readJson<SessionData>(SESSION_KEY);
}

export function getStoredUser() {
    return readJson<Record<string, string>>(USER_KEY);
}

export function getDisplayName() {
    const session = getSession();
    if (session?.fullName) return session.fullName;

    const user = getStoredUser();
    if (user?.fullName) return user.fullName;
    if (user?.email) return user.email;

    return '';
}
