import React from 'react';

interface GalleryImageItemProps {
    image: string;
    onRemove: (image: string) => void;
}

const GalleryImageItem: React.FC<GalleryImageItemProps> = ({ image, onRemove }) => {
    return (
        <div className="ap-gallery-item">
            <img src={image} alt="Galerie proprietate" />
            <button type="button" className="ap-gallery-remove" onClick={() => onRemove(image)}>
                Șterge
            </button>
        </div>
    );
};

export default GalleryImageItem;
