// types/index.ts
export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departureAirport: string;
  departureIata: string;
  departureCity: string;
  arrivalAirport: string;
  arrivalIata: string;
  arrivalCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  aircraft?: string;
  bookingLink?: string;
}

export interface FlightStatus {
  flightDesignator: {
    carrierCode: string;
    flightNumber: string;
  };
  flightStatus: string;
  departure: {
    iataCode: string;
    scheduledTimeUtc: string;
    estimatedTimeUtc?: string;
    actualTimeUtc?: string;
    terminal?: string;
    gate?: string;
  };
  arrival: {
    iataCode: string;
    scheduledTimeUtc: string;
    estimatedTimeUtc?: string;
    actualTimeUtc?: string;
    terminal?: string;
    gate?: string;
  };
  remarks?: string;
}

export interface Booking {
  id: string;
  userId: string;
  flightId: string;
  passengerDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  paymentStatus: 'pending' | 'completed' | 'failed';
  bookingReference: string;
  createdAt: string;
  updatedAt: string;
}