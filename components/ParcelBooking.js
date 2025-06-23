'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ParcelBooking() {
  const router = useRouter()
  const [form, setForm] = useState({
    sender: '',
    recipient: '',
    from: '',
    to: '',
    weight: '',
    unit: 'kg',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [price, setPrice] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Calculate price when weight or unit changes
  useEffect(() => {
    if (form.weight) {
      const weight = parseFloat(form.weight)
      if (!isNaN(weight) && weight > 0) {
        // Calculate price based on weight and unit
        const pricePerUnit = 3.61
        const calculatedPrice = weight * pricePerUnit
        setPrice(calculatedPrice.toFixed(2))
      } else {
        setPrice(null)
      }
    } else {
      setPrice(null)
    }
  }, [form.weight, form.unit])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      // Include price in the submission
      const dataToSend = { ...form, price: price }
      
      const res = await fetch('/api/parcels/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      })
      const data = await res.json()
      
      if (res.ok) {
        // Redirect to confirmation page with the reference number
        router.push(`/parcels/confirmation?ref=${data.reference || 'UNKNOWN'}`)
      } else {
        setError(data.error || 'Booking failed')
        setLoading(false)
      }
    } catch (err) {
      setError('Booking failed')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white rounded-xl shadow p-8">
      <h1 className="text-4xl font-bold mb-6">Book Your Parcel</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Pickup Location */}
        <div>
          <label className="block text-xl font-semibold mb-2">Pickup Location</label>
          <input
            className="w-full border rounded px-4 py-3 text-lg mb-4"
            name="sender"
            placeholder="Sender Name"
            value={form.sender}
            onChange={handleChange}
            required
          />
          <input
            className="w-full border rounded px-4 py-3 text-lg"
            name="from"
            placeholder="From (City/Airport)"
            value={form.from}
            onChange={handleChange}
            required
          />
        </div>
        {/* Drop-off Location */}
        <div>
          <label className="block text-xl font-semibold mb-2">Drop-off Location</label>
          <input
            className="w-full border rounded px-4 py-3 text-lg mb-4"
            name="recipient"
            placeholder="Recipient Name"
            value={form.recipient}
            onChange={handleChange}
            required
          />
          <input
            className="w-full border rounded px-4 py-3 text-lg"
            name="to"
            placeholder="To (City/Airport)"
            value={form.to}
            onChange={handleChange}
            required
          />
        </div>
        {/* Weight */}
        <div className="flex gap-4">
          <input
            className="flex-1 border rounded px-4 py-3 text-lg"
            name="weight"
            placeholder="Weight"
            value={form.weight}
            onChange={handleChange}
            required
            type="number"
            min="0"
            step="0.01"
          />
          <select
            name="unit"
            value={form.unit}
            onChange={handleChange}
            className="border rounded px-4 py-3 text-lg"
          >
            <option value="kg">kg</option>
            <option value="lb">lb</option>
          </select>
        </div>
        {/* Button and Price */}
        <div className="flex justify-between items-center">
          {price && (
            <div className="text-xl font-semibold">
              Estimated Price: <span className="text-orange-600">${price}</span>
            </div>
          )}
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xl px-10 py-3 rounded transition"
            disabled={loading}
          >
            {loading ? 'Booking...' : 'Book Parcel'}
          </button>
        </div>
      </form>
      {error && <div className="text-red-600 mt-4">{error}</div>}
    </div>
  )
}