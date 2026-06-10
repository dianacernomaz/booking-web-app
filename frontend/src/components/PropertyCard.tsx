import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../utils/currency';
import type { ManagedPropertySummary } from '../types/managedProperties';
import FeatureTag from './FeatureTag';
import { addFavorite, checkFavorite, favoritesChangedEvent, removeFavorite } from '../utils/favorites';
import { getSession } from '../utils/session';

interface PropertyCardProps {
    property: ManagedPropertySummary;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
    const navigate = useNavigate();
    const { formatPrice } = useCurrency();
    const [isFavorite, setIsFavorite] = useState(Boolean(property.isFavorite));

    useEffect(() => {
        setIsFavorite(Boolean(property.isFavorite));
    }, [property.isFavorite]);

    useEffect(() => {
        const syncFavoriteState = () => {
            const session = getSession();
            if (!session?.token) {
                setIsFavorite(Boolean(property.isFavorite));
                return;
            }

            checkFavorite(property.id)
                .then((data) => setIsFavorite(data.isFavorite))
                .catch(() => undefined);
        };

        syncFavoriteState();
        window.addEventListener(favoritesChangedEvent, syncFavoriteState);
        window.addEventListener('sb_session_changed', syncFavoriteState);
        return () => {
            window.removeEventListener(favoritesChangedEvent, syncFavoriteState);
            window.removeEventListener('sb_session_changed', syncFavoriteState);
        };
    }, [property.id, property.isFavorite]);

    const handleFavoriteClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();

        const session = getSession();
        if (!session?.email) {
            navigate('/login');
            return;
        }

        if (isFavorite) {
            await removeFavorite(property.id);
            setIsFavorite(false);
            return;
        }

        await addFavorite(property.id);
        setIsFavorite(true);
    };

    return (
        <div className="sr-card" onClick={() => navigate(`/property/${property.id}`)} style={{ cursor: 'pointer' }}>
            {property.badge && <span className="sr-badge">{property.badge}</span>}
            <button type="button" className={`sr-fav-btn ${isFavorite ? 'active' : ''}`} onClick={handleFavoriteClick} aria-label={isFavorite ? 'Elimina din favorite' : 'Adauga la favorite'}>
                {isFavorite ? '♥' : '♡'}
            </button>
            <div className="sr-card-image">
                <img src={property.image} alt={property.title} loading="lazy" />
            </div>
            <div className="sr-card-info">
                <h3>{property.title}</h3>
                <p className="sr-card-location">Locatie: {property.location}</p>
                <div className="sr-card-meta">
                    <span>Max {property.maxGuests} oaspeti</span>
                    <span>{property.availableFrom} - {property.availableTo}</span>
                </div>
                <div className="sr-card-features">
                    {property.features.map((feature) => (
                        <FeatureTag key={feature} feature={feature} className="sr-feature-tag" />
                    ))}
                </div>
                <div className="sr-card-footer">
                    <div className="sr-rating">
                        <span className="sr-rating-score">Stele {property.rating}</span>
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
    );
};

export default PropertyCard;
