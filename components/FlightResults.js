'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plane, Clock, ArrowRight } from 'lucide-react'

export default function FlightResults({ searchParams }) {
  const router = useRouter()
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true)
      setError(null)
      try {
        const fromCode = searchParams.from
        const toCode = searchParams.to
        if (!fromCode || !toCode) {
          setFlights([])
          setLoading(false)
          return
        }
        const res = await fetch(`/api/flights/search?from=${fromCode}&to=${toCode}&date=${searchParams.departure}`)
        const data = await res.json()
        if (res.ok && Array.isArray(data) && data.length > 0) {
          setFlights(data)
        } else {
          setFlights([])
        }
      } catch (err) {
        setError('Failed to fetch flights')
        setFlights([])
      } finally {
        setLoading(false)
      }
    }
    if (searchParams && searchParams.from && searchParams.to) {
      fetchFlights()
    } else {
      setLoading(false)
    }
  }, [searchParams])

  const handleBookFlight = (flight) => {
    const bookingParams = new URLSearchParams({
      ...searchParams,
      flight: flight.flight_number,
      airline: flight.airline,
      price: flight.price
    })
    router.push(`/flights/book?${bookingParams}`)
  }

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-20 h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card bg-red-50">
        <div className="text-red-600">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!flights.length) {
    return (
      <div className="card bg-yellow-50">
        <div className="text-yellow-700">
          <p>No flights found for your search.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        Showing {flights.length} results for {searchParams.fromDisplay || searchParams.from} → {searchParams.toDisplay || searchParams.to}
      </h2>
      {flights.map((flight) => (
        <div key={flight.id} className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Plane className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-semibold">{flight.airline}</span>
                  <span className="text-gray-500">{flight.flight_number}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {flight.duration}
                  </span>
                  <span>
                    {flight.stops === 0 ? 'Nonstop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mt-2 text-sm">
                  <span className="font-medium">{flight.departure_time}</span>
                  <ArrowRight className="w-4 h-4" />
                  <span className="font-medium">{flight.arrival_time}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                ${flight.price}
              </div>
              <button
                onClick={() => handleBookFlight(flight)}
                className="btn-primary text-sm px-4 py-2"
              >
                Select
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}