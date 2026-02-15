import { useMemo, useState, type CSSProperties } from "react";
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
    availableTo: string; // YYYY-MM-DD
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

function formatDate(s: string) {
    if (!s) return "-";
    const [y, m, d] = s.split("-");
    if (!y || !m || !d) return s;
    return `${d}.${m}.${y}`;
}

type SortKey = "recommended" | "priceAsc" | "priceDesc" | "ratingDesc";

// Mock data (poți extinde)
const PROPERTIES: Property[] = [
    {
        id: 1,
        title: "Luxury Suite cu vedere la mare",
        location: "Bali, Indonezia",
        city: "Bali",
        price: 200,
        rating: 4.9,
        reviews: 128,
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
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
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
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
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
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
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
        features: ["WiFi", "Piscină", "Jacuzzi"],
        isFavorite: true,
        maxGuests: 6,
        availableFrom: "2026-06-01",
        availableTo: "2026-09-15",
    },
];

export default function SearchResults() {
    const params = useMemo(() => readParamsFromUrl(), []);
    const [sort, setSort] = useState<SortKey>("recommended");

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
            const matchesLocation = normalize(p.city).includes(loc) || normalize(p.location).includes(loc);
            const matchesGuests = params.guests <= p.maxGuests;
            const matchesDates = inAvailabilityRange(params.checkIn, params.checkOut, p.availableFrom, p.availableTo);
            return matchesLocation && matchesGuests && matchesDates;
        });
    }, [params.location, params.checkIn, params.checkOut, params.guests]);

    const sortedResults = useMemo(() => {
        const arr = [...results];
        switch (sort) {
            case "priceAsc":
                arr.sort((a, b) => a.price - b.price);
                break;
            case "priceDesc":
                arr.sort((a, b) => b.price - a.price);
                break;
            case "ratingDesc":
                arr.sort((a, b) => b.rating - a.rating);
                break;
            case "recommended":
            default:
                arr.sort((a, b) => b.rating * 10 + b.reviews / 50 - (a.rating * 10 + a.reviews / 50));
                break;
        }
        return arr;
    }, [results, sort]);

    const chipStyle: CSSProperties = {
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 14px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.18)",
        border: "1px solid rgba(255,255,255,0.28)",
        color: "rgba(255,255,255,0.95)",
        fontSize: 14,
        fontWeight: 600,
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
    };

    return (
        <div className="home">
            {/* Header */}
            <section className="hero" style={{ padding: "44px 0 56px" }}>
                <div className="hero-content" style={{ maxWidth: 1200 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                        <div>
                            <h1 className="hero-title" style={{ fontSize: "2.4rem", marginBottom: 8 }}>
                                Rezultate pentru {params.location ? `„${params.location}”` : "căutare"}
                            </h1>
                            <p className="hero-subtitle" style={{ marginBottom: 0 }}>
                                {errors.length
                                    ? "Verifică datele introduse și încearcă din nou."
                                    : `${sortedResults.length} cazare${sortedResults.length === 1 ? "" : "i"} găsite`}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            style={{
                                padding: "12px 16px",
                                borderRadius: 12,
                                border: "1px solid rgba(255,255,255,0.35)",
                                background: "rgba(255,255,255,0.15)",
                                color: "white",
                                fontWeight: 700,
                                cursor: "pointer",
                                backdropFilter: "blur(10px)",
                                WebkitBackdropFilter: "blur(10px)",
                            }}
                        >
                            ← Înapoi
                        </button>
                    </div>

                    <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <span style={chipStyle}>📍 {params.location || "-"}</span>
                        <span style={chipStyle}>📅 {formatDate(params.checkIn)} → {formatDate(params.checkOut)}</span>
                        <span style={chipStyle}>👤 {params.guests || "-"} persoane</span>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="properties" style={{ paddingTop: 28 }}>
                <div
                    style={{
                        maxWidth: 1200,
                        margin: "0 auto",
                        padding: "0 40px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 16,
                        flexWrap: "wrap",
                        marginBottom: 18,
                    }}
                >
                    <div style={{ color: "#6b7280" }}>
                        {errors.length ? null : (
                            <>
                                <b>{sortedResults.length}</b> rezultate • interval: <b>{formatDate(params.checkIn)}</b> – <b>{formatDate(params.checkOut)}</b>
                            </>
                        )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ color: "#6b7280", fontWeight: 600 }}>Sortează:</span>
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value as SortKey)}
                            style={{
                                padding: "10px 12px",
                                borderRadius: 10,
                                border: "1px solid #e5e7eb",
                                background: "white",
                                fontWeight: 600,
                                cursor: "pointer",
                            }}
                        >
                            <option value="recommended">Recomandate</option>
                            <option value="priceAsc">Preț crescător</option>
                            <option value="priceDesc">Preț descrescător</option>
                            <option value="ratingDesc">Rating (mare → mic)</option>
                        </select>
                    </div>
                </div>

                {errors.length > 0 ? (
                    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px", color: "#ef4444", fontWeight: 700 }}>
                        {errors.map((x, i) => (
                            <div key={i} style={{ marginBottom: 6 }}>{x}</div>
                        ))}
                    </div>
                ) : sortedResults.length === 0 ? (
                    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
                        <div style={{ background: "white", borderRadius: 16, border: "1px solid #e5e7eb", padding: 18, color: "#6b7280", fontWeight: 600 }}>
                            Nu am găsit cazări disponibile pentru criteriile alese.
                            <div style={{ marginTop: 8, fontWeight: 500 }}>
                                Sugestie: încearcă alte date sau o destinație mai generală.
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="properties-grid" style={{ maxWidth: 1200 }}>
                        {sortedResults.map((property) => (
                            <div key={property.id} className="property-card">
                                {property.badge && <span className="property-badge">{property.badge}</span>}

                                <div className="property-image">
                                    <img src={property.image} alt={property.title} loading="lazy" />
                                </div>

                                <div className="property-info">
                                    <h3>{property.title}</h3>
                                    <p className="property-location">📍 {property.location}</p>

                                    <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 10 }}>
                                        👤 max {property.maxGuests} • 📅 {formatDate(property.availableFrom)} → {formatDate(property.availableTo)}
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
}
