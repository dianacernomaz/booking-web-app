import React from 'react';

interface AmenityItemProps {
    icon: string;
    label: string;
}

const AmenityItem: React.FC<AmenityItemProps> = ({ icon, label }) => {
    return (
        <div className="pd-feature-item">
            <span>{icon}</span> {label}
        </div>
    );
};

export default AmenityItem;
