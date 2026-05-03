import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../utils/currency';
import type { ManagedPropertySummary } from '../types/managedProperties';
import FeatureTag from './FeatureTag';

interface HomePropertyCardProps {
    property: ManagedPropertySummary;
}

const HomePropertyCard: React.FC<HomePropertyCardProps> = ({ property }) => {
    const navigate = useNavigate();
    const { formatPrice } = useCurrency();

    return (
        <div
            className="property-card"
            onClick={() => navigate(`/property/${property.id}`)}
            style={{ cursor: 'pointer' }}
        >
            {property.badge && <span className="property-badge">{property.badge}</span>}
            <div className="property-image">
                <img src={property.image} alt={property.title} />
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
