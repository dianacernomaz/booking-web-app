import { createContext, useContext, useMemo, type PropsWithChildren } from 'react';
import type { AxiosInstance } from 'axios';
import { buildApiClient, setApiClient } from './httpClient';

const ApiContext = createContext<AxiosInstance | null>(null);

export function ApiProvider({ children }: PropsWithChildren) {
    const client = useMemo(() => buildApiClient(), []);
    setApiClient(client);

    return <ApiContext.Provider value={client}>{children}</ApiContext.Provider>;
}

export function useApi() {
    const client = useContext(ApiContext);
    if (!client) {
        throw new Error('useApi trebuie folosit in interiorul ApiProvider.');
    }

    return client;
}
