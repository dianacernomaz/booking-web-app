import React from 'react';

interface FeatureTagProps {
    feature: string;
    className?: string;
}

const FeatureTag: React.FC<FeatureTagProps> = ({ feature, className = 'feature-tag' }) => {
    return (
        <span key={feature} className={className}>{feature}</span>
    );
};

export default FeatureTag;
