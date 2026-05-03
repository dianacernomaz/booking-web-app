import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import AdminUserCard from '../components/AdminUserCard';
import AdminPropertyCard from '../components/AdminPropertyCard';
import { authService, type StoredUser } from '../auth/authService';
import { propertyService } from '../axios/propertyService';
import { getAdminStats } from '../utils/bookings';
import type { ManagedProperty } from '../types/managedProperties';
import '../assets/css/AdminProperties.css';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState<StoredUser[]>([]);
    const [properties, setProperties] = useState<ManagedProperty[]>([]);
    const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'properties'>('stats');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const session = authService.getSession();
        if (!session || session.role !== 'admin') {
            navigate('/403');
            return;
        }

        Promise.all([
            getAdminStats(),
            authService.getAdminUsers(),
            propertyService.getAdminAll()
        ]).then(([s, u, p]) => {
            setStats(s);
            setUsers(u);
            setProperties(p);
        }).finally(() => setLoading(false));
    }, [navigate]);

    const handleApprove = async (id: number) => {
        await propertyService.approve(id);
        const updated = await propertyService.getAdminAll();
        setProperties(updated);
    };

    const handleReject = async (id: number) => {
        await propertyService.reject(id);
        const updated = await propertyService.getAdminAll();
        setProperties(updated);
    };

    const handleRoleUpdate = async (email: string, role: string) => {
        await authService.updateUserRole(email, role);
        const updated = await authService.getAdminUsers();
        setUsers(updated);
    };

    if (loading) return <div className="loading">Incarcare dashboard admin...</div>;

    return (
        <div className="my-properties-page">
            <Header />
            <main className="mp-main">
                <div className="mp-header">
                    <h1>Panou Administrare</h1>
                    <p>Gestioneaza utilizatorii, proprietatile si vezi statistici despre platforma.</p>
                </div>

                <div className="ap-summary" style={{ marginBottom: '2rem' }}>
                    <button 
                        className={`ap-secondary-btn ${activeTab === 'stats' ? 'ap-primary-btn' : ''}`}
                        onClick={() => setActiveTab('stats')}
                    >
                        Statistici
                    </button>
                    <button 
                        className={`ap-secondary-btn ${activeTab === 'users' ? 'ap-primary-btn' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        Utilizatori
                    </button>
                    <button 
                        className={`ap-secondary-btn ${activeTab === 'properties' ? 'ap-primary-btn' : ''}`}
                        onClick={() => setActiveTab('properties')}
                    >
                        Proprietati
                    </button>
                </div>

                {activeTab === 'stats' && stats && (
                    <div className="ap-summary">
                        <div className="ap-summary-card">
                            <span className="ap-summary-label">Total Utilizatori</span>
                            <strong>{stats.totalUsers}</strong>
                        </div>
                        <div className="ap-summary-card">
                            <span className="ap-summary-label">Total Proprietati</span>
                            <strong>{stats.totalProperties}</strong>
                        </div>
                        <div className="ap-summary-card">
                            <span className="ap-summary-label">Asteapta Aprobare</span>
                            <strong style={{ color: '#febb02' }}>{stats.pendingProperties}</strong>
                        </div>
                        <div className="ap-summary-card">
                            <span className="ap-summary-label">Total Rezervari</span>
                            <strong>{stats.totalBookings}</strong>
                        </div>
                        <div className="ap-summary-card">
                            <span className="ap-summary-label">Venit Total</span>
                            <strong style={{ color: '#008009' }}>{stats.totalRevenue} €</strong>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="ap-cards">
                        {users.map(user => (
                            <AdminUserCard 
                                key={user.email} 
                                user={user} 
                                onToggleAdmin={(email, currentRole) => handleRoleUpdate(email, currentRole === 'admin' ? 'user' : 'admin')}
                            />
                        ))}
                    </div>
                )}

                {activeTab === 'properties' && (
                    <div className="ap-cards">
                        {properties.map(property => (
                            <AdminPropertyCard 
                                key={property.id} 
                                property={property} 
                                onApprove={handleApprove}
                                onReject={handleReject}
                            />
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default AdminDashboard;
