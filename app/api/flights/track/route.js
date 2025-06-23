import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const flightNumber = searchParams.get('flightNumber')
  const date = searchParams.get('date')
  
  if (!flightNumber) {
    return Response.json({ error: 'Flight number is required' }, { status: 400 })
  }
  
  try {
    // Build query for flight
    let query = supabase
      .from('flights')
      .select('*')
      .eq('flight_number', flightNumber)
    
    // Add date filter if provided
    if (date) {
      query = query.eq('departure_date', date)
    }
    
    // Get the most recent flight if no date specified
    if (!date) {
      query = query.order('departure_date', { ascending: false })
    }
    
    const { data: flight, error: flightError } = await query.single()

    if (flightError || !flight) {
      return Response.json({ error: 'Flight not found' }, { status: 404 })
    }

    // Fetch events for this flight - using created_at field
    const { data: flightEvents, error: eventsError } = await supabase
      .from('flight_events')
      .select('status, location, created_at, details')
      .eq('flight_id', flight.id)
      .order('created_at', { ascending: true })

    if (eventsError) {
      console.error('Error fetching events:', eventsError)
      // Continue execution even if events fetch fails
    }
    
    // Map events to the expected format
    const events = flightEvents ? flightEvents.map(event => ({
      status: event.status,
      location: event.location,
      timestamp: event.created_at,
      details: event.details
    })) : []

    return Response.json({
      flightNumber: flight.flight_number,
      status: flight.status || 'scheduled',
      departureAirport: flight.departure_airport,
      departureDate: flight.departure_date,
      departureTime: flight.departure_time,
      departureTerminal: flight.departure_terminal || 'TBD',
      departureGate: flight.departure_gate || 'TBD',
      arrivalAirport: flight.arrival_airport,
      arrivalTime: flight.arrival_time,
      arrivalTerminal: flight.arrival_terminal || 'TBD',
      arrivalGate: flight.arrival_gate || 'TBD',
      delayMinutes: flight.delay_minutes || 0,
      aircraft: flight.aircraft || 'Boeing 737',
      airline: flight.airline,
      events: events
    })
  } catch (error) {
    console.error('Flight tracking error:', error);
    return Response.json({ error: 'Failed to track flight' }, { status: 500 })
  }
}