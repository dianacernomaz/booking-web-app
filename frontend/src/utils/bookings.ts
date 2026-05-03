import { axiosClient } from '../axios/axiosClient';

export type BookingStatus = 'active' | 'upcoming' | 'completed' | 'cancelled';
export type PaymentMethod = 'card' | 'bank_transfer' | 'pay_on_arrival';
export type PaymentStatus = 'paid' | 'pending';

export interface BookingRecord {
    id: string;
    ownerEmail: string;
    propertyId: number;
    propertyTitle: string;
    propertyLocation: string;
    propertyImage: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    nights: number;
    total: number;
    status: BookingStatus;
    code: string;
    createdAt: string;
    paymentMethod?: PaymentMethod;
    paymentStatus?: PaymentStatus;
    paymentLabel?: string;
    paymentLast4?: string;
    paidAt?: string;
}

interface NewBookingInput {
    ownerEmail: string;
    propertyId: number;
    propertyTitle: string;
    propertyLocation: string;
    propertyImage: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    nights: number;
    total: number;
    code: string;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    paymentLabel: string;
    paymentLast4?: string;
    paidAt?: string;
}

const BOOKINGS_CHANGED_EVENT = 'sb_bookings_changed';

export function getBookingStatus(checkIn: string, checkOut: string, currentStatus?: BookingStatus): BookingStatus {
    if (currentStatus === 'cancelled') return 'cancelled';

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const checkInValue = new Date(`${checkIn}T00:00:00`).getTime();
    const checkOutValue = new Date(`${checkOut}T00:00:00`).getTime();

    if (today < checkInValue) return 'upcoming';
    if (today >= checkOutValue) return 'completed';
    return 'active';
}

export async function getBookingsForOwner(ownerEmail: string) {
    const { data } = await axiosClient.get<BookingRecord[]>('/bookings/owner', {
        params: { email: ownerEmail },
    });

    return data
        .map((booking) => ({
            ...booking,
            status: getBookingStatus(booking.checkIn, booking.checkOut, booking.status),
        }))
        .sort((a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime());
}

export async function saveBooking(input: NewBookingInput) {
    const { data } = await axiosClient.post<BookingRecord>('/bookings', input);
    window.dispatchEvent(new Event(BOOKINGS_CHANGED_EVENT));
    return data;
}

export async function getBookingsForHost(hostEmail: string) {
    const { data } = await axiosClient.get<BookingRecord[]>('/bookings/host', {
        params: { email: hostEmail },
    });

    return data
        .map((booking) => ({
            ...booking,
            status: getBookingStatus(booking.checkIn, booking.checkOut, booking.status),
        }))
        .sort((a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime());
}

export async function getAdminStats() {
    const { data } = await axiosClient.get<any>('/bookings/admin/stats');
    return data;
}

export async function cancelBooking(id: string, ownerEmail: string) {
    await axiosClient.patch(`/bookings/${id}/cancel`, undefined, {
        params: { ownerEmail },
    });
    window.dispatchEvent(new Event(BOOKINGS_CHANGED_EVENT));
}

export const bookingsChangedEvent = BOOKINGS_CHANGED_EVENT;
