'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AirportAutocomplete from './AirportAutocomplete'

export default function FlightSearch() {
  const router = useRouter()
  const [searchData, setSearchData] = useState({
    from: '',
    fromDisplay: '',
    to: '',
    toDisplay: '',
    departure: '',
    return: '',
    passengers: 1,
    class: 'economy'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Build query with airport codes
    const queryParams = new URLSearchParams({
      from: searchData.from,          // This will be the airport code
      fromDisplay: searchData.fromDisplay,  // This will be the display name
      to: searchData.to,              // This will be the airport code
      toDisplay: searchData.toDisplay,      // This will be the display name
      departure: searchData.departure,
      return: searchData.return,
      passengers: searchData.passengers,
      class: searchData.class
    }).toString()
    
    router.push(`/flights?${queryParams}`)
  }

  const handleChange = (e) => {
    const { name, value, display } = e.target
    
    setSearchData(prev => ({
      ...prev,
      [name]: value,
      ...(display ? { [`${name}Display`]: display } : {})
    }))
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <AirportAutocomplete
              name="from"
              value={searchData.from}
              onChange={handleChange}
              placeholder="City or Airport Code"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <AirportAutocomplete
              name="to"
              value={searchData.to}
              onChange={handleChange}
              placeholder="City or Airport Code"
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Departure</label>
            <input
              type="date"
              name="departure"
              value={searchData.departure}
              onChange={handleChange}
              className="input-field text-gray-900 w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Return</label>
            <input
              type="date"
              name="return"
              value={searchData.return}
              onChange={handleChange}
              className="input-field text-gray-900 w-full"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
              <select
                name="passengers"
                value={searchData.passengers}
                onChange={handleChange}
                className="input-field text-gray-900"
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <select
                name="class"
                value={searchData.class}
                onChange={handleChange}
                className="input-field text-gray-900"
              >
                <option value="economy">Economy</option>
                <option value="premium">Premium Economy</option>
                <option value="business">Business</option>
                <option value="first">First Class</option>
              </select>
            </div>
          </div>
          
          <div className="self-end">
            <button type="submit" className="btn-primary">
              Search
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}