import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import './CSS/Home.css';

interface Destination {
    id: number;
    name: string;
    properties: number;
    image: string;
}

interface Property {
    id: number;
    title: string;
    location: string;
    price: number;
    rating: number;
    reviews: number;
    image: string;
    features: string[];
    isFavorite: boolean;
    badge?: string;
}

interface SpecialOffer {
    id: number;
    title: string;
    description: string;
    icon: string;
    color: string;
    buttonText: string;
}

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [searchLocation, setSearchLocation] = useState('');
    const [checkIn,  setCheckIn]  = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests,   setGuests]   = useState(2);
    const [activeFilter, setActiveFilter] = useState('all');

    const destinations: Destination[] = [
        { id: 1, name: 'Paris',    properties: 3874, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop' },
        { id: 2, name: 'Tokyo',    properties: 2156, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop' },
        { id: 3, name: 'New York', properties: 4521, image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop' },
        { id: 4, name: 'Bali',     properties: 1843, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop' },
        { id: 5, name: 'Londra',   properties: 3201, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop' },
        { id: 6, name: 'Roma',     properties: 2789, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop' },
    ];

    const properties: Property[] = [
        {
            id: 1,
            title: 'Luxury Suite cu vedere la mare',
            location: 'Bali, Indonezia',
            price: 200,
            rating: 4.9,
            reviews: 128,
            image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop',
            features: ['WiFi', 'Piscină', 'Parcare'],
            isFavorite: false
        },
        {
            id: 2,
            title: 'Apartament Modern în Zona Lunitei',
            location: 'București, România',
            price: 180,
            rating: 4.7,
            reviews: 94,
            image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
            features: ['WiFi', 'Bucătărie', 'Terasă'],
            isFavorite: true,
        },
        {
            id: 3,
            title: 'Cabană Romantică la Munte',
            location: 'Brașov, România',
            price: 145,
            rating: 4.8,
            reviews: 203,
            image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop',
            features: ['WiFi', 'Șemineu', 'Grădină'],
            isFavorite: false,
            badge: 'Nou',
        },
        {
            id: 4,
            title: 'Vilă de Lux cu Piscină Privată',
            location: 'Constanța, România',
            price: 399,
            rating: 5.0,
            reviews: 87,
            image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop',
            features: ['WiFi', 'Piscină', 'Jacuzzi'],
            isFavorite: true,
        },
    ];

    const specialOffers: SpecialOffer[] = [
        {
            id: 1,
            title: 'Rezervare 25% pentru rezervări lungi',
            description: 'Rezerva cu cel puțin 30 de zile înainte și economisește',
            icon: '🏖️',
            color: '#10b981',
            buttonText: 'Vezi oferta',
        },
        {
            id: 2,
            title: 'Last Minute - până la 45% reducere',
            description: 'Oferte exclusive pentru rezervările de ultimă oră',
            icon: '⏰',
            color: '#f59e0b',
            buttonText: 'Vezi oferta',
        },
        {
            id: 3,
            title: 'Weekend special - a 3-a noapte gratis',
            description: 'Valabil pentru minim 3 nopți de cazare în weekend',
            icon: '🎉',
            color: '#8b5cf6',
            buttonText: 'Vezi oferta',
        },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        navigate(`/search?location=${searchLocation}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
    };

    const toggleFavorite = (id: number) => {
        console.log('Toggle favorite:', id);
    };

    return (
        <div className="home">
            <Header />

            {/* ── Hero ── */}
            <section className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">Găsește cazarea perfectă</h1>

                    <p className="hero-subtitle">Peste 2 milioane de proprietăți în 120 orașe și mai mult</p>

                    <form className="search-form" onSubmit={handleSearch}>
                        <div className="search-inputs">
                            <div className="search-field">
                                <label htmlFor="location">🔍</label>
                                <input
                                    id="location"
                                    type="text"
                                    placeholder="Unde vrei să mergi?"
                                    value={searchLocation}
                                    onChange={(e) => setSearchLocation(e.target.value)}
                                />
                            </div>
                            <div className="search-field">
                                <label htmlFor="checkin">📅</label>
                                <input
                                    id="checkin"
                                    type="text"
                                    placeholder="Check-in"
                                    value={checkIn}
                                    onChange={(e) => setCheckIn(e.target.value)}
                                    onFocus={(e) => (e.target.type = 'date')}
                                />
                            </div>
                            <div className="search-field">
                                <label htmlFor="checkout">📅</label>
                                <input
                                    id="checkout"
                                    type="text"
                                    placeholder="Check-out"
                                    value={checkOut}
                                    onChange={(e) => setCheckOut(e.target.value)}
                                    onFocus={(e) => (e.target.type = 'date')}
                                />
                            </div>
                            <div className="search-field">
                                <label htmlFor="guests">👤</label>
                                <input
                                    id="guests"
                                    type="number"
                                    placeholder="2 adulți"
                                    value={guests}
                                    onChange={(e) => setGuests(Number(e.target.value))}
                                    min="1"
                                />
                            </div>
                        </div>
                        <button type="submit" className="search-button">Caută cazări</button>
                    </form>

                    <div className="filter-buttons">
                        {[
                            { key: 'hotels',     label: '🏨 Hoteluri' },
                            { key: 'apartments', label: '🏢 Apartamente' },
                            { key: 'villas',     label: '🏡 Vile' },
                            { key: 'cabins',     label: '🏔️ Cabane' },
                            { key: 'beach',      label: '🏖️ Plajă și sol' },
                        ].map((f) => (
                            <button
                                key={f.key}
                                className={`filter-btn ${activeFilter === f.key ? 'active' : ''}`}
                                onClick={() => setActiveFilter(f.key)}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Popular Destinations ── */}
            <section className="destinations">
                <div className="section-header">
                    <h2>Destinații populare</h2>
                    <a href="#" className="view-more">Vezi toate →</a>
                </div>
                <div className="destinations-grid">
                    {destinations.map((dest: Destination) => (
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
                                    <p>{dest.properties.toLocaleString()} proprietăți</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Recommended Properties ── */}
            <section className="properties">
                <div className="section-header">
                    <h2>Proprietăți recomandate</h2>
                    <a href="#" className="view-more">Vezi toate →</a>
                </div>
                <div className="properties-grid">
                    {properties.map((property: Property) => (
                        <div
                            key={property.id}
                            className="property-card"
                            onClick={() => navigate(`/property/${property.id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            {property.badge && (
                                <span className="property-badge">{property.badge}</span>
                            )}
                            <button
                                className={`favorite-btn ${property.isFavorite ? 'active' : ''}`}
                                onClick={(e) => { e.stopPropagation(); toggleFavorite(property.id); }}
                            >
                                {property.isFavorite ? '❤️' : '🤍'}
                            </button>
                            <div className="property-image">
                                <img src={property.image} alt={property.title} />
                            </div>
                            <div className="property-info">
                                <h3>{property.title}</h3>
                                <p className="property-location">📍 {property.location}</p>
                                <div className="property-features">
                                    {property.features.map((feature, index) => (
                                        <span key={index} className="feature-tag">{feature}</span>
                                    ))}
                                </div>
                                <div className="property-footer">
                                    <div className="property-rating">
                                        <span className="rating-score">⭐ {property.rating}</span>
                                        <span className="rating-reviews">({property.reviews} recenzii)</span>
                                    </div>
                                    <div className="property-price">
                                        <span className="price-amount">{property.price} RON</span>
                                        <span className="price-period">/ noapte</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Special Offers ── */}
            <section className="special-offers">
                <div className="container">
                    <h2>Profită de reducerile noastre exclusive</h2>
                    <div className="offers-grid">
                        {specialOffers.map((offer) => (
                            <div key={offer.id} className="offer-card">
                                <div className="offer-icon">{offer.icon}</div>
                                <div className="offer-badge" style={{ backgroundColor: offer.color }}>
                                    {offer.id === 1 ? '-25%' : offer.id === 2 ? '-40%' : 'GRATUIT'}
                                </div>
                                <h3>{offer.title}</h3>
                                <p>{offer.description}</p>
                                <button className="offer-button">{offer.buttonText}</button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Newsletter ── */}
            <section className="newsletter">
                <div className="newsletter-content">
                    <div className="newsletter-icon">✉️</div>
                    <h2>Primește oferte exclusive</h2>
                    <p>Abonează-te la newsletter și fii primul care află despre cele mai bune oferte și destinații</p>
                    <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); }}>
                        <input type="email" placeholder="Adresa ta de email" required />
                        <button type="submit">Abonează-te</button>
                    </form>
                    <p className="newsletter-disclaimer">
                        Poți anula abonamentul oricând. Datele tale sunt în siguranță.
                    </p>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;