import { supabase } from '../../../../lib/supabase'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const trackingNumber = searchParams.get('trackingNumber')
  if (!trackingNumber) {
    return Response.json({ error: 'Tracking number required' }, { status: 400 })
  }

  // Fetch parcel by tracking number
  const { data: parcel, error: parcelError } = await supabase
    .from('parcels')
    .select('id, status')
    .eq('tracking_number', trackingNumber)
    .single()

  if (parcelError || !parcel) {
    return Response.json({ error: 'Parcel not found' }, { status: 404 })
  }

  // Fetch events for this parcel
  const { data: events, error: eventsError } = await supabase
    .from('parcel_events')
    .select('status, location, event_time')
    .eq('parcel_id', parcel.id)
    .order('event_time', { ascending: true })

  if (eventsError) {
    return Response.json({ error: 'Could not fetch events' }, { status: 500 })
  }

  // Format events for frontend
  const history = events.map(ev => ({
    status: ev.status,
    location: ev.location,
    date: new Date(ev.event_time).toLocaleString()
  }))

  return Response.json({
    trackingNumber,
    status: parcel.status,
    history
  })
}