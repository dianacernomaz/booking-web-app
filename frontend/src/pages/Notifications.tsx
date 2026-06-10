import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import '../assets/css/Home.css';
import '../assets/css/MyProfile.css';
import {
    deleteNotification,
    getNotifications,
    markAllNotificationsAsRead,
    markNotificationAsRead,
    notificationsChangedEvent,
    type NotificationRecord,
    type NotificationType,
} from '../utils/notifications';
import { getSession } from '../utils/session';

const TYPE_LABELS: Record<NotificationType, string> = {
    Reservation: 'Rezervare',
    Promotional: 'Promotional',
    System: 'Sistem',
};

function formatNotificationTime(value: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString('ro-RO', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
}

const Notifications: React.FC = () => {
    const navigate = useNavigate();
    const session = getSession();
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState<NotificationRecord[]>([]);

    const loadNotifications = () => {
        setLoading(true);
        getNotifications()
            .then(setNotifications)
            .catch(() => setNotifications([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (!session?.email) {
            navigate('/login');
            return;
        }

        loadNotifications();
        window.addEventListener(notificationsChangedEvent, loadNotifications);
        return () => window.removeEventListener(notificationsChangedEvent, loadNotifications);
    }, [navigate, session?.email]);

    const unreadCount = useMemo(
        () => notifications.filter((notification) => !notification.isRead).length,
        [notifications],
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
                        <button className="mp-nav-item" onClick={() => navigate('/bookings')}>Rezervarile mele</button>
                        <button className="mp-nav-item" onClick={() => navigate('/favorites')}>Favorite</button>
                        <button className="mp-nav-item active">Notificari</button>
                    </nav>
                </aside>

                <main className="mp-main">
                    <div className="mp-tab-content">
                        <div className="mp-tab-header">
                            <h1>Notificarile mele</h1>
                            <p>Vezi cele mai recente actualizari pentru rezervari, plati si mesaje de sistem.</p>
                        </div>

                        <div className="nt-toolbar">
                            <div className="nt-toolbar-copy">
                                <strong>{unreadCount}</strong>
                                <span>{unreadCount === 1 ? 'notificare necitita' : 'notificari necitite'}</span>
                            </div>
                            <button
                                type="button"
                                className="mp-save-btn"
                                onClick={async () => {
                                    await markAllNotificationsAsRead();
                                    loadNotifications();
                                }}
                                disabled={unreadCount === 0}
                            >
                                Marcheaza tot ca citit
                            </button>
                        </div>

                        {loading ? (
                            <div className="mb-empty">
                                <h3>Se incarca notificarile...</h3>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="mb-empty">
                                <div>Inbox</div>
                                <h3>Nu ai notificari</h3>
                                <p>Vom afisa aici confirmarile de rezervare, platile si actualizarile de sistem.</p>
                            </div>
                        ) : (
                            <div className="nt-list">
                                {notifications.map((notification) => (
                                    <article key={notification.id} className={`nt-card ${notification.isRead ? '' : 'nt-card--unread'}`}>
                                        <div className="nt-card-head">
                                            <div>
                                                <span className={`nt-type nt-type--${notification.type}`}>{TYPE_LABELS[notification.type] || notification.type}</span>
                                                <h3>{notification.title}</h3>
                                            </div>
                                            <time className="nt-time">{formatNotificationTime(notification.createdAt)}</time>
                                        </div>
                                        <p className="nt-message">{notification.message}</p>
                                        <div className="nt-actions">
                                            {!notification.isRead && (
                                                <button
                                                    type="button"
                                                    className="nt-action"
                                                    onClick={async () => {
                                                        await markNotificationAsRead(notification.id);
                                                        loadNotifications();
                                                    }}
                                                >
                                                    Marcheaza ca citita
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                className="nt-action nt-action--danger"
                                                onClick={async () => {
                                                    await deleteNotification(notification.id);
                                                    loadNotifications();
                                                }}
                                            >
                                                Sterge
                                            </button>
                                        </div>
                                    </article>
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

export default Notifications;
