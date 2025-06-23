import { Flight } from './flight';
import { User } from './user'; // Assuming User type is defined in types/user.ts

export interface Booking {
    id: string;
    flightId: string;
    userId: string;
    seatNumber: string;
    status: 'pending' | 'confirmed' | 'canceled';
    createdAt: string; // Supabase returns timestamps as strings
    updatedAt: string;
}

export interface BookingDetails {
    booking: Booking;
    flight: Flight; // Assuming Flight type is defined in types/flight.ts
    user: User; // Assuming User type is defined in types/user.ts
}

export interface CreateBookingInput {
    flightId: string;
    userId: string;
    seatNumber: string;
}

export interface UpdateBookingInput {
    id: string;
    status?: 'pending' | 'confirmed' | 'canceled';
    seatNumber?: string;
}