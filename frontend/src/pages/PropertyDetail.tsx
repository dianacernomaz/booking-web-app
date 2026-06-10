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
import {
    addReview,
    checkPropertyReview,
    deleteReview,
    getAverageRating,
    getReviewsForProperty,
    updateReview,
    type ReviewRecord,
} from '../utils/reviews';

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

function normalizeApiError(error: unknown, fallback: string) {
    if (typeof error === 'object' && error && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } };
        return apiError.response?.data?.message || fallback;
    }

    return fallback;
}

function formatReviewDate(value: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString('ro-RO', {
        dateStyle: 'medium',
    });
}

function buildReviewInitials(name: string) {
    return name
        .split(' ')
        .map((part) => part[0] || '')
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'U';
}

function getReviewColor(userId: number) {
    const colors = ['#2563eb', '#7c3aed', '#ea580c', '#059669', '#dc2626', '#0891b2'];
    return colors[Math.abs(userId) % colors.length];
}

const PropertyDetailPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { formatPrice } = useCurrency();
    const session = getSession();
    const currentUserId = Number(session?.userId || 0);
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
    const [reviews, setReviews] = useState<ReviewRecord[]>([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [reviewAverage, setReviewAverage] = useState({ rating: 0, count: 0 });
    const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const [reviewError, setReviewError] = useState('');
    const [reviewMessage, setReviewMessage] = useState('');

    const loadProperty = async (propertyId: number) => {
        setLoading(true);
        try {
            const data = await propertyService.getById(propertyId);
            setProperty(data);
            setCheckIn(data.availableFrom);
            const nextDay = new Date(`${data.availableFrom}T00:00:00`);
            nextDay.setDate(nextDay.getDate() + 1);
            const nextDayString = nextDay.toISOString().split('T')[0];
            setCheckOut(nextDayString <= data.availableTo ? nextDayString : data.availableTo);
            setGuests(Math.min(2, data.maxGuests));
            setError('');
        } catch {
            setError('Proprietatea nu a fost gasita.');
        } finally {
            setLoading(false);
        }
    };

    const loadReviews = async (propertyId: number) => {
        setReviewsLoading(true);
        try {
            const [items, average] = await Promise.all([
                getReviewsForProperty(propertyId),
                getAverageRating(propertyId),
            ]);
            setReviews(items);
            setReviewAverage(average);
        } catch {
            setReviews([]);
            setReviewAverage({ rating: 0, count: 0 });
        } finally {
            setReviewsLoading(false);
        }
    };

    const loadCurrentUserReview = async (propertyId: number) => {
        const currentSession = getSession();
        if (!currentSession?.token) {
            setEditingReviewId(null);
            setReviewRating(5);
            setReviewComment('');
            return;
        }

        try {
            const data = await checkPropertyReview(propertyId);
            if (data.hasReviewed && data.review) {
                setEditingReviewId(data.review.id);
                setReviewRating(data.review.rating);
                setReviewComment(data.review.comment);
                return;
            }
        } catch {
            // Ignore and reset below.
        }

        setEditingReviewId(null);
        setReviewRating(5);
        setReviewComment('');
    };

    const refreshReviewState = async (propertyId: number) => {
        await Promise.all([
            loadProperty(propertyId),
            loadReviews(propertyId),
            loadCurrentUserReview(propertyId),
        ]);
    };

    useEffect(() => {
        const propertyId = Number(id);
        if (!propertyId) {
            setLoading(false);
            setError('Proprietatea nu a fost gasita.');
            return;
        }

        void refreshReviewState(propertyId);
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
    const displayRating = reviewAverage.count > 0 ? reviewAverage.rating : property?.rating ?? 0;
    const displayReviewCount = reviewAverage.count > 0 ? reviewAverage.count : property?.reviews ?? 0;
    const reviewDistribution = [5, 4, 3, 2, 1].map((stars) => {
        const count = reviews.filter((review) => review.rating === stars).length;
        return {
            stars,
            count,
            width: reviews.length > 0 ? (count / reviews.length) * 100 : 0,
        };
    });

    const resetBookingState = () => {
        setBookingError('');
        setBookingCode('');
    };

    const openBookingModal = () => {
        if (!property || nights <= 0) return;

        const currentSession = getSession();
        if (!currentSession?.email) {
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
                return 'Completeaza numele titularului de card.';
            }

            if (digitsOnly(cardNumber).length < 16) {
                return 'Numarul cardului trebuie sa aiba 16 cifre.';
            }

            if (!/^\d{2}\/\d{2}$/.test(cardExpiry.trim())) {
                return 'Data expirarii trebuie sa fie in format MM/YY.';
            }

            if (digitsOnly(cardCvc).length < 3) {
                return 'Codul CVC trebuie sa aiba cel putin 3 cifre.';
            }
        }

        if (paymentMethod === 'bank_transfer' && transferName.trim().length < 3) {
            return 'Completeaza numele platitorului pentru transfer.';
        }

        return '';
    };

    const handleConfirmBooking = async () => {
        if (!property || nights <= 0) return;

        const currentSession = getSession();
        if (!currentSession?.email) {
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
                ownerEmail: currentSession.email,
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
            setBookingMessage(`Rezervarea pentru ${property.title} a fost confirmata.`);
        } catch {
            setBookingError('Rezervarea nu a putut fi finalizata. Verifica datele si incearca din nou.');
        } finally {
            setBookingSubmitting(false);
        }
    };

    const handleReviewSubmit = async () => {
        if (!property) {
            return;
        }

        const currentSession = getSession();
        if (!currentSession?.token) {
            navigate('/login');
            return;
        }

        if (reviewRating < 1 || reviewRating > 5) {
            setReviewError('Rating-ul trebuie sa fie intre 1 si 5.');
            return;
        }

        if (!reviewComment.trim()) {
            setReviewError('Comentariul este obligatoriu.');
            return;
        }

        if (reviewComment.trim().length > 1000) {
            setReviewError('Comentariul nu poate depasi 1000 de caractere.');
            return;
        }

        try {
            setReviewSubmitting(true);
            setReviewError('');
            setReviewMessage('');

            const payload = {
                propertyId: property.id,
                rating: reviewRating,
                comment: reviewComment.trim(),
            };

            if (editingReviewId) {
                await updateReview(editingReviewId, payload);
                setReviewMessage('Review-ul a fost actualizat.');
            } else {
                await addReview(payload);
                setReviewMessage('Review-ul a fost adaugat.');
            }

            await refreshReviewState(property.id);
        } catch (reviewActionError) {
            setReviewError(normalizeApiError(reviewActionError, 'Review-ul nu a putut fi salvat.'));
        } finally {
            setReviewSubmitting(false);
        }
    };

    const handleReviewDelete = async (reviewId: number) => {
        if (!property) {
            return;
        }

        try {
            setReviewSubmitting(true);
            setReviewError('');
            setReviewMessage('');
            await deleteReview(reviewId);
            setReviewMessage('Review-ul a fost sters.');
            await refreshReviewState(property.id);
        } catch (reviewActionError) {
            setReviewError(normalizeApiError(reviewActionError, 'Review-ul nu a putut fi sters.'));
        } finally {
            setReviewSubmitting(false);
        }
    };

    if (loading) {
        return <div className="home"><Header /><div className="pd-not-found"><p>Se incarca...</p></div><Footer /></div>;
    }

    if (error || !property) {
        return (
            <div className="home">
                <Header />
                <div className="pd-not-found">
                    <div className="pd-nf-icon">Casa</div>
                    <h2>Proprietatea nu a fost gasita</h2>
                    <p>{error}</p>
                    <button className="pd-back-btn" onClick={() => navigate('/')}>Inapoi acasa</button>
                </div>
                <Footer />
            </div>
        );
    }

    const galleryImages = property.images.slice(0, 3);
    const galleryClassName = `pd-gallery-grid pd-gallery-grid--count-${galleryImages.length}`;
    const paymentSummary = paymentMethod === 'card'
        ? 'Plata se marcheaza imediat ca achitata, iar rezervarea se confirma pe loc.'
        : paymentMethod === 'bank_transfer'
            ? 'Rezervarea se salveaza acum, iar plata ramane in asteptare pana la confirmarea transferului.'
            : 'Rezervarea se creeaza acum, iar plata se face la sosire.';

    return (
        <div className="home">
            <Header />

            <div className="pd-breadcrumb">
                <a href="/" onClick={(event) => { event.preventDefault(); navigate('/'); }}>Acasa</a>
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
                    <section className="pd-section pd-section--hero">
                        <div className="pd-title-block">
                            <div className="pd-badges">
                                <span className="pd-badge pd-badge--blue">Verificata</span>
                                {property.badge && <span className="pd-badge pd-badge--green">{property.badge}</span>}
                            </div>
                            <h1>{property.title}</h1>

                        </div>
                    </section>

                    <section className="pd-section pd-info-card">
                        <h2 className="pd-sec-title">Despre proprietate</h2>
                        <div className="pd-desc-text">
                            <p>{property.description}</p>
                            <p>{property.descriptionExtra}</p>
                        </div>
                    </section>

                    <section className="pd-section pd-info-card">
                        <h2 className="pd-sec-title">Facilitati</h2>
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
                        <h2 className="pd-sec-title">In apropiere</h2>
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

                    <section className="pd-section">
                        <h2 className="pd-sec-title">Recenzii</h2>

                        <div className="pd-reviews-summary">
                            <div className="pd-rs-score">
                                <div className="pd-rs-big">{displayRating.toFixed(2)}</div>
                                <div className="pd-rs-stars">{'★'.repeat(Math.max(1, Math.round(displayRating || 0)))}</div>
                                <p>{displayReviewCount} recenzii</p>
                            </div>
                            <div className="pd-rs-bars">
                                {reviewDistribution.map((item) => (
                                    <div key={item.stars} className="pd-rs-bar-row">
                                        <span>{item.stars}</span>
                                        <div className="pd-rs-bar-track">
                                            <div className="pd-rs-bar-fill" style={{ width: `${item.width}%` }} />
                                        </div>
                                        <span>{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {session?.token ? (
                            <div className="pd-review-form">
                                <div className="pd-review-form-head">
                                    <div>
                                        <h3>{editingReviewId ? 'Editeaza review-ul tau' : 'Scrie un review'}</h3>
                                        <p>{editingReviewId ? 'Poti modifica rating-ul si comentariul lasat pentru aceasta proprietate.' : 'Acorda o nota si spune-le si altor utilizatori cum a fost experienta ta.'}</p>
                                    </div>
                                    {editingReviewId && (
                                        <button type="button" className="pd-review-link" onClick={() => loadCurrentUserReview(property.id)}>
                                            Reseteaza
                                        </button>
                                    )}
                                </div>

                                <div className="pd-review-stars-picker">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            className={`pd-review-star-btn ${reviewRating === star ? 'active' : ''}`}
                                            onClick={() => setReviewRating(star)}
                                        >
                                            {star} ★
                                        </button>
                                    ))}
                                </div>

                                <div className="pd-review-field">
                                    <label>Comentariu</label>
                                    <textarea
                                        rows={5}
                                        value={reviewComment}
                                        maxLength={1000}
                                        onChange={(event) => {
                                            setReviewComment(event.target.value);
                                            setReviewError('');
                                            setReviewMessage('');
                                        }}
                                        placeholder="Scrie aici parerea ta despre proprietate"
                                    />
                                    <span>{reviewComment.trim().length}/1000</span>
                                </div>

                                {reviewError && <div className="pd-review-error">{reviewError}</div>}
                                {reviewMessage && <div className="pd-review-success">{reviewMessage}</div>}

                                <div className="pd-review-actions">
                                    <button type="button" className="pd-review-submit" onClick={handleReviewSubmit} disabled={reviewSubmitting}>
                                        {reviewSubmitting ? 'Se salveaza...' : editingReviewId ? 'Actualizeaza review-ul' : 'Trimite review-ul'}
                                    </button>
                                    {editingReviewId && (
                                        <button type="button" className="pd-review-delete" onClick={() => handleReviewDelete(editingReviewId)} disabled={reviewSubmitting}>
                                            Sterge review-ul
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="pd-review-login">
                                <p>Conecteaza-te pentru a lasa un review acestei proprietati.</p>
                                <button type="button" className="pd-review-submit" onClick={() => navigate('/login')}>
                                    Mergi la autentificare
                                </button>
                            </div>
                        )}

                        {reviewsLoading ? (
                            <div className="pd-review-empty">
                                <p>Se incarca recenziile...</p>
                            </div>
                        ) : reviews.length === 0 ? (
                            <div className="pd-review-empty">
                                <p>Nu exista review-uri pentru aceasta proprietate inca.</p>
                            </div>
                        ) : (
                            <div className="pd-reviews-list">
                                {reviews.map((review) => {
                                    const isOwnReview = currentUserId > 0 && review.userId === currentUserId;
                                    return (
                                        <article key={review.id} className="pd-review-card">
                                            <div className="pd-rev-header">
                                                <div className="pd-rev-user">
                                                    <div className="pd-rev-avatar" style={{ background: getReviewColor(review.userId) }}>
                                                        {buildReviewInitials(review.userName)}
                                                    </div>
                                                    <div>
                                                        <div className="pd-rev-name">{review.userName}</div>
                                                        <div className="pd-rev-date">{formatReviewDate(review.updatedAt)}</div>
                                                    </div>
                                                </div>
                                                <div className="pd-rev-side">
                                                    <div className="pd-rev-stars">{'★'.repeat(review.rating)}</div>
                                                    {isOwnReview && <span className="pd-review-badge">Review-ul tau</span>}
                                                </div>
                                            </div>
                                            <p className="pd-rev-text">{review.comment}</p>
                                            {isOwnReview && (
                                                <div className="pd-review-card-actions">
                                                    <button
                                                        type="button"
                                                        className="pd-review-link"
                                                        onClick={() => {
                                                            setEditingReviewId(review.id);
                                                            setReviewRating(review.rating);
                                                            setReviewComment(review.comment);
                                                            setReviewError('');
                                                            setReviewMessage('');
                                                        }}
                                                    >
                                                        Editeaza
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="pd-review-link pd-review-link--danger"
                                                        onClick={() => handleReviewDelete(review.id)}
                                                    >
                                                        Sterge
                                                    </button>
                                                </div>
                                            )}
                                        </article>
                                    );
                                })}
                            </div>
                        )}
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
                                <strong>Card</strong>
                                <span>Plata instant</span>
                            </button>
                            <button type="button" className={`pd-payment-method ${paymentMethod === 'bank_transfer' ? 'active' : ''}`} onClick={() => setPaymentMethod('bank_transfer')}>
                                <strong>Transfer</strong>
                                <span>Confirmare ulterioara</span>
                            </button>
                            <button type="button" className={`pd-payment-method ${paymentMethod === 'pay_on_arrival' ? 'active' : ''}`} onClick={() => setPaymentMethod('pay_on_arrival')}>
                                <strong>La sosire</strong>
                                <span>Achiti la check-in</span>
                            </button>
                        </div>

                        <div className="pd-sb-payment-hint">
                            <strong>Metoda selectata:</strong> {getPaymentLabel(paymentMethod)}
                            <p>{paymentSummary}</p>
                        </div>

                        {nights > 0 && (
                            <div className="pd-sb-breakdown">
                                <div className="pd-sb-row"><span>{formatPrice(property.price)} x {nights} nopti</span><span>{formatPrice(property.price * nights)}</span></div>
                                <div className="pd-sb-row"><span>Taxa curatenie</span><span>{formatPrice(cleaning)}</span></div>
                                <div className="pd-sb-row"><span>Taxa serviciu</span><span>{formatPrice(fee)}</span></div>
                                <div className="pd-sb-total"><span>Total</span><span>{formatPrice(total)}</span></div>
                            </div>
                        )}

                        <button className="pd-sb-book-btn" onClick={openBookingModal} disabled={nights <= 0}>
                            Continua spre confirmare
                        </button>

                        <p className="pd-sb-note">
                            Rezervarea se confirma in pasul urmator. Pentru card, plata este simulata in aplicatie.
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
                                <h3>Rezervare confirmata</h3>
                                <p>
                                    Cererea a fost salvata in baza de date. O poti vedea imediat in pagina de rezervari.
                                </p>
                                <div className="pd-modal-code">{bookingCode}</div>
                                <div className="pd-modal-code-label">Codul rezervarii</div>
                                <button
                                    type="button"
                                    className="pd-modal-confirm-btn"
                                    onClick={() => navigate('/bookings')}
                                >
                                    Vezi rezervarile mele
                                </button>
                            </div>
                        ) : (
                            <>
                                <h2>Confirma rezervarea</h2>
                                <p className="pd-modal-sub">Verifica detaliile si finalizeaza pasul de plata.</p>

                                <div className="pd-modal-summary">
                                    <img src={property.images[0]} alt={property.title} />
                                    <div>
                                        <h4>{property.title}</h4>
                                        <p>{property.location}</p>
                                        <p>{checkIn} - {checkOut}</p>
                                    </div>
                                </div>

                                <div className="pd-modal-rows">
                                    <div className="pd-modal-row"><span>Oaspeti</span><span>{guests}</span></div>
                                    <div className="pd-modal-row"><span>Durata</span><span>{nights} nopti</span></div>
                                    <div className="pd-modal-row"><span>Metoda de plata</span><span>{getPaymentLabel(paymentMethod)}</span></div>
                                </div>

                                <div className="pd-modal-total">
                                    <span>Total</span>
                                    <span>{formatPrice(total)}</span>
                                </div>

                                <div className="pd-payment-box">
                                    <div className="pd-payment-head">
                                        <h3>Detalii plata</h3>
                                        <span>Fluxul de achitare este simulat pentru proiect. Rezervarea este totusi salvata real in baza de date.</span>
                                    </div>

                                    {paymentMethod === 'card' && (
                                        <div className="pd-payment-fields">
                                            <div className="pd-payment-field pd-payment-field--full">
                                                <label>Titular card</label>
                                                <input value={cardholderName} onChange={(event) => setCardholderName(event.target.value)} placeholder="Ex: Maria Popescu" />
                                            </div>
                                            <div className="pd-payment-field pd-payment-field--full">
                                                <label>Numar card</label>
                                                <input value={cardNumber} onChange={(event) => setCardNumber(event.target.value)} placeholder="4242 4242 4242 4242" />
                                            </div>
                                            <div className="pd-payment-field">
                                                <label>Expira la</label>
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
                                                    <label>Nume platitor</label>
                                                    <input value={transferName} onChange={(event) => setTransferName(event.target.value)} placeholder="Ex: Maria Popescu" />
                                                </div>
                                            </div>
                                            <div className="pd-payment-note">
                                                Transfera suma in contul demonstrativ RO49 STBK 0000 0000 1234 5678. Rezervarea ramane cu plata in asteptare pana la confirmare.
                                            </div>
                                        </>
                                    )}

                                    {paymentMethod === 'pay_on_arrival' && (
                                        <div className="pd-payment-note">
                                            Nu exista o functie de achitare online reala pentru aceasta optiune. Aplicatia va salva rezervarea, iar plata ramane de facut la sosire.
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
                                    {bookingSubmitting ? 'Se proceseaza...' : 'Confirma rezervarea'}
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


