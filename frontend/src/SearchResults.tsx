import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from './components/Header';
import Footer from "./components/Footer";
import "./CSS/Home.css";
import "./CSS/SearchResults.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Property {
    id: number;
    title: string;
    location: string;
    city: string;
    price: number;
    rating: number;
    reviews: number;
    image: string;
    features: string[];
    isFavorite: boolean;
    badge?: string;
    maxGuests: number;
    availableFrom: string;
    availableTo: string;
}

// ─── Mock database ─────────────────────────────────────────────────────────────

const PROPERTIES: Property[] = [
    {
        id: 1,
        title: "Luxury Suite cu vedere la mare",
        location: "Bali, Indonezia",
        city: "Bali",
        price: 200,
        rating: 4.9,
        reviews: 128,
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop",
        features: ["WiFi", "Piscină", "Parcare"],
        isFavorite: false,
        maxGuests: 4,
        availableFrom: "2026-02-01",
        availableTo: "2026-12-31",
    },
    {
        id: 2,
        title: "Apartament Modern în Zona Lunitei",
        location: "București, România",
        city: "București",
        price: 180,
        rating: 4.7,
        reviews: 94,
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
        features: ["WiFi", "Bucătărie", "Terasă"],
        isFavorite: true,
        maxGuests: 2,
        availableFrom: "2026-02-01",
        availableTo: "2026-12-31",
    },
    {
        id: 3,
        title: "Cabană Romantică la Munte",
        location: "Brașov, România",
        city: "Brașov",
        price: 145,
        rating: 4.8,
        reviews: 203,
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop",
        features: ["WiFi", "Șemineu", "Grădină"],
        isFavorite: false,
        badge: "Nou",
        maxGuests: 3,
        availableFrom: "2026-02-01",
        availableTo: "2026-12-31",
    },
    {
        id: 4,
        title: "Vilă de Lux cu Piscină Privată",
        location: "Constanța, România",
        city: "Constanța",
        price: 399,
        rating: 5.0,
        reviews: 87,
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop",
        features: ["WiFi", "Piscină", "Jacuzzi"],
        isFavorite: true,
        badge: "Top",
        maxGuests: 6,
        availableFrom: "2026-02-01",
        availableTo: "2026-12-31",
    },
    {
        id: 5,
        title: "Studio Cozy în Centrul Vechi",
        location: "Cluj-Napoca, România",
        city: "Cluj-Napoca",
        price: 110,
        rating: 4.6,
        reviews: 57,
        image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop",
        features: ["WiFi", "Bucătărie"],
        isFavorite: false,
        maxGuests: 2,
        availableFrom: "2026-02-01",
        availableTo: "2026-12-31",
    },
    {
        id: 6,
        title: "Penthouse cu Panoramă la Oraș",
        location: "Timișoara, România",
        city: "Timișoara",
        price: 260,
        rating: 4.9,
        reviews: 42,
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
        features: ["WiFi", "Terasă", "Parcare", "Jacuzzi"],
        isFavorite: false,
        badge: "Premium",
        maxGuests: 4,
        availableFrom: "2026-02-01",
        availableTo: "2026-12-31",
    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalize(s: string) {
    return s.trim().toLowerCase();
}

function inAvailabilityRange(checkIn: string, checkOut: string, from: string, to: string) {
    if (!checkIn || !checkOut) return true;
    return (
        new Date(checkIn).getTime() >= new Date(from).getTime() &&
        new Date(checkOut).getTime() <= new Date(to).getTime()
    );
}

function readParamsFromUrl() {
    const sp = new URLSearchParams(window.location.search);
    return {
        location: sp.get("location") ?? "",
        checkIn:  sp.get("checkIn")  ?? "",
        checkOut: sp.get("checkOut") ?? "",
        guests:   Number(sp.get("guests") ?? "2"),
    };
}

const SORT_OPTIONS = [
    { value: "recommended", label: "Recomandate" },
    { value: "price-asc",   label: "Preț: mic → mare" },
    { value: "price-desc",  label: "Preț: mare → mic" },
    { value: "rating",      label: "Cele mai bine cotate" },
];

// ─── Component ────────────────────────────────────────────────────────────────

const SearchResults: React.FC = () => {
    const navigate = useNavigate();
    const initialParams = useMemo(() => readParamsFromUrl(), []);

    const [location, setLocation] = useState(initialParams.location);
    const [checkIn,  setCheckIn]  = useState(initialParams.checkIn);
    const [checkOut, setCheckOut] = useState(initialParams.checkOut);
    const [guests,   setGuests]   = useState(initialParams.guests);

    const [activeParams, setActiveParams] = useState(initialParams);
    const [sortBy,       setSortBy]       = useState("recommended");
    const [favorites,    setFavorites]    = useState<Set<number>>(
        () => new Set(PROPERTIES.filter((p) => p.isFavorite).map((p) => p.id))
    );

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = { location, checkIn, checkOut, guests };
        setActiveParams(params);
        const qs = new URLSearchParams({
            location,
            checkIn,
            checkOut,
            guests: String(guests),
        }).toString();
        navigate(`/search?${qs}`, { replace: true });
    };

    const toggleFavorite = (id: number) => {
        setFavorites((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    // Validation
    const errors: string[] = [];
    if (!activeParams.location.trim()) errors.push("Lipsește destinația.");
    if (
        activeParams.checkIn &&
        activeParams.checkOut &&
        new Date(activeParams.checkOut) <= new Date(activeParams.checkIn)
    ) {
        errors.push("Check-out trebuie să fie după Check-in.");
    }
    if (!Number.isFinite(activeParams.guests) || activeParams.guests < 1) {
        errors.push("Numărul de persoane este invalid.");
    }

    // Filter + sort
    const results = useMemo(() => {
        if (errors.length) return [];
        const loc = normalize(activeParams.location);
        let filtered = PROPERTIES.filter((p) => {
            const matchesLocation =
                !loc ||
                normalize(p.city).includes(loc) ||
                normalize(p.location).includes(loc);
            const matchesGuests = activeParams.guests <= p.maxGuests;
            const matchesDates  = inAvailabilityRange(
                activeParams.checkIn,
                activeParams.checkOut,
                p.availableFrom,
                p.availableTo
            );
            return matchesLocation && matchesGuests && matchesDates;
        });
        if (sortBy === "price-asc")  filtered = [...filtered].sort((a, b) => a.price - b.price);
        if (sortBy === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);
        if (sortBy === "rating")     filtered = [...filtered].sort((a, b) => b.rating - a.rating);
        return filtered;
    }, [activeParams, sortBy]);

    return (
        <div className="home">

            {/* ── Shared Header ── */}
            <Header />

            {/* ── Compact Search Banner ── */}
            <div className="sr-search-banner">
                <div className="sr-search-banner-inner">
                    <form className="sr-search-bar" onSubmit={handleSearch}>

                        <div className="sr-field">
                            <span className="sr-field-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Unde vrei să mergi?"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>

                        <div className="sr-divider" />

                        <div className="sr-field">
                            <span className="sr-field-icon">📅</span>
                            <div className="sr-date-group">
                                <label>Check-in</label>
                                <input
                                    type="date"
                                    value={checkIn}
                                    onChange={(e) => setCheckIn(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="sr-divider" />

                        <div className="sr-field">
                            <span className="sr-field-icon">📅</span>
                            <div className="sr-date-group">
                                <label>Check-out</label>
                                <input
                                    type="date"
                                    value={checkOut}
                                    onChange={(e) => setCheckOut(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="sr-divider" />

                        <div className="sr-field sr-field-guests">
                            <span className="sr-field-icon">👤</span>
                            <div className="sr-date-group">
                                <label>Persoane</label>
                                <input
                                    type="number"
                                    min={1}
                                    max={20}
                                    value={guests}
                                    onChange={(e) => setGuests(Number(e.target.value))}
                                />
                            </div>
                        </div>

                        <button type="submit" className="sr-search-btn">
                            🔍 Caută
                        </button>
                    </form>
                </div>
            </div>

            {/* ── Main Content ── */}
            <main className="sr-main">

                {/* Summary + sort */}
                <div className="sr-summary-row">
                    <div className="sr-summary-text">
                        {errors.length > 0 ? (
                            <span className="sr-error">⚠️ {errors[0]}</span>
                        ) : (
                            <>
                                <strong>{results.length}</strong>{" "}
                                {results.length === 1 ? "proprietate găsită" : "proprietăți găsite"}
                                {activeParams.location && (
                                    <> în <span className="sr-location-tag">"{activeParams.location}"</span></>
                                )}
                                {activeParams.checkIn && activeParams.checkOut && (
                                    <span className="sr-dates-tag">
                                        {" "}• {activeParams.checkIn} → {activeParams.checkOut}
                                    </span>
                                )}
                                {activeParams.guests > 0 && (
                                    <span className="sr-dates-tag"> • {activeParams.guests} persoane</span>
                                )}
                            </>
                        )}
                    </div>

                    {results.length > 0 && (
                        <div className="sr-sort">
                            <label htmlFor="sort">Sortează:</label>
                            <select
                                id="sort"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                {SORT_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Error block */}
                {errors.length > 0 ? (
                    <div className="sr-errors-block">
                        {errors.map((err, i) => <p key={i}>{err}</p>)}
                    </div>

                ) : results.length === 0 ? (
                    /* Empty state */
                    <div className="sr-empty">
                        <div className="sr-empty-icon">🏠</div>
                        <h3>Nu am găsit cazări disponibile</h3>
                        <p>Încearcă o altă destinație, perioade diferite sau mai puțini oaspeți.</p>
                        <a href="/" className="sr-back-btn">← Înapoi la căutare</a>
                    </div>

                ) : (
                    /* Results grid */
                    <div className="sr-grid">
                        {results.map((property) => (
                            <div key={property.id} className="sr-card">

                                {property.badge && (
                                    <span className="sr-badge">{property.badge}</span>
                                )}

                                <button
                                    className={`sr-fav-btn ${favorites.has(property.id) ? "active" : ""}`}
                                    onClick={() => toggleFavorite(property.id)}
                                    aria-label="Favorite"
                                >
                                    {favorites.has(property.id) ? "❤️" : "🤍"}
                                </button>

                                <div className="sr-card-image">
                                    <img src={property.image} alt={property.title} loading="lazy" />
                                </div>

                                <div className="sr-card-info">
                                    <h3>{property.title}</h3>
                                    <p className="sr-card-location">📍 {property.location}</p>

                                    <div className="sr-card-meta">
                                        <span>👤 max {property.maxGuests} oaspeți</span>
                                        <span>📅 {property.availableFrom} → {property.availableTo}</span>
                                    </div>

                                    <div className="sr-card-features">
                                        {property.features.map((f, i) => (
                                            <span key={i} className="sr-feature-tag">{f}</span>
                                        ))}
                                    </div>

                                    <div className="sr-card-footer">
                                        <div className="sr-rating">
                                            <span className="sr-rating-score">⭐ {property.rating}</span>
                                            <span className="sr-rating-count">({property.reviews} recenzii)</span>
                                        </div>
                                        <div className="sr-price">
                                            <span className="sr-price-amount">{property.price} RON</span>
                                            <span className="sr-price-period">/ noapte</span>
                                        </div>
                                    </div>

                                    <button className="sr-book-btn">Rezervă acum</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* ── Shared Footer ── */}
            <Footer />
        </div>
    );
};

export default SearchResults;