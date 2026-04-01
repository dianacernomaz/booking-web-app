import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import './CSS/Home.css';
import './CSS/MyProfile.css';
import { authService } from './services/authService';

type Tab = 'overview' | 'settings' | 'security';

const MyProfile: React.FC = () => {
    const navigate = useNavigate();
    const session = authService.getSession();
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [user, setUser] = useState(authService.getCurrentUser());
    const [message, setMessage] = useState('');
    const [secMessage, setSecMessage] = useState('');
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        city: '',
        country: '',
        bio: '',
    });
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        if (!session?.email) {
            navigate('/login');
            return;
        }

        authService.fetchCurrentUser(session.email)
            .then((data) => {
                setUser(data);
                setForm({
                    fullName: data.fullName,
                    email: data.email,
                    phone: data.phone || '',
                    city: data.city || '',
                    country: data.country || '',
                    bio: data.bio || '',
                });
            })
            .catch(() => undefined);
    }, [navigate, session?.email]);

    if (!session?.email) {
        return null;
    }

    return (
        <div className="home">
            <Header />
            <div className="mp-page">
                <aside className="mp-sidebar">
                    <div className="mp-avatar-wrap">
                        <div className="mp-avatar" style={{ background: '#2563eb' }}>{session.initials}</div>
                    </div>
                    <h2 className="mp-name">{form.fullName || session.fullName}</h2>
                    <nav className="mp-nav">
                        <button className={`mp-nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Profil</button>
                        <button className={`mp-nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>Setari cont</button>
                        <button className={`mp-nav-item ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>Securitate</button>
                        <button className="mp-nav-item" onClick={() => navigate('/my-properties')}>Cazarile mele</button>
                        <button className="mp-nav-item" onClick={() => navigate('/bookings')}>Rezervarile mele</button>
                        <button className="mp-nav-item mp-nav-item--danger" onClick={() => { authService.logout(); navigate('/login'); }}>Deconectare</button>
                    </nav>
                </aside>

                <main className="mp-main">
                    {activeTab === 'overview' && (
                        <div className="mp-tab-content">
                            <div className="mp-tab-header">
                                <h1>Profilul meu</h1>
                                <p>Datele de profil sunt citite din backend.</p>
                            </div>
                            <div className="mp-profile-card">
                                <div className="mp-profile-card-left">
                                    <div className="mp-avatar-lg" style={{ background: '#2563eb' }}>{session.initials}</div>
                                    <div>
                                        <h2>{user?.fullName}</h2>
                                        <p>✉️ {user?.email}</p>
                                        {user?.phone && <p>📞 {user.phone}</p>}
                                        {user?.city && user?.country && <p>📍 {user.city}, {user.country}</p>}
                                    </div>
                                </div>
                            </div>
                            {user?.bio && <div className="mp-section"><h3 className="mp-section-title">Despre mine</h3><p className="mp-bio">{user.bio}</p></div>}
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="mp-tab-content">
                            <div className="mp-tab-header">
                                <h1>Setari cont</h1>
                                <p>Actualizeaza datele personale.</p>
                            </div>
                            <form className="mp-form" onSubmit={async (e) => {
                                e.preventDefault();
                                const result = await authService.updateCurrentUserProfile(form);
                                if (result.ok) {
                                    setUser(result.user);
                                    setMessage('Modificarile au fost salvate.');
                                } else {
                                    setMessage(result.error || 'Nu am putut salva.');
                                }
                            }}>
                                <div className="mp-form-section">
                                    <div className="mp-form-grid">
                                        <div className="mp-field mp-field--full"><label>Nume complet</label><input value={form.fullName} onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))} /></div>
                                        <div className="mp-field mp-field--full"><label>Email</label><input type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} /></div>
                                        <div className="mp-field"><label>Telefon</label><input value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} /></div>
                                        <div className="mp-field"><label>Oras</label><input value={form.city} onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))} /></div>
                                        <div className="mp-field"><label>Tara</label><input value={form.country} onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))} /></div>
                                        <div className="mp-field mp-field--full"><label>Bio</label><textarea rows={4} value={form.bio} onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))} /></div>
                                    </div>
                                </div>
                                <div className="mp-form-actions">
                                    {message && <span className="mp-save-msg">{message}</span>}
                                    <button type="submit" className="mp-save-btn">Salveaza modificarile</button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="mp-tab-content">
                            <div className="mp-tab-header">
                                <h1>Securitate</h1>
                                <p>Schimba parola sau sterge contul.</p>
                            </div>
                            <form className="mp-form" onSubmit={async (e) => {
                                e.preventDefault();
                                if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                                    setSecMessage('Parolele nu coincid.');
                                    return;
                                }
                                const result = await authService.updateCurrentUserPassword(passwordForm.currentPassword, passwordForm.newPassword);
                                setSecMessage(result.ok ? 'Parola a fost schimbata.' : result.error || 'Nu am putut schimba parola.');
                            }}>
                                <div className="mp-form-section">
                                    <div className="mp-form-grid">
                                        <div className="mp-field mp-field--full"><label>Parola curenta</label><input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))} /></div>
                                        <div className="mp-field"><label>Parola noua</label><input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))} /></div>
                                        <div className="mp-field"><label>Confirma parola</label><input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))} /></div>
                                    </div>
                                </div>
                                <div className="mp-form-actions">
                                    {secMessage && <span className="mp-save-msg">{secMessage}</span>}
                                    <button type="submit" className="mp-save-btn">Schimba parola</button>
                                </div>
                            </form>

                            <div className="mp-form-section mp-danger-zone">
                                <h3>Zona periculoasa</h3>
                                <p>Stergerea contului elimina si proprietatile si rezervarile aferente.</p>
                                <button type="button" className="mp-delete-btn" onClick={async () => {
                                    const result = await authService.deleteCurrentUser();
                                    if (result.ok) {
                                        navigate('/register');
                                    } else {
                                        setSecMessage(result.error || 'Nu am putut sterge contul.');
                                    }
                                }}>
                                    Sterge contul
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default MyProfile;
