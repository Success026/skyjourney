import { cookies } from 'next/headers'
import { supabase } from '../../../../lib/supabase'

// Auth middleware
async function checkAuth() {
  const cookieStore = cookies()
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

  try {
    const { data, error } = await supabase
      .from('parcels')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return Response.json(data)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  if (!await checkAuth()) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    const generatedTrackingNumber = data.tracking_number || 'TRK' + Math.floor(Math.random() * 1e12)
    const parcelStatus = data.status || 'Pending'
    
    const { data: parcel, error } = await supabase
      .from('parcels')
      .insert([{ 
        tracking_number: generatedTrackingNumber,
        status: parcelStatus,
      }])
      .select()
      .single()
    
    if (error) throw error
    
    return Response.json(parcel)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}