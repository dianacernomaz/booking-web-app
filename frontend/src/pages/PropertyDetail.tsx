import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import GalleryItem from '../components/GalleryItem';
import AmenityItem from '../components/AmenityItem';
import NearbyItem from '../components/NearbyItem';
import '../assets/css/Home.css';
import '../assets/css/PropertyDetail.css';
import { useCurrency } from '../utils/currency';
import { saveBooking, type PaymentMethod } from '../utils/bookings';
import { getSession } from '../utils/session';
import { propertyService, type PropertyDetail } from '../axios/propertyService';

function calcNights(checkIn: string, checkOut: string) {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(`${checkIn}T00:00:00`).getTime();
    const end = new Date(`${checkOut}T00:00:00`).getTime();
    return Math.max(0, Math.round((end - start) / 86400000));
}

function createBookingCode() {
    return `SB-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function getPaymentLabel(paymentMethod: PaymentMethod) {
    if (paymentMethod === 'card') return 'Card bancar';
    if (paymentMethod === 'bank_transfer') return 'Transfer bancar';
    return 'Plata la proprietate';
}

function digitsOnly(value: string) {
    return value.replace(/\D/g, '');
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
    const [bookingModalOpen, setBookingModalOpen] = useState(false);
    const [bookingSubmitting, setBookingSubmitting] = useState(false);
    const [bookingError, setBookingError] = useState('');
    const [bookingCode, setBookingCode] = useState('');
    const [cardholderName, setCardholderName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvc, setCardCvc] = useState('');
    const [transferName, setTransferName] = useState('');

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
            .catch(() => setError('Proprietatea nu a fost găsită.'))
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        if (!bookingModalOpen) {
            return undefined;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [bookingModalOpen]);

    const nights = useMemo(() => calcNights(checkIn, checkOut), [checkIn, checkOut]);
    const cleaning = 150;
    const fee = nights > 0 && property ? Math.round(property.price * nights * 0.1) : 0;
    const total = property ? property.price * nights + cleaning + fee : 0;

    const resetBookingState = () => {
        setBookingError('');
        setBookingCode('');
    };

    const openBookingModal = () => {
        if (!property || nights <= 0) return;

        const session = getSession();
        if (!session?.email) {
            navigate('/login');
            return;
        }

        resetBookingState();
        setBookingModalOpen(true);
    };

    const closeBookingModal = () => {
        if (bookingSubmitting) {
            return;
        }

        setBookingModalOpen(false);
        setBookingError('');
    };

    const validatePaymentDetails = () => {
        if (paymentMethod === 'card') {
            if (cardholderName.trim().length < 3) {
                return 'Completează numele titularului de card.';
            }

            if (digitsOnly(cardNumber).length < 16) {
                return 'Numărul cardului trebuie să aibă 16 cifre.';
            }

            if (!/^\d{2}\/\d{2}$/.test(cardExpiry.trim())) {
                return 'Data expirării trebuie să fie în format MM/YY.';
            }

            if (digitsOnly(cardCvc).length < 3) {
                return 'Codul CVC trebuie să aibă cel puțin 3 cifre.';
            }
        }

        if (paymentMethod === 'bank_transfer' && transferName.trim().length < 3) {
            return 'Completează numele plătitorului pentru transfer.';
        }

        return '';
    };

    const handleConfirmBooking = async () => {
        if (!property || nights <= 0) return;

        const session = getSession();
        if (!session?.email) {
            navigate('/login');
            return;
        }

        const paymentValidationError = validatePaymentDetails();
        if (paymentValidationError) {
            setBookingError(paymentValidationError);
            return;
        }

        const code = createBookingCode();

        try {
            setBookingSubmitting(true);
            setBookingError('');

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
                paymentLabel: getPaymentLabel(paymentMethod),
                paymentLast4: paymentMethod === 'card' ? digitsOnly(cardNumber).slice(-4) : undefined,
                paidAt: paymentMethod === 'card' ? new Date().toISOString() : undefined,
            });

            setBookingCode(code);
            setBookingMessage(`Rezervarea pentru ${property.title} a fost confirmată.`);
        } catch {
            setBookingError('Rezervarea nu a putut fi finalizată. Verifică datele și încearcă din nou.');
        } finally {
            setBookingSubmitting(false);
        }
    };

    if (loading) {
        return <div className="home"><Header /><div className="pd-not-found"><p>Se încarcă...</p></div><Footer /></div>;
    }

    if (error || !property) {
        return (
            <div className="home">
                <Header />
                <div className="pd-not-found">
                    <div className="pd-nf-icon">Casa</div>
                    <h2>Proprietatea nu a fost găsită</h2>
                    <p>{error}</p>
                    <button className="pd-back-btn" onClick={() => navigate('/')}>Înapoi acasă</button>
                </div>
                <Footer />
            </div>
        );
    }

    const galleryImages = property.images.slice(0, 3);
    const galleryClassName = `pd-gallery-grid pd-gallery-grid--count-${galleryImages.length}`;
    const paymentSummary = paymentMethod === 'card'
        ? 'Plata se marchează imediat ca achitată, iar rezervarea se confirmă pe loc.'
        : paymentMethod === 'bank_transfer'
            ? 'Rezervarea se salvează acum, iar plata rămâne în așteptare până la confirmarea transferului.'
            : 'Rezervarea se creează acum, iar plata se face la sosire.';

    return (
        <div className="home">
            <Header />

            <div className="pd-breadcrumb">
                <a href="/" onClick={(event) => { event.preventDefault(); navigate('/'); }}>Acasă</a>
                <span>/</span>
                <a href="/search" onClick={(event) => { event.preventDefault(); navigate(`/search?location=${encodeURIComponent(property.city)}`); }}>{property.city}</a>
                <span>/</span>
                <span>{property.title}</span>
            </div>

            <div className="pd-gallery-wrap">
                <div className={galleryClassName}>
                    {galleryImages.map((image, index) => (
                        <GalleryItem 
                            key={image} 
                            image={image} 
                            alt={`${property.title} ${index + 1}`} 
                            isMain={index === 0} 
                        />
                    ))}
                </div>
            </div>

            <div className="pd-layout">
                <div className="pd-main-col">
                    <section className="pd-section">
                        <h1>{property.title}</h1>
                        <p>{property.location}</p>
                        <p>{property.rating} / 5 | {property.reviews} recenzii</p>
                    </section>

                    <section className="pd-section">
                        <h2 className="pd-sec-title">Despre proprietate</h2>
                        <p>{property.description}</p>
                        <p>{property.descriptionExtra}</p>
                    </section>

                    <section className="pd-section">
                        <h2 className="pd-sec-title">Facilități</h2>
                        <div className="pd-features-grid">
                            {property.amenities.map((amenity) => (
                                <AmenityItem 
                                    key={amenity.label} 
                                    icon={amenity.icon} 
                                    label={amenity.label} 
                                />
                            ))}
                        </div>
                    </section>

                    <section className="pd-section">
                        <h2 className="pd-sec-title">În apropiere</h2>
                        <div className="pd-nearby-grid">
                            {property.nearby.map((place) => (
                                <NearbyItem 
                                    key={`${place.name}-${place.dist}`} 
                                    icon={place.icon} 
                                    name={place.name} 
                                    dist={place.dist} 
                                />
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
                                <input type="date" value={checkIn} min={property.availableFrom} max={property.availableTo} onChange={(event) => setCheckIn(event.target.value)} />
                            </div>
                            <div className="pd-sb-date-field">
                                <label>Check-out</label>
                                <input type="date" value={checkOut} min={checkIn || property.availableFrom} max={property.availableTo} onChange={(event) => setCheckOut(event.target.value)} />
                            </div>
                        </div>

                        <div className="pd-sb-guests">
                            <div>
                                <label>Oaspeți</label>
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
                                <strong>Card</strong>
                                <span>Plata instant</span>
                            </button>
                            <button type="button" className={`pd-payment-method ${paymentMethod === 'bank_transfer' ? 'active' : ''}`} onClick={() => setPaymentMethod('bank_transfer')}>
                                <strong>Transfer</strong>
                                <span>Confirmare ulterioară</span>
                            </button>
                            <button type="button" className={`pd-payment-method ${paymentMethod === 'pay_on_arrival' ? 'active' : ''}`} onClick={() => setPaymentMethod('pay_on_arrival')}>
                                <strong>La sosire</strong>
                                <span>Achiți la check-in</span>
                            </button>
                        </div>

                        <div className="pd-sb-payment-hint">
                            <strong>Metoda selectată:</strong> {getPaymentLabel(paymentMethod)}
                            <p>{paymentSummary}</p>
                        </div>

                        {nights > 0 && (
                            <div className="pd-sb-breakdown">
                                <div className="pd-sb-row"><span>{formatPrice(property.price)} x {nights} nopți</span><span>{formatPrice(property.price * nights)}</span></div>
                                <div className="pd-sb-row"><span>Taxă curățenie</span><span>{formatPrice(cleaning)}</span></div>
                                <div className="pd-sb-row"><span>Taxă serviciu</span><span>{formatPrice(fee)}</span></div>
                                <div className="pd-sb-total"><span>Total</span><span>{formatPrice(total)}</span></div>
                            </div>
                        )}

                        <button className="pd-sb-book-btn" onClick={openBookingModal} disabled={nights <= 0}>
                            Continuă spre confirmare
                        </button>

                        <p className="pd-sb-note">
                            Rezervarea se confirmă în pasul următor. Pentru card, plata este simulată în aplicație.
                        </p>
                        {bookingMessage && <p className="pd-sb-note pd-sb-note--success">{bookingMessage}</p>}
                    </div>
                </div>
            </div>

            {bookingModalOpen && (
                <div className="pd-modal-bg" onClick={closeBookingModal}>
                    <div className="pd-modal" onClick={(event) => event.stopPropagation()}>
                        <button className="pd-modal-close" type="button" onClick={closeBookingModal}>x</button>

                        {bookingCode ? (
                            <div className="pd-modal-success">
                                <div>OK</div>
                                <h3>Rezervare confirmată</h3>
                                <p>
                                    Cererea a fost salvată în baza de date. O poți vedea imediat în pagina de rezervări.
                                </p>
                                <div className="pd-modal-code">{bookingCode}</div>
                                <div className="pd-modal-code-label">Codul rezervării</div>
                                <button
                                    type="button"
                                    className="pd-modal-confirm-btn"
                                    onClick={() => navigate('/bookings')}
                                >
                                    Vezi rezervările mele
                                </button>
                            </div>
                        ) : (
                            <>
                                <h2>Confirmă rezervarea</h2>
                                <p className="pd-modal-sub">Verifică detaliile și finalizează pasul de plată.</p>

                                <div className="pd-modal-summary">
                                    <img src={property.images[0]} alt={property.title} />
                                    <div>
                                        <h4>{property.title}</h4>
                                        <p>{property.location}</p>
                                        <p>{checkIn} - {checkOut}</p>
                                    </div>
                                </div>

                                <div className="pd-modal-rows">
                                    <div className="pd-modal-row"><span>Oaspeți</span><span>{guests}</span></div>
                                    <div className="pd-modal-row"><span>Durată</span><span>{nights} nopți</span></div>
                                    <div className="pd-modal-row"><span>Metodă de plată</span><span>{getPaymentLabel(paymentMethod)}</span></div>
                                </div>

                                <div className="pd-modal-total">
                                    <span>Total</span>
                                    <span>{formatPrice(total)}</span>
                                </div>

                                <div className="pd-payment-box">
                                    <div className="pd-payment-head">
                                        <h3>Detalii plată</h3>
                                        <span>Fluxul de achitare este simulat pentru proiect. Rezervarea este totuși salvată real în baza de date.</span>
                                    </div>

                                    {paymentMethod === 'card' && (
                                        <div className="pd-payment-fields">
                                            <div className="pd-payment-field pd-payment-field--full">
                                                <label>Titular card</label>
                                                <input value={cardholderName} onChange={(event) => setCardholderName(event.target.value)} placeholder="Ex: Maria Popescu" />
                                            </div>
                                            <div className="pd-payment-field pd-payment-field--full">
                                                <label>Număr card</label>
                                                <input value={cardNumber} onChange={(event) => setCardNumber(event.target.value)} placeholder="4242 4242 4242 4242" />
                                            </div>
                                            <div className="pd-payment-field">
                                                <label>Expiră la</label>
                                                <input value={cardExpiry} onChange={(event) => setCardExpiry(event.target.value)} placeholder="MM/YY" />
                                            </div>
                                            <div className="pd-payment-field">
                                                <label>CVC</label>
                                                <input value={cardCvc} onChange={(event) => setCardCvc(event.target.value)} placeholder="123" />
                                            </div>
                                        </div>
                                    )}

                                    {paymentMethod === 'bank_transfer' && (
                                        <>
                                            <div className="pd-payment-fields">
                                                <div className="pd-payment-field pd-payment-field--full">
                                                    <label>Nume plătitor</label>
                                                    <input value={transferName} onChange={(event) => setTransferName(event.target.value)} placeholder="Ex: Maria Popescu" />
                                                </div>
                                            </div>
                                            <div className="pd-payment-note">
                                                Transferă suma în contul demonstrativ RO49 STBK 0000 0000 1234 5678. Rezervarea rămâne cu plata în așteptare până la confirmare.
                                            </div>
                                        </>
                                    )}

                                    {paymentMethod === 'pay_on_arrival' && (
                                        <div className="pd-payment-note">
                                            Nu există o funcție de achitare online reală pentru această opțiune. Aplicația va salva rezervarea, iar plata rămâne de făcut la sosire.
                                        </div>
                                    )}

                                    {bookingError && <div className="pd-payment-error">{bookingError}</div>}
                                </div>

                                <button
                                    type="button"
                                    className="pd-modal-confirm-btn"
                                    onClick={handleConfirmBooking}
                                    disabled={bookingSubmitting}
                                >
                                    {bookingSubmitting ? 'Se procesează...' : 'Confirmă rezervarea'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default PropertyDetailPage;
