'use client'
import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Plane, User, Mail, Phone, CreditCard } from 'lucide-react'

export default function FlightBookingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showTicket, setShowTicket] = useState(false) // <-- Add this line
  const [bookingData, setBookingData] = useState({
    user_name: '',
    user_email: '',
    phone: '',
    flight_number: searchParams.get('flight') || '',
    airline: searchParams.get('airline') || '',
    departure_airport: searchParams.get('from') || '',
    arrival_airport: searchParams.get('to') || '',
    departure_date: searchParams.get('departure') || '',
    return_date: searchParams.get('return') || '',
    passengers: parseInt(searchParams.get('passengers')) || 1,
    class: searchParams.get('class') || 'economy',
    price: parseFloat(searchParams.get('price')) || 0
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setShowTicket(true) // <-- Show the ticket preview on submit
  }

  const handleBookFlight = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/flights/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      })

      const result = await response.json()

      if (result.success) {
        router.push(`/flights/confirmation?ref=${result.booking.booking_reference}`)
      } else {
        alert('Booking failed: ' + result.error)
      }
    } catch (error) {
      alert('Booking failed: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          {!showTicket && (
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Passenger Information */}
                <div className="card">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Passenger Information
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="user_name"
                        value={bookingData.user_name}
                        onChange={handleChange}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="user_email"
                        value={bookingData.user_email}
                        onChange={handleChange}
                        className="input-field"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={bookingData.phone}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-50"
                >
                  {loading ? 'Processing...' : `Preview Ticket`}
                </button>
              </form>
            </div>
          )}

          {/* Ticket Preview */}
          {showTicket && (
            <div className="lg:col-span-2 flex flex-col items-center justify-center">
              <TicketPreview bookingData={bookingData} />
              
              {/* Book Flight Button */}
              <button 
                className="mt-6 btn-primary py-3 px-8 text-center rounded-lg shadow-md hover:shadow-lg transition-all"
                onClick={handleBookFlight}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Book Flight'}
              </button>
            </div>
          )}

          {/* Booking Summary */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Plane className="w-5 h-5 mr-2" />
              Flight Summary
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Flight</span>
                <span className="font-medium">{bookingData.flight_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Airline</span>
                <span className="font-medium">{bookingData.airline}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Route</span>
                <span className="font-medium">
                  {bookingData.departure_airport} → {bookingData.arrival_airport}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Departure</span>
                <span className="font-medium">{bookingData.departure_date}</span>
              </div>
              {bookingData.return_date && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Return</span>
                  <span className="font-medium">{bookingData.return_date}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Passengers</span>
                <span className="font-medium">{bookingData.passengers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Class</span>
                <span className="font-medium capitalize">{bookingData.class}</span>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${bookingData.price}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Ticket Preview Component ---
function TicketPreview({ bookingData }) {
  // Generate consistent pseudo-random seat and gate numbers based on user name
  const getRandomElement = (arr, seed) => {
    const hash = seed.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return arr[Math.abs(hash) % arr.length];
  };
  
  const userName = bookingData.user_name || "Guest Traveler";
  const seatRow = Math.abs(userName.charCodeAt(0) % 40) + 1;
  const seatLetter = "ABCDEF"[Math.abs(userName.charCodeAt(userName.length-1) % 6)];
  const seat = `${seatRow}${seatLetter}`;
  const gate = Math.abs((userName.charCodeAt(0) + userName.charCodeAt(userName.length-1)) % 30) + 1;
  const boardTime = "10:10";
  
  // Get flight time (assuming it's 10:30 if not provided)
  const flightTime = "10:30";
  
  // Format the departure date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        day: '2-digit', 
        month: 'short'
      }).toUpperCase().replace(" ", "");
    } catch (e) {
      return dateStr;
    }
  };
  
  const displayDate = formatDate(bookingData.departure_date);
  const barcodeNumber = userName.length > 0 
    ? String(userName.split('').reduce((a, b) => a + b.charCodeAt(0), 0) * 1000000).slice(0, 10)
    : String(Math.floor(Math.random() * 10000000000)).padStart(10, '0');

  return (
    <div className="boarding-pass rounded-lg shadow-2xl overflow-hidden max-w-4xl w-full flex">
      {/* Main boarding pass section */}
      <div className="flex-1 p-3 text-white"> {/* Further reduced padding */}
        {/* Header */}
        <div className="flex items-center justify-between mb-2"> {/* Further reduced margin */}
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center">
              <Plane className="w-5 h-5 text-blue-500 plane-icon" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Sky Airlines</h1>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-80">Boarding pass</div>
            <div className="text-xs opacity-60 uppercase">{bookingData.class}</div>
          </div>
        </div>

        {/* Passenger and Flight Info - More compact */}
        <div className="grid grid-cols-2 gap-3 mb-2">
          <div className="space-y-1">
            <div>
              <div className="text-xs opacity-80">Passenger name</div>
              <div className="text-sm font-semibold">{bookingData.user_name || 'N/A'}</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-xs opacity-80">From</div>
                <div className="text-sm font-semibold">{bookingData.departure_airport}</div>
              </div>
              <div>
                <div className="text-xs opacity-80">To</div>
                <div className="text-sm font-semibold">{bookingData.arrival_airport}</div>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-xs opacity-80">Date</div>
                <div className="text-sm font-semibold">{displayDate}</div>
              </div>
              <div>
                <div className="text-xs opacity-80">Time</div>
                <div className="text-sm font-semibold">{flightTime}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <div>
                <div className="text-xs opacity-80">Flight</div>
                <div className="text-sm font-semibold">{bookingData.flight_number}</div>
              </div>
              <div>
                <div className="text-xs opacity-80">Seat</div>
                <div className="text-sm font-semibold">{seat}</div>
              </div>
              <div>
                <div className="text-xs opacity-80">Gate</div>
                <div className="text-sm font-semibold">{gate}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Barcode - Shorter and more proportioned */}
        <div className="flex items-center mt-2 mb-1">
          {/* Vertical barcode on the left side */}
          <div className="barcode-container mr-2">
            {/* Generate 15-20 vertical bars with varying widths */}
            {[...Array(18)].map((_, i) => (
              <div
                key={i}
                className="barcode-bar"
                style={{
                  height: '40px',
                  width: i % 3 === 0 ? '3px' : '1px',
                  backgroundColor: '#333',
                  marginRight: '2px',
                  display: 'inline-block'
                }}
              />
            ))}
          </div>
          <div className="flex-1">
            <div className="text-xs opacity-80">Board till: {boardTime}</div>
            <div className="text-xs opacity-80">{barcodeNumber}</div>
          </div>
        </div>
      </div>

      {/* Stub section */}
      <div className="w-65 bg-white perforated-edge p-2 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <Plane className="w-3 h-3 text-white" />
            </div>
            <div className="text-xs text-gray-600">
              <div>Boarding pass</div>
              <div className="text-blue-500 uppercase">{bookingData.class}</div>
            </div>
          </div>

          <div className="space-y-1 text-gray-800">
            <div>
              <div className="text-xs text-gray-500">Passenger name</div>
              <div className="text-xs font-semibold">{bookingData.user_name || 'N/A'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">From</div>
              <div className="text-xs font-semibold">{bookingData.departure_airport}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">To</div>
              <div className="text-xs font-semibold">{bookingData.arrival_airport}</div>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <div>
                <div className="text-xs text-gray-500">Date</div>
                <div className="text-xs font-semibold">{displayDate}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Time</div>
                <div className="text-xs font-semibold">{flightTime}</div>
              </div>
            </div>
        
          </div>
        </div>

        <div className="pt-2 border-t border-gray-200">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center ml-auto">
            <Plane className="w-3 h-3 text-white" />
          </div>
        </div>
      </div>

      {/* CSS styles for the boarding pass */}
      <style jsx>{`
        .boarding-pass {
          background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
          max-height: 450px;
        }
        .perforated-edge {
          border-left: 4px dashed #cbd5e1;
        }
        @keyframes plane-fly {
          0% { transform: translateX(-10px); }
          50% { transform: translateX(5px); }
          100% { transform: translateX(-10px); }
        }
        .plane-icon {
          animation: plane-fly 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}