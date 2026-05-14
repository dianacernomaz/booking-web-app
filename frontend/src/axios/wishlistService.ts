import type { ManagedPropertySummary } from '../types/managedProperties';
import { axiosClient } from './axiosClient';

export interface ToggleWishlistResponse {
  message: string;
}

export const wishlistService = {
  getWishlist: async (email: string): Promise<ManagedPropertySummary[]> => {
    try {
      const response = await axiosClient.get<ManagedPropertySummary[]>(`/api/Wishlist?email=${encodeURIComponent(email)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      throw error;
    }
  },

  toggleWishlist: async (email: string, propertyId: number): Promise<ToggleWishlistResponse> => {
    try {
      const response = await axiosClient.post<ToggleWishlistResponse>('/api/Wishlist/toggle', {
        email,
        propertyId
      });
      return response.data;
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      throw error;
    }
  }
};
