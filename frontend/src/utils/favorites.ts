import { axiosClient } from '../axios/axiosClient';
import type { ManagedPropertySummary } from '../types/managedProperties';

interface FavoriteStatusDto {
    isFavorite: boolean;
}

const FAVORITES_CHANGED_EVENT = 'sb_favorites_changed';

export async function getFavoriteProperties() {
    const { data } = await axiosClient.get<ManagedPropertySummary[]>('/favorites');
    return data.map((property) => ({ ...property, isFavorite: true }));
}

export async function addFavorite(propertyId: number) {
    await axiosClient.post('/favorites', { propertyId });
    window.dispatchEvent(new Event(FAVORITES_CHANGED_EVENT));
}

export async function removeFavorite(propertyId: number) {
    await axiosClient.delete(`/favorites/${propertyId}`);
    window.dispatchEvent(new Event(FAVORITES_CHANGED_EVENT));
}

export async function checkFavorite(propertyId: number) {
    const { data } = await axiosClient.get<FavoriteStatusDto>(`/favorites/${propertyId}/check`);
    return data;
}

export const favoritesChangedEvent = FAVORITES_CHANGED_EVENT;
