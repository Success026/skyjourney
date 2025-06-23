import { cookies } from 'next/headers'
import { supabase } from '../../../../../lib/supabase'

// Auth middleware
async function checkAuth() {
  const cookieStore = await cookies()
  const adminAuth = cookieStore.get('admin_auth')
  
  if (adminAuth?.value !== 'true') {
    return false
  }
  return true
}

export async function PATCH(request, { params }) {
  if (!await checkAuth()) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { id } = params
  
  try {
    const data = await request.json()
    const delay = data.delay ? parseInt(data.delay) : 0
    
    // 1. Update the flight record
    const { error: flightError } = await supabase
      .from('flights')
      .update({ 
        status: data.status,
        delay_minutes: delay
      })
      .eq('id', id)
    
    if (flightError) throw flightError
    
    // 2. Create a flight event to record this change
    const { error: eventError } = await supabase
      .from('flight_events')
      .insert([{
        flight_id: id,
        status: data.status,
        location: data.location || 'System Update',
        delay_minutes: delay,
        details: { 
          message: `Flight status updated to ${data.status}`,
          delay: delay,
          updated_by: 'admin'
        }
      }])
      
    if (eventError) {
      console.error('Error creating flight event:', eventError)
      // Continue execution even if event creation fails
    }
    
    // 3. If status is "cancelled", update all associated bookings
    if (data.status === 'cancelled') {
      const { error: bookingError } = await supabase
        .from('flight_bookings')
        .update({ status: 'cancelled' })
        .eq('flight_id', id)
        
      if (bookingError) {
        console.error('Error updating bookings:', bookingError)
      }
      
      // 4. Create booking events for all affected bookings
      const { data: bookings } = await supabase
        .from('flight_bookings')
        .select('id')
        .eq('flight_id', id)
        
      if (bookings && bookings.length > 0) {
        const bookingEvents = bookings.map(booking => ({
          booking_id: booking.id,
          status: 'cancelled',
          details: {
            message: 'Flight has been cancelled',
            reason: data.details || 'Administrative action'
          },
          created_by: 'system'
        }))
        
        await supabase
          .from('booking_events')
          .insert(bookingEvents)
      }
    }
    
    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  if (!await checkAuth()) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { id } = params
  
  try {
    const { error } = await supabase
      .from('flights')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}