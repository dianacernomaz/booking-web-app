import { useState } from 'react';
import { useAxios } from '../providers/AxiosProvider';
import { getHealth, getHealthFailure, type HealthResponse } from '../services/healthService';

export default function ApiDiagnosticsPanel() {
    const { api, serverError, clearServerError } = useAxios();
    const [health, setHealth] = useState<HealthResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const loadHealth = async () => {
        setLoading(true);
        setLocalError(null);

        try {
            const data = await getHealth(api);
            setHealth(data);
        } catch {
            setLocalError('Health endpoint is unavailable.');
        } finally {
            setLoading(false);
        }
    };

    const triggerServerError = async () => {
        setLoading(true);
        setLocalError(null);

        try {
            await getHealthFailure(api);
        } catch {
            setLocalError('A 500 response was triggered on purpose.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="api-diagnostics">
            <div className="api-diagnostics__content">
                <p className="api-diagnostics__eyebrow">Frontend to backend check</p>
                <h2>Axios provider, context si interceptors</h2>
                <p className="api-diagnostics__text">
                    Testeaza conexiunea cu <code>/api/health</code> si valideaza interceptorul pentru status code 500.
                </p>

                <div className="api-diagnostics__actions">
                    <button type="button" onClick={loadHealth} disabled={loading}>
                        Test health controller
                    </button>
                    <button type="button" className="secondary" onClick={triggerServerError} disabled={loading}>
                        Test 500 interceptor
                    </button>
                    {serverError ? (
                        <button type="button" className="ghost" onClick={clearServerError}>
                            Clear error
                        </button>
                    ) : null}
                </div>

                {health ? (
                    <div className="api-diagnostics__card success">
                        <strong>{health.status}</strong>
                        <span>{health.service}</span>
                        <span>{new Date(health.utcTime).toLocaleString()}</span>
                    </div>
                ) : null}

                {localError ? <div className="api-diagnostics__card warning">{localError}</div> : null}

                {serverError ? (
                    <div className="api-diagnostics__card error">
                        <strong>Interceptor captured {serverError.statusCode}</strong>
                        <span>{serverError.message}</span>
                        <span>{serverError.url}</span>
                    </div>
                ) : null}
            </div>
        </section>
    );
}
