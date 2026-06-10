import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../utils/currency';
import type { ManagedProperty } from '../types/managedProperties';

interface AdminPropertyCardProps {
    property: ManagedProperty;
    onEdit: (property: ManagedProperty) => void;
    onDelete: (property: ManagedProperty) => void;
}

const AdminPropertyCard: React.FC<AdminPropertyCardProps> = ({ property, onEdit, onDelete }) => {
    const navigate = useNavigate();
    const { formatPrice } = useCurrency();

    return (
        <div className="ap-card">
            <img src={property.image} alt={property.title} className="ap-card-image" />
            <div className="ap-card-body">
                <div className="ap-card-top">
                    <div>
                        <h3>{property.title}</h3>
                        <p>{property.city}, {property.country}</p>
                        <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Proprietar: {property.ownerEmail}</p>
                    </div>
                    <span className="ap-card-price">{formatPrice(property.price)}</span>
                </div>
                <div className="ap-card-meta">
                    <span>{property.maxGuests} oaspeti</span>
                    <span>{property.bedrooms} dormitoare</span>
                    <span>{property.bathrooms} bai</span>
                </div>
                <div className="ap-card-actions">
                    <button type="button" className="ap-secondary-btn" onClick={() => navigate(`/property/${property.id}`)}>
                        Vezi
                    </button>
                    <button type="button" className="ap-secondary-btn" onClick={() => onEdit(property)}>
                        Modifica
                    </button>
                    <button type="button" className="ap-danger-btn" onClick={() => onDelete(property)}>
                        Sterge
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminPropertyCard;
