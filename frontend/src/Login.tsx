import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { authService } from './services/authService';
import './CSS/Home.css';
import './CSS/Auth.css';

const Login: React.FC = () => {
    const navigate = useNavigate();

    const [email,    setEmail]    = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [errors,   setErrors]   = useState<{ email?: string; password?: string; general?: string }>({});
    const [loading,  setLoading]  = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const validate = () => {
        const e: typeof errors = {};
        if (!email.trim())                          e.email    = 'Adresa de email este obligatorie.';
        else if (!/\S+@\S+\.\S+/.test(email))       e.email    = 'Adresa de email nu este validă.';
        if (!password)                              e.password = 'Parola este obligatorie.';
        else if (password.length < 6)               e.password = 'Parola trebuie să aibă cel puțin 6 caractere.';
        return e;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setErrors({});
        setLoading(true);
        const result = await authService.login({ email, password });
        setLoading(false);
        if (!result.ok) {
            setErrors({ general: result.error || 'Email sau parolă incorectă.' });
            return;
        }
        setSubmitted(true);
        setTimeout(() => navigate('/'), 900);
    };

    return (
        <div className="home">
            <Header />

            <div className="auth-page">
                {/* Left panel */}
                <div className="auth-panel auth-panel--left">
                    <div className="auth-panel-content">
                        <div className="auth-panel-icon">🏨</div>
                        <h2>Bine ai revenit!</h2>
                        <p>Conectează-te și continuă să explorezi mii de cazări din toată lumea.</p>
                        <ul className="auth-perks">
                            <li><span>✈️</span> Rezervări instantanee</li>
                            <li><span>❤️</span> Salvează proprietăți favorite</li>
                            <li><span>🔔</span> Notificări oferte exclusive</li>
                            <li><span>🛡️</span> Plăți 100% securizate</li>
                        </ul>
                    </div>
                    <div className="auth-panel-bg" />
                </div>

                {/* Right panel */}
                <div className="auth-panel auth-panel--right">
                    <div className="auth-form-wrap">
                        {submitted ? (
                            <div className="auth-success">
                                <div className="auth-success-icon">✅</div>
                                <h2>Autentificare reușită!</h2>
                                <p>Ești conectat. Redirecționare...</p>
                                <button className="auth-btn" onClick={() => navigate('/')}>
                                    Mergi la pagina principală
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="auth-header">
                                    <h1>Autentificare</h1>
                                    <p>Introdu datele contului tău StayBooker</p>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 8 }}>
                                        Admin: admin@staybooker.com / Admin123!
                                    </p>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 4 }}>
                                        User: user@staybooker.com / User123!
                                    </p>
                                </div>

                                <form className="auth-form" onSubmit={handleSubmit} noValidate>

                                    {errors.general && (
                                        <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px 14px', borderRadius: 10, fontSize: '0.875rem', fontWeight: 600 }}>
                                            {errors.general}
                                        </div>
                                    )}

                                    <div className={`auth-field ${errors.email ? 'auth-field--error' : ''}`}>
                                        <label htmlFor="email">Adresă de email</label>
                                        <div className="auth-input-wrap">
                                            <span className="auth-input-icon">✉️</span>
                                            <input
                                                id="email"
                                                type="email"
                                                placeholder="exemplu@email.com"
                                                value={email}
                                                onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: undefined, general: undefined })); }}
                                                autoComplete="email"
                                            />
                                        </div>
                                        {errors.email && <span className="auth-error-msg">{errors.email}</span>}
                                    </div>

                                    <div className={`auth-field ${errors.password ? 'auth-field--error' : ''}`}>
                                        <label htmlFor="password">Parolă</label>
                                        <div className="auth-input-wrap">
                                            <span className="auth-input-icon">🔒</span>
                                            <input
                                                id="password"
                                                type={showPass ? 'text' : 'password'}
                                                placeholder="Parola ta"
                                                value={password}
                                                onChange={(e) => { setPassword(e.target.value); setErrors((prev) => ({ ...prev, password: undefined, general: undefined })); }}
                                                autoComplete="current-password"
                                            />
                                            <button type="button" className="auth-toggle-pass" onClick={() => setShowPass(!showPass)}>
                                                {showPass ? '🙈' : '👁️'}
                                            </button>
                                        </div>
                                        {errors.password && <span className="auth-error-msg">{errors.password}</span>}
                                    </div>

                                    <div className="auth-row">
                                        <label className="auth-remember">
                                            <input type="checkbox" /> Ține-mă minte
                                        </label>
                                        <a href="#" className="auth-link">Ai uitat parola?</a>
                                    </div>

                                    <button type="submit" className="auth-btn" disabled={loading}>
                                        {loading ? <span className="auth-spinner" /> : 'Autentifică-te'}
                                    </button>
                                </form>

                                <p className="auth-switch">
                                    Nu ai cont?{' '}
                                    <span className="auth-link" onClick={() => navigate('/register')}>
                                        Înregistrează-te gratuit
                                    </span>
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Login;
