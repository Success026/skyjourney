import Link from 'next/link'
import { Package, Search, Truck, Clock } from 'lucide-react'

export default function ParcelsPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Parcel Services</h1>
        
        {/* Service Options */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="card text-center">
            <Package className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-4">Book Delivery</h2>
            <p className="text-gray-600 mb-6">
              Send your parcels worldwide with our reliable delivery service
            </p>
            <Link href="/parcels/book" className="btn-primary">
              Book Now
            </Link>
          </div>
          
          <div className="card text-center">
            <Search className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-4">Track Parcel</h2>
            <p className="text-gray-600 mb-6">
              Track your parcel in real-time and get delivery updates
            </p>
            <Link href="/parcels/track" className="btn-primary">
              Track Now
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Our Delivery Features</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Truck className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Multiple Services</h3>
              <p className="text-gray-600 text-sm">
                Standard, Express, and Overnight delivery options
              </p>
            </div>
            
            <div className="text-center">
              <Clock className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Real-time Tracking</h3>
              <p className="text-gray-600 text-sm">
                Track your parcel from pickup to delivery
              </p>
            </div>
            
            <div className="text-center">
              <Package className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Secure Handling</h3>
              <p className="text-gray-600 text-sm">
                Your parcels are handled with utmost care
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}