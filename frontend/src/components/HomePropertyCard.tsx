import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../utils/currency';
import type { ManagedPropertySummary } from '../types/managedProperties';
import FeatureTag from './FeatureTag';
import { authService } from '../auth/authService';
import { wishlistService } from '../axios/wishlistService';

interface HomePropertyCardProps {
    property: ManagedPropertySummary;
}

const HomePropertyCard: React.FC<HomePropertyCardProps> = ({ property }) => {
    const navigate = useNavigate();
    const { formatPrice } = useCurrency();
    const [isFavorite, setIsFavorite] = useState(property.isFavorite);

    const handleFavoriteClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const session = authService.getSession();
        if (!session?.email) {
            navigate('/login');
            return;
        }
        try {
            await wishlistService.toggleWishlist(session.email, property.id);
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error('Failed to toggle wishlist', error);
        }
    };

    return (
        <div
            className="property-card"
            onClick={() => navigate(`/property/${property.id}`)}
            style={{ cursor: 'pointer' }}
        >
            {property.badge && <span className="property-badge">{property.badge}</span>}
            <div className="property-image" style={{ position: 'relative' }}>
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
                <p className="property-location">📍 {property.location}</p>
                <div className="property-features">
                    {property.features.map((feature) => (
                        <FeatureTag key={feature} feature={feature} />
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
    );
};

export default HomePropertyCard;
