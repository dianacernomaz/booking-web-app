import axios from 'axios';

export const SESSION_KEY = 'sb_session';
export const USER_KEY = 'sb_user';
export const SESSION_CHANGED_EVENT = 'sb_session_changed';
export const HTTP_ERROR_EVENT = 'sb_http_error';

export const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5128/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use((config) => {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
        try {
            const session = JSON.parse(raw);
            if (session.token) {
                config.headers.Authorization = `Bearer ${session.token}`;
            }
        } catch (e) {
            // ignore
        }
    }
    return config;
});

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const status = error.response.status;
            if (status === 401) window.location.href = '/401';
            else if (status === 403) window.location.href = '/403';
            else if (status >= 500) window.location.href = '/500';
        }
        return Promise.reject(error);
    }
);
