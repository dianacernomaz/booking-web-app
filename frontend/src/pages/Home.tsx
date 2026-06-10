import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import DestinationCard from '../components/DestinationCard';
import HomePropertyCard from '../components/HomePropertyCard';
import '../assets/css/Home.css';
import type { ManagedPropertySummary } from '../types/managedProperties';
import { propertyService } from '../axios/propertyService';
import { authService } from '../auth/authService';

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
    const [searchLocation, setSearchLocation] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(2);
    const [properties, setProperties] = useState<ManagedPropertySummary[]>([]);

    useEffect(() => {
        const session = authService.getSession();
        propertyService.getAllSummaries(session?.email)
            .then((data) => setProperties(data.slice(0, 4)))
            .catch(() => setProperties([]));
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
                    <h1 className="hero-title">Găsește cazarea perfectă</h1>
                    <p className="hero-subtitle">Alege rapid o destinație, compară ofertele și rezervă în câteva momente.</p>

                    <form className="search-form" onSubmit={handleSearch}>
                        <div className="search-inputs">
                            <div className="search-field">
                                <label htmlFor="location">🔍</label>
                                <input id="location" value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} placeholder="Unde vrei să mergi?" />
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
                        <button type="submit" className="search-button">Caută cazări</button>
                    </form>
                </div>
            </section>

            <section className="destinations">
                <div className="section-header">
                    <h2>Destinații populare</h2>
                </div>
                <div className="destinations-grid">
                    {destinations.map((dest) => (
                        <DestinationCard key={dest.id} destination={dest} />
                    ))}
                </div>
            </section>

            <section className="properties">
                <div className="section-header">
                    <h2>Proprietăți disponibile</h2>
                </div>
                <div className="properties-grid">
                    {properties.map((property) => (
                        <HomePropertyCard key={property.id} property={property} />
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
