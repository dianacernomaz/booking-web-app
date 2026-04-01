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
