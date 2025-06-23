// app/api/flights/book/route.js
import { nanoid } from 'nanoid'
import { supabase } from '../../../../lib/supabase'

export async function POST(request) {
  try {
    const bookingData = await request.json()
    const bookingReference = nanoid(6).toUpperCase()
    
    // 1. Check if flight already exists with the same flight_number and departure_date
    const { data: existingFlight, error: flightLookupError } = await supabase
      .from('flights')
      .select('id')
      .eq('flight_number', bookingData.flight_number)
      .eq('departure_date', bookingData.departure_date)
      .single()
      
    let flightId = null
    
    // 2. If flight doesn't exist, create it
    if (!existingFlight) {
      // Calculate default arrival time (2 hours after departure)
      const departureDate = new Date(bookingData.departure_date)
      const departureTime = new Date(departureDate)
      departureTime.setHours(10, 0, 0) // Default to 10:00 AM if not provided
      
      const arrivalTime = new Date(departureTime)
      arrivalTime.setHours(arrivalTime.getHours() + 2) // 2 hours flight time by default
      
      const { data: newFlight, error: createFlightError } = await supabase
        .from('flights')
        .insert({
          flight_number: bookingData.flight_number,
          airline: bookingData.airline,
          departure_airport: bookingData.departure_airport,
          arrival_airport: bookingData.arrival_airport,
          departure_time: departureTime.toISOString(),
          arrival_time: arrivalTime.toISOString(),
          departure_date: bookingData.departure_date,
          price: bookingData.price,
          duration: '2h 00m', // Default duration
          status: 'scheduled',
          aircraft: 'Boeing 737', // Default aircraft
          available_seats: 180 - bookingData.passengers, // Default seats minus booked passengers
          stops: 0
        })
        .select('id')
        .single()
      
      if (createFlightError) throw createFlightError
      flightId = newFlight.id
    } else {
      flightId = existingFlight.id
      
      // First get current available seats
      const { data: flightData } = await supabase
        .from('flights')
        .select('available_seats')
        .eq('id', flightId)
        .single()

      const newAvailableSeats = Math.max(0, (flightData?.available_seats || 0) - bookingData.passengers)

      // Then update
      await supabase
        .from('flights')
        .update({ available_seats: newAvailableSeats })
        .eq('id', flightId)
    }
    
    // 3. Create the booking with reference to the flight
    const { data: booking, error: bookingError } = await supabase
      .from('flight_bookings')
      .insert([{
        booking_reference: bookingReference,
        user_name: bookingData.user_name,
        user_email: bookingData.user_email,
        phone: bookingData.phone || null,
        flight_id: flightId, // Link to the flight
        flight_number: bookingData.flight_number,
        airline: bookingData.airline,
        departure_airport: bookingData.departure_airport,
        arrival_airport: bookingData.arrival_airport,
        departure_date: bookingData.departure_date,
        return_date: bookingData.return_date || null,
        passengers: bookingData.passengers,
        seat: bookingData.seat,
        class: bookingData.class,
        price: bookingData.price,
        status: 'confirmed'
      }])
      .select()

    if (bookingError) throw bookingError
    
    // 4. Create initial booking event
    const { error: eventError } = await supabase
      .from('booking_events')
      .insert([{
        booking_id: booking[0].id,
        status: 'confirmed',
        details: { 
          message: 'Booking created successfully',
          price: bookingData.price,
          passengers: bookingData.passengers
        },
        created_by: 'system'
      }])
    
    if (eventError) {
      console.error('Failed to create booking event:', eventError)
      // We'll still return success even if event creation fails
    }
    
    return Response.json({
      success: true,
      booking: booking[0]
    })
  } catch (error) {
    console.error('Booking error:', error)
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}