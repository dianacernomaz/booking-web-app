import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../utils/currency';
import type { ManagedPropertySummary } from '../types/managedProperties';
import FeatureTag from './FeatureTag';
import { addFavorite, checkFavorite, favoritesChangedEvent, removeFavorite } from '../utils/favorites';
import { getSession } from '../utils/session';

interface HomePropertyCardProps {
    property: ManagedPropertySummary;
    onRemove?: (id: number) => void;
}

const HomePropertyCard: React.FC<HomePropertyCardProps> = ({ property, onRemove }) => {
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
        <div
            className="property-card"
            onClick={() => navigate(`/property/${property.id}`)}
            style={{ cursor: 'pointer' }}
        >
            {property.badge && <span className="property-badge">{property.badge}</span>}
            <button type="button" className={`favorite-btn ${isFavorite ? 'active' : ''}`} onClick={handleFavoriteClick} aria-label={isFavorite ? 'Elimina din favorite' : 'Adauga la favorite'}>
                {isFavorite ? '♥' : '♡'}
            </button>
            <div className="property-image">
                <img src={property.image} alt={property.title} />
                <button 
                    onClick={handleFavoriteClick}
                    style={{ 
                        position: 'absolute', 
                        top: 12, 
                        right: 12, 
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '24px',
                        textShadow: '0px 0px 4px rgba(0,0,0,0.5)',
                        opacity: 0.9,
                        transition: 'transform 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                    {isFavorite ? '❤️' : '🤍'}
                </button>
            </div>
            <div className="property-info">
                <h3>{property.title}</h3>
                <p className="property-location">Locatie: {property.location}</p>
                <div className="property-features">
                    {property.features.map((feature) => (
                        <FeatureTag key={feature} feature={feature} />
                    ))}
                </div>
                <div className="property-footer">
                    <div className="property-rating">
                        <span className="rating-score">Stele {property.rating}</span>
                        <span className="rating-reviews">({property.reviews} recenzii)</span>
                    </div>
                    <div className="property-price">
                        <span className="price-amount">{formatPrice(property.price)}</span>
                        <span className="price-period">/ noapte</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePropertyCard;
