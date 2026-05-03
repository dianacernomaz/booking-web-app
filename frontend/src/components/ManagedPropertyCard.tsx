import React from 'react';
import { useCurrency } from '../utils/currency';
import type { ManagedProperty } from '../types/managedProperties';

interface ManagedPropertyCardProps {
    property: ManagedProperty;
    isEditing: boolean;
    deletingId: number | null;
    onView: (id: number) => void;
    onEdit: (property: ManagedProperty) => void;
    onDelete: (property: ManagedProperty) => void;
}

const ManagedPropertyCard: React.FC<ManagedPropertyCardProps> = ({ 
    property, 
    isEditing, 
    deletingId, 
    onView, 
    onEdit, 
    onDelete 
}) => {
    const { formatPrice } = useCurrency();

    return (
        <article className={`ap-card ${isEditing ? 'ap-card--active' : ''}`}>
            <img src={property.image} alt={property.title} className="ap-card-image" />
            <div className="ap-card-body">
                <div className="ap-card-top">
                    <div>
                        <h3>{property.title}</h3>
                        <p>{property.city}, {property.country}</p>
                    </div>
                    <span className="ap-card-price">{formatPrice(property.price)}</span>
                </div>
                <div className="ap-card-meta">
                    <span>{property.maxGuests} oaspeți</span>
                    <span>{property.bedrooms} dormitoare</span>
                    <span>{property.bathrooms} băi</span>
                </div>
                <div className="ap-card-actions">
                    <button type="button" className="ap-secondary-btn" onClick={() => onView(property.id)}>Vezi</button>
                    <button type="button" className="ap-secondary-btn" onClick={() => onEdit(property)}>Editează</button>
                    <button
                        type="button"
                        className="ap-danger-btn"
                        onClick={() => onDelete(property)}
                        disabled={deletingId === property.id}
                    >
                        {deletingId === property.id ? 'Se șterge...' : 'Șterge'}
                    </button>
                </div>
            </div>
        </article>
    );
};

export default ManagedPropertyCard;
