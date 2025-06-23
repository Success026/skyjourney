'use client'
import { useState } from 'react'

const statusColors = {
  'In Transit': 'bg-green-500',
  'Delivered': 'bg-blue-500',
  'Exception': 'bg-red-500',
  'Pending': 'bg-yellow-400',
}

export default function ParcelTracker() {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const res = await fetch(`/api/parcels/track?trackingNumber=${encodeURIComponent(trackingNumber)}`)
      const data = await res.json()
      if (res.ok) {
        setResult(data)
      } else {
        setError(data.error || 'Failed to track parcel')
      }
    } catch (err) {
      setError('Failed to track parcel')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white rounded-xl shadow p-8">
      <h1 className="text-3xl font-bold mb-6">Parcel Tracking</h1>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end mb-8">
        <div className="flex-1">
          <label className="block text-lg font-medium mb-2" htmlFor="trackingNumber">
            Tracking Number
          </label>
          <input
            id="trackingNumber"
            type="text"
            className="input-field w-full text-lg px-4 py-3 border rounded"
            placeholder="1Z9999W99999999999"
            value={trackingNumber}
            onChange={e => setTrackingNumber(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg px-8 py-3 rounded transition"
          disabled={loading}
        >
          {loading ? 'Tracking...' : 'Track'}
        </button>
      </form>
      {error && <div className="text-red-600 mt-4">{error}</div>}
      {result && (
        <div>
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <div className="flex items-center gap-3">
              <span className="text-lg font-medium">Status:</span>
              <span
                className={`inline-block w-3 h-3 rounded-full ${statusColors[result.status] || 'bg-gray-400'}`}
                aria-label={result.status}
              ></span>
              <span className="text-lg font-semibold">{result.status}</span>
            </div>
          </div>
          <div>
            <ul className="border-l-2 border-gray-300 pl-6">
              {result.history && result.history.length > 0 ? (
                result.history.map((event, idx) => (
                  <li key={idx} className="mb-8 relative">
                    <span className="absolute -left-6 top-1 w-4 h-4 bg-white border-2 border-gray-400 rounded-full"></span>
                    <div className="font-semibold text-lg">{event.status}</div>
                    <div className="text-gray-700">{event.location}</div>
                    <div className="text-gray-500 text-sm">{event.date}</div>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No tracking history available.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}