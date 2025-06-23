import FlightSearch from '../../components/FlightSearch'
import FlightResults from '../../components/FlightResults'

export default function FlightsPage({ searchParams }) {
  // Create a clean, serializable object with only the needed properties
  const flightParams = {
    from: searchParams.from || '',
    fromDisplay: searchParams.fromDisplay || '',
    to: searchParams.to || '',
    toDisplay: searchParams.toDisplay || '',
    departure: searchParams.departure || '',
    return: searchParams.return || '',
    passengers: searchParams.passengers ? Number(searchParams.passengers) : 1,
    class: searchParams.class || 'economy'
  };
  
  // Check if we have search parameters to show results
  const hasParams = searchParams && searchParams.from && searchParams.to;

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Search Flights</h1>
        
        {/* Flight Search Form */}
        <div className="mb-8">
          <FlightSearch />
        </div>

        {/* Flight Results */}
        {hasParams && (
          <FlightResults searchParams={flightParams} />
        )}
      </div>
    </div>
  )
}