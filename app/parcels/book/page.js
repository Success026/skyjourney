import ParcelBooking from '../../../components/ParcelBooking'

export default function ParcelBookingPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Book Your Parcel</h1>
        
        <ParcelBooking />
      </div>
    </div>
  )
}