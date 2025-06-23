import { cookies } from 'next/headers'
import { supabase } from '../../../../lib/supabase'

// Auth middleware
async function checkAuth() {
  const cookieStore = await cookies()
  const adminAuth = cookieStore.get('admin_auth')
  if (adminAuth?.value !== 'true') {
    return false
  }
  return true
}

export async function GET() {
  if (!await checkAuth()) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch flights from Supabase
  const { data: flights, error } = await supabase
    .from('flights')
    .select('*')
    .order('id', { ascending: true })

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  // Fetch latest event and bookings for each flight
  const flightsWithData = await Promise.all(
    flights.map(async (flight) => {
      // Get latest event
      const { data: events } = await supabase
        .from('flight_events')
        .select('*')
        .eq('flight_id', flight.id)
        .order('created_at', { ascending: false })
        .limit(1)
      
      // Get bookings for this flight
      const { data: bookings } = await supabase
        .from('flight_bookings')
        .select('id, booking_reference, user_name, status')
        .eq('flight_id', flight.id)
        .order('created_at', { ascending: false })
      
      const latestEvent = events && events.length > 0 ? events[0] : null
      
      return {
        ...flight,
        latest_event: latestEvent,
        bookings: bookings || []
      }
    })
  )

  return Response.json(flightsWithData)
}