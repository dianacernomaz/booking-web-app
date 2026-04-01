import axios from 'axios';
import { getApiClient } from '../api/httpClient';

export interface ManagedProperty {
    id: number;
    ownerEmail: string;
    host: string;
    title: string;
    city: string;
    country: string;
    address: string;
    price: number;
    image: string;
    galleryImages: string[];
    features: string[];
    badge?: string;
    maxGuests: number;
    bedrooms: number;
    bathrooms: number;
    area: number;
    availableFrom: string;
    availableTo: string;
    description: string;
    descriptionExtra: string;
    createdAt: string;
    updatedAt: string;
}

export interface ManagedPropertySummary {
    id: number;
    title: string;
    location: string;
    city: string;
    category: string;
    price: number;
    rating: number;
    reviews: number;
    image: string;
    features: string[];
    isFavorite: boolean;
    badge?: string;
    maxGuests: number;
    availableFrom: string;
    availableTo: string;
}

const CUSTOM_PROPERTIES_KEY = 'sb_host_properties';
const PROPERTIES_CHANGED_EVENT = 'sb_properties_changed';

function readManagedProperties() {
    const raw = localStorage.getItem(CUSTOM_PROPERTIES_KEY);
    if (!raw) return [] as ManagedProperty[];

    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? (parsed as ManagedProperty[]) : [];
    } catch {
        return [];
    }
}

function writeManagedProperties(properties: ManagedProperty[]) {
    localStorage.setItem(CUSTOM_PROPERTIES_KEY, JSON.stringify(properties));
    window.dispatchEvent(new Event(PROPERTIES_CHANGED_EVENT));
}

function buildLocation(property: Pick<ManagedProperty, 'city' | 'country'>) {
    return [property.city, property.country].filter(Boolean).join(', ');
}

function normalizeText(value: string) {
    return value.trim().toLowerCase();
}

function inferCategory(property: Pick<ManagedProperty, 'title' | 'features'>) {
    const text = normalizeText(`${property.title} ${property.features.join(' ')}`);
    if (text.includes('hotel') || text.includes('suite') || text.includes('resort')) return 'hotels';
    if (text.includes('apartament') || text.includes('studio') || text.includes('penthouse')) return 'apartments';
    if (text.includes('vil')) return 'villas';
    if (text.includes('caban')) return 'cabins';
    if (text.includes('plaj') || text.includes('mare')) return 'beach';
    return 'all';
}

function uniqueStrings(values: string[]) {
    return Array.from(new Set(values.filter(Boolean)));
}

function extractError(error: unknown, fallback: string) {
    if (axios.isAxiosError<{ message?: string }>(error)) {
        return error.response?.data?.message || fallback;
    }

    return fallback;
}

export function getManagedProperties() {
    return readManagedProperties();
}

export async function refreshManagedProperties(ownerEmail?: string) {
    const { data } = await getApiClient().get<ManagedProperty[]>('/properties', {
        params: ownerEmail ? { ownerEmail } : undefined,
    });

    if (!ownerEmail) {
        writeManagedProperties(data);
        return data;
    }

    const current = readManagedProperties();
    const filteredCurrent = current.filter((property) => property.ownerEmail !== ownerEmail);
    writeManagedProperties([...filteredCurrent, ...data]);
    return data;
}

export function getManagedPropertiesForOwner(ownerEmail: string) {
    return readManagedProperties().filter((property) => property.ownerEmail === ownerEmail);
}

export function getManagedPropertyById(id: number) {
    return readManagedProperties().find((property) => property.id === id) ?? null;
}

export function toManagedPropertySummary(property: ManagedProperty): ManagedPropertySummary {
    return {
        id: property.id,
        title: property.title,
        location: buildLocation(property),
        city: property.city,
        category: inferCategory(property),
        price: property.price,
        rating: 0,
        reviews: 0,
        image: property.image,
        features: property.features,
        isFavorite: false,
        badge: property.badge || 'Gazda noua',
        maxGuests: property.maxGuests,
        availableFrom: property.availableFrom,
        availableTo: property.availableTo,
    };
}

export function getManagedPropertySummaries() {
    return readManagedProperties().map(toManagedPropertySummary);
}

export function toManagedPropertyDetail(property: ManagedProperty) {
    const images = uniqueStrings([property.image, ...property.galleryImages]);
    const amenities = uniqueStrings(property.features).map((label) => ({
        icon: '✓',
        label,
        available: true,
    }));

    return {
        id: property.id,
        title: property.title,
        location: buildLocation(property),
        city: property.city,
        country: property.country,
        address: property.address,
        price: property.price,
        priceOriginal: Math.round(property.price * 1.15),
        rating: 0,
        reviews: 0,
        images,
        features: property.features,
        badge: property.badge || 'Gazda noua',
        maxGuests: property.maxGuests,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area: property.area,
        availableFrom: property.availableFrom,
        availableTo: property.availableTo,
        description: property.description,
        descriptionExtra: property.descriptionExtra,
        host: property.host,
        amenities,
        occupiedDays: [] as number[],
        reviewsList: [] as { name: string; date: string; rating: number; color: string; text: string }[],
        nearby: [
            { icon: '📍', name: property.address, dist: 'La locatie' },
            { icon: '🏙️', name: `Centru ${property.city}`, dist: '1.2 km' },
            { icon: '🛒', name: 'Supermarket', dist: '700 m' },
            { icon: '🍽️', name: 'Restaurant', dist: '450 m' },
        ],
    };
}

export async function saveManagedProperty(
    property: Omit<ManagedProperty, 'id' | 'createdAt' | 'updatedAt'> & { id?: number },
) {
    try {
        const response = property.id
            ? await getApiClient().put<ManagedProperty>(`/properties/${property.id}`, property)
            : await getApiClient().post<ManagedProperty>('/properties', property);

        const current = readManagedProperties().filter((item) => item.id !== response.data.id);
        writeManagedProperties([...current, response.data]);
        return response.data;
    } catch {
        return null;
    }
}

export async function deleteManagedProperty(id: number, ownerEmail: string) {
    try {
        await getApiClient().delete(`/properties/${id}`, {
            params: { ownerEmail },
        });

        const nextProperties = readManagedProperties().filter((property) => property.id !== id);
        writeManagedProperties(nextProperties);
        return true;
    } catch {
        return false;
    }
}

export async function reassignManagedPropertiesOwner(
    previousEmail: string,
    nextEmail: string,
    nextHost: string,
) {
    const nextProperties = readManagedProperties().map((property) =>
        property.ownerEmail === previousEmail
            ? {
                ...property,
                ownerEmail: nextEmail,
                host: nextHost,
                updatedAt: new Date().toISOString(),
            }
            : property,
    );

    writeManagedProperties(nextProperties);
    await refreshManagedProperties();
}

export async function deleteManagedPropertiesForOwner(ownerEmail: string) {
    const deletions = readManagedProperties()
        .filter((property) => property.ownerEmail === ownerEmail)
        .map((property) => deleteManagedProperty(property.id, ownerEmail));

    await Promise.all(deletions);
}

export function getManagedPropertiesErrorMessage(error: unknown) {
    return extractError(error, 'Nu am putut sincroniza proprietatile.');
}
