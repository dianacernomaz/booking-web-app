import { axiosClient } from '../axios/axiosClient';

export interface ReviewRecord {
    id: number;
    userId: number;
    propertyId: number;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt: string;
}

export interface ReviewAverageRecord {
    rating: number;
    count: number;
}

export interface ReviewStatusRecord {
    hasReviewed: boolean;
    review?: ReviewRecord | null;
}

interface UpsertReviewInput {
    propertyId: number;
    rating: number;
    comment: string;
}

const REVIEWS_CHANGED_EVENT = 'sb_reviews_changed';

export async function getReviewsForProperty(propertyId: number) {
    const { data } = await axiosClient.get<ReviewRecord[]>(`/reviews/property/${propertyId}`);
    return data.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export async function getAverageRating(propertyId: number) {
    const { data } = await axiosClient.get<ReviewAverageRecord>(`/reviews/property/${propertyId}/average`);
    return data;
}

export async function checkPropertyReview(propertyId: number) {
    const { data } = await axiosClient.get<ReviewStatusRecord>(`/reviews/property/${propertyId}/check`);
    return data;
}

export async function addReview(input: UpsertReviewInput) {
    await axiosClient.post('/reviews', input);
    window.dispatchEvent(new Event(REVIEWS_CHANGED_EVENT));
}

export async function updateReview(id: number, input: UpsertReviewInput) {
    await axiosClient.put(`/reviews/${id}`, input);
    window.dispatchEvent(new Event(REVIEWS_CHANGED_EVENT));
}

export async function deleteReview(id: number) {
    await axiosClient.delete(`/reviews/${id}`);
    window.dispatchEvent(new Event(REVIEWS_CHANGED_EVENT));
}

export const reviewsChangedEvent = REVIEWS_CHANGED_EVENT;
