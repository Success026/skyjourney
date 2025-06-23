'use client'
import { useState, useEffect } from 'react'
import { Check, X, Plus, Edit, Trash, RefreshCw } from 'lucide-react'

export default function AdminParcels() {
  const [parcels, setParcels] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    status: '',
    location: '',
    eventStatus: '',
  })
  const [showAddEvent, setShowAddEvent] = useState(false)
  
  useEffect(() => {
    fetchParcels()
  }, [])
  
  const fetchParcels = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/parcels')
      const data = await res.json()
      setParcels(data)
    } catch (error) {
      console.error('Failed to fetch parcels', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleEdit = (parcel) => {
    setEditingId(parcel.id)
    setFormData({
      status: parcel.status,
      location: '',
      eventStatus: '',
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
      const res = await fetch(`/api/admin/parcels/${editingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: formData.status
        }),
      })
      
      if (res.ok) {
        fetchParcels()
        setEditingId(null)
      }
    } catch (error) {
      console.error('Failed to update parcel', error)
    }
  }
  
  const handleAddEvent = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/admin/parcels/${editingId}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: formData.eventStatus,
          location: formData.location,
        }),
      })
      
      if (res.ok) {
        fetchParcels()
        setShowAddEvent(false)
      }
    } catch (error) {
      console.error('Failed to add event', error)
    }
  }
  
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this parcel?')) return
    
    try {
      const res = await fetch(`/api/admin/parcels/${id}`, {
        method: 'DELETE',
      })
      
      if (res.ok) {
        fetchParcels()
      }
    } catch (error) {
      console.error('Failed to delete parcel', error)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Parcels</h1>
        <button 
          onClick={fetchParcels} 
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
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tracking #
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sender
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipient
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  From → To
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weight
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {parcels.map(parcel => (
                <tr key={parcel.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {parcel.tracking_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {editingId === parcel.id ? (
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="border rounded px-2 py-1"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Exception">Exception</option>
                      </select>
                    ) : (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${parcel.status === 'Delivered' ? 'bg-green-100 text-green-800' : ''}
                        ${parcel.status === 'In Transit' ? 'bg-blue-100 text-blue-800' : ''}
                        ${parcel.status === 'Exception' ? 'bg-red-100 text-red-800' : ''}
                        ${parcel.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      `}>
                        {parcel.status}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {parcel.sender_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {parcel.recipient_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {parcel.from_city} → {parcel.to_city}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {parcel.weight} {parcel.weight_unit || 'kg'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {editingId === parcel.id ? (
                      <div className="flex space-x-2">
                        <button 
                          onClick={handleSubmit}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => {
                            setEditingId(null)
                            setShowAddEvent(false)
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          <X className="h-5 w-5" />
                        </button>
                        {!showAddEvent ? (
                          <button 
                            onClick={() => setShowAddEvent(true)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Plus className="h-5 w-5" />
                          </button>
                        ) : null}
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit(parcel)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(parcel.id)}
                          className="text-red-600 hover:text-red-900"
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
      
      {showAddEvent && editingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Add Tracking Event</h2>
            <form onSubmit={handleAddEvent}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="eventStatus"
                  value={formData.eventStatus}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="">Select a status</option>
                  <option value="Picked Up">Picked Up</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Failed Delivery">Failed Delivery</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="City, Country"
                  required
                />
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