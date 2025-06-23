import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  let bookingRef = searchParams.get('bookingRef')

  if (!bookingRef) {
    return Response.json({ error: 'Booking reference is required' }, { status: 400 })
  }

  // Normalize input
  bookingRef = bookingRef.trim().toUpperCase()

  try {
    // 1. Find the booking by reference
    const { data: booking, error: bookingError } = await supabase
      .from('flight_bookings')
      .select('*')
      .eq('booking_reference', bookingRef)
      .single()

    if (bookingError || !booking) {
      return Response.json({ error: 'Booking not found' }, { status: 404 })
    }

    // 2. Find the flight by flight_id (not flight_number)
    const { data: flight, error: flightError } = await supabase
      .from('flights')
      .select('*')
      .eq('id', booking.flight_id)
      .single()

    let flightDetails = {}
    let events = []

    if (flight) {
      flightDetails = {
        departureTerminal: flight.departure_terminal || 'TBD',
        departureGate: flight.departure_gate || 'TBD',
        arrivalTerminal: flight.arrival_terminal || 'TBD',
        arrivalGate: flight.arrival_gate || 'TBD',
        status: flight.status || 'scheduled',
        delayMinutes: flight.delay_minutes || 0
      }

      // 3. Get events for this flight - using created_at instead of timestamp
      const { data: flightEvents } = await supabase
        .from('flight_events')
        .select('status, location, created_at, details')
        .eq('flight_id', flight.id)
        .order('created_at', { ascending: true })

      if (flightEvents && flightEvents.length > 0) {
        events = flightEvents.map(event => ({
          status: event.status,
          location: event.location,
          timestamp: event.created_at,
          details: event.details
        }))
      }
    }

    // 4. Get booking events
    const { data: bookingEvents } = await supabase
      .from('booking_events')
      .select('status, created_at, details')
      .eq('booking_id', booking.id)
      .order('created_at', { ascending: true })
      
    if (bookingEvents && bookingEvents.length > 0) {
      const mappedBookingEvents = bookingEvents.map(event => ({
        status: event.status,
        location: 'Booking System',
        timestamp: event.created_at,
        details: event.details,
        type: 'booking'
      }))
      events = [...events, ...mappedBookingEvents]
    }
    
    // Sort all events by timestamp
    events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

    return Response.json({
      bookingRef: booking.booking_reference,
      flightNumber: booking.flight_number,
      status: flightDetails.status || booking.status,
      departureAirport: booking.departure_airport,
      departureDate: booking.departure_date,
      departureTime: flight?.departure_time || null,
      arrivalAirport: booking.arrival_airport,
      arrivalTime: flight?.arrival_time || null,
      passengers: booking.passengers,
      seat: booking.seat || 'Not assigned',
      class: booking.class || 'Economy',
      delayMinutes: flightDetails.delayMinutes,
      ...flightDetails,
      events: events
    })
  } catch (error) {
    console.error('Tracking error:', error)
    return Response.json({ error: 'Failed to track booking' }, { status: 500 })
  }
}