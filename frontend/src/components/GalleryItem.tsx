import React from 'react';

interface GalleryItemProps {
    image: string;
    alt: string;
    isMain?: boolean;
}

const GalleryItem: React.FC<GalleryItemProps> = ({ image, alt, isMain }) => {
    return (
        <div className={`pd-gallery-item${isMain ? ' pd-gallery-item--main' : ''}`}>
            <img src={image} alt={alt} className="pd-gallery-img" />
        </div>
    );
};

export default GalleryItem;
