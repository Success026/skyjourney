import ParcelTracker from '../../../components/ParcelTracker'

export default function ParcelTrackingPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Parcel Tracking</h1>
        <p className="text-gray-600 mb-8">
          Enter your tracking number to track a parcel
        </p>
        
        <ParcelTracker />
      </div>
    </div>
  )
}