import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import BookingCard from '../components/BookingCard';
import '../assets/css/Home.css';
import '../assets/css/MyProfile.css';
import { bookingsChangedEvent, cancelBooking, getBookingsForOwner, type BookingRecord, type BookingStatus } from '../utils/bookings';
import { getSession } from '../utils/session';
const STATUS_LABELS: Record<BookingStatus, string> = {
    active: 'Activ',
    upcoming: 'Urmeaza',
    completed: 'Finalizat',
    cancelled: 'Anulat',
};
const MyBookings: React.FC = () => {
    const navigate = useNavigate();
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
                        <button className="mp-nav-item" onClick={() => navigate('/favorites')}>Favorite</button>
                    </nav>
                </aside>
                <main className="mp-main">
                    <div className="mp-tab-content">
                        <div className="mp-tab-header">
                            <h1>Rezervarile mele</h1>
                            <p>Aici gasesti toate rezervarile tale, organizate dupa status.</p>
                        </div>
                        <div className="mb-filters">
                            {(['all', 'active', 'upcoming', 'completed', 'cancelled'] as const).map((currentFilter) => (
                                <button key={currentFilter} className={'mb-filter-btn ' + (filter === currentFilter ? 'active' : '')} onClick={() => setFilter(currentFilter)}>
                                    {currentFilter === 'all' ? 'Toate' : STATUS_LABELS[currentFilter]}
                                </button>
                            ))}
                        </div>
                        {filtered.length === 0 ? (
                            <div className="mb-empty">
                                <div>Inbox</div>
                                <h3>Nicio rezervare</h3>
                                <button className="mp-save-btn" onClick={() => navigate('/')}>Cauta cazari</button>
                            </div>
                        ) : (
                            <div className="mb-list">
                                {filtered.map((booking) => (
                                    <BookingCard
                                        key={booking.id}
                                        booking={booking}
                                        onCancel={cancelBooking}
                                        userEmail={session.email}
                                    />
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

