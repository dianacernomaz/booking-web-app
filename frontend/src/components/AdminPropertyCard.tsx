import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { ManagedProperty } from '../types/managedProperties';

interface AdminPropertyCardProps {
    property: ManagedProperty;
    onApprove: (id: number) => void;
    onReject: (id: number) => void;
}

const AdminPropertyCard: React.FC<AdminPropertyCardProps> = ({ property, onApprove, onReject }) => {
    const navigate = useNavigate();

    return (
        <div key={property.id} className="ap-card">
            <img src={property.image} alt={property.title} className="ap-card-image" />
            <div className="ap-card-body">
                <div className="ap-card-top">
                    <div>
                        <h3>{property.title}</h3>
                        <p>{property.city}, {property.country}</p>
                        <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Proprietar: {property.ownerEmail}</p>
                    </div>
                    <div className={`ap-message ${property.isApproved ? 'ap-message--success' : 'ap-message--error'}`} style={{ margin: 0, padding: '4px 12px', fontSize: '0.8rem' }}>
                        {property.isApproved ? 'Aprobata' : 'In asteptare'}
                    </div>
                </div>
                <div className="ap-card-actions">
                    {!property.isApproved ? (
                        <button onClick={() => onApprove(property.id)} className="ap-primary-btn">Aproba</button>
                    ) : (
                        <button onClick={() => onReject(property.id)} className="ap-danger-btn">Respinge</button>
                    )}
                    <button className="ap-secondary-btn" onClick={() => navigate(`/property/${property.id}`)}>Vezi</button>
                </div>
            </div>
        </div>
    );
};

export default AdminPropertyCard;
