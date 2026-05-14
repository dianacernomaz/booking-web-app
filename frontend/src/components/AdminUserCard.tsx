import React from 'react';
import { type StoredUser } from '../auth/authService';

interface AdminUserCardProps {
    user: StoredUser;
    onToggleAdmin: (email: string, currentRole: string) => void;
}

const AdminUserCard: React.FC<AdminUserCardProps> = ({ user, onToggleAdmin }) => {
    return (
        <div key={user.email} className="ap-card" style={{ gridTemplateColumns: '1fr auto', alignItems: 'center' }}>
            <div>
                <h3 style={{ margin: 0 }}>{user.fullName}</h3>
                <p style={{ margin: 0, color: '#64748b' }}>{user.email} — <strong>{user.role}</strong></p>
            </div>
            <div className="ap-card-actions">
                <button 
                    onClick={() => onToggleAdmin(user.email, user.role || 'user')}
                    className="ap-secondary-btn"
                >
                    Toggle Admin
                </button>
            </div>
        </div>
    );
};

export default AdminUserCard;
