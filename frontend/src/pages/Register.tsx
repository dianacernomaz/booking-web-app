import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import { authService } from '../auth/authService';
import '../assets/css/Home.css';
import '../assets/css/Auth.css';
import { useCurrency } from '../utils/currency';

interface FormData {
    fullName: string;
    email: string;
    phone: string;
    birthDate: string;
    password: string;
    confirm: string;
    agree: boolean;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

const Register: React.FC = () => {
    const navigate = useNavigate();
    const { formatPrice } = useCurrency();

    const [form, setForm] = useState<FormData>({
        fullName: '',
        email: '',
        phone: '',
        birthDate: '',
        password: '',
        confirm: '',
        agree: false,
    });

    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const getStrength = (p: string): { level: number; label: string; color: string } => {
        if (!p) return { level: 0, label: '', color: '' };
        let score = 0;
        if (p.length >= 8) score++;
        if (/[A-Z]/.test(p)) score++;
        if (/[0-9]/.test(p)) score++;
        if (/[^A-Za-z0-9]/.test(p)) score++;
        if (score <= 1) return { level: 1, label: 'Slaba', color: '#ef4444' };
        if (score === 2) return { level: 2, label: 'Medie', color: '#f59e0b' };
        if (score === 3) return { level: 3, label: 'Buna', color: '#10b981' };
        return { level: 4, label: 'Excelenta', color: '#2563eb' };
    };

    const strength = getStrength(form.password);

    const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = field === 'agree' ? e.target.checked : e.target.value;
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const validate = (): FormErrors => {
        const e: FormErrors = {};
        if (!form.fullName.trim()) e.fullName = 'Numele complet este obligatoriu.';
        if (!form.email.trim()) e.email = 'Email-ul este obligatoriu.';
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Adresa de email nu este valida.';
        if (!form.phone.trim()) e.phone = 'Numarul de telefon este obligatoriu.';
        else if (!/^[+]?[\d\s\-()]{7,}$/.test(form.phone)) e.phone = 'Numarul de telefon nu este valid.';
        if (!form.birthDate) e.birthDate = 'Data nasterii este obligatorie.';
        else {
            const age = (Date.now() - new Date(form.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
            if (age < 18) e.birthDate = 'Trebuie sa ai cel putin 18 ani.';
        }
        if (!form.password) e.password = 'Parola este obligatorie.';
        else if (form.password.length < 8) e.password = 'Parola trebuie sa aiba cel putin 8 caractere.';
        if (!form.confirm) e.confirm = 'Confirmarea parolei este obligatorie.';
        else if (form.confirm !== form.password) e.confirm = 'Parolele nu coincid.';
        if (!form.agree) e.agree = 'Trebuie sa accepti termenii si conditiile.';
        return e;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) {
            setErrors(errs);
            return;
        }
        setErrors({});
        setLoading(true);
        const result = await authService.register({
            fullName: form.fullName,
            email: form.email,
            phone: form.phone,
            birthDate: form.birthDate,
            password: form.password,
        });
        setLoading(false);
        if (!result.ok) {
            setErrors((prev) => ({ ...prev, email: result.error || 'Inregistrare esuata.' }));
            return;
        }
        setSubmitted(true);
    };

    const passwordMatch = form.confirm && form.confirm === form.password;

    return (
        <div className="home">
            <Header />

            <div className="auth-page auth-page--register">
                <div className="auth-panel auth-panel--left">
                    <div className="auth-panel-content">
                        <div className="auth-panel-icon">🚀</div>
                        <h2>Alatura-te comunitatii!</h2>
                        <p>Creeaza-ti contul gratuit si descopera mii de cazari unice in toata lumea.</p>
                        <ul className="auth-perks">
                            <li><span>🌍</span> Acces la 2M+ proprietati</li>
                            <li><span>💸</span> Preturi exclusive pentru membri</li>
                            <li><span>⭐</span> Recenzii verificate</li>
                            <li><span>🎁</span> Bonus {formatPrice(50)} la prima rezervare</li>
                        </ul>
                    </div>
                    <div className="auth-panel-bg" />
                </div>

                <div className="auth-panel auth-panel--right">
                    <div className="auth-form-wrap">
                        {submitted ? (
                            <div className="auth-success">
                                <div className="auth-success-icon">🎉</div>
                                <h2>Cont creat cu succes!</h2>
                                <p>Bine ai venit, <strong>{form.fullName.split(' ')[0]}</strong>! Contul tau a fost creat.</p>
                                <button className="auth-btn" onClick={() => navigate('/login')}>
                                    Autentifica-te acum
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="auth-header">
                                    <h1>Creeaza cont</h1>
                                    <p>Completeaza formularul pentru a te inregistra</p>
                                </div>

                                <form className="auth-form" onSubmit={handleSubmit} noValidate>
                                    <div className={`auth-field ${errors.fullName ? 'auth-field--error' : ''}`}>
                                        <label htmlFor="fullName">Nume complet</label>
                                        <div className="auth-input-wrap">
                                            <span className="auth-input-icon">👤</span>
                                            <input id="fullName" type="text" placeholder="Prenume Nume" value={form.fullName} onChange={set('fullName')} autoComplete="name" />
                                        </div>
                                        {errors.fullName && <span className="auth-error-msg">{errors.fullName}</span>}
                                    </div>

                                    <div className={`auth-field ${errors.email ? 'auth-field--error' : ''}`}>
                                        <label htmlFor="reg-email">Adresa de email</label>
                                        <div className="auth-input-wrap">
                                            <span className="auth-input-icon">✉️</span>
                                            <input id="reg-email" type="email" placeholder="exemplu@email.com" value={form.email} onChange={set('email')} autoComplete="email" />
                                        </div>
                                        {errors.email && <span className="auth-error-msg">{errors.email}</span>}
                                    </div>

                                    <div className={`auth-field ${errors.phone ? 'auth-field--error' : ''}`}>
                                        <label htmlFor="phone">Numar de telefon</label>
                                        <div className="auth-input-wrap">
                                            <span className="auth-input-icon">📞</span>
                                            <input id="phone" type="tel" placeholder="+40 7xx xxx xxx" value={form.phone} onChange={set('phone')} autoComplete="tel" />
                                        </div>
                                        {errors.phone && <span className="auth-error-msg">{errors.phone}</span>}
                                    </div>

                                    <div className={`auth-field ${errors.birthDate ? 'auth-field--error' : ''}`}>
                                        <label htmlFor="birthDate">Data nasterii</label>
                                        <div className="auth-input-wrap">
                                            <span className="auth-input-icon">📅</span>
                                            <input id="birthDate" type="date" value={form.birthDate} onChange={set('birthDate')} />
                                        </div>
                                        {errors.birthDate && <span className="auth-error-msg">{errors.birthDate}</span>}
                                    </div>

                                    <div className={`auth-field ${errors.password ? 'auth-field--error' : ''}`}>
                                        <label htmlFor="reg-password">Parola</label>
                                        <div className="auth-input-wrap">
                                            <span className="auth-input-icon">🔒</span>
                                            <input id="reg-password" type={showPass ? 'text' : 'password'} placeholder="Minim 8 caractere" value={form.password} onChange={set('password')} autoComplete="new-password" />
                                            <button type="button" className="auth-toggle-pass" onClick={() => setShowPass(!showPass)}>{showPass ? '🙈' : '👁️'}</button>
                                        </div>
                                        {form.password && (
                                            <div className="auth-strength">
                                                <div className="auth-strength-bars">
                                                    {[1, 2, 3, 4].map((i) => (
                                                        <div key={i} className="auth-strength-bar" style={{ background: i <= strength.level ? strength.color : '#e5e7eb' }} />
                                                    ))}
                                                </div>
                                                <span style={{ color: strength.color }}>{strength.label}</span>
                                            </div>
                                        )}
                                        {errors.password && <span className="auth-error-msg">{errors.password}</span>}
                                    </div>

                                    <div className={`auth-field ${errors.confirm ? 'auth-field--error' : ''}`}>
                                        <label htmlFor="confirm">Confirma parola</label>
                                        <div className="auth-input-wrap">
                                            <span className="auth-input-icon">🔒</span>
                                            <input id="confirm" type={showConfirm ? 'text' : 'password'} placeholder="Repeta parola" value={form.confirm} onChange={set('confirm')} autoComplete="new-password" />
                                            <button type="button" className="auth-toggle-pass" onClick={() => setShowConfirm(!showConfirm)}>{showConfirm ? '🙈' : '👁️'}</button>
                                        </div>
                                        {passwordMatch && <span className="auth-match-ok">✓ Parolele coincid</span>}
                                        {errors.confirm && <span className="auth-error-msg">{errors.confirm}</span>}
                                    </div>

                                    <div className={`auth-field auth-field--checkbox ${errors.agree ? 'auth-field--error' : ''}`}>
                                        <label className="auth-checkbox-label">
                                            <input type="checkbox" checked={form.agree} onChange={set('agree')} />
                                            Sunt de acord cu <a href="#" className="auth-link">Termenii si conditiile</a> si <a href="#" className="auth-link">Politica de confidentialitate</a>
                                        </label>
                                        {errors.agree && <span className="auth-error-msg">{errors.agree}</span>}
                                    </div>

                                    <button type="submit" className="auth-btn" disabled={loading}>
                                        {loading ? <span className="auth-spinner" /> : 'Creeaza cont gratuit'}
                                    </button>
                                </form>

                                <p className="auth-switch">
                                    Ai deja cont?{' '}
                                    <span className="auth-link" onClick={() => navigate('/login')}>Logheaza-te</span>
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

export default Register;
