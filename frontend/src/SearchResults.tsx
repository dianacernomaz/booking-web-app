import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import './CSS/Home.css';
import './CSS/SearchResults.css';
import { useCurrency } from './lib/currency';
import type { ManagedPropertySummary } from './lib/managedProperties';
import { propertyService } from './services/propertyService';

function readParamsFromUrl() {
    const sp = new URLSearchParams(window.location.search);
    return {
        location: sp.get('location') ?? '',
        checkIn: sp.get('checkIn') ?? '',
        checkOut: sp.get('checkOut') ?? '',
        guests: Number(sp.get('guests') ?? '2'),
    };
}

const SearchResults: React.FC = () => {
    const navigate = useNavigate();
    const { formatPrice } = useCurrency();
    const initialParams = useMemo(() => readParamsFromUrl(), []);

    const [location, setLocation] = useState(initialParams.location);
    const [checkIn, setCheckIn] = useState(initialParams.checkIn);
    const [checkOut, setCheckOut] = useState(initialParams.checkOut);
    const [guests, setGuests] = useState(initialParams.guests);
    const [activeParams, setActiveParams] = useState(initialParams);
    const [properties, setProperties] = useState<ManagedPropertySummary[]>([]);

    useEffect(() => {
        propertyService.getAllSummaries().then(setProperties).catch(() => setProperties([]));
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = { location, checkIn, checkOut, guests };
        setActiveParams(params);
        navigate(`/search?${new URLSearchParams({
            location,
            checkIn,
            checkOut,
            guests: String(guests),
        }).toString()}`, { replace: true });
    };

    const results = useMemo(() => {
        const normalizedLocation = activeParams.location.trim().toLowerCase();
        return properties.filter((property) => {
            const matchesLocation =
                !normalizedLocation ||
                property.city.toLowerCase().includes(normalizedLocation) ||
                property.location.toLowerCase().includes(normalizedLocation);
            const matchesGuests = activeParams.guests <= property.maxGuests;
            const matchesDates =
                (!activeParams.checkIn || activeParams.checkIn >= property.availableFrom) &&
                (!activeParams.checkOut || activeParams.checkOut <= property.availableTo);

            return matchesLocation && matchesGuests && matchesDates;
        });
    }, [activeParams, properties]);

    return (
        <div className="home">
            <Header />

            <div className="sr-search-banner">
                <div className="sr-search-banner-inner">
                    <form className="sr-search-bar" onSubmit={handleSearch}>
                        <div className="sr-field">
                            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Destinatie" />
                        </div>
                        <div className="sr-field">
                            <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                        </div>
                        <div className="sr-field">
                            <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
                        </div>
                        <div className="sr-field">
                            <input type="number" min={1} value={guests} onChange={(e) => setGuests(Number(e.target.value))} />
                        </div>
                        <button type="submit" className="sr-search-btn">Cauta</button>
                    </form>
                </div>
            </div>

            <main className="sr-main">
                <div className="sr-summary-row">
                    <div className="sr-summary-text">
                        <strong>{results.length}</strong> proprietati gasite
                        {activeParams.location && <> in <span className="sr-location-tag">"{activeParams.location}"</span></>}
                    </div>
                </div>

                {results.length === 0 ? (
                    <div className="sr-empty">
                        <div className="sr-empty-icon">🏠</div>
                        <h3>Nu am gasit cazari disponibile</h3>
                        <p>Incearca alta destinatie sau modifica perioada selectata.</p>
                    </div>
                ) : (
                    <div className="sr-grid">
                        {results.map((property) => (
                            <div key={property.id} className="sr-card" onClick={() => navigate(`/property/${property.id}`)} style={{ cursor: 'pointer' }}>
                                {property.badge && <span className="sr-badge">{property.badge}</span>}
                                <div className="sr-card-image">
                                    <img src={property.image} alt={property.title} loading="lazy" />
                                </div>
                                <div className="sr-card-info">
                                    <h3>{property.title}</h3>
                                    <p className="sr-card-location">📍 {property.location}</p>
                                    <div className="sr-card-meta">
                                        <span>👤 max {property.maxGuests} oaspeti</span>
                                        <span>📅 {property.availableFrom} - {property.availableTo}</span>
                                    </div>
                                    <div className="sr-card-features">
                                        {property.features.map((feature) => (
                                            <span key={feature} className="sr-feature-tag">{feature}</span>
                                        ))}
                                    </div>
                                    <div className="sr-card-footer">
                                        <div className="sr-rating">
                                            <span className="sr-rating-score">⭐ {property.rating}</span>
                                            <span className="sr-rating-count">({property.reviews} recenzii)</span>
                                        </div>
                                        <div className="sr-price">
                                            <span className="sr-price-amount">{formatPrice(property.price)}</span>
                                            <span className="sr-price-period">/ noapte</span>
                                        </div>
                                    </div>
                                    <button className="sr-book-btn">Rezerva acum</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default SearchResults;
