import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { authService } from './services/authService';
import './CSS/Home.css';
import './CSS/MyProfile.css';

// ─── Types ────────────────────────────────────────────────────────────────────
type BookingStatus = 'active' | 'upcoming' | 'completed' | 'cancelled';

interface Booking {
    id: string;
    propertyId: number;
    propertyTitle: string;
    propertyLocation: string;
    propertyImage: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    nights: number;
    total: number;
    status: BookingStatus;
    code: string;
}

// ─── Mock data ─────────────────────────────────────────────────────────────────
const BOOKINGS: Booking[] = [
    {
        id: '1',
        propertyId: 4,
        propertyTitle: 'Vilă de Lux cu Piscină Privată',
        propertyLocation: 'Constanța, România',
        propertyImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=260&fit=crop',
        checkIn: '2026-03-15',
        checkOut: '2026-03-20',
        guests: 4,
        nights: 5,
        total: 2195,
        status: 'upcoming',
        code: 'SB-A4F2KL',
    },
    {
        id: '2',
        propertyId: 6,
        propertyTitle: 'Penthouse cu Panoramă la Oraș',
        propertyLocation: 'Timișoara, România',
        propertyImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=260&fit=crop',
        checkIn: '2026-02-24',
        checkOut: '2026-02-27',
        guests: 2,
        nights: 3,
        total: 930,
        status: 'active',
        code: 'SB-B9XR21',
    },
    {
        id: '3',
        propertyId: 1,
        propertyTitle: 'Luxury Suite cu vedere la mare',
        propertyLocation: 'Bali, Indonezia',
        propertyImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=260&fit=crop',
        checkIn: '2025-12-20',
        checkOut: '2025-12-27',
        guests: 2,
        nights: 7,
        total: 1700,
        status: 'completed',
        code: 'SB-C7MN99',
    },
    {
        id: '4',
        propertyId: 3,
        propertyTitle: 'Cabană Romantică la Munte',
        propertyLocation: 'Brașov, România',
        propertyImage: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=260&fit=crop',
        checkIn: '2025-11-10',
        checkOut: '2025-11-13',
        guests: 2,
        nights: 3,
        total: 585,
        status: 'completed',
        code: 'SB-D3KP55',
    },
    {
        id: '5',
        propertyId: 2,
        propertyTitle: 'Apartament Modern în Zona Lunitei',
        propertyLocation: 'București, România',
        propertyImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=260&fit=crop',
        checkIn: '2025-09-05',
        checkOut: '2025-09-07',
        guests: 1,
        nights: 2,
        total: 510,
        status: 'cancelled',
        code: 'SB-E1QW44',
    },
];

const STATUS_LABELS: Record<BookingStatus, string> = {
    active: 'Activ',
    upcoming: 'Urmează',
    completed: 'Finalizat',
    cancelled: 'Anulat',
};

