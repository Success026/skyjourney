'use client'
import { useState, useEffect } from 'react'
import { Check, X, Edit, Trash, RefreshCw, Plus } from 'lucide-react'

export default function AdminFlights() {
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    status: '',
    delay: '',
    location: '',
    details: ''
  })
  const [showAddEvent, setShowAddEvent] = useState(false)
  
  useEffect(() => {
    fetchFlights()
  }, [])
  
  const fetchFlights = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/flights')
      const data = await res.json()
      setFlights(data)
    } catch (error) {
      console.error('Failed to fetch flights', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleEdit = (flight) => {
    setEditingId(flight.id)
    setFormData({
      status: flight.status || 'scheduled',
      delay: flight.delay_minutes || '0',
      location: '',
      details: ''
    })
  }
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/admin/flights/${editingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: formData.status,
          delay: formData.delay,
          location: formData.location || null
        }),
      })
      
      if (res.ok) {
        fetchFlights()
        setEditingId(null)
        setShowAddEvent(false)
      }
    } catch (error) {
      console.error('Failed to update flight', error)
    }
  }
  
  const handleAddEvent = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/admin/flights/${editingId}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: formData.status,
          location: formData.location,
          delay: formData.delay,
          details: formData.details || {}
        }),
      })
      
      if (res.ok) {
        fetchFlights()
        setShowAddEvent(false)
      }
    } catch (error) {
      console.error('Failed to add event', error)
    }
  }
  
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this flight?')) return
    
    try {
      const res = await fetch(`/api/admin/flights/${id}`, {
        method: 'DELETE',
      })
      
      if (res.ok) {
        fetchFlights()
      }
    } catch (error) {
      console.error('Failed to delete flight', error)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Flights</h1>
        <button 
          onClick={fetchFlights} 
          className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </button>
      </div>
      
      {loading ? (
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Flight Number
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delay
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bookings
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {flights.map(flight => (
                <tr key={flight.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {flight.flight_number || flight.flight_iata}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(flight.departure_airport || flight.departure_iata)} → {(flight.arrival_airport || flight.arrival_iata)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {editingId === flight.id ? (
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="border rounded px-2 py-1"
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="active">Active</option>
                        <option value="landed">Landed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="delayed">Delayed</option>
                      </select>
                    ) : (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${flight.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : ''}
                        ${flight.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                        ${flight.status === 'landed' ? 'bg-purple-100 text-purple-800' : ''}
                        ${flight.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                        ${flight.status === 'delayed' ? 'bg-yellow-100 text-yellow-800' : ''}
                      `}>
                        {flight.status || 'scheduled'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {editingId === flight.id ? (
                      <input
                        type="number"
                        name="delay"
                        value={formData.delay}
                        onChange={handleChange}
                        className="border rounded px-2 py-1 w-20"
                        min="0"
                      />
                    ) : (
                      <span>{flight.delay ? `${flight.delay} min` : '0 min'}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {flight.bookings && flight.bookings.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {flight.bookings.map(booking => (
                          <span key={booking.id} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {booking.booking_reference}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">No bookings</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {editingId === flight.id ? (
                      <div className="flex space-x-2">
                        <button 
                          onClick={handleSubmit}
                          className="text-green-600 hover:text-green-900"
                          title="Save changes"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => {
                            setEditingId(null)
                            setShowAddEvent(false)
                          }}
                          className="text-red-600 hover:text-red-900"
                          title="Cancel"
                        >
                          <X className="h-5 w-5" />
                        </button>
                        {!showAddEvent ? (
                          <button 
                            onClick={() => setShowAddEvent(true)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Add event"
                          >
                            <Plus className="h-5 w-5" />
                          </button>
                        ) : null}
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit(flight)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit flight"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(flight.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete flight"
                        >
                          <Trash className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Add the modal for flight events */}
      {showAddEvent && editingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Add Flight Event</h2>
            <form onSubmit={handleAddEvent}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="">Select a status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="boarding">Boarding</option>
                  <option value="active">Active (In Flight)</option>
                  <option value="landed">Landed</option>
                  <option value="delayed">Delayed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Airport or City"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delay (minutes)
                </label>
                <input
                  type="number"
                  name="delay"
                  value={formData.delay}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  min="0"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Details
                </label>
                <textarea
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Additional information"
                  rows="3"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddEvent(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}