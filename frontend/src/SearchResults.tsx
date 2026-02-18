import { useMemo } from "react";
import "./Home.css";

type SearchParams = {
    location: string;
    checkIn: string;
    checkOut: string;
    guests: number;
};

type Property = {
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
    availableFrom: string; // YYYY-MM-DD
    availableTo: string;   // YYYY-MM-DD
};

function normalize(s: string) {
    return s.trim().toLowerCase();
}

function inAvailabilityRange(checkIn: string, checkOut: string, from: string, to: string) {
    const ci = new Date(checkIn).getTime();
    const co = new Date(checkOut).getTime();
    const af = new Date(from).getTime();
    const at = new Date(to).getTime();
    return ci >= af && co <= at;
}

function readParamsFromUrl(): SearchParams {
    const sp = new URLSearchParams(window.location.search);

    return {
        location: sp.get("location") ?? "",
        checkIn: sp.get("checkIn") ?? "",
        checkOut: sp.get("checkOut") ?? "",
        guests: Number(sp.get("guests") ?? "2"),
    };
}

// ✅ aici ții “baza de date” mock (poți adăuga câte vrei)
const PROPERTIES: Property[] = [
    {
        id: 1,
        title: "Luxury Suite cu vedere la mare",
        location: "Bali, Indonezia",
        city: "Bali",
        price: 200,
        rating: 4.9,
        reviews: 128,
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop",
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
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
        features: ["WiFi", "Bucătărie", "Terasă"],
        isFavorite: true,
        maxGuests: 2,
        availableFrom: "2026-03-10",
        availableTo: "2026-04-10",
    },
    {
        id: 3,
        title: "Cabană Romantică la Munte",
        location: "Brașov, România",
        city: "Brașov",
        price: 145,
        rating: 4.8,
        reviews: 203,
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
        features: ["WiFi", "Șemineu", "Grădină"],
        isFavorite: false,
        badge: "Nou",
        maxGuests: 3,
        availableFrom: "2026-02-15",
        availableTo: "2026-05-30",
    },
    {
        id: 4,
        title: "Vilă de Lux cu Piscină Privată",
        location: "Constanța, România",
        city: "Constanța",
        price: 399,
        rating: 5.0,
        reviews: 87,
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop",
        features: ["WiFi", "Piscină", "Jacuzzi"],
        isFavorite: true,
        maxGuests: 6,
        availableFrom: "2026-06-01",
        availableTo: "2026-09-15",
    },
];

const SearchResults: React.FC = () => {
    const params = useMemo(() => readParamsFromUrl(), []);

    const errors: string[] = [];
    if (!params.location.trim()) errors.push("Lipsește destinația.");
    if (!params.checkIn || !params.checkOut) errors.push("Lipsesc datele (check-in / check-out).");
    if (params.checkIn && params.checkOut && new Date(params.checkOut) <= new Date(params.checkIn)) {
        errors.push("Check-out trebuie să fie după Check-in.");
    }
    if (!Number.isFinite(params.guests) || params.guests < 1) errors.push("Numărul de persoane este invalid.");

    const results = useMemo(() => {
        if (errors.length) return [];

        const loc = normalize(params.location);

        return PROPERTIES.filter((p) => {
            const matchesLocation =
                normalize(p.city).includes(loc) || normalize(p.location).includes(loc);

            const matchesGuests = params.guests <= p.maxGuests;

            const matchesDates = inAvailabilityRange(
                params.checkIn,
                params.checkOut,
                p.availableFrom,
                p.availableTo
            );

            return matchesLocation && matchesGuests && matchesDates;
        });
    }, [params.location, params.checkIn, params.checkOut, params.guests]); // eslint ok

    return (
        <div className="home">
            <section className="properties" style={{ paddingTop: 40 }}>
                <div className="section-header" style={{ padding: "0 40px" }}>
                    <h2>Rezultate căutare</h2>
                    <a className="view-more" href="/" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
                        ← Înapoi
                    </a>
                </div>

                <div style={{ padding: "0 40px", marginBottom: 20, color: "#6b7280" }}>
                    <div><b>Destinație:</b> {params.location || "-"}</div>
                    <div><b>Check-in:</b> {params.checkIn || "-"} • <b>Check-out:</b> {params.checkOut || "-"}</div>
                    <div><b>Persoane:</b> {params.guests || "-"}</div>
                </div>

                {errors.length > 0 ? (
                    <div style={{ padding: "0 40px", color: "#ef4444", fontWeight: 600 }}>
                        {errors.map((x, i) => <div key={i}>{x}</div>)}
                    </div>
                ) : results.length === 0 ? (
                    <p style={{ padding: "0 40px" }}>
                        Nu am găsit cazări disponibile pentru criteriile alese.
                    </p>
                ) : (
                    <div className="properties-grid">
                        {results.map((property) => (
                            <div key={property.id} className="property-card">
                                {property.badge && <span className="property-badge">{property.badge}</span>}

                                <div className="property-image">
                                    <img src={property.image} alt={property.title} />
                                </div>

                                <div className="property-info">
                                    <h3>{property.title}</h3>
                                    <p className="property-location">📍 {property.location}</p>

                                    <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 10 }}>
                                        👤 max {property.maxGuests} • 📅 {property.availableFrom} → {property.availableTo}
                                    </p>

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
                )}
            </section>
        </div>
    );
};

export default SearchResults;
