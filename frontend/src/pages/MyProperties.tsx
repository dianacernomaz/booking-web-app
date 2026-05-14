import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import ManagedPropertyCard from '../components/ManagedPropertyCard';
import GalleryImageItem from '../components/GalleryImageItem';
import '../assets/css/Home.css';
import '../assets/css/MyProfile.css';
import '../assets/css/AdminProperties.css';
import { propertyService } from '../axios/propertyService';
import type { ManagedProperty } from '../types/managedProperties';
import { getSession } from '../utils/session';

interface PropertyFormState {
    title: string;
    city: string;
    country: string;
    address: string;
    price: string;
    image: string;
    badge: string;
    maxGuests: string;
    bedrooms: string;
    bathrooms: string;
    area: string;
    availableFrom: string;
    availableTo: string;
    description: string;
    descriptionExtra: string;
    features: string;
}

type MessageState =
    | { type: 'success'; text: string }
    | { type: 'error'; text: string }
    | null;

function formatDateOffset(days: number) {
    const value = new Date();
    value.setDate(value.getDate() + days);
    return value.toISOString().split('T')[0];
}

function createEmptyForm(): PropertyFormState {
    return {
        title: '',
        city: '',
        country: '',
        address: '',
        price: '',
        image: '',
        badge: '',
        maxGuests: '2',
        bedrooms: '1',
        bathrooms: '1',
        area: '50',
        availableFrom: formatDateOffset(0),
        availableTo: formatDateOffset(30),
        description: '',
        descriptionExtra: '',
        features: '',
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
        badge: property.badge || '',
        maxGuests: String(property.maxGuests),
        bedrooms: String(property.bedrooms),
        bathrooms: String(property.bathrooms),
        area: String(property.area),
        availableFrom: property.availableFrom,
        availableTo: property.availableTo,
        description: property.description,
        descriptionExtra: property.descriptionExtra,
        features: property.features.join(', '),
    };
}

function parseList(value: string) {
    return value
        .split(/[\n,]/)
        .map((item) => item.trim())
        .filter(Boolean);
}

function normalizeApiError(error: unknown, fallback: string) {
    if (typeof error === 'object' && error && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } };
        return apiError.response?.data?.message || fallback;
    }

    return fallback;
}

function validateForm(form: PropertyFormState) {
    if (!form.title.trim()) return 'Titlul proprietății este obligatoriu.';
    if (!form.city.trim()) return 'Orașul este obligatoriu.';
    if (!form.country.trim()) return 'Țara este obligatorie.';
    if (!form.address.trim()) return 'Adresa este obligatorie.';
    if (!form.image.trim()) return 'Imaginea principală este obligatorie.';
    if (!form.price.trim() || Number(form.price) <= 0) return 'Prețul pe noapte trebuie să fie mai mare decât 0.';
    if (Number(form.maxGuests) < 1) return 'Capacitatea minimă este 1 oaspete.';
    if (Number(form.bedrooms) < 1) return 'Proprietatea trebuie să aibă cel puțin un dormitor.';
    if (Number(form.bathrooms) < 1) return 'Proprietatea trebuie să aibă cel puțin o baie.';
    if (Number(form.area) < 10) return 'Suprafața minimă este 10 mp.';
    if (!form.availableFrom || !form.availableTo) return 'Perioada de disponibilitate este obligatorie.';
    if (form.availableTo < form.availableFrom) return 'Data de check-out trebuie să fie după check-in.';
    if (!form.description.trim()) return 'Descrierea este obligatorie.';
    return '';
}

async function readFileAsDataUrl(file: File) {
    return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result ?? ''));
        reader.onerror = () => reject(new Error('Fișierul nu a putut fi citit.'));
        reader.readAsDataURL(file);
    });
}

