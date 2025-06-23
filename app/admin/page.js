export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Parcel Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-orange-100 p-4 rounded-lg">
              <div className="text-2xl font-bold">24</div>
              <div className="text-sm text-gray-600">Active Parcels</div>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <div className="text-2xl font-bold">18</div>
              <div className="text-sm text-gray-600">Delivered Today</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Flight Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-100 p-4 rounded-lg">
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-gray-600">Active Flights</div>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg">
              <div className="text-2xl font-bold">5</div>
              <div className="text-sm text-gray-600">Delayed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}