import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import './CSS/Home.css';
import './CSS/MyProfile.css';
import './CSS/AdminProperties.css';
import { useCurrency } from './lib/currency';
import {
    deleteManagedProperty,
    getManagedPropertiesForOwner,
    refreshManagedProperties,
    saveManagedProperty,
} from './lib/managedProperties';
import type { ManagedProperty } from './lib/managedProperties';
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
        title: '',
        city: '',
        country: '',
        address: '',
        price: '',
        image: '',
        galleryImages: '',
        features: '',
        badge: '',
        maxGuests: '2',
        bedrooms: '1',
        bathrooms: '1',
        area: '50',
        availableFrom: '',
        availableTo: '',
        description: '',
        descriptionExtra: '',
    };
}

function listToText(values: string[]) {
    return values.join(', ');
}

function textToList(value: string) {
    return value
        .split(/[\n,]/)
        .map((item) => item.trim())
        .filter(Boolean);
}

function toFormState(property: ManagedProperty): PropertyFormState {
    return {
        title: property.title,
        city: property.city,
        country: property.country,
        address: property.address,
        price: String(property.price),
        image: property.image,
        galleryImages: listToText(property.galleryImages),
        features: listToText(property.features),
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
    const { formatPrice } = useCurrency();
    const [session, setSession] = useState(() => getSession());
    const [properties, setProperties] = useState<ManagedProperty[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState<PropertyFormState>(() => createEmptyForm());
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        const loadProperties = async (email: string) => {
            await refreshManagedProperties();
            setProperties(getManagedPropertiesForOwner(email));
        };

        const nextSession = getSession();
        if (!nextSession) {
            navigate('/login');
            return;
        }

        setSession(nextSession);
        void loadProperties(nextSession.email);

        const syncProperties = () => {
            const activeSession = getSession();
            if (!activeSession) return;
            setProperties(getManagedPropertiesForOwner(activeSession.email));
        };

        window.addEventListener('sb_properties_changed', syncProperties);
        return () => window.removeEventListener('sb_properties_changed', syncProperties);
    }, [navigate]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setMessage(null);
    };

    const resetEditor = () => {
        setEditingId(null);
        setForm(createEmptyForm());
        setMessage(null);
    };

    const handleEdit = (property: ManagedProperty) => {
        setEditingId(property.id);
        setForm(toFormState(property));
        setMessage(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const validateForm = () => {
        if (!form.title.trim()) return 'Titlul proprietatii este obligatoriu.';
        if (!form.city.trim()) return 'Orasul este obligatoriu.';
        if (!form.country.trim()) return 'Tara este obligatorie.';
        if (!form.address.trim()) return 'Adresa este obligatorie.';
        if (!form.image.trim()) return 'Imaginea principala este obligatorie.';
        if (!form.availableFrom || !form.availableTo) return 'Perioada de disponibilitate este obligatorie.';
        if (new Date(form.availableTo) < new Date(form.availableFrom)) {
            return 'Data de final trebuie sa fie dupa data de inceput.';
        }
        if (!form.description.trim()) return 'Descrierea scurta este obligatorie.';
        if (Number(form.price) <= 0) return 'Pretul pe noapte trebuie sa fie mai mare decat 0.';
        if (Number(form.maxGuests) < 1) return 'Capacitatea minima este 1 oaspete.';
        if (Number(form.bedrooms) < 1) return 'Proprietatea trebuie sa aiba cel putin un dormitor.';
        if (Number(form.bathrooms) < 1) return 'Proprietatea trebuie sa aiba cel putin o baie.';
        if (Number(form.area) < 10) return 'Suprafata trebuie sa fie de minim 10 m².';
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) return;

        const validationError = validateForm();
        if (validationError) {
            setMessage({ type: 'error', text: validationError });
            return;
        }

        const saved = await saveManagedProperty({
            id: editingId ?? undefined,
            ownerEmail: session.email,
            host: session.fullName,
            title: form.title.trim(),
            city: form.city.trim(),
            country: form.country.trim(),
            address: form.address.trim(),
            price: Number(form.price),
            image: form.image.trim(),
            galleryImages: textToList(form.galleryImages),
            features: textToList(form.features),
            badge: form.badge.trim(),
            maxGuests: Number(form.maxGuests),
            bedrooms: Number(form.bedrooms),
            bathrooms: Number(form.bathrooms),
            area: Number(form.area),
            availableFrom: form.availableFrom,
            availableTo: form.availableTo,
            description: form.description.trim(),
            descriptionExtra: form.descriptionExtra.trim(),
        });

        if (!saved) {
            setMessage({ type: 'error', text: 'Nu am putut salva proprietatea.' });
            return;
        }

        await refreshManagedProperties();
        setProperties(getManagedPropertiesForOwner(session.email));
        setEditingId(saved.id);
        setForm(toFormState(saved));
        setMessage({
            type: 'success',
            text: editingId
                ? 'Proprietatea a fost actualizata cu succes.'
                : 'Proprietatea a fost publicata pe site.',
        });
    };

    const handleDelete = async (property: ManagedProperty) => {
        if (!session) return;

        const confirmed = window.confirm(`Stergi proprietatea "${property.title}"?`);
        if (!confirmed) return;

        await deleteManagedProperty(property.id, session.email);
        await refreshManagedProperties();
        setProperties(getManagedPropertiesForOwner(session.email));

        if (editingId === property.id) {
            resetEditor();
        }

        setMessage({ type: 'success', text: 'Proprietatea a fost stearsa.' });
    };

    const publishedCount = properties.length;

    return (
        <div className="home">
            <Header />

            <div className="mp-page">
                <aside className="mp-sidebar">
                    <div className="mp-avatar-wrap">
                        <div className="mp-avatar" style={{ background: '#2563eb' }}>
                            {session?.initials || 'SB'}
                        </div>
                    </div>

                    <h2 className="mp-name">{session?.fullName || 'Gazda StayBooker'}</h2>
                    <p className="mp-member-since">Panou gazda</p>

                    <div className="mp-stats">
                        <div className="mp-stat">
                            <span className="mp-stat-val">{publishedCount}</span>
                            <span className="mp-stat-lbl">Cazari publicate</span>
                        </div>
                        <div className="mp-stat">
                            <span className="mp-stat-val">{properties.filter((item) => item.badge).length}</span>
                            <span className="mp-stat-lbl">Cu badge</span>
                        </div>
                        <div className="mp-stat">
                            <span className="mp-stat-val">{properties.filter((item) => item.galleryImages.length > 0).length}</span>
                            <span className="mp-stat-lbl">Cu galerie</span>
                        </div>
                    </div>

                    <nav className="mp-nav">
                        <button className="mp-nav-item" onClick={() => navigate('/profile')}>
                            <span>👤</span> Profilul meu
                        </button>
                        <button className="mp-nav-item active">
                            <span>🏠</span> Cazarile mele
                        </button>
                        <button className="mp-nav-item" onClick={() => navigate('/bookings')}>
                            <span>📋</span> Rezervarile mele
                        </button>
                        <button className="mp-nav-item mp-nav-item--danger" onClick={() => navigate('/login')}>
                            <span>↩️</span> Intra in alt cont
                        </button>
                    </nav>
                </aside>

                <main className="mp-main">
                    <div className="mp-tab-content">
                        <div className="mp-tab-header">
                            <h1>Administrare cazari</h1>
                            <p>Adauga, editeaza si sterge proprietatile publicate de contul tau.</p>
                        </div>

                        {message && (
                            <div className={`ap-message ap-message--${message.type}`}>
                                {message.text}
                            </div>
                        )}

                        <div className="ap-summary">
                            <div className="ap-summary-card">
                                <span className="ap-summary-label">Publicate</span>
                                <strong>{publishedCount}</strong>
                            </div>
                            <div className="ap-summary-card">
                                <span className="ap-summary-label">Ultima actualizare</span>
                                <strong>{properties[0]?.updatedAt ? new Date(properties[0].updatedAt).toLocaleDateString('ro-RO') : '—'}</strong>
                            </div>
                            <button className="ap-primary-btn" type="button" onClick={resetEditor}>
                                + Adauga o cazare noua
                            </button>
                        </div>

                        <div className="ap-layout">
                            <section className="ap-list">
                                <div className="ap-panel-head">
                                    <h2>Proprietatile tale</h2>
                                    <span>{publishedCount} active</span>
                                </div>

                                {properties.length === 0 ? (
                                    <div className="ap-empty">
                                        <div className="ap-empty-icon">🏠</div>
                                        <h3>Nu ai publicat nicio cazare</h3>
                                        <p>Completeaza formularul din dreapta pentru a publica prima proprietate.</p>
                                    </div>
                                ) : (
                                    <div className="ap-cards">
                                        {properties
                                            .slice()
                                            .sort((a, b) => b.id - a.id)
                                            .map((property) => (
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
                                                        <div className="ap-card-meta">
                                                            <span>👥 max {property.maxGuests}</span>
                                                            <span>🛏️ {property.bedrooms} dormitoare</span>
                                                            <span>📅 {property.availableFrom} → {property.availableTo}</span>
                                                        </div>
                                                        <div className="ap-card-actions">
                                                            <button type="button" className="ap-secondary-btn" onClick={() => navigate(`/property/${property.id}`)}>
                                                                Vezi
                                                            </button>
                                                            <button type="button" className="ap-secondary-btn" onClick={() => handleEdit(property)}>
                                                                Editeaza
                                                            </button>
                                                            <button type="button" className="ap-danger-btn" onClick={() => handleDelete(property)}>
                                                                Sterge
                                                            </button>
                                                        </div>
                                                    </div>
                                                </article>
                                            ))}
                                    </div>
                                )}
                            </section>

                            <section className="ap-editor">
                                <div className="ap-panel-head">
                                    <h2>{editingId ? 'Editeaza cazarea' : 'Cazare noua'}</h2>
                                    {editingId && (
                                        <button type="button" className="ap-link-btn" onClick={resetEditor}>
                                            Formular nou
                                        </button>
                                    )}
                                </div>

                                <form className="ap-form" onSubmit={handleSubmit}>
                                    <div className="ap-grid">
                                        <label className="ap-field ap-field--full">
                                            <span>Titlu</span>
                                            <input name="title" value={form.title} onChange={handleChange} placeholder="Ex: Vila moderna cu piscina" />
                                        </label>

                                        <label className="ap-field">
                                            <span>Oras</span>
                                            <input name="city" value={form.city} onChange={handleChange} placeholder="Bucuresti" />
                                        </label>

                                        <label className="ap-field">
                                            <span>Tara</span>
                                            <input name="country" value={form.country} onChange={handleChange} placeholder="Romania" />
                                        </label>

                                        <label className="ap-field ap-field--full">
                                            <span>Adresa</span>
                                            <input name="address" value={form.address} onChange={handleChange} placeholder="Strada, numar, zona" />
                                        </label>

                                        <label className="ap-field">
                                            <span>Pret / noapte (RON baza)</span>
                                            <input name="price" type="number" min="1" value={form.price} onChange={handleChange} />
                                        </label>

                                        <label className="ap-field">
                                            <span>Badge optional</span>
                                            <input name="badge" value={form.badge} onChange={handleChange} placeholder="Nou / Premium" />
                                        </label>

                                        <label className="ap-field">
                                            <span>Max. oaspeti</span>
                                            <input name="maxGuests" type="number" min="1" value={form.maxGuests} onChange={handleChange} />
                                        </label>

                                        <label className="ap-field">
                                            <span>Dormitoare</span>
                                            <input name="bedrooms" type="number" min="1" value={form.bedrooms} onChange={handleChange} />
                                        </label>

                                        <label className="ap-field">
                                            <span>Bai</span>
                                            <input name="bathrooms" type="number" min="1" value={form.bathrooms} onChange={handleChange} />
                                        </label>

                                        <label className="ap-field">
                                            <span>Suprafata (m²)</span>
                                            <input name="area" type="number" min="10" value={form.area} onChange={handleChange} />
                                        </label>

                                        <label className="ap-field">
                                            <span>Disponibila din</span>
                                            <input name="availableFrom" type="date" value={form.availableFrom} onChange={handleChange} />
                                        </label>

                                        <label className="ap-field">
                                            <span>Disponibila pana la</span>
                                            <input name="availableTo" type="date" value={form.availableTo} onChange={handleChange} />
                                        </label>

                                        <label className="ap-field ap-field--full">
                                            <span>Imagine principala</span>
                                            <input name="image" value={form.image} onChange={handleChange} placeholder="https://..." />
                                        </label>

                                        <label className="ap-field ap-field--full">
                                            <span>Galerie foto</span>
                                            <textarea
                                                name="galleryImages"
                                                rows={3}
                                                value={form.galleryImages}
                                                onChange={handleChange}
                                                placeholder="URL-uri separate prin virgula sau pe linii separate"
                                            />
                                        </label>

                                        <label className="ap-field ap-field--full">
                                            <span>Facilitati</span>
                                            <input
                                                name="features"
                                                value={form.features}
                                                onChange={handleChange}
                                                placeholder="WiFi, Piscina, Parcare, Aer conditionat"
                                            />
                                        </label>

                                        <label className="ap-field ap-field--full">
                                            <span>Descriere scurta</span>
                                            <textarea
                                                name="description"
                                                rows={4}
                                                value={form.description}
                                                onChange={handleChange}
                                                placeholder="Descrierea care apare in pagina proprietatii"
                                            />
                                        </label>

                                        <label className="ap-field ap-field--full">
                                            <span>Descriere extinsa</span>
                                            <textarea
                                                name="descriptionExtra"
                                                rows={5}
                                                value={form.descriptionExtra}
                                                onChange={handleChange}
                                                placeholder="Detalii suplimentare despre experienta, zona si facilitati"
                                            />
                                        </label>
                                    </div>

                                    <div className="ap-form-actions">
                                        <button type="button" className="ap-secondary-btn" onClick={resetEditor}>
                                            Reseteaza
                                        </button>
                                        <button type="submit" className="ap-primary-btn">
                                            {editingId ? 'Salveaza modificarile' : 'Publica proprietatea'}
                                        </button>
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
