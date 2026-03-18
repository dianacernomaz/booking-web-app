import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { authService } from './services/authService';
import './CSS/Home.css';
import './CSS/MyProfile.css';
import { useCurrency } from './lib/currency';
import { bookingsChangedEvent, cancelBooking, getBookingsForOwner, type BookingRecord, type BookingStatus } from './lib/bookings';
import { getSession, getStoredUser } from './lib/session';

const STATUS_LABELS: Record<BookingStatus, string> = {
    active: 'Activ',
    upcoming: 'Urmează',
    completed: 'Finalizat',
    cancelled: 'Anulat',
};

const MONTHS_RO = ['Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun', 'Iul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(iso: string) {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${d} ${MONTHS_RO[parseInt(m, 10) - 1]} ${y}`;
}

function buildInitials(name: string) {
    return name
        .split(' ')
        .map((part) => part[0] || '')
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

const MyBookings: React.FC = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState<BookingStatus | 'all'>('all');
    const [bookings, setBookings] = useState<BookingRecord[]>([]);
    const { formatPrice } = useCurrency();

    const session = getSession();
    const storedUser = getStoredUser();

    useEffect(() => {
        if (!session?.email) {
            navigate('/login');
            return;
        }

        const syncBookings = () => {
            setBookings(getBookingsForOwner(session.email));
        };

        syncBookings();
        window.addEventListener(bookingsChangedEvent, syncBookings);
        return () => window.removeEventListener(bookingsChangedEvent, syncBookings);
    }, [navigate, session?.email]);

    const displayName = session?.fullName || storedUser?.fullName || storedUser?.email || 'Utilizator';
    const displayInitials = session?.initials || buildInitials(displayName || 'U');

    const bookingCounts = useMemo(
        () => ({
            all: bookings.length,
            active: bookings.filter((booking) => booking.status === 'active').length,
            upcoming: bookings.filter((booking) => booking.status === 'upcoming').length,
            completed: bookings.filter((booking) => booking.status === 'completed').length,
            cancelled: bookings.filter((booking) => booking.status === 'cancelled').length,
        }),
        [bookings],
    );

    const filtered = filter === 'all' ? bookings : bookings.filter((booking) => booking.status === filter);

    const handleLogout = () => {
        localStorage.removeItem('sb_session');
        window.dispatchEvent(new Event('sb_session_changed'));
        navigate('/login');
    };

    const handleCancelBooking = (bookingId: string) => {
        if (!session?.email) return;
        cancelBooking(bookingId, session.email);
    };

    return (
        <div className="home">
            <Header />

            <div className="mp-page">
                <aside className="mp-sidebar">
                    <div className="mp-avatar-wrap">
                        <div className="mp-avatar" style={{ background: '#2563eb' }}>{displayInitials}</div>
                    </div>
                    <h2 className="mp-name">{displayName}</h2>
                    <p className="mp-member-since">{session?.email || 'Membru StayBooker'}</p>

                    <div className="mp-stats">
                        <div className="mp-stat"><span className="mp-stat-val">{bookingCounts.all}</span><span className="mp-stat-lbl">Rezervări</span></div>
                        <div className="mp-stat"><span className="mp-stat-val">{bookingCounts.upcoming}</span><span className="mp-stat-lbl">Urmează</span></div>
                        <div className="mp-stat"><span className="mp-stat-val">{bookingCounts.completed}</span><span className="mp-stat-lbl">Finalizate</span></div>
                    </div>

                    <nav className="mp-nav">
                        <button className="mp-nav-item" onClick={() => navigate('/profile')}>
                            <span>👤</span> Profilul meu
                        </button>
                        <button className="mp-nav-item" onClick={() => navigate('/my-properties')}>
                            <span>🏠</span> Cazări mele
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
                        <button className="mp-nav-item mp-nav-item--danger" onClick={handleLogout}>
                            <span>🚪</span> Deconectare
                        </button>
                    </nav>
                </aside>

                <main className="mp-main">
                    <div className="mp-tab-content">
                        <div className="mp-tab-header">
                            <h1>Rezervările mele</h1>
                            <p>Istoricul complet al sejururilor tale</p>
                        </div>

                        <div className="mb-filters">
                            {(['all', 'active', 'upcoming', 'completed', 'cancelled'] as const).map((currentFilter) => (
                                <button
                                    key={currentFilter}
                                    className={`mb-filter-btn ${filter === currentFilter ? 'active' : ''}`}
                                    onClick={() => setFilter(currentFilter)}
                                >
                                    {currentFilter === 'all' ? 'Toate' : STATUS_LABELS[currentFilter]}
                                    <span className="mb-filter-count">
                                        {currentFilter === 'all' ? bookingCounts.all : bookingCounts[currentFilter]}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {filtered.length === 0 ? (
                            <div className="mb-empty">
                                <div>📭</div>
                                <h3>Nicio rezervare</h3>
                                <p>Nu ai încă rezervări salvate pentru acest cont.</p>
                                <button className="mp-save-btn" onClick={() => navigate('/')}>
                                    Caută cazări
                                </button>
                            </div>
                        ) : (
                            <div className="mb-list">
                                {filtered.map((booking) => (
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
                                                <div className="mb-booking-meta">
                                                    <div>
                                                        <span className="mb-code">#{booking.code}</span>
                                                        <span className="mb-total">{formatPrice(booking.total)}</span>
                                                    </div>
                                                    <div className="mb-payment-row">
                                                        <span className={`mb-payment-badge mb-payment-badge--${booking.paymentStatus || 'pending'}`}>
                                                            {booking.paymentStatus === 'paid' ? 'Plătit' : 'În așteptare'}
                                                        </span>
                                                        <span className="mb-payment-label">
                                                            {booking.paymentLabel || 'Metodă nespecificată'}
                                                            {booking.paymentLast4 ? ` • **** ${booking.paymentLast4}` : ''}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="mb-actions">
                                                    <button
                                                        className="mb-btn mb-btn--secondary"
                                                        onClick={() => navigate(`/property/${booking.propertyId}`)}
                                                    >
                                                        Vezi proprietatea
                                                    </button>
                                                    {booking.status === 'upcoming' && (
                                                        <button className="mb-btn mb-btn--danger" onClick={() => handleCancelBooking(booking.id)}>
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
