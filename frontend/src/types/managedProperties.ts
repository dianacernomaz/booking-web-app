import { propertyService } from '../axios/propertyService';

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
    isApproved: boolean;
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

const PROPERTIES_CHANGED_EVENT = 'sb_properties_changed';

export async function getManagedPropertiesForOwner(ownerEmail: string) {
    return propertyService.getManagedByOwner(ownerEmail);
}

export async function getManagedPropertySummaries() {
    return propertyService.getAllSummaries();
}

export async function saveManagedProperty(
    property: Omit<ManagedProperty, 'id' | 'createdAt' | 'updatedAt'> & { id?: number }
) {
    const saved = await propertyService.saveManagedProperty(property);
    window.dispatchEvent(new Event(PROPERTIES_CHANGED_EVENT));
    return saved;
}

export async function deleteManagedProperty(id: number, ownerEmail: string) {
    await propertyService.deleteManagedProperty(id, ownerEmail);
    window.dispatchEvent(new Event(PROPERTIES_CHANGED_EVENT));
}
