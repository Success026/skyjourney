import { Users, Award, Globe, Shield } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About SkyJourney</h1>
          <p className="text-xl text-gray-600">
            Your trusted partner for flights and parcel delivery services worldwide
          </p>
        </div>

        {/* Story Section */}
        <div className="card mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-gray-600 mb-4">
            Founded in 2020, SkyJourney has grown to become a leading platform for flight booking and parcel delivery services. We started with a simple mission: to make travel and shipping accessible, reliable, and affordable for everyone.
          </p>
          <p className="text-gray-600">
            Today, we serve thousands of customers worldwide, connecting people and businesses through our comprehensive travel and logistics solutions.
          </p>
        </div>

        {/* Values Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="card text-center">
            <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Reliability</h3>
            <p className="text-gray-600">
              We ensure your flights and parcels are handled with the highest standards of reliability and security.
            </p>
          </div>
          
          <div className="card text-center">
            <Globe className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Global Reach</h3>
            <p className="text-gray-600">
              Our extensive network covers destinations worldwide, connecting you to anywhere you need to go or send.
            </p>
          </div>
          
          <div className="card text-center">
            <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Customer First</h3>
            <p className="text-gray-600">
              Our customers are at the heart of everything we do. We provide 24/7 support and personalized service.
            </p>
          </div>
          
          <div className="card text-center">
            <Award className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Excellence</h3>
            <p className="text-gray-600">
              We strive for excellence in every interaction, ensuring the best possible experience for our customers.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="card">
          <h2 className="text-2xl font-semibold mb-6">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="font-semibold">John Smith</h3>
              <p className="text-gray-600 text-sm">Chief Executive Officer</p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="font-semibold">Sarah Johnson</h3>
              <p className="text-gray-600 text-sm">Head of Operations</p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="font-semibold">Mike Chen</h3>
              <p className="text-gray-600 text-sm">Chief Technology Officer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}