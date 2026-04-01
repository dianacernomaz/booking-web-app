import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import './CSS/Home.css';
import './CSS/MyProfile.css';
import { useCurrency } from './lib/currency';
import { bookingsChangedEvent, cancelBooking, getBookingsForOwner, type BookingRecord, type BookingStatus } from './lib/bookings';
import { getSession } from './lib/session';

const STATUS_LABELS: Record<BookingStatus, string> = {
    active: 'Activ',
    upcoming: 'Urmeaza',
    completed: 'Finalizat',
    cancelled: 'Anulat',
};

const MyBookings: React.FC = () => {
    const navigate = useNavigate();
    const { formatPrice } = useCurrency();
    const session = getSession();
    const [filter, setFilter] = useState<BookingStatus | 'all'>('all');
    const [bookings, setBookings] = useState<BookingRecord[]>([]);

    useEffect(() => {
        if (!session?.email) {
            navigate('/login');
            return;
        }

        const load = () => getBookingsForOwner(session.email).then(setBookings).catch(() => setBookings([]));
        load();
        window.addEventListener(bookingsChangedEvent, load);
        return () => window.removeEventListener(bookingsChangedEvent, load);
    }, [navigate, session?.email]);

    const filtered = useMemo(
        () => filter === 'all' ? bookings : bookings.filter((booking) => booking.status === filter),
        [bookings, filter],
    );

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
                        <button className="mp-nav-item active">Rezervarile mele</button>
                    </nav>
                </aside>

                <main className="mp-main">
                    <div className="mp-tab-content">
                        <div className="mp-tab-header">
                            <h1>Rezervarile mele</h1>
                            <p>Rezervarile sunt incarcate acum din backend.</p>
                        </div>

                        <div className="mb-filters">
                            {(['all', 'active', 'upcoming', 'completed', 'cancelled'] as const).map((currentFilter) => (
                                <button key={currentFilter} className={`mb-filter-btn ${filter === currentFilter ? 'active' : ''}`} onClick={() => setFilter(currentFilter)}>
                                    {currentFilter === 'all' ? 'Toate' : STATUS_LABELS[currentFilter]}
                                </button>
                            ))}
                        </div>

                        {filtered.length === 0 ? (
                            <div className="mb-empty">
                                <div>📭</div>
                                <h3>Nicio rezervare</h3>
                                <button className="mp-save-btn" onClick={() => navigate('/')}>Cauta cazari</button>
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
                                                <span className={`mb-status mb-status--${booking.status}`}>{STATUS_LABELS[booking.status]}</span>
                                            </div>
                                            <div className="mb-dates-row">
                                                <div className="mb-date-block"><label>CHECK-IN</label><span>{booking.checkIn}</span></div>
                                                <div className="mb-date-block"><label>CHECK-OUT</label><span>{booking.checkOut}</span></div>
                                                <div className="mb-date-block"><label>NOPTI</label><span>{booking.nights}</span></div>
                                                <div className="mb-date-block"><label>OASPETI</label><span>{booking.guests}</span></div>
                                            </div>
                                            <div className="mb-card-footer">
                                                <div className="mb-booking-meta">
                                                    <span className="mb-code">#{booking.code}</span>
                                                    <span className="mb-total">{formatPrice(booking.total)}</span>
                                                </div>
                                                <div className="mb-actions">
                                                    <button className="mb-btn mb-btn--secondary" onClick={() => navigate(`/property/${booking.propertyId}`)}>Vezi proprietatea</button>
                                                    {booking.status === 'upcoming' && (
                                                        <button className="mb-btn mb-btn--danger" onClick={() => cancelBooking(booking.id, session.email)}>
                                                            Anuleaza
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
