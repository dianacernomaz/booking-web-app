import type { AxiosInstance } from 'axios';

export type HealthResponse = {
    status: string;
    service: string;
    utcTime: string;
};

export async function getHealth(api: AxiosInstance) {
    const response = await api.get<HealthResponse>('/health');
    return response.data;
}

export async function getHealthFailure(api: AxiosInstance) {
    const response = await api.get('/health/fail');
    return response.data;
}
