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

const BOOKINGS_KEY = 'sb_bookings';
const BOOKINGS_CHANGED_EVENT = 'sb_bookings_changed';

function readBookings() {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    if (!raw) return [] as BookingRecord[];

    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? (parsed as BookingRecord[]) : [];
    } catch {
        return [];
    }
}

function writeBookings(bookings: BookingRecord[]) {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    window.dispatchEvent(new Event(BOOKINGS_CHANGED_EVENT));
}

function toDateValue(iso: string) {
    return new Date(`${iso}T00:00:00`).getTime();
}

export function getBookingStatus(checkIn: string, checkOut: string, currentStatus?: BookingStatus): BookingStatus {
    if (currentStatus === 'cancelled') return 'cancelled';

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const checkInValue = toDateValue(checkIn);
    const checkOutValue = toDateValue(checkOut);

    if (today < checkInValue) return 'upcoming';
    if (today >= checkOutValue) return 'completed';
    return 'active';
}

export function getBookingsForOwner(ownerEmail: string) {
    return readBookings()
        .filter((booking) => booking.ownerEmail === ownerEmail)
        .map((booking) => ({
            ...booking,
            status: getBookingStatus(booking.checkIn, booking.checkOut, booking.status),
        }))
        .sort((a, b) => toDateValue(b.checkIn) - toDateValue(a.checkIn));
}

export function saveBooking(input: NewBookingInput) {
    const bookings = readBookings();
    const booking: BookingRecord = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        status: getBookingStatus(input.checkIn, input.checkOut),
        ...input,
    };

    writeBookings([booking, ...bookings]);
    return booking;
}

export function cancelBooking(id: string, ownerEmail: string) {
    const bookings = readBookings().map((booking) =>
        booking.id === id && booking.ownerEmail === ownerEmail
            ? { ...booking, status: 'cancelled' as BookingStatus }
            : booking,
    );

    writeBookings(bookings);
}

export function reassignBookingsOwner(previousEmail: string, nextEmail: string) {
    if (!previousEmail || !nextEmail || previousEmail === nextEmail) return;

    const bookings = readBookings().map((booking) =>
        booking.ownerEmail === previousEmail
            ? { ...booking, ownerEmail: nextEmail }
            : booking,
    );

    writeBookings(bookings);
}

export function deleteBookingsForOwner(ownerEmail: string) {
    const filtered = readBookings().filter((booking) => booking.ownerEmail !== ownerEmail);
    writeBookings(filtered);
}

export const bookingsChangedEvent = BOOKINGS_CHANGED_EVENT;
