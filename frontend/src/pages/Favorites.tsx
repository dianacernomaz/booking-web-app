import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import HomePropertyCard from '../components/HomePropertyCard';
import '../assets/css/Home.css';
import '../assets/css/MyProfile.css';
import { favoritesChangedEvent, getFavoriteProperties } from '../utils/favorites';
import type { ManagedPropertySummary } from '../types/managedProperties';
import { getSession } from '../utils/session';

const Favorites: React.FC = () => {
    const navigate = useNavigate();
    const session = getSession();
    const [loading, setLoading] = useState(true);
    const [properties, setProperties] = useState<ManagedPropertySummary[]>([]);

    const loadFavorites = () => {
        setLoading(true);
        getFavoriteProperties()
            .then(setProperties)
            .catch(() => setProperties([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (!session?.email) {
            navigate('/login');
            return;
        }

        loadFavorites();
        window.addEventListener(favoritesChangedEvent, loadFavorites);
        return () => window.removeEventListener(favoritesChangedEvent, loadFavorites);
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
                    <h2 className="mp-name">{session.fullName}</h2>
                    <nav className="mp-nav">
                        <button className="mp-nav-item" onClick={() => navigate('/profile')}>Profilul meu</button>
                        <button className="mp-nav-item" onClick={() => navigate('/my-properties')}>Cazarile mele</button>
                        <button className="mp-nav-item" onClick={() => navigate('/bookings')}>Rezervarile mele</button>
                        <button className="mp-nav-item" onClick={() => navigate('/notifications')}>Notificari</button>
                        <button className="mp-nav-item active">Favorite</button>
                    </nav>
                </aside>

                <main className="mp-main">
                    <div className="mp-tab-content">
                        <div className="mp-tab-header">
                            <h1>Favoritele mele</h1>
                            <p>Pastreaza aici proprietatile pe care vrei sa le revezi sau sa le rezervi mai tarziu.</p>
                        </div>

                        {loading ? (
                            <div className="mb-empty">
                                <h3>Se incarca favoritele...</h3>
                            </div>
                        ) : properties.length === 0 ? (
                            <div className="mb-empty">
                                <div>?</div>
                                <h3>Nu ai proprietati favorite</h3>
                                <p>Apasa pe inima dintr-un card pentru a salva o proprietate.</p>
                                <button className="mp-save-btn" onClick={() => navigate('/')}>Vezi proprietati</button>
                            </div>
                        ) : (
                            <div className="properties-grid">
                                {properties.map((property) => (
                                    <HomePropertyCard key={property.id} property={property} />
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default Favorites;
