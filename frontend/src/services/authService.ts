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

const USERS_KEY = 'sb_users';
const USER_KEY = 'sb_user';
const SESSION_KEY = 'sb_session';
const SESSION_CHANGED_EVENT = 'sb_session_changed';

const demoUsers: StoredUser[] = [
    {
        fullName: 'Admin StayBooker',
        email: 'admin@staybooker.com',
        password: 'Admin123!',
        phone: '',
        birthDate: '',
        city: '',
        country: '',
        bio: '',
        role: 'admin',
    },
    {
        fullName: 'User StayBooker',
        email: 'user@staybooker.com',
        password: 'User123!',
        phone: '',
        birthDate: '',
        city: '',
        country: '',
        bio: '',
        role: 'user',
    },
];

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

function buildInitials(fullName: string) {
    return fullName
        .split(' ')
        .map((part) => part[0] || '')
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'U';
}

function normalizeEmail(email: string) {
    return email.trim().toLowerCase();
}

function ensureUsers() {
    const existing = readJson<StoredUser[]>(USERS_KEY);
    if (existing?.length) return existing;

    writeJson(USERS_KEY, demoUsers);
    return demoUsers;
}

function getUsers() {
    return ensureUsers();
}

function saveUsers(users: StoredUser[]) {
    writeJson(USERS_KEY, users);
}

function toSession(user: StoredUser): SessionUser {
    return {
        email: user.email,
        fullName: user.fullName,
        initials: buildInitials(user.fullName || user.email),
        role: user.role || 'user',
    };
}

function saveActiveUser(user: StoredUser) {
    writeJson(USER_KEY, user);
    writeJson(SESSION_KEY, toSession(user));
    window.dispatchEvent(new Event(SESSION_CHANGED_EVENT));
}

export const authService = {
    async login({ email, password }: { email: string; password: string }) {
        const normalizedEmail = normalizeEmail(email);
        const user = getUsers().find(
            (candidate) =>
                normalizeEmail(candidate.email) === normalizedEmail &&
                candidate.password === password,
        );

        if (!user) {
            return { ok: false as const, error: 'Email sau parolă incorectă.' };
        }

        saveActiveUser(user);
        return { ok: true as const, user: toSession(user) };
    },

    async register(data: {
        fullName: string;
        email: string;
        phone?: string;
        birthDate?: string;
        password: string;
    }) {
        const users = getUsers();
        const normalizedEmail = normalizeEmail(data.email);

        if (users.some((user) => normalizeEmail(user.email) === normalizedEmail)) {
            return { ok: false as const, error: 'Există deja un cont cu acest email.' };
        }

        const user: StoredUser = {
            fullName: data.fullName.trim(),
            email: normalizedEmail,
            phone: data.phone?.trim() || '',
            birthDate: data.birthDate || '',
            password: data.password,
            city: '',
            country: '',
            bio: '',
            role: 'user',
        };

        saveUsers([...users, user]);
        return { ok: true as const, user: toSession(user) };
    },

    getSession() {
        return readJson<SessionUser>(SESSION_KEY);
    },

    getCurrentUser() {
        return readJson<StoredUser>(USER_KEY);
    },

    updateCurrentUserProfile(profile: {
        fullName: string;
        email: string;
        phone?: string;
        city?: string;
        country?: string;
        bio?: string;
    }) {
        const currentUser = readJson<StoredUser>(USER_KEY);
        if (!currentUser) {
            return { ok: false as const, error: 'Nu există utilizator autentificat.' };
        }

        const users = getUsers();
        const nextEmail = normalizeEmail(profile.email);
        const currentEmail = normalizeEmail(currentUser.email);
        const duplicate = users.find(
            (user) => normalizeEmail(user.email) === nextEmail && normalizeEmail(user.email) !== currentEmail,
        );

        if (duplicate) {
            return { ok: false as const, error: 'Email-ul este deja folosit de alt cont.' };
        }

        const updatedUser: StoredUser = {
            ...currentUser,
            fullName: profile.fullName.trim() || currentUser.fullName,
            email: nextEmail,
            phone: profile.phone?.trim() || '',
            city: profile.city?.trim() || '',
            country: profile.country?.trim() || '',
            bio: profile.bio?.trim() || '',
        };

        saveUsers(
            users.map((user) =>
                normalizeEmail(user.email) === currentEmail ? updatedUser : user,
            ),
        );
        saveActiveUser(updatedUser);

        return { ok: true as const, user: updatedUser };
    },

    updateCurrentUserPassword(currentPassword: string, newPassword: string) {
        const currentUser = readJson<StoredUser>(USER_KEY);
        if (!currentUser) {
            return { ok: false as const, error: 'Nu există utilizator autentificat.' };
        }
        if (currentUser.password !== currentPassword) {
            return { ok: false as const, error: 'Parola curentă este incorectă.' };
        }

        const updatedUser: StoredUser = { ...currentUser, password: newPassword };
        saveUsers(
            getUsers().map((user) =>
                normalizeEmail(user.email) === normalizeEmail(currentUser.email) ? updatedUser : user,
            ),
        );
        saveActiveUser(updatedUser);

        return { ok: true as const };
    },

    logout() {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(SESSION_KEY);
        window.dispatchEvent(new Event(SESSION_CHANGED_EVENT));
    },
};
