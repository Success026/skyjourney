'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Plane } from 'lucide-react'
import Link from 'next/link'

export default function FlightBookingConfirmationPage() {
  const searchParams = useSearchParams()
  const bookingRef = searchParams.get('ref')
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingRef) {
        setError('No booking reference provided')
        setLoading(false)
        return
      }
      
      try {
        const res = await fetch(`/api/flights/bookings/${bookingRef}`)
        const data = await res.json()
        
        if (res.ok) {
          setBooking(data)
        } else {
          setError(data.error || 'Failed to load booking details')
        }
      } catch (err) {
        setError('Failed to load booking details')
      } finally {
        setLoading(false)
      }
    }
    
    fetchBooking()
  }, [bookingRef])
  
  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4 mx-auto w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2.5"></div>
            <div className="h-4 bg-gray-200 rounded mb-2.5"></div>
          </div>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Unable to Load Booking</h1>
          <p className="mb-6">{error}</p>
          <Link href="/flights" className="btn-primary">
            Return to Flight Search
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-lg text-gray-600">
            Your booking reference is <span className="font-bold">{bookingRef}</span>
          </p>
        </div>
        
        {booking && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Plane className="w-5 h-5 mr-2" />
              Flight Details
            </h2>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Passenger</p>
                  <p className="font-medium">{booking.user_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Flight</p>
                  <p className="font-medium">{booking.flight_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Route</p>
                  <p className="font-medium">
                    {booking.departure_airport} → {booking.arrival_airport}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{booking.departure_date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Seat</p>
                  <p className="font-medium">{booking.seat || 'Not assigned'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Class</p>
                  <p className="font-medium capitalize">{booking.class}</p>
                </div>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between text-lg">
                <span>Price</span>
                <span className="font-bold">${booking.price}</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8 text-center">
          <Link href="/flights" className="btn-primary">
            Return to Flight Search
          </Link>
        </div>
      </div>
    </div>
  )
}