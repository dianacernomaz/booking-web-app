import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import GalleryImageItem from '../components/GalleryImageItem';
import { authService } from '../auth/authService';
import { propertyService } from '../axios/propertyService';
import type { ManagedProperty } from '../types/managedProperties';
import '../assets/css/Home.css';
import '../assets/css/MyProfile.css';
import '../assets/css/AdminProperties.css';

interface PropertyFormState {
    host: string;
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

function createEmptyForm(): PropertyFormState {
    return {
        host: '',
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
        availableFrom: '',
        availableTo: '',
        description: '',
        descriptionExtra: '',
        features: '',
    };
}

function toForm(property: ManagedProperty): PropertyFormState {
    return {
        host: property.host,
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
    if (!form.host.trim()) return 'Numele gazdei este obligatoriu.';
    if (!form.title.trim()) return 'Titlul proprietatii este obligatoriu.';
    if (!form.city.trim()) return 'Orasul este obligatoriu.';
    if (!form.country.trim()) return 'Tara este obligatorie.';
    if (!form.address.trim()) return 'Adresa este obligatorie.';
    if (!form.image.trim()) return 'Imaginea principala este obligatorie.';
    if (!form.price.trim() || Number(form.price) <= 0) return 'Pretul pe noapte trebuie sa fie mai mare decat 0.';
    if (Number(form.maxGuests) < 1) return 'Capacitatea minima este 1 oaspete.';
    if (Number(form.bedrooms) < 1) return 'Proprietatea trebuie sa aiba cel putin un dormitor.';
    if (Number(form.bathrooms) < 1) return 'Proprietatea trebuie sa aiba cel putin o baie.';
    if (Number(form.area) < 10) return 'Suprafata minima este 10 mp.';
    if (!form.availableFrom || !form.availableTo) return 'Perioada de disponibilitate este obligatorie.';
    if (form.availableTo < form.availableFrom) return 'Data finala trebuie sa fie dupa data de inceput.';
    if (!form.description.trim()) return 'Descrierea este obligatorie.';
    return '';
}

async function readFileAsDataUrl(file: File) {
    return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result ?? ''));
        reader.onerror = () => reject(new Error('Fisierul nu a putut fi citit.'));
        reader.readAsDataURL(file);
    });
}

const AdminPropertyEditor: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [property, setProperty] = useState<ManagedProperty | null>(null);
    const [form, setForm] = useState<PropertyFormState>(createEmptyForm());
    const [galleryImages, setGalleryImages] = useState<string[]>([]);
    const [galleryUrlDraft, setGalleryUrlDraft] = useState('');
    const [message, setMessage] = useState<MessageState>(null);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    const propertyId = Number(id);

    const loadProperty = async () => {
        const session = authService.getSession();
        if (!session || session.role !== 'admin') {
            navigate('/403');
            return;
        }

        const items = await propertyService.getAdminAll();
        const current = items.find((item) => item.id === propertyId) || null;

        if (!current) {
            navigate('/404');
            return;
        }

        setProperty(current);
        setForm(toForm(current));
        setGalleryImages(current.galleryImages);
    };

    useEffect(() => {
        if (!propertyId) {
            navigate('/404');
            return;
        }

        void loadProperty().finally(() => setLoading(false));
    }, [navigate, propertyId]);

    useEffect(() => {
        if (!message) {
            return undefined;
        }

        const timeoutId = window.setTimeout(() => setMessage(null), 3600);
        return () => window.clearTimeout(timeoutId);
    }, [message]);

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
            setMessage({ type: 'success', text: 'Imaginea principala a fost actualizata.' });
        } catch {
            setMessage({ type: 'error', text: 'Nu am putut incarca imaginea principala.' });
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
            setMessage({ type: 'success', text: 'Imaginile de galerie au fost adaugate.' });
        } catch {
            setMessage({ type: 'error', text: 'Nu am putut incarca toate imaginile selectate.' });
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
        if (!property) {
            return;
        }

        const validationError = validateForm(form);
        if (validationError) {
            setMessage({ type: 'error', text: validationError });
            return;
        }

        try {
            setSaving(true);
            setMessage(null);

            const saved = await propertyService.updateManagedPropertyAsAdmin(property.id, {
                ownerEmail: property.ownerEmail,
                host: form.host.trim(),
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
                isApproved: property.isApproved,
            });

            setProperty(saved);
            setForm(toForm(saved));
            setGalleryImages(saved.galleryImages);
            setMessage({ type: 'success', text: 'Proprietatea a fost actualizata.' });
        } catch (error) {
            setMessage({ type: 'error', text: normalizeApiError(error, 'Nu am putut salva modificarile.') });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="loading">Se incarca proprietatea...</div>;
    }

    if (!property) {
        return null;
    }

    return (
        <div className="home">
            <Header />
            <div className="mp-page mp-page--single">
                <main className="mp-main mp-main--full">
                    <div className="mp-tab-content">
                        <div className="mp-tab-header">
                            <h1>Editeaza proprietate</h1>
                            <p>Modifici proprietatea ca administrator pentru {property.ownerEmail}.</p>
                        </div>

                        {message && <div className={`ap-message ap-message--${message.type}`}>{message.text}</div>}

                        <div className="ap-summary ap-summary--editor">
                            <div className="ap-summary-card">
                                <span className="ap-summary-label">Proprietar</span>
                                <strong>{property.ownerEmail}</strong>
                            </div>
                            <div className="ap-summary-card">
                                <span className="ap-summary-label">Status</span>
                                <strong>{property.isApproved ? 'Aprobata' : 'Draft'}</strong>
                            </div>
                            <div className="ap-summary-card">
                                <span className="ap-summary-label">Imagini galerie</span>
                                <strong>{galleryImages.length}</strong>
                            </div>
                        </div>

                        <section className="ap-editor">
                            <div className="ap-panel-head">
                                <div>
                                    <h2>Formular proprietate</h2>
                                    <span>Actualizeaza campurile de mai jos si salveaza modificarile.</span>
                                </div>
                                <button type="button" className="ap-secondary-btn" onClick={() => navigate('/admin')}>
                                    Inapoi la admin
                                </button>
                            </div>

                            <form className="ap-form" onSubmit={handleSubmit}>
                                <div className="ap-form-section">
                                    <h3 className="ap-form-section-title">Date principale</h3>
                                    <div className="ap-grid">
                                        <label className="ap-field">
                                            <span>Gazda</span>
                                            <input value={form.host} onChange={(event) => updateForm('host', event.target.value)} />
                                        </label>
                                        <label className="ap-field ap-field--full">
                                            <span>Titlu proprietate</span>
                                            <input value={form.title} onChange={(event) => updateForm('title', event.target.value)} placeholder="Ex: Apartament modern in centrul orasului" />
                                        </label>
                                        <label className="ap-field">
                                            <span>Oras</span>
                                            <input value={form.city} onChange={(event) => updateForm('city', event.target.value)} placeholder="Ex: Chisinau" />
                                        </label>
                                        <label className="ap-field">
                                            <span>Tara</span>
                                            <input value={form.country} onChange={(event) => updateForm('country', event.target.value)} placeholder="Ex: Moldova" />
                                        </label>
                                        <label className="ap-field ap-field--full">
                                            <span>Adresa</span>
                                            <input value={form.address} onChange={(event) => updateForm('address', event.target.value)} placeholder="Strada, numar, sector" />
                                        </label>
                                        <label className="ap-field">
                                            <span>Pret pe noapte</span>
                                            <input type="number" min="1" value={form.price} onChange={(event) => updateForm('price', event.target.value)} />
                                        </label>
                                        <label className="ap-field">
                                            <span>Badge optional</span>
                                            <input value={form.badge} onChange={(event) => updateForm('badge', event.target.value)} placeholder="Ex: Popular" />
                                        </label>
                                    </div>
                                </div>

                                <div className="ap-form-section">
                                    <h3 className="ap-form-section-title">Imagine principala</h3>
                                    <div className="ap-grid">
                                        <label className="ap-field ap-field--full">
                                            <span>Link imagine</span>
                                            <input value={form.image} onChange={(event) => updateForm('image', event.target.value)} placeholder="https://... sau incarca din laptop" />
                                        </label>
                                        <label className="ap-field ap-field--full">
                                            <span>Incarca din laptop</span>
                                            <input type="file" accept="image/*" onChange={handleMainImageUpload} />
                                        </label>
                                    </div>

                                    {form.image && (
                                        <div className="ap-media-preview">
                                            <img src={form.image} alt="Preview imagine principala" className="ap-media-preview-image" />
                                            <div className="ap-media-preview-body">
                                                <strong>Preview imagine principala</strong>
                                                <p>Imaginea de mai sus va fi afisata in listari si in pagina detaliata.</p>
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
                                            placeholder="Adauga un link de imagine"
                                        />
                                        <button type="button" className="ap-secondary-btn" onClick={addGalleryUrl}>Adauga link</button>
                                    </div>
                                    <label className="ap-field">
                                        <span>Incarca mai multe imagini din laptop</span>
                                        <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} />
                                    </label>

                                    {galleryImages.length > 0 && (
                                        <div className="ap-gallery-list">
                                            {galleryImages.map((image) => (
                                                <GalleryImageItem key={image} image={image} onRemove={removeGalleryImage} />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="ap-form-section">
                                    <h3 className="ap-form-section-title">Capacitate si disponibilitate</h3>
                                    <div className="ap-grid">
                                        <label className="ap-field">
                                            <span>Nr. oaspeti</span>
                                            <input type="number" min="1" value={form.maxGuests} onChange={(event) => updateForm('maxGuests', event.target.value)} />
                                        </label>
                                        <label className="ap-field">
                                            <span>Dormitoare</span>
                                            <input type="number" min="1" value={form.bedrooms} onChange={(event) => updateForm('bedrooms', event.target.value)} />
                                        </label>
                                        <label className="ap-field">
                                            <span>Bai</span>
                                            <input type="number" min="1" value={form.bathrooms} onChange={(event) => updateForm('bathrooms', event.target.value)} />
                                        </label>
                                        <label className="ap-field">
                                            <span>Suprafata (mp)</span>
                                            <input type="number" min="10" value={form.area} onChange={(event) => updateForm('area', event.target.value)} />
                                        </label>
                                        <label className="ap-field">
                                            <span>Disponibil din</span>
                                            <input type="date" value={form.availableFrom} onChange={(event) => updateForm('availableFrom', event.target.value)} />
                                        </label>
                                        <label className="ap-field">
                                            <span>Disponibil pana la</span>
                                            <input type="date" value={form.availableTo} onChange={(event) => updateForm('availableTo', event.target.value)} />
                                        </label>
                                    </div>
                                </div>

                                <div className="ap-form-section">
                                    <h3 className="ap-form-section-title">Descriere si facilitati</h3>
                                    <div className="ap-grid">
                                        <label className="ap-field ap-field--full">
                                            <span>Facilitati</span>
                                            <textarea
                                                rows={3}
                                                value={form.features}
                                                onChange={(event) => updateForm('features', event.target.value)}
                                                placeholder="Ex: WiFi, Parcare, Aer conditionat"
                                            />
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
                                    <button type="button" className="ap-secondary-btn" onClick={() => navigate('/admin')}>
                                        Anuleaza
                                    </button>
                                    <button type="submit" className="ap-primary-btn" disabled={saving}>
                                        {saving ? 'Se salveaza...' : 'Salveaza modificarile'}
                                    </button>
                                </div>
                            </form>
                        </section>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default AdminPropertyEditor;
