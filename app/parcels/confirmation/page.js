'use client'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, Package, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function ParcelConfirmation() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const trackingNumber = searchParams.get('ref')
  const [parcel, setParcel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const fetchParcel = async () => {
      if (!trackingNumber) {
        setError('No tracking number provided')
        setLoading(false)
        return
      }
      
      try {
        const res = await fetch(`/api/parcels/bookings/${trackingNumber}`)
        
        if (!res.ok) {
          throw new Error('Failed to load parcel details')
        }
        
        const data = await res.json()
        setParcel(data)
      } catch (err) {
        setError(err.message || 'An error occurred while loading parcel details')
      } finally {
        setLoading(false)
      }
    }
    
    fetchParcel()
  }, [trackingNumber])
  
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
          <div className="inline-flex items-center justify-center p-2 bg-red-100 rounded-full mb-4">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold mb-4 text-red-600">Unable to Load Parcel Information</h1>
          <p className="mb-6">{error}</p>
          <Link href="/parcels" className="btn-primary">
            Return to Parcel Services
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
          <h1 className="text-3xl font-bold mb-2">Parcel Booking Confirmed!</h1>
          <p className="text-lg text-gray-600">
            Your tracking number is <span className="font-bold">{trackingNumber}</span>
          </p>
        </div>
        
        {parcel && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Parcel Details
            </h2>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Sender</p>
                  <p className="font-medium">{parcel.sender_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Recipient</p>
                  <p className="font-medium">{parcel.recipient_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">From</p>
                  <p className="font-medium">{parcel.pickup_location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">To</p>
                  <p className="font-medium">{parcel.dropoff_location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Service Type</p>
                  <p className="font-medium capitalize">{parcel.service_type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Weight</p>
                  <p className="font-medium">{parcel.weight} {parcel.weight_unit}</p>
                </div>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between text-lg">
                <span>Shipping Cost</span>
                <span className="font-bold">${parcel.price}</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8 text-center">
          <Link href={`/parcels/track?ref=${trackingNumber}`} className="btn-primary mr-4">
            Track Your Parcel
          </Link>
          <Link href="/parcels" className="btn-secondary">
            Return to Parcel Services
          </Link>
        </div>
      </div>
    </div>
  )
}