import { createContext, useContext, useEffect, type PropsWithChildren } from 'react';
import type { AxiosInstance } from 'axios';
import { axiosClient, HTTP_ERROR_EVENT, SESSION_CHANGED_EVENT, SESSION_KEY, USER_KEY } from './axiosClient';

const AxiosContext = createContext<AxiosInstance>(axiosClient);

export function AxiosProvider({ children }: PropsWithChildren) {
    useEffect(() => {
        const interceptorId = axiosClient.interceptors.response.use(
            (response) => response,
            (error) => {
                const status = error.response?.status as number | undefined;
                const message = error.response?.data?.message as string | undefined;

                if (status === 401) {
                    localStorage.removeItem(USER_KEY);
                    localStorage.removeItem(SESSION_KEY);
                    window.dispatchEvent(new Event(SESSION_CHANGED_EVENT));
                }

                window.dispatchEvent(new CustomEvent(HTTP_ERROR_EVENT, {
                    detail: {
                        status,
                        message: message || 'Request failed.',
                    },
                }));

                return Promise.reject(error);
            },
        );

        return () => {
            axiosClient.interceptors.response.eject(interceptorId);
        };
    }, []);

    return (
        <AxiosContext.Provider value={axiosClient}>
            {children}
        </AxiosContext.Provider>
    );
}

export function useAxios() {
    return useContext(AxiosContext);
}
