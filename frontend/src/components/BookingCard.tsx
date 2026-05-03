import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../utils/currency';
import { type BookingRecord, type BookingStatus } from '../utils/bookings';

const STATUS_LABELS: Record<BookingStatus, string> = {
    active: 'Activ',
    upcoming: 'Urmează',
    completed: 'Finalizat',
    cancelled: 'Anulat',
};

interface BookingCardProps {
    booking: BookingRecord;
    onCancel: (id: string, email: string) => void;
    userEmail: string;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onCancel, userEmail }) => {
    const navigate = useNavigate();
    const { formatPrice } = useCurrency();

    return (
        <div className="mb-card">
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
                    <div className="mb-date-block"><label>NOPȚI</label><span>{booking.nights}</span></div>
                    <div className="mb-date-block"><label>OASPEȚI</label><span>{booking.guests}</span></div>
                </div>
                <div className="mb-card-footer">
                    <div className="mb-booking-meta">
                        <span className="mb-code">#{booking.code}</span>
                        <span className="mb-total">{formatPrice(booking.total)}</span>
                    </div>
                    <div className="mb-actions">
                        <button className="mb-btn mb-btn--secondary" onClick={() => navigate(`/property/${booking.propertyId}`)}>Vezi proprietatea</button>
                        {booking.status === 'upcoming' && (
                            <button className="mb-btn mb-btn--danger" onClick={() => onCancel(booking.id, userEmail)}>
                                Anulează
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingCard;
