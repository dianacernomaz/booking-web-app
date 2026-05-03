import { axiosClient } from './axiosClient';
import type { ManagedProperty, ManagedPropertySummary } from '../types/managedProperties';

export interface PropertyDetail {
    id: number;
    title: string;
    location: string;
    city: string;
    country: string;
    address: string;
    price: number;
    priceOriginal: number;
    rating: number;
    reviews: number;
    images: string[];
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
    host: string;
    amenities: { icon: string; label: string; available: boolean }[];
    occupiedDays: number[];
    reviewsList: { name: string; date: string; rating: number; color: string; text: string }[];
    nearby: { icon: string; name: string; dist: string }[];
}

export const propertyService = {
    async getAllSummaries() {
        const { data } = await axiosClient.get<ManagedPropertySummary[]>('/properties');
        return data;
    },

    async getById(id: number) {
        const { data } = await axiosClient.get<PropertyDetail>(`/properties/${id}`);
        return data;
    },

    async getManagedByOwner(email: string) {
        const { data } = await axiosClient.get<ManagedProperty[]>('/properties/owner', {
            params: { email },
        });
        return data;
    },

    async saveManagedProperty(property: Omit<ManagedProperty, 'id' | 'createdAt' | 'updatedAt'> & { id?: number }) {
        const payload = {
            ownerEmail: property.ownerEmail,
            host: property.host,
            title: property.title,
            city: property.city,
            country: property.country,
            address: property.address,
            price: property.price,
            image: property.image,
            galleryImages: property.galleryImages,
            features: property.features,
            badge: property.badge,
            maxGuests: property.maxGuests,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            area: property.area,
            availableFrom: property.availableFrom,
            availableTo: property.availableTo,
            description: property.description,
            descriptionExtra: property.descriptionExtra,
        };

        if (property.id) {
            const { data } = await axiosClient.put<ManagedProperty>(`/properties/${property.id}`, payload);
            return data;
        }

        const { data } = await axiosClient.post<ManagedProperty>('/properties', payload);
        return data;
    },

    async search(params: { location?: string; guests?: number; checkIn?: string; checkOut?: string }) {
        const { data } = await axiosClient.get<ManagedPropertySummary[]>('/properties/search', {
            params,
        });
        return data;
    },

    async getAdminAll() {
        const { data } = await axiosClient.get<ManagedProperty[]>('/properties/admin/all');
        return data;
    },

    async approve(id: number) {
        const { data } = await axiosClient.patch(`/properties/admin/approve/${id}`);
        return data;
    },

    async reject(id: number) {
        const { data } = await axiosClient.patch(`/properties/admin/reject/${id}`);
        return data;
    },

    async updateAvailability(id: number, occupiedDays: number[]) {
        const { data } = await axiosClient.patch(`/properties/${id}/availability`, occupiedDays);
        return data;
    },

    async deleteManagedProperty(id: number, ownerEmail: string) {
        await axiosClient.delete(`/properties/${id}`, {
            params: { ownerEmail },
        });
    },
};
