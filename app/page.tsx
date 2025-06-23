'use client'
import Link from 'next/link'
import { Plane, Package, Clock, Shield, Headphones } from 'lucide-react'

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 rounded-lg">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Find Your Next Flight
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Discover amazing destinations at exclusive deals
          </p>
          
          {/* Call to action button */}
          <div className="max-w-md mx-auto">
            <Link 
              href="/flights" 
              className="btn-primary text-lg px-8 py-3 inline-block rounded-lg"
            >
              Search Flights
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Flight Services */}
            <div className="card text-center">
              <Plane className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4">Flight Services</h3>
              <p className="text-gray-600 mb-6">
                Book flights worldwide with real-time tracking and competitive prices
              </p>
              <div className="space-y-2">
                <Link href="/flights" className="block btn-primary">
                  Search Flights
                </Link>
                <Link href="/flights/track" className="block btn-secondary">
                  Track Flight
                </Link>
              </div>
            </div>

            {/* Parcel Services */}
            <div className="card text-center">
              <Package className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4">Parcel Delivery</h3>
              <p className="text-gray-600 mb-6">
                Fast and reliable parcel delivery with end-to-end tracking
              </p>
              <div className="space-y-2">
                <Link href="/parcels/book" className="block btn-primary">
                  Book Delivery
                </Link>
                <Link href="/parcels/track" className="block btn-secondary">
                  Track Parcel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Reliable Service</h3>
              <p className="text-gray-600">
                We ensure your parcels are delivered on time and in perfect condition
              </p>
            </div>
            
            <div className="text-center">
              <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Our delivery network ensures quick and efficient parcel delivery
              </p>
            </div>
            
            <div className="text-center">
              <Headphones className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Our customer support team is available around the clock to assist
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}