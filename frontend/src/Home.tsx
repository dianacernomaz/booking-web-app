import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import './CSS/Home.css';
import { useCurrency } from './lib/currency';
import type { ManagedPropertySummary } from './lib/managedProperties';
import { propertyService } from './services/propertyService';

interface Destination {
    id: number;
    name: string;
    properties: number;
    image: string;
}

const destinations: Destination[] = [
    { id: 1, name: 'Paris', properties: 3874, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop' },
    { id: 2, name: 'Tokyo', properties: 2156, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop' },
    { id: 3, name: 'New York', properties: 4521, image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop' },
    { id: 4, name: 'Bali', properties: 1843, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop' },
];

const Home: React.FC = () => {
    const navigate = useNavigate();
    const { formatPrice } = useCurrency();
    const [searchLocation, setSearchLocation] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(2);
    const [properties, setProperties] = useState<ManagedPropertySummary[]>([]);

    useEffect(() => {
        propertyService.getAllSummaries().then((data) => setProperties(data.slice(0, 4))).catch(() => setProperties([]));
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        navigate(`/search?location=${encodeURIComponent(searchLocation)}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
    };

    return (
        <div className="home">
            <Header />

            <section className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">Gaseste cazarea perfecta</h1>
                    <p className="hero-subtitle">Aplicatia React este acum conectata la backendul ASP.NET Core.</p>

                    <form className="search-form" onSubmit={handleSearch}>
                        <div className="search-inputs">
                            <div className="search-field">
                                <label htmlFor="location">🔍</label>
                                <input id="location" value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} placeholder="Unde vrei sa mergi?" />
                            </div>
                            <div className="search-field">
                                <label htmlFor="checkin">📅</label>
                                <input id="checkin" type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                            </div>
                            <div className="search-field">
                                <label htmlFor="checkout">📅</label>
                                <input id="checkout" type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
                            </div>
                            <div className="search-field">
                                <label htmlFor="guests">👤</label>
                                <input id="guests" type="number" min="1" value={guests} onChange={(e) => setGuests(Number(e.target.value))} />
                            </div>
                        </div>
                        <button type="submit" className="search-button">Cauta cazari</button>
                    </form>
                </div>
            </section>

            <section className="destinations">
                <div className="section-header">
                    <h2>Destinatii populare</h2>
                </div>
                <div className="destinations-grid">
                    {destinations.map((dest) => (
                        <div
                            key={dest.id}
                            className="destination-card"
                            onClick={() => navigate(`/search?location=${encodeURIComponent(dest.name)}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="destination-image">
                                <img src={dest.image} alt={dest.name} />
                                <div className="destination-overlay">
                                    <h3>{dest.name}</h3>
                                    <p>{dest.properties.toLocaleString()} proprietati</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="properties">
                <div className="section-header">
                    <h2>Proprietati disponibile</h2>
                </div>
                <div className="properties-grid">
                    {properties.map((property) => (
                        <div
                            key={property.id}
                            className="property-card"
                            onClick={() => navigate(`/property/${property.id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            {property.badge && <span className="property-badge">{property.badge}</span>}
                            <div className="property-image">
                                <img src={property.image} alt={property.title} />
                            </div>
                            <div className="property-info">
                                <h3>{property.title}</h3>
                                <p className="property-location">📍 {property.location}</p>
                                <div className="property-features">
                                    {property.features.map((feature) => (
                                        <span key={feature} className="feature-tag">{feature}</span>
                                    ))}
                                </div>
                                <div className="property-footer">
                                    <div className="property-rating">
                                        <span className="rating-score">⭐ {property.rating}</span>
                                        <span className="rating-reviews">({property.reviews} recenzii)</span>
                                    </div>
                                    <div className="property-price">
                                        <span className="price-amount">{formatPrice(property.price)}</span>
                                        <span className="price-period">/ noapte</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
