import { cookies } from 'next/headers'
import { supabase } from '../../../../../../lib/supabase'

// Auth middleware
async function checkAuth() {
  const cookieStore = await cookies()
  const adminAuth = cookieStore.get('admin_auth')
  
  if (adminAuth?.value !== 'true') {
    return false
  }
  return true
}

export async function POST(request, context) {
  if (!await checkAuth()) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Extract id from params after awaiting the context
  const params = await context.params
  const { id } = params
  
  try {
    const data = await request.json()
    
    // Check if the flight_events table exists
    const { error: tableCheckError } = await supabase
      .from('flight_events')
      .select('id')
      .limit(1)
    
    // If table doesn't exist, return a more helpful error
    if (tableCheckError && tableCheckError.message.includes('does not exist')) {
      console.error('Table flight_events does not exist:', tableCheckError)
      return Response.json({ 
        error: 'The flight_events table does not exist in the database. Please create it first.',
        details: tableCheckError.message
      }, { status: 500 })
    }
    
    // Insert the flight event
    const { error } = await supabase
      .from('flight_events')
      .insert([{
        flight_id: id,
        status: data.status,
        location: data.location,
        delay_minutes: data.delay ? parseInt(data.delay) : 0,
        details: typeof data.details === 'string' 
          ? { message: data.details } 
          : (data.details || {})
      }])
    
    if (error) throw error
    
    // Update the flight status to match the event
    await supabase
      .from('flights')
      .update({
        status: data.status,
        delay_minutes: data.delay ? parseInt(data.delay) : 0
      })
      .eq('id', id)
    
    return Response.json({ success: true })
  } catch (error) {
    console.error('Error adding flight event:', error)
    return Response.json({ 
      error: error.message,
      details: error
    }, { status: 500 })
  }
}