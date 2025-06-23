import { supabase } from '../../../../lib/supabase'

export async function POST(request) {
  try {
    const body = await request.json()
    
    // Generate a unique tracking number
    const trackingNumber = generateTrackingNumber()
    
    // Format data for database
    const parcelData = {
      tracking_number: trackingNumber,
      sender_name: body.sender,
      recipient_name: body.recipient,
      pickup_location: body.from,
      dropoff_location: body.to,
      weight: body.weight,
      weight_unit: body.unit,
      status: 'Pending pickup', // Updated status
      price: body.price,
      created_at: new Date().toISOString()
    }
    
    // Insert into database
    const { data, error } = await supabase
      .from('parcels')
      .insert(parcelData)
      .select()
    
    if (error) {
      console.error('Database error:', error)
      return Response.json({ error: 'Failed to create booking' }, { status: 500 })
    }
    
    // Create initial parcel event
    const parcelId = data[0].id
    const eventData = {
      parcel_id: parcelId,
      status: 'Pending pickup',
      location: body.from, // Use the pickup location
      event_time: new Date().toISOString()
    }
    
    // Insert event into database
    const { error: eventError } = await supabase
      .from('parcel_events')
      .insert(eventData)
      
    if (eventError) {
      console.error('Event creation error:', eventError)
      // We'll continue anyway since the parcel was created successfully
    }
    
    return Response.json({ reference: trackingNumber })
  } catch (err) {
    console.error('Server error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}

// Helper functions
function generateTrackingNumber() {
  const prefix = 'SJ'
  const timestamp = Date.now().toString().slice(-8)
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `${prefix}${timestamp}${random}`
}

function getEstimatedDelivery() {
  const date = new Date()
  date.setDate(date.getDate() + 3) // 3 days from now
  return date.toISOString().split('T')[0]
}

// This function is kept for reference but no longer used
function calculatePrice(weight, unit) {
  // Convert to kg if needed
  const weightInKg = unit === 'lb' ? weight * 0.453592 : weight
  // Base price plus per kg
  return (15 + weightInKg * 2).toFixed(2)
}