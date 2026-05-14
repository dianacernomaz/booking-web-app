import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../utils/currency';
import type { ManagedPropertySummary } from '../types/managedProperties';
import FeatureTag from './FeatureTag';
import { authService } from '../auth/authService';
import { wishlistService } from '../axios/wishlistService';

interface PropertyCardProps {
    property: ManagedPropertySummary;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
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
        <div className="sr-card" onClick={() => navigate(`/property/${property.id}`)} style={{ cursor: 'pointer' }}>
            {property.badge && <span className="sr-badge">{property.badge}</span>}
            <div className="sr-card-image" style={{ position: 'relative' }}>
                <img src={property.image} alt={property.title} loading="lazy" />
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
            <div className="sr-card-info">
                <h3>{property.title}</h3>
                <p className="sr-card-location">📍 {property.location}</p>
                <div className="sr-card-meta">
                    <span>👤 max {property.maxGuests} oaspeți</span>
                    <span>📅 {property.availableFrom} - {property.availableTo}</span>
                </div>
                <div className="sr-card-features">
                    {property.features.map((feature) => (
                        <FeatureTag key={feature} feature={feature} className="sr-feature-tag" />
                    ))}
                </div>
                <div className="sr-card-footer">
                    <div className="sr-rating">
                        <span className="sr-rating-score">⭐ {property.rating}</span>
                        <span className="sr-rating-count">({property.reviews} recenzii)</span>
                    </div>
                    <div className="sr-price">
                        <span className="sr-price-amount">{formatPrice(property.price)}</span>
                        <span className="sr-price-period">/ noapte</span>
                    </div>
                </div>
                <button className="sr-book-btn">Rezervă acum</button>
            </div>
        </div>
    );
};

export default PropertyCard;
