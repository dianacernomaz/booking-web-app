import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import './CSS/Home.css';
import './CSS/MyProfile.css';
import './CSS/AdminProperties.css';
import { useCurrency } from './lib/currency';
import { deleteManagedProperty, getManagedPropertiesForOwner, saveManagedProperty, type ManagedProperty } from './lib/managedProperties';
import { getSession } from './lib/session';

interface PropertyFormState {
    title: string;
    city: string;
    country: string;
    address: string;
    price: string;
    image: string;
    galleryImages: string;
    features: string;
    badge: string;
    maxGuests: string;
    bedrooms: string;
    bathrooms: string;
    area: string;
    availableFrom: string;
    availableTo: string;
    description: string;
    descriptionExtra: string;
}

function createEmptyForm(): PropertyFormState {
    return {
        title: '', city: '', country: '', address: '', price: '', image: '', galleryImages: '', features: '', badge: '',
        maxGuests: '2', bedrooms: '1', bathrooms: '1', area: '50', availableFrom: '', availableTo: '', description: '', descriptionExtra: '',
    };
}

function toForm(property: ManagedProperty): PropertyFormState {
    return {
        title: property.title,
        city: property.city,
        country: property.country,
        address: property.address,
        price: String(property.price),
        image: property.image,
        galleryImages: property.galleryImages.join(', '),
        features: property.features.join(', '),
        badge: property.badge || '',
        maxGuests: String(property.maxGuests),
        bedrooms: String(property.bedrooms),
        bathrooms: String(property.bathrooms),
        area: String(property.area),
        availableFrom: property.availableFrom,
        availableTo: property.availableTo,
        description: property.description,
        descriptionExtra: property.descriptionExtra,
    };
}

const MyProperties: React.FC = () => {
    const navigate = useNavigate();
    const session = getSession();
    const { formatPrice } = useCurrency();
    const [properties, setProperties] = useState<ManagedProperty[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState<PropertyFormState>(createEmptyForm());

    const loadProperties = () => {
        if (!session?.email) return;
        getManagedPropertiesForOwner(session.email).then(setProperties).catch(() => setProperties([]));
    };

    useEffect(() => {
        if (!session?.email) {
            navigate('/login');
            return;
        }
        loadProperties();
    }, [navigate, session?.email]);

    if (!session?.email) {
        return null;
    }

    return (
        <div className="home">
            <Header />
            <div className="mp-page">
                <aside className="mp-sidebar">
                    <div className="mp-avatar-wrap">
                        <div className="mp-avatar" style={{ background: '#2563eb' }}>{session.initials}</div>
                    </div>
                    <h2 className="mp-name">{session.fullName}</h2>
                    <nav className="mp-nav">
                        <button className="mp-nav-item" onClick={() => navigate('/profile')}>Profilul meu</button>
                        <button className="mp-nav-item active">Cazarile mele</button>
                        <button className="mp-nav-item" onClick={() => navigate('/bookings')}>Rezervarile mele</button>
                    </nav>
                </aside>

                <main className="mp-main">
                    <div className="mp-tab-content">
                        <div className="mp-tab-header">
                            <h1>Administrare cazari</h1>
                            <p>CRUD complet prin backendul Web API.</p>
                        </div>

                        <div className="ap-layout">
                            <section className="ap-list">
                                <div className="ap-panel-head">
                                    <h2>Proprietatile tale</h2>
                                    <button type="button" className="ap-primary-btn" onClick={() => { setEditingId(null); setForm(createEmptyForm()); }}>
                                        Cazare noua
                                    </button>
                                </div>
                                <div className="ap-cards">
                                    {properties.map((property) => (
                                        <article key={property.id} className={`ap-card ${editingId === property.id ? 'ap-card--active' : ''}`}>
                                            <img src={property.image} alt={property.title} className="ap-card-image" />
                                            <div className="ap-card-body">
                                                <div className="ap-card-top">
                                                    <div>
                                                        <h3>{property.title}</h3>
                                                        <p>{property.city}, {property.country}</p>
                                                    </div>
                                                    <span className="ap-card-price">{formatPrice(property.price)}</span>
                                                </div>
                                                <div className="ap-card-actions">
                                                    <button type="button" className="ap-secondary-btn" onClick={() => navigate(`/property/${property.id}`)}>Vezi</button>
                                                    <button type="button" className="ap-secondary-btn" onClick={() => { setEditingId(property.id); setForm(toForm(property)); }}>Editeaza</button>
                                                    <button type="button" className="ap-danger-btn" onClick={async () => { await deleteManagedProperty(property.id, session.email); loadProperties(); if (editingId === property.id) { setEditingId(null); setForm(createEmptyForm()); } }}>
                                                        Sterge
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </section>

                            <section className="ap-editor">
                                <div className="ap-panel-head">
                                    <h2>{editingId ? 'Editeaza cazarea' : 'Cazare noua'}</h2>
                                </div>
                                <form className="ap-form" onSubmit={async (e) => {
                                    e.preventDefault();
                                    await saveManagedProperty({
                                        id: editingId ?? undefined,
                                        ownerEmail: session.email,
                                        host: session.fullName,
                                        title: form.title,
                                        city: form.city,
                                        country: form.country,
                                        address: form.address,
                                        price: Number(form.price),
                                        image: form.image,
                                        galleryImages: form.galleryImages.split(',').map((item) => item.trim()).filter(Boolean),
                                        features: form.features.split(',').map((item) => item.trim()).filter(Boolean),
                                        badge: form.badge || undefined,
                                        maxGuests: Number(form.maxGuests),
                                        bedrooms: Number(form.bedrooms),
                                        bathrooms: Number(form.bathrooms),
                                        area: Number(form.area),
                                        availableFrom: form.availableFrom,
                                        availableTo: form.availableTo,
                                        description: form.description,
                                        descriptionExtra: form.descriptionExtra,
                                    });
                                    await loadProperties();
                                }}>
                                    <div className="ap-grid">
                                        {Object.entries(form).map(([key, value]) => (
                                            <label key={key} className={`ap-field ${['title', 'address', 'galleryImages', 'features', 'description', 'descriptionExtra'].includes(key) ? 'ap-field--full' : ''}`}>
                                                <span>{key}</span>
                                                {['description', 'descriptionExtra', 'galleryImages'].includes(key) ? (
                                                    <textarea rows={key === 'descriptionExtra' ? 5 : 3} value={value} onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))} />
                                                ) : (
                                                    <input type={['price', 'maxGuests', 'bedrooms', 'bathrooms', 'area'].includes(key) ? 'number' : key.includes('available') ? 'date' : 'text'} value={value} onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))} />
                                                )}
                                            </label>
                                        ))}
                                    </div>
                                    <div className="ap-form-actions">
                                        <button type="button" className="ap-secondary-btn" onClick={() => { setEditingId(null); setForm(createEmptyForm()); }}>Reseteaza</button>
                                        <button type="submit" className="ap-primary-btn">{editingId ? 'Salveaza modificarile' : 'Publica proprietatea'}</button>
                                    </div>
                                </form>
                            </section>
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default MyProperties;
