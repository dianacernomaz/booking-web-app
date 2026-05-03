import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Destination {
    id: number;
    name: string;
    properties: number;
    image: string;
}

interface DestinationCardProps {
    destination: Destination;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ destination }) => {
    const navigate = useNavigate();

    return (
        <div
            className="destination-card"
            onClick={() => navigate(`/search?location=${encodeURIComponent(destination.name)}`)}
            style={{ cursor: 'pointer' }}
        >
            <div className="destination-image">
                <img src={destination.image} alt={destination.name} />
                <div className="destination-overlay">
                    <h3>{destination.name}</h3>
                    <p>{destination.properties.toLocaleString()} proprietăți</p>
                </div>
            </div>
        </div>
    );
};

export default DestinationCard;
