import { supabase } from '../../../../../lib/supabase'

export async function GET(request, { params }) {
  const reference = params.reference
  
  if (!reference) {
    return Response.json({ error: 'Reference number required' }, { status: 400 })
  }

  try {
    // Query parcel with the reference number
    const { data: parcel, error } = await supabase
      .from('parcels')
      .select('*')
      .eq('tracking_number', reference)
      .single()

    return Response.json(parcel)
  } catch (err) {
    return Response.json({ error: 'Failed to retrieve parcel details' }, { status: 500 })
  }
}