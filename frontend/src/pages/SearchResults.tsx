import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import PropertyCard from '../components/PropertyCard';
import '../assets/css/Home.css';
import '../assets/css/SearchResults.css';
import type { ManagedPropertySummary } from '../types/managedProperties';
import { propertyService } from '../axios/propertyService';

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
    const initialParams = useMemo(() => readParamsFromUrl(), []);

    const [location, setLocation] = useState(initialParams.location);
    const [checkIn, setCheckIn] = useState(initialParams.checkIn);
    const [checkOut, setCheckOut] = useState(initialParams.checkOut);
    const [guests, setGuests] = useState(initialParams.guests);
    const [activeParams, setActiveParams] = useState(initialParams);
    const [results, setResults] = useState<ManagedPropertySummary[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        propertyService.search(activeParams)
            .then(setResults)
            .catch(() => setResults([]))
            .finally(() => setLoading(false));
    }, [activeParams]);

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

    return (
        <div className="home">
            <Header />

            <div className="sr-search-banner">
                <div className="sr-search-banner-inner">
                    <form className="sr-search-bar" onSubmit={handleSearch}>
                        <div className="sr-field">
                            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Destinație" />
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
                        <button type="submit" className="sr-search-btn">Caută</button>
                    </form>
                </div>
            </div>

            <main className="sr-main">
                <div className="sr-summary-row">
                    <div className="sr-summary-text">
                        <strong>{results.length}</strong> proprietăți găsite
                        {activeParams.location && <> în <span className="sr-location-tag">"{activeParams.location}"</span></>}
                    </div>
                </div>

                {loading ? (
                    <div className="sr-loading">Se caută cele mai bune oferte...</div>
                ) : results.length === 0 ? (
                    <div className="sr-empty">
                        <div className="sr-empty-icon">🏠</div>
                        <h3>Nu am găsit cazări disponibile</h3>
                        <p>Încearcă altă destinație sau modifică perioada selectată.</p>
                    </div>
                ) : (
                    <div className="sr-grid">
                        {results.map((property) => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default SearchResults;
