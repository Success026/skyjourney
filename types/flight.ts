export interface Flight {
    id: string;
    airline: string;
    flightNumber: string;
    departureAirport: string;
    departureIata: string;
    arrivalAirport: string;
    arrivalIata: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    price: number;
    status: string;
    availableSeats: number;
  }
  
  export interface FlightSearchParams {
    origin: string;
    destination: string;
    departureDate?: string;
    limit?: number;
  }