import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import './CSS/Home.css';
import './CSS/PropertyDetail.css';
import { useCurrency } from './lib/currency';
import { saveBooking, type PaymentMethod } from './lib/bookings';
import { getSession } from './lib/session';
import { propertyService, type PropertyDetail } from './services/propertyService';

function calcNights(checkIn: string, checkOut: string) {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(`${checkIn}T00:00:00`).getTime();
    const end = new Date(`${checkOut}T00:00:00`).getTime();
    return Math.max(0, Math.round((end - start) / 86400000));
}

const PropertyDetailPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { formatPrice } = useCurrency();
    const [property, setProperty] = useState<PropertyDetail | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(2);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
    const [bookingMessage, setBookingMessage] = useState('');

    useEffect(() => {
        const propertyId = Number(id);
        setLoading(true);
        propertyService.getById(propertyId)
            .then((data) => {
                setProperty(data);
                setCheckIn(data.availableFrom);
                const nextDay = new Date(`${data.availableFrom}T00:00:00`);
                nextDay.setDate(nextDay.getDate() + 1);
                const nextDayString = nextDay.toISOString().split('T')[0];
                setCheckOut(nextDayString <= data.availableTo ? nextDayString : data.availableTo);
                setGuests(Math.min(2, data.maxGuests));
                setError('');
            })
            .catch(() => setError('Proprietatea nu a fost gasita.'))
            .finally(() => setLoading(false));
    }, [id]);

    const nights = useMemo(() => calcNights(checkIn, checkOut), [checkIn, checkOut]);
    const cleaning = 150;
    const fee = nights > 0 && property ? Math.round(property.price * nights * 0.1) : 0;
    const total = property ? property.price * nights + cleaning + fee : 0;

    const handleBook = async () => {
        if (!property || nights <= 0) return;

        const session = getSession();
        if (!session?.email) {
            navigate('/login');
            return;
        }

        const code = `SB-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
        await saveBooking({
            ownerEmail: session.email,
            propertyId: property.id,
            propertyTitle: property.title,
            propertyLocation: property.location,
            propertyImage: property.images[0],
            checkIn,
            checkOut,
            guests,
            nights,
            total,
            code,
            paymentMethod,
            paymentStatus: paymentMethod === 'card' ? 'paid' : 'pending',
            paymentLabel: paymentMethod === 'card' ? 'Card bancar' : paymentMethod === 'bank_transfer' ? 'Transfer bancar' : 'Plata la proprietate',
            paymentLast4: paymentMethod === 'card' ? '4242' : undefined,
            paidAt: paymentMethod === 'card' ? new Date().toISOString() : undefined,
        });

        setBookingMessage(`Rezervarea a fost creata cu codul ${code}.`);
    };

    if (loading) {
        return <div className="home"><Header /><div className="pd-not-found"><p>Se incarca...</p></div><Footer /></div>;
    }

    if (error || !property) {
        return (
            <div className="home">
                <Header />
                <div className="pd-not-found">
                    <div className="pd-nf-icon">🏠</div>
                    <h2>Proprietatea nu a fost gasita</h2>
                    <p>{error}</p>
                    <button className="pd-back-btn" onClick={() => navigate('/')}>Inapoi acasa</button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="home">
            <Header />

            <div className="pd-breadcrumb">
                <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Acasa</a> ›
                <a href="/search" onClick={(e) => { e.preventDefault(); navigate(`/search?location=${encodeURIComponent(property.city)}`); }}>{property.city}</a> ›
                <span>{property.title}</span>
            </div>

            <div className="pd-gallery-wrap">
                <div className="pd-gallery-grid">
                    {property.images.slice(0, 3).map((image) => (
                        <img key={image} src={image} alt={property.title} className="pd-gallery-img" />
                    ))}
                </div>
            </div>

            <div className="pd-layout">
                <div className="pd-main-col">
                    <section className="pd-section">
                        <h1>{property.title}</h1>
                        <p>📍 {property.location}</p>
                        <p>⭐ {property.rating} · {property.reviews} recenzii</p>
                    </section>

                    <section className="pd-section">
                        <h2 className="pd-sec-title">Despre proprietate</h2>
                        <p>{property.description}</p>
                        <p>{property.descriptionExtra}</p>
                    </section>

                    <section className="pd-section">
                        <h2 className="pd-sec-title">Facilitati</h2>
                        <div className="pd-features-grid">
                            {property.amenities.map((amenity) => (
                                <div key={amenity.label} className="pd-feature-item">
                                    <span>{amenity.icon}</span> {amenity.label}
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="pd-section">
                        <h2 className="pd-sec-title">In apropiere</h2>
                        <div className="pd-nearby-grid">
                            {property.nearby.map((place) => (
                                <div key={`${place.name}-${place.dist}`} className="pd-nearby-item">
                                    <span>{place.icon}</span>
                                    <span className="pd-nearby-name">{place.name}</span>
                                    <span className="pd-nearby-dist">{place.dist}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="pd-sidebar-col">
                    <div className="pd-sidebar">
                        <div className="pd-sb-price-row">
                            <span className="pd-sb-price">{formatPrice(property.price)}</span>
                            <span className="pd-sb-per">/ noapte</span>
                        </div>

                        <div className="pd-sb-dates">
                            <div className="pd-sb-date-field">
                                <label>Check-in</label>
                                <input type="date" value={checkIn} min={property.availableFrom} max={property.availableTo} onChange={(e) => setCheckIn(e.target.value)} />
                            </div>
                            <div className="pd-sb-date-field">
                                <label>Check-out</label>
                                <input type="date" value={checkOut} min={checkIn || property.availableFrom} max={property.availableTo} onChange={(e) => setCheckOut(e.target.value)} />
                            </div>
                        </div>

                        <div className="pd-sb-guests">
                            <div>
                                <label>Oaspeti</label>
                                <span>{guests} persoane</span>
                            </div>
                            <div className="pd-sb-guest-ctrl">
                                <button onClick={() => setGuests((value) => Math.max(1, value - 1))}>-</button>
                                <span>{guests}</span>
                                <button onClick={() => setGuests((value) => Math.min(property.maxGuests, value + 1))}>+</button>
                            </div>
                        </div>

                        <div className="pd-payment-methods">
                            <button type="button" className={`pd-payment-method ${paymentMethod === 'card' ? 'active' : ''}`} onClick={() => setPaymentMethod('card')}>
                                <strong>💳 Card</strong>
                            </button>
                            <button type="button" className={`pd-payment-method ${paymentMethod === 'bank_transfer' ? 'active' : ''}`} onClick={() => setPaymentMethod('bank_transfer')}>
                                <strong>🏦 Transfer</strong>
                            </button>
                            <button type="button" className={`pd-payment-method ${paymentMethod === 'pay_on_arrival' ? 'active' : ''}`} onClick={() => setPaymentMethod('pay_on_arrival')}>
                                <strong>🏨 La sosire</strong>
                            </button>
                        </div>

                        {nights > 0 && (
                            <div className="pd-sb-breakdown">
                                <div className="pd-sb-row"><span>{formatPrice(property.price)} x {nights} nopti</span><span>{formatPrice(property.price * nights)}</span></div>
                                <div className="pd-sb-row"><span>Taxa curatenie</span><span>{formatPrice(cleaning)}</span></div>
                                <div className="pd-sb-row"><span>Taxa serviciu</span><span>{formatPrice(fee)}</span></div>
                                <div className="pd-sb-total"><span>Total</span><span>{formatPrice(total)}</span></div>
                            </div>
                        )}

                        <button className="pd-sb-book-btn" onClick={handleBook} disabled={nights <= 0}>
                            Rezerva
                        </button>

                        {bookingMessage && <p className="pd-sb-note">{bookingMessage}</p>}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default PropertyDetailPage;
