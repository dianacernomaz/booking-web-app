import React from 'react';

interface NearbyItemProps {
    icon: string;
    name: string;
    dist: string;
}

const NearbyItem: React.FC<NearbyItemProps> = ({ icon, name, dist }) => {
    return (
        <div className="pd-nearby-item">
            <span>{icon}</span>
            <span className="pd-nearby-name">{name}</span>
            <span className="pd-nearby-dist">{dist}</span>
        </div>
    );
};

export default NearbyItem;
