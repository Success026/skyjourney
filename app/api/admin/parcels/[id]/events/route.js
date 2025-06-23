import { cookies } from 'next/headers'
import { supabase } from '../../../../../../lib/supabase'

// Auth middleware
async function checkAuth() {
  const cookieStore = cookies()
  const adminAuth = cookieStore.get('admin_auth')
  
  if (adminAuth?.value !== 'true') {
    return false
  }
  return true
}

export async function POST(request, { params }) {
  if (!await checkAuth()) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params
  
  try {
    const data = await request.json()
    
    const { error } = await supabase
      .from('parcel_events')
      .insert([{
        parcel_id: id,
        status: data.status,
        location: data.location,
      }])
    
    if (error) throw error
    
    // Also update the main parcel status
    const { error: updateError } = await supabase
      .from('parcels')
      .update({ status: data.status })
      .eq('id', id)
    
    if (updateError) throw updateError
    
    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}