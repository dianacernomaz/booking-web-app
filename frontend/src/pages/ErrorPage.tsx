import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
interface ErrorPageProps {
    code: 401 | 403 | 404 | 500;
    title: string;
    message: string;
}
const ErrorPage: React.FC<ErrorPageProps> = ({ code, title, message }) => {
    const navigate = useNavigate();
    return (
        <div className="home" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 1rem' }}>
                <div style={{ textAlign: 'center', maxWidth: '500px' }}>
                    <div style={{ fontSize: '6rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '1rem', lineHeight: 1 }}>
                        {code}
                    </div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>
                        {title}
                    </h1>
                    <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '1.125rem' }}>
                        {message}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button
                            onClick={() => navigate('/')}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: '#2563eb',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.5rem',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Inapoi la Home
                        </button>
                        {code === 401 && (
                            <button
                                onClick={() => navigate('/login')}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: 'white',
                                    color: '#2563eb',
                                    border: '1px solid #2563eb',
                                    borderRadius: '0.5rem',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};
export default ErrorPage;