const MONTHS_RO = ['Ian','Feb','Mar','Apr','Mai','Iun','Iul','Aug','Sep','Oct','Nov','Dec'];
function formatDate(iso: string) {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${d} ${MONTHS_RO[parseInt(m) - 1]} ${y}`;
}

// ─── Component ────────────────────────────────────────────────────────────────
const MyBookings: React.FC = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState<BookingStatus | 'all'>('all');

    const filtered = filter === 'all' ? BOOKINGS : BOOKINGS.filter(b => b.status === filter);

    return (
        <div className="home">
            <Header />

            <div className="mp-page">

                {/* ── Sidebar ── */}
                <aside className="mp-sidebar">
                    <div className="mp-avatar-wrap">
                        <div className="mp-avatar" style={{ background: '#2563eb' }}>AP</div>
                    </div>
                    <h2 className="mp-name">Alexandru Popescu</h2>
                    <p className="mp-member-since">Membru din Februarie 2024</p>

                    <div className="mp-stats">
                        <div className="mp-stat"><span className="mp-stat-val">12</span><span className="mp-stat-lbl">Rezervări</span></div>
                        <div className="mp-stat"><span className="mp-stat-val">8</span><span className="mp-stat-lbl">Favorite</span></div>
                        <div className="mp-stat"><span className="mp-stat-val">7</span><span className="mp-stat-lbl">Recenzii</span></div>
                    </div>

                    <nav className="mp-nav">
                        <button className="mp-nav-item" onClick={() => navigate('/profile')}>
                            <span>👤</span> Profilul meu
                        </button>
                        <button className="mp-nav-item active">
                            <span>📋</span> Rezervările mele
                        </button>
                        <button className="mp-nav-item" onClick={() => navigate('/profile')}>
                            <span>⚙️</span> Setări cont
                        </button>
                        <button className="mp-nav-item" onClick={() => navigate('/profile')}>
                            <span>🔒</span> Securitate
                        </button>
                        <button className="mp-nav-item mp-nav-item--danger" onClick={() => { authService.logout(); navigate('/login'); }}>
                            <span>🚪</span> Deconectare
                        </button>
                    </nav>
                </aside>

                {/* ── Main ── */}
                <main className="mp-main">
                    <div className="mp-tab-content">
                        <div className="mp-tab-header">
                            <h1>Rezervările mele</h1>
                            <p>Istoricul complet al sejururilor tale</p>
                        </div>

                        {/* Filter tabs */}
                        <div className="mb-filters">
                            {(['all', 'active', 'upcoming', 'completed', 'cancelled'] as const).map(f => (
                                <button
                                    key={f}
                                    className={`mb-filter-btn ${filter === f ? 'active' : ''}`}
                                    onClick={() => setFilter(f)}
                                >
                                    {f === 'all' ? 'Toate' : STATUS_LABELS[f]}
                                    <span className="mb-filter-count">
                                        {f === 'all' ? BOOKINGS.length : BOOKINGS.filter(b => b.status === f).length}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Bookings list */}
                        {filtered.length === 0 ? (
                            <div className="mb-empty">
                                <div>📭</div>
                                <h3>Nicio rezervare</h3>
                                <p>Nu ai rezervări în această categorie.</p>
                                <button className="mp-save-btn" onClick={() => navigate('/')}>
                                    Caută cazări
                                </button>
                            </div>
                        ) : (
                            <div className="mb-list">
                                {filtered.map(booking => (
                                    <div key={booking.id} className="mb-card">
                                        <div className="mb-card-image">
                                            <img src={booking.propertyImage} alt={booking.propertyTitle} />
                                        </div>
                                        <div className="mb-card-info">
                                            <div className="mb-card-top">
                                                <div>
                                                    <h3>{booking.propertyTitle}</h3>
                                                    <p className="mb-location">📍 {booking.propertyLocation}</p>
                                                </div>
                                                <span className={`mb-status mb-status--${booking.status}`}>
                                                    {STATUS_LABELS[booking.status]}
                                                </span>
                                            </div>

                                            <div className="mb-dates-row">
                                                <div className="mb-date-block">
                                                    <label>CHECK-IN</label>
                                                    <span>{formatDate(booking.checkIn)}</span>
                                                </div>
                                                <div className="mb-date-arrow">→</div>
                                                <div className="mb-date-block">
                                                    <label>CHECK-OUT</label>
                                                    <span>{formatDate(booking.checkOut)}</span>
                                                </div>
                                                <div className="mb-date-block">
                                                    <label>NOPȚI</label>
                                                    <span>{booking.nights}</span>
                                                </div>
                                                <div className="mb-date-block">
                                                    <label>OASPEȚI</label>
                                                    <span>{booking.guests} pers.</span>
                                                </div>
                                            </div>

                                            <div className="mb-card-footer">
                                                <div>
                                                    <span className="mb-code">#{booking.code}</span>
                                                    <span className="mb-total">{booking.total.toLocaleString()} RON</span>
                                                </div>
                                                <div className="mb-actions">
                                                    <button
                                                        className="mb-btn mb-btn--secondary"
                                                        onClick={() => navigate(`/property/${booking.propertyId}`)}
                                                    >
                                                        Vezi proprietatea
                                                    </button>
                                                    {booking.status === 'upcoming' && (
                                                        <button className="mb-btn mb-btn--danger">
                                                            Anulează
                                                        </button>
                                                    )}
                                                    {booking.status === 'completed' && (
                                                        <button className="mb-btn mb-btn--primary">
                                                            ⭐ Lasă recenzie
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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

export default MyBookings;
