import axios, { AxiosError, type AxiosInstance } from 'axios';

export interface ApiMessageResponse {
    message?: string;
}

let apiClient: AxiosInstance | null = null;

function resolveBaseUrl() {
    return import.meta.env.VITE_API_URL ?? 'http://localhost:5114/api';
}

export function buildApiClient() {
    const client = axios.create({
        baseURL: resolveBaseUrl(),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    client.interceptors.response.use(
        (response) => response,
        (error: AxiosError<ApiMessageResponse>) => {
            const status = error.response?.status;
            const message =
                error.response?.data?.message ??
                (status === 401
                    ? 'Nu esti autentificat.'
                    : status === 404
                        ? 'Resursa nu a fost gasita.'
                        : status === 409
                            ? 'Exista un conflict de date.'
                            : status === 500
                                ? 'Serverul a intampinat o eroare.'
                                : 'Cererea a esuat.');

            window.dispatchEvent(
                new CustomEvent('sb_api_error', {
                    detail: { status, message },
                }),
            );

            return Promise.reject(error);
        },
    );

    return client;
}

export function setApiClient(client: AxiosInstance) {
    apiClient = client;
}

export function getApiClient() {
    if (!apiClient) {
        apiClient = buildApiClient();
    }

    return apiClient;
}
