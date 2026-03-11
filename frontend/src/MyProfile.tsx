import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { authService } from './services/authService';
import './CSS/Home.css';
import './CSS/MyProfile.css';

type Tab = 'overview' | 'settings' | 'security';

function loadUser() {
    return authService.getCurrentUser();
}

function getInitials(fullName: string) {
    return fullName
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

const MyProfile: React.FC = () => {
    const navigate = useNavigate();
    const session = authService.getSession();
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [saved, setSaved] = useState(false);

    // ── Datele reale ale utilizatorului
    const [userData, setUserData] = useState(() => loadUser());

    // Dacă nu e logat, trimite la login
    useEffect(() => {
        if (!authService.getSession()) {
            navigate('/login');
        }
    }, [navigate]);

    // Construim firstName / lastName din fullName dacă e necesar
    const fullName    = userData?.fullName || userData?.email || '';
    const nameParts   = fullName.trim().split(' ');
    const firstName   = nameParts[0] || '';
    const lastName    = nameParts.slice(1).join(' ') || '';
    const avatarColor = '#2563eb';

    // ── Formular setări (populat cu datele reale)
    const [form, setForm] = useState({
        firstName: firstName,
        lastName:  lastName,
        email:     userData?.email     || '',
        phone:     userData?.phone     || '',
        city:      userData?.city      || '',
        country:   userData?.country   || '',
        bio:       userData?.bio       || '',
    });

    // Actualizează formularul dacă userData se schimbă
    useEffect(() => {
        const u = loadUser();
        if (u) {
            const fn = (u.fullName || u.email || '').split(' ');
            setForm({
                firstName: fn[0] || '',
                lastName:  fn.slice(1).join(' ') || '',
                email:     u.email    || '',
                phone:     u.phone    || '',
                city:      u.city     || '',
                country:   u.country  || '',
                bio:       u.bio      || '',
            });
            setUserData(u);
        }
    }, []);

    // ── Formular securitate
    const [secForm, setSecForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [secMsg, setSecMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setSaved(false);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const newFullName = `${form.firstName} ${form.lastName}`.trim();
        const result = authService.updateCurrentUserProfile({
            fullName: newFullName,
            email:    form.email,
            phone:    form.phone,
            city:     form.city,
            country:  form.country,
            bio:      form.bio,
        });
        if (!result.ok || !result.data) return;
        setUserData(result.data);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleSecSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!secForm.currentPassword) {
            setSecMsg({ type: 'error', text: 'Introdu parola curentă.' });
            return;
        }
        if (secForm.newPassword.length < 6) {
            setSecMsg({ type: 'error', text: 'Parola nouă trebuie să aibă minim 6 caractere.' });
            return;
        }
        if (secForm.newPassword !== secForm.confirmPassword) {
            setSecMsg({ type: 'error', text: 'Parolele nu coincid.' });
            return;
        }
        const result = authService.updateCurrentUserPassword(secForm.currentPassword, secForm.newPassword);
        if (!result.ok) {
            setSecMsg({ type: 'error', text: result.error || 'Parola curentă este incorectă.' });
            return;
        }
        setSecMsg({ type: 'success', text: 'Parola a fost schimbată cu succes!' });
        setSecForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setSecMsg(null), 4000);
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    // Sidebar name (updated live dacă userul salvează)
    const displayName = `${form.firstName} ${form.lastName}`.trim() || fullName;
    const displayInitials = getInitials(displayName || 'U');

    return (
        <div className="home">
            <Header />

            <div className="mp-page">

                {/* ── Sidebar ── */}
                <aside className="mp-sidebar">
                    <div className="mp-avatar-wrap">
                        <div className="mp-avatar" style={{ background: avatarColor }}>
                            {displayInitials}
                        </div>
                        <button className="mp-avatar-edit" title="Schimbă poza">📷</button>
                    </div>

                    <h2 className="mp-name">{displayName}</h2>
                    <p className="mp-member-since">Membru StayBooker</p>

                    <div className="mp-stats">
                        <div className="mp-stat">
                            <span className="mp-stat-val">0</span>
                            <span className="mp-stat-lbl">Rezervări</span>
                        </div>
                        <div className="mp-stat">
                            <span className="mp-stat-val">0</span>
                            <span className="mp-stat-lbl">Favorite</span>
                        </div>
                        <div className="mp-stat">
                            <span className="mp-stat-val">0</span>
                            <span className="mp-stat-lbl">Recenzii</span>
                        </div>
                    </div>

                    <nav className="mp-nav">
                        <button className={`mp-nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                            <span>👤</span> Profilul meu
                        </button>
                        <button className="mp-nav-item" onClick={() => navigate('/bookings')}>
                            <span>📋</span> Rezervările mele
                        </button>
                        <button className={`mp-nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
                            <span>⚙️</span> Setări cont
                        </button>
                        <button className={`mp-nav-item ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
                            <span>🔒</span> Securitate
                        </button>
                        <button className="mp-nav-item mp-nav-item--danger" onClick={handleLogout}>
                            <span>🚪</span> Deconectare
                        </button>
                    </nav>
                </aside>

                {/* ── Main Content ── */}
                <main className="mp-main">

                    {/* ══ OVERVIEW ══ */}
                    {activeTab === 'overview' && (
                        <div className="mp-tab-content">
                            <div className="mp-tab-header">
                                <h1>Profilul meu</h1>
                                <p>Informații despre contul tău StayBooker</p>
                            </div>

                            <div className="mp-profile-card">
                                <div className="mp-profile-card-left">
                                    <div className="mp-avatar-lg" style={{ background: avatarColor }}>
                                        {displayInitials}
                                    </div>
                                    <div>
                                        <h2>{displayName}</h2>
                                        {form.city && form.country && <p>📍 {form.city}, {form.country}</p>}
                                        {form.email   && <p>✉️ {form.email}</p>}
                                        {form.phone   && <p>📞 {form.phone}</p>}
                                    </div>
                                </div>
                                <button className="mp-edit-btn" onClick={() => setActiveTab('settings')}>
                                    ✏️ Editează profilul
                                </button>
                            </div>

                            {form.bio && (
                                <div className="mp-section">
                                    <h3 className="mp-section-title">Despre mine</h3>
                                    <p className="mp-bio">{form.bio}</p>
                                </div>
                            )}

                            <div className="mp-section">
                                <h3 className="mp-section-title">Acces rapid</h3>
                                <div className="mp-quick-actions">
                                    <div className="mp-action-card" onClick={() => navigate('/bookings')}>
                                        <div className="mp-action-icon" style={{ background: '#dbeafe' }}>📋</div>
                                        <div>
                                            <h4>Rezervările mele</h4>
                                            <p>Vezi istoricul rezervărilor</p>
                                        </div>
                                        <span className="mp-action-arrow">→</span>
                                    </div>
                                    <div className="mp-action-card" onClick={() => setActiveTab('settings')}>
                                        <div className="mp-action-icon" style={{ background: '#d1fae5' }}>⚙️</div>
                                        <div>
                                            <h4>Setări cont</h4>
                                            <p>Actualizează datele personale</p>
                                        </div>
                                        <span className="mp-action-arrow">→</span>
                                    </div>
                                    <div className="mp-action-card" onClick={() => setActiveTab('security')}>
                                        <div className="mp-action-icon" style={{ background: '#fef3c7' }}>🔒</div>
                                        <div>
                                            <h4>Securitate</h4>
                                            <p>Schimbă parola contului</p>
                                        </div>
                                        <span className="mp-action-arrow">→</span>
                                    </div>
                                    {session?.role === 'admin' && (
                                        <div className="mp-action-card" onClick={() => navigate('/admin')}>
                                            <div className="mp-action-icon" style={{ background: '#ede9fe' }}>🛠️</div>
                                            <div>
                                                <h4>Admin</h4>
                                                <p>Deschide panoul de administrare</p>
                                            </div>
                                            <span className="mp-action-arrow">→</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mp-section">
                                <h3 className="mp-section-title">Verificări cont</h3>
                                <div className="mp-verifications">
                                    <div className="mp-verify-item mp-verify--done">
                                        <span>✅</span> Adresă email verificată
                                    </div>
                                    <div className={`mp-verify-item ${form.phone ? 'mp-verify--done' : 'mp-verify--pending'}`}>
                                        <span>{form.phone ? '✅' : '⚠️'}</span> Număr de telefon {form.phone ? 'verificat' : 'neverificat'}
                                        {!form.phone && <button className="mp-verify-btn" onClick={() => setActiveTab('settings')}>Adaugă acum</button>}
                                    </div>
                                    <div className="mp-verify-item mp-verify--pending">
                                        <span>⚠️</span> Identitate neconfirmată
                                        <button className="mp-verify-btn">Verifică acum</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ══ SETTINGS ══ */}
                    {activeTab === 'settings' && (
                        <div className="mp-tab-content">
                            <div className="mp-tab-header">
                                <h1>Setări cont</h1>
                                <p>Actualizează informațiile tale personale</p>
                            </div>

                            <form className="mp-form" onSubmit={handleSave}>
                                <div className="mp-form-section">
                                    <h3>Informații personale</h3>
                                    <div className="mp-form-grid">
                                        <div className="mp-field">
                                            <label>Prenume</label>
                                            <input name="firstName" value={form.firstName} onChange={handleFormChange} placeholder="Prenumele tău" />
                                        </div>
                                        <div className="mp-field">
                                            <label>Nume</label>
                                            <input name="lastName" value={form.lastName} onChange={handleFormChange} placeholder="Numele tău" />
                                        </div>
                                        <div className="mp-field mp-field--full">
                                            <label>Adresă email</label>
                                            <input name="email" type="email" value={form.email} onChange={handleFormChange} placeholder="email@exemplu.com" />
                                        </div>
                                        <div className="mp-field">
                                            <label>Telefon</label>
                                            <input name="phone" value={form.phone} onChange={handleFormChange} placeholder="+40 7xx xxx xxx" />
                                        </div>
                                    </div>
                                </div>

                                <div className="mp-form-section">
                                    <h3>Locație</h3>
                                    <div className="mp-form-grid">
                                        <div className="mp-field">
                                            <label>Oraș</label>
                                            <input name="city" value={form.city} onChange={handleFormChange} placeholder="Orașul tău" />
                                        </div>
                                        <div className="mp-field">
                                            <label>Țară</label>
                                            <input name="country" value={form.country} onChange={handleFormChange} placeholder="Țara ta" />
                                        </div>
                                    </div>
                                </div>

                                <div className="mp-form-section">
                                    <h3>Despre tine</h3>
                                    <div className="mp-field mp-field--full">
                                        <label>Bio</label>
                                        <textarea name="bio" value={form.bio} onChange={handleFormChange} placeholder="Scrie câteva cuvinte despre tine..." rows={4} />
                                    </div>
                                </div>

                                <div className="mp-form-actions">
                                    {saved && <span className="mp-save-msg">✅ Modificările au fost salvate!</span>}
                                    <button type="submit" className="mp-save-btn">💾 Salvează modificările</button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* ══ SECURITY ══ */}
                    {activeTab === 'security' && (
                        <div className="mp-tab-content">
                            <div className="mp-tab-header">
                                <h1>Securitate</h1>
                                <p>Gestionează parola și securitatea contului</p>
                            </div>

                            <form className="mp-form" onSubmit={handleSecSave}>
                                <div className="mp-form-section">
                                    <h3>Schimbă parola</h3>
                                    {secMsg && (
                                        <div className={`mp-msg ${secMsg.type === 'error' ? 'mp-msg--error' : 'mp-msg--success'}`}>
                                            {secMsg.text}
                                        </div>
                                    )}
                                    <div className="mp-form-grid">
                                        <div className="mp-field mp-field--full">
                                            <label>Parola curentă</label>
                                            <input type="password" value={secForm.currentPassword} onChange={e => setSecForm(p => ({ ...p, currentPassword: e.target.value }))} placeholder="••••••••" />
                                        </div>
                                        <div className="mp-field">
                                            <label>Parola nouă</label>
                                            <input type="password" value={secForm.newPassword} onChange={e => setSecForm(p => ({ ...p, newPassword: e.target.value }))} placeholder="Minim 6 caractere" />
                                        </div>
                                        <div className="mp-field">
                                            <label>Confirmă parola nouă</label>
                                            <input type="password" value={secForm.confirmPassword} onChange={e => setSecForm(p => ({ ...p, confirmPassword: e.target.value }))} placeholder="Repetă parola" />
                                        </div>
                                    </div>
                                </div>

                                <div className="mp-form-section">
                                    <h3>Sesiuni active</h3>
                                    <div className="mp-sessions">
                                        <div className="mp-session">
                                            <div className="mp-session-icon">💻</div>
                                            <div>
                                                <p className="mp-session-name">Browser curent</p>
                                                <p className="mp-session-info">{form.email} · Activ acum</p>
                                            </div>
                                            <span className="mp-session-badge mp-session-badge--current">Curent</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mp-form-section mp-danger-zone">
                                    <h3>Zonă periculoasă</h3>
                                    <p>Odată șters, contul nu poate fi recuperat.</p>
                                    <button type="button" className="mp-delete-btn" onClick={() => {
                                        authService.deleteCurrentUser();
                                        navigate('/register');
                                    }}>
                                        🗑️ Șterge contul
                                    </button>
                                </div>

                                <div className="mp-form-actions">
                                    <button type="submit" className="mp-save-btn">🔒 Schimbă parola</button>
                                </div>
                            </form>
                        </div>
                    )}

                </main>
            </div>

            <Footer />
        </div>
    );
};

export default MyProfile;
