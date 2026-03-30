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
const DEFAULT_MAX_PROPERTY_ID = 6;

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
    window.dispatchEvent(new Event('sb_properties_changed'));
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

function buildAmenityList(property: ManagedProperty) {
    const featureAmenities = property.features.map((feature) => ({
        icon: '✓',
        label: feature,
        available: true,
    }));

    return uniqueStrings(featureAmenities.map((item) => item.label)).map((label) => ({
        icon: '✓',
        label,
        available: true,
    }));
}

function buildNearbyList(property: ManagedProperty) {
    return [
        { icon: '📍', name: property.address, dist: 'La locatie' },
        { icon: '🏙️', name: `Centru ${property.city}`, dist: '1.2 km' },
        { icon: '🛒', name: 'Supermarket', dist: '700 m' },
        { icon: '🍽️', name: 'Restaurant', dist: '450 m' },
    ];
}

export function getManagedProperties() {
    return readManagedProperties();
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
    const amenities = buildAmenityList(property);

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
        nearby: buildNearbyList(property),
    };
}

export function saveManagedProperty(
    property: Omit<ManagedProperty, 'id' | 'createdAt' | 'updatedAt'> & { id?: number }
) {
    const properties = readManagedProperties();
    const now = new Date().toISOString();

    if (property.id) {
        const nextProperties = properties.map((item) =>
            item.id === property.id
                ? {
                    ...item,
                    ...property,
                    badge: property.badge || undefined,
                    updatedAt: now,
                }
                : item
        );

        writeManagedProperties(nextProperties);
        return nextProperties.find((item) => item.id === property.id) ?? null;
    }

    const nextId = Math.max(
        DEFAULT_MAX_PROPERTY_ID,
        ...properties.map((item) => item.id)
    ) + 1;

    const createdProperty: ManagedProperty = {
        ...property,
        id: nextId,
        badge: property.badge || undefined,
        createdAt: now,
        updatedAt: now,
    };

    writeManagedProperties([...properties, createdProperty]);
    return createdProperty;
}

export function deleteManagedProperty(id: number, ownerEmail: string) {
    const nextProperties = readManagedProperties().filter(
        (property) => !(property.id === id && property.ownerEmail === ownerEmail)
    );
    writeManagedProperties(nextProperties);
}

export function reassignManagedPropertiesOwner(
    previousEmail: string,
    nextEmail: string,
    nextHost: string
) {
    const nextProperties = readManagedProperties().map((property) =>
        property.ownerEmail === previousEmail
            ? {
                ...property,
                ownerEmail: nextEmail,
                host: nextHost,
                updatedAt: new Date().toISOString(),
            }
            : property
    );

    writeManagedProperties(nextProperties);
}

export function deleteManagedPropertiesForOwner(ownerEmail: string) {
    const nextProperties = readManagedProperties().filter(
        (property) => property.ownerEmail !== ownerEmail
    );
    writeManagedProperties(nextProperties);
}
