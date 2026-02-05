import { Event } from "./events";

export interface Reservation {
    id: string;
    userId: string;
    eventId: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELED';
    event?: Event;
}

export interface CreateReservationFormData {
    eventId: string;
}
