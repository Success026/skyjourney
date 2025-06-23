'use client'
import { useState } from 'react'
import { Search, ArrowRight } from 'lucide-react'

export default function FlightTracker() {
  const [bookingRef, setBookingRef] = useState('')
  const [loading, setLoading] = useState(false)
  const [flightData, setFlightData] = useState(null)
  const [error, setError] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setFlightData(null)
    
    try {
      const url = `/api/flights/track/reference?bookingRef=${bookingRef.trim()}`
      
      const res = await fetch(url)
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to find flight')
      }
      
      setFlightData(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Helper function to format the date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Helper function to format the time
  const formatTime = (timeString) => {
    if (!timeString) return 'N/A'
    const date = new Date(timeString)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  // Helper to get status badge color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'active': 
      case 'in-flight': return 'bg-green-100 text-green-800'
      case 'boarding': return 'bg-purple-100 text-purple-800'
      case 'landed': return 'bg-indigo-100 text-indigo-800'
      case 'delayed': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'confirmed': return 'bg-teal-100 text-teal-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div>
      <div className="mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label htmlFor="bookingRef" className="block text-sm font-medium text-gray-700 mb-1">
              Booking Reference
            </label>
            <input
              type="text"
              id="bookingRef"
              placeholder="Enter your booking reference (e.g. ABC123)"
              value={bookingRef}
              onChange={(e) => setBookingRef(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-md flex items-center justify-center hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? (
              <span>Searching...</span>
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                <span>Track Flight</span>
              </>
            )}
          </button>
        </form>
      </div>
      
      {error && (
        <div className="p-4 bg-red-50 text-red-800 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {flightData && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-50 p-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {flightData.flightNumber}
                {flightData.bookingRef && ` | Booking: ${flightData.bookingRef}`}
              </h2>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(flightData.status)}`}>
                {flightData.status || 'Unknown'}
                {flightData.delayMinutes > 0 && ` (Delayed ${flightData.delayMinutes} mins)`}
              </span>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex flex-col md:flex-row justify-between mb-6">
              <div className="mb-4 md:mb-0">
                <p className="text-sm text-gray-500">Departure</p>
                <p className="text-lg font-bold">{flightData.departureAirport}</p>
                <p className="text-sm">
                  {formatDate(flightData.departureDate || flightData.departureTime)}
                </p>
                <p className="text-sm">
                  {formatTime(flightData.departureTime)}
                </p>
                <p className="text-sm mt-1">
                  Terminal: {flightData.departureTerminal || 'TBD'}
                </p>
                <p className="text-sm">
                  Gate: {flightData.departureGate || 'TBD'}
                </p>
              </div>
              
              <div className="flex items-center my-2 md:my-0">
                <ArrowRight className="w-6 h-6 text-gray-400" />
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Arrival</p>
                <p className="text-lg font-bold">{flightData.arrivalAirport}</p>
                <p className="text-sm">
                  {formatDate(flightData.arrivalTime)}
                </p>
                <p className="text-sm">
                  {formatTime(flightData.arrivalTime)}
                </p>
                <p className="text-sm mt-1">
                  Terminal: {flightData.arrivalTerminal || 'TBD'}
                </p>
                <p className="text-sm">
                  Gate: {flightData.arrivalGate || 'TBD'}
                </p>
              </div>
            </div>
            
            {flightData.seat && (
              <div className="mb-6 p-3 bg-blue-50 rounded-md">
                <p className="text-sm font-medium">Your Details</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  <div>
                    <p className="text-xs text-gray-500">Passengers</p>
                    <p className="text-sm">{flightData.passengers || 1}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Seat</p>
                    <p className="text-sm">{flightData.seat || 'Not assigned'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Class</p>
                    <p className="text-sm">{flightData.class || 'Economy'}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Flight journey timeline */}
            {flightData.events && flightData.events.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-4">Flight Journey</h3>
                <div className="space-y-4">
                  {flightData.events.map((event, index) => (
                    <div key={index} className="relative pl-6 pb-4 border-l-2 border-gray-200 last:border-l-0">
                      <div className="absolute -left-1.5 mt-1.5 w-3 h-3 rounded-full bg-blue-500"></div>
                      <div className="mb-1 flex justify-between">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(event.timestamp)} {formatTime(event.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm font-medium">{event.location || 'Unknown location'}</p>
                      {event.details && event.details.message && (
                        <p className="text-sm text-gray-600 mt-1">{event.details.message}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}