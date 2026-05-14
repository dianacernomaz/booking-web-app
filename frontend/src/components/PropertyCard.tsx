import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../utils/currency';
import type { ManagedPropertySummary } from '../types/managedProperties';
import FeatureTag from './FeatureTag';

interface PropertyCardProps {
    property: ManagedPropertySummary;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
    const navigate = useNavigate();
    const { formatPrice } = useCurrency();

    return (
        <div className="sr-card" onClick={() => navigate(`/property/${property.id}`)} style={{ cursor: 'pointer' }}>
            {property.badge && <span className="sr-badge">{property.badge}</span>}
            <div className="sr-card-image">
                <img src={property.image} alt={property.title} loading="lazy" />
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