const MyProperties: React.FC = () => {
    const navigate = useNavigate();
    const session = getSession();
    const [properties, setProperties] = useState<ManagedProperty[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState<PropertyFormState>(createEmptyForm());
    const [galleryImages, setGalleryImages] = useState<string[]>([]);
    const [galleryUrlDraft, setGalleryUrlDraft] = useState('');
    const [message, setMessage] = useState<MessageState>(null);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<ManagedProperty | null>(null);

    const loadProperties = async () => {
        if (!session?.email) return;

        try {
            const data = await propertyService.getManagedByOwner(session.email);
            setProperties(data);
        } catch {
            setProperties([]);
            setMessage({ type: 'error', text: 'Nu am putut încărca proprietățile tale.' });
        }
    };

    useEffect(() => {
        if (!session?.email) {
            navigate('/401');
            return;
        }

        void loadProperties();
    }, [navigate, session?.email]);

    useEffect(() => {
        if (!message) {
            return undefined;
        }

        const timeoutId = window.setTimeout(() => setMessage(null), 3600);
        return () => window.clearTimeout(timeoutId);
    }, [message]);

    const resetEditor = () => {
        setEditingId(null);
        setForm(createEmptyForm());
        setGalleryImages([]);
        setGalleryUrlDraft('');
        setMessage(null);
    };

    const startEditing = (property: ManagedProperty) => {
        setEditingId(property.id);
        setForm(toForm(property));
        setGalleryImages(property.galleryImages);
        setGalleryUrlDraft('');
        setMessage(null);
    };

    const updateForm = (field: keyof PropertyFormState, value: string) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const handleMainImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        try {
            const image = await readFileAsDataUrl(file);
            updateForm('image', image);
            setMessage({ type: 'success', text: 'Imaginea principală a fost încărcată din laptop.' });
        } catch {
            setMessage({ type: 'error', text: 'Nu am putut încărca imaginea principală.' });
        } finally {
            event.target.value = '';
        }
    };

    const handleGalleryUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);
        if (files.length === 0) {
            return;
        }

        try {
            const uploaded = await Promise.all(files.map(readFileAsDataUrl));
            setGalleryImages((current) => Array.from(new Set([...current, ...uploaded])));
            setMessage({ type: 'success', text: 'Imaginile de galerie au fost adăugate.' });
        } catch {
            setMessage({ type: 'error', text: 'Nu am putut încărca toate imaginile selectate.' });
        } finally {
            event.target.value = '';
        }
    };

    const addGalleryUrl = () => {
        const trimmed = galleryUrlDraft.trim();
        if (!trimmed) {
            return;
        }

        setGalleryImages((current) => (current.includes(trimmed) ? current : [...current, trimmed]));
        setGalleryUrlDraft('');
    };

    const removeGalleryImage = (image: string) => {
        setGalleryImages((current) => current.filter((item) => item !== image));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const validationError = validateForm(form);
        if (validationError) {
            setMessage({ type: 'error', text: validationError });
            return;
        }

        if (!session?.email) {
            navigate('/login');
            return;
        }

        try {
            setSaving(true);
            setMessage(null);

            const saved = await propertyService.saveManagedProperty({
                id: editingId ?? undefined,
                ownerEmail: session.email,
                host: session.fullName,
                title: form.title.trim(),
                city: form.city.trim(),
                country: form.country.trim(),
                address: form.address.trim(),
                price: Number(form.price),
                image: form.image.trim(),
                galleryImages,
                features: parseList(form.features),
                badge: form.badge.trim() || undefined,
                maxGuests: Number(form.maxGuests),
                bedrooms: Number(form.bedrooms),
                bathrooms: Number(form.bathrooms),
                area: Number(form.area),
                availableFrom: form.availableFrom,
                availableTo: form.availableTo,
                description: form.description.trim(),
                descriptionExtra: form.descriptionExtra.trim(),
                isApproved: editingId ? (properties.find(p => p.id === editingId)?.isApproved ?? false) : false,
            });

            await loadProperties();
            startEditing(saved);
            setMessage({
                type: 'success',
                text: editingId ? 'Proprietatea a fost actualizată.' : 'Proprietatea a fost publicată cu succes.',
            });
        } catch (error) {
            setMessage({ type: 'error', text: normalizeApiError(error, 'Nu am putut salva proprietatea.') });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (property: ManagedProperty) => {
        if (!session?.email) {
            navigate('/login');
            return;
        }

        try {
            setDeletingId(property.id);
            setDeleteTarget(null);
            setMessage(null);
            await propertyService.deleteManagedProperty(property.id, session.email);
            await loadProperties();

            if (editingId === property.id) {
                resetEditor();
            }

            setMessage({ type: 'success', text: `Proprietatea "${property.title}" a fost ștearsă.` });
        } catch (error) {
            setMessage({ type: 'error', text: normalizeApiError(error, 'Nu am putut șterge proprietatea.') });
        } finally {
            setDeletingId(null);
        }
    };

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
                        <button className="mp-nav-item active">Cazările mele</button>
                        <button className="mp-nav-item" onClick={() => navigate('/bookings')}>Rezervările mele</button>
                    </nav>
                </aside>

                <main className="mp-main">
                    <div className="mp-tab-content">
                        <div className="mp-tab-header">
                            <h1>Administrare cazări</h1>
                            <p>Acum poți adăuga proprietatea mai ușor și poți folosi imagini din link sau direct din laptop.</p>
                        </div>

                        {message && (
                            <div className={`ap-message ap-message--${message.type}`}>
                                {message.text}
                            </div>
                        )}

                        <div className="ap-summary">
                            <div className="ap-summary-card">
                                <span className="ap-summary-label">Proprietăți publicate</span>
                                <strong>{properties.length}</strong>
                            </div>
                            <div className="ap-summary-card">
                                <span className="ap-summary-label">Mod editor</span>
                                <strong>{editingId ? 'Editare' : 'Adăugare'}</strong>
                            </div>
                            <div className="ap-summary-card">
                                <span className="ap-summary-label">Imagini galerie</span>
                                <strong>{galleryImages.length}</strong>
                            </div>
                        </div>

                        <div className="ap-layout">
                            <section className="ap-list">
                                <div className="ap-panel-head">
                                    <div>
                                        <h2>Proprietățile tale</h2>
                                        <span>Selectează una pentru editare sau adaugă una nouă.</span>
                                    </div>
                                    <button type="button" className="ap-primary-btn" onClick={resetEditor}>
                                        Cazare nouă
                                    </button>
                                </div>

                                <div className="ap-cards">
                                    {properties.length === 0 ? (
                                        <div className="ap-empty">
                                            <div className="ap-empty-icon">Casa</div>
                                            <h3>Nu ai proprietăți publicate</h3>
                                            <p>Completează formularul de mai jos și publică prima ta cazare.</p>
                                        </div>
                                    ) : (
                                        properties.map((property) => (
                                            <ManagedPropertyCard 
                                                key={property.id} 
                                                property={property}
                                                isEditing={editingId === property.id}
                                                deletingId={deletingId}
                                                onView={(id) => navigate(`/property/${id}`)}
                                                onEdit={startEditing}
                                                onDelete={setDeleteTarget}
                                            />
                                        ))
                                    )}
                                </div>
                            </section>

                            <section className="ap-editor">
                                <div className="ap-panel-head">
                                    <div>
                                        <h2>{editingId ? 'Editează cazarea' : 'Adaugă o cazare nouă'}</h2>
                                        <span>Completează câmpurile esențiale și adaugă poze direct din laptop sau prin link.</span>
                                    </div>
                                </div>

                                <form className="ap-form" onSubmit={handleSubmit}>
                                    <div className="ap-form-section">
                                        <h3 className="ap-form-section-title">Date principale</h3>
                                        <div className="ap-grid">
                                            <label className="ap-field ap-field--full">
                                                <span>Titlu proprietate</span>
                                                <input value={form.title} onChange={(event) => updateForm('title', event.target.value)} placeholder="Ex: Apartament modern in centrul orasului" />
                                            </label>
                                            <label className="ap-field">
                                                <span>Oraș</span>
                                                <input value={form.city} onChange={(event) => updateForm('city', event.target.value)} placeholder="Ex: Chisinau" />
                                            </label>
                                            <label className="ap-field">
                                                <span>Țară</span>
                                                <input value={form.country} onChange={(event) => updateForm('country', event.target.value)} placeholder="Ex: Moldova" />
                                            </label>
                                            <label className="ap-field ap-field--full">
                                                <span>Adresa</span>
                                                <input value={form.address} onChange={(event) => updateForm('address', event.target.value)} placeholder="Strada, numar, sector" />
                                            </label>
                                            <label className="ap-field">
                                                <span>Preț pe noapte</span>
                                                <input type="number" min="1" value={form.price} onChange={(event) => updateForm('price', event.target.value)} />
                                            </label>
                                            <label className="ap-field">
                                                <span>Badge opțional</span>
                                                <input value={form.badge} onChange={(event) => updateForm('badge', event.target.value)} placeholder="Ex: Popular" />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="ap-form-section">
                                        <h3 className="ap-form-section-title">Imagine principală</h3>
                                        <div className="ap-grid">
                                            <label className="ap-field ap-field--full">
                                                <span>Link imagine</span>
                                                <input value={form.image} onChange={(event) => updateForm('image', event.target.value)} placeholder="https://... sau lasă gol și încarcă din laptop" />
                                                <small className="ap-field-help">Poți folosi fie un URL, fie fișierul încărcat mai jos.</small>
                                            </label>
                                            <label className="ap-field ap-field--full">
                                                <span>Încarcă din laptop</span>
                                                <input type="file" accept="image/*" onChange={handleMainImageUpload} />
                                            </label>
                                        </div>

                                        {form.image && (
                                            <div className="ap-media-preview">
                                                <img src={form.image} alt="Preview imagine principală" className="ap-media-preview-image" />
                                                <div className="ap-media-preview-body">
                                                    <strong>Preview imagine principală</strong>
                                                    <p>Imaginea de mai sus va fi afișată în listări și în pagina detaliată.</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="ap-form-section">
                                        <h3 className="ap-form-section-title">Galerie foto</h3>
                                        <div className="ap-gallery-toolbar">
                                            <input
                                                className="ap-gallery-input"
                                                value={galleryUrlDraft}
                                                onChange={(event) => setGalleryUrlDraft(event.target.value)}
                                                placeholder="Adaugă un link de imagine și apasă butonul"
                                            />
                                            <button type="button" className="ap-secondary-btn" onClick={addGalleryUrl}>Adaugă link</button>
                                        </div>
                                        <label className="ap-field">
                                            <span>Încarcă mai multe imagini din laptop</span>
                                            <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} />
                                        </label>

                                        {galleryImages.length > 0 && (
                                            <div className="ap-gallery-list">
                                                {galleryImages.map((image) => (
                                                    <GalleryImageItem 
                                                        key={image} 
                                                        image={image} 
                                                        onRemove={removeGalleryImage} 
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="ap-form-section">
                                        <h3 className="ap-form-section-title">Capacitate și disponibilitate</h3>
                                        <div className="ap-grid">
                                            <label className="ap-field">
                                                <span>Nr. oaspeți</span>
                                                <input type="number" min="1" value={form.maxGuests} onChange={(event) => updateForm('maxGuests', event.target.value)} />
                                            </label>
                                            <label className="ap-field">
                                                <span>Dormitoare</span>
                                                <input type="number" min="1" value={form.bedrooms} onChange={(event) => updateForm('bedrooms', event.target.value)} />
                                            </label>
                                            <label className="ap-field">
                                                <span>Băi</span>
                                                <input type="number" min="1" value={form.bathrooms} onChange={(event) => updateForm('bathrooms', event.target.value)} />
                                            </label>
                                            <label className="ap-field">
                                                <span>Suprafața (mp)</span>
                                                <input type="number" min="10" value={form.area} onChange={(event) => updateForm('area', event.target.value)} />
                                            </label>
                                            <label className="ap-field">
                                                <span>Disponibil din</span>
                                                <input type="date" value={form.availableFrom} onChange={(event) => updateForm('availableFrom', event.target.value)} />
                                            </label>
                                            <label className="ap-field">
                                                <span>Disponibil până la</span>
                                                <input type="date" value={form.availableTo} onChange={(event) => updateForm('availableTo', event.target.value)} />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="ap-form-section">
                                        <h3 className="ap-form-section-title">Descriere și facilități</h3>
                                        <div className="ap-grid">
                                            <label className="ap-field ap-field--full">
                                                <span>Facilități</span>
                                                <textarea
                                                    rows={3}
                                                    value={form.features}
                                                    onChange={(event) => updateForm('features', event.target.value)}
                                                    placeholder="Ex: WiFi, Parcare, Aer conditionat"
                                                />
                                                <small className="ap-field-help">Separi facilitățile prin virgulă sau pe linii diferite.</small>
                                            </label>
                                            <label className="ap-field ap-field--full">
                                                <span>Descriere scurta</span>
                                                <textarea rows={4} value={form.description} onChange={(event) => updateForm('description', event.target.value)} />
                                            </label>
                                            <label className="ap-field ap-field--full">
                                                <span>Descriere extinsa</span>
                                                <textarea rows={5} value={form.descriptionExtra} onChange={(event) => updateForm('descriptionExtra', event.target.value)} />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="ap-form-actions">
                                        <button type="button" className="ap-secondary-btn" onClick={resetEditor}>Resetează</button>
                                        <button type="submit" className="ap-primary-btn" disabled={saving}>
                                            {saving ? 'Se salvează...' : editingId ? 'Salvează modificările' : 'Publică proprietatea'}
                                        </button>
                                    </div>
                                </form>
                            </section>
                        </div>
                    </div>
                </main>
            </div>

            {message && (
                <div className={`ap-toast ap-toast--${message.type}`} role="status" aria-live="polite">
                    <div className="ap-toast-title">{message.type === 'success' ? 'Acțiune reușită' : 'Atenție'}</div>
                    <div className="ap-toast-text">{message.text}</div>
                    <button type="button" className="ap-toast-close" onClick={() => setMessage(null)}>x</button>
                </div>
            )}

            {deleteTarget && (
                <div className="ap-dialog-backdrop" onClick={() => setDeleteTarget(null)}>
                    <div className="ap-dialog" onClick={(event) => event.stopPropagation()}>
                        <h3>Ștergi această proprietate?</h3>
                        <p>
                            Proprietatea <strong>{deleteTarget.title}</strong> va fi eliminată din listă și din bază de date.
                        </p>
                        <div className="ap-dialog-card">
                            <img src={deleteTarget.image} alt={deleteTarget.title} className="ap-dialog-image" />
                            <div>
                                <strong>{deleteTarget.title}</strong>
                                <span>{deleteTarget.city}, {deleteTarget.country}</span>
                            </div>
                        </div>
                        <div className="ap-dialog-actions">
                            <button type="button" className="ap-secondary-btn" onClick={() => setDeleteTarget(null)}>
                                Anulează
                            </button>
                            <button
                                type="button"
                                className="ap-danger-btn"
                                onClick={() => handleDelete(deleteTarget)}
                                disabled={deletingId === deleteTarget.id}
                            >
                                {deletingId === deleteTarget.id ? 'Se șterge...' : 'Da, șterge'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default MyProperties;
