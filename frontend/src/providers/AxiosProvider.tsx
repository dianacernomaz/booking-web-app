import axios, { AxiosError, type AxiosInstance } from 'axios';
import {
    createContext,
    type PropsWithChildren,
    useContext,
    useEffect,
    useState,
} from 'react';

type ApiErrorState = {
    message: string;
    statusCode: number;
    url?: string;
} | null;

type AxiosContextValue = {
    api: AxiosInstance;
    serverError: ApiErrorState;
    clearServerError: () => void;
};

const AxiosContext = createContext<AxiosContextValue | null>(null);

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export function AxiosProvider({ children }: PropsWithChildren) {
    const [serverError, setServerError] = useState<ApiErrorState>(null);

    useEffect(() => {
        const requestInterceptor = api.interceptors.request.use((config) => {
            config.headers.Accept = 'application/json';
            return config;
        });

        const responseInterceptor = api.interceptors.response.use(
            (response) => response,
            (error: AxiosError<{ message?: string }>) => {
                const statusCode = error.response?.status;

                if (statusCode && statusCode >= 500) {
                    setServerError({
                        message: error.response?.data?.message ?? 'Server error intercepted by Axios.',
                        statusCode,
                        url: error.config?.url,
                    });
                }

                return Promise.reject(error);
            },
        );

        return () => {
            api.interceptors.request.eject(requestInterceptor);
            api.interceptors.response.eject(responseInterceptor);
        };
    }, []);

    const value = {
        api,
        serverError,
        clearServerError: () => setServerError(null),
    };

    return <AxiosContext.Provider value={value}>{children}</AxiosContext.Provider>;
}

export function useAxios() {
    const context = useContext(AxiosContext);

    if (!context) {
        throw new Error('useAxios must be used inside AxiosProvider.');
    }

    return context;
}
