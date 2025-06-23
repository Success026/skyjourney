import FlightTracker from '../../../components/FlightTracker'

export default function FlightTrackerPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Flight Booking Tracker</h1>
        <p className="text-gray-600 mb-8">
          Enter your booking reference to track your flight status and journey
        </p>
        
        <FlightTracker />
      </div>
    </div>
  )
}