import { supabase } from '../../../../../lib/supabase'

export async function GET(request, { params }) {
  const { reference } = params
  
  try {
    const { data, error } = await supabase
      .from('flight_bookings')
      .select('*')
      .eq('booking_reference', reference)
      .single()
    
    if (error) throw error
    
    if (!data) {
      return Response.json({ error: 'Booking not found' }, { status: 404 })
    }
    
    return Response.json(data)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}