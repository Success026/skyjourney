import { aviationStackAPI } from ''

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const date = searchParams.get('date')

    const flights = await aviationStackAPI.searchFlights({
      dep_iata: from,
      arr_iata: to,
      flight_date: date
    })

    return Response.json(flights)
  } catch (error) {
    return Response.json({ error: 'Failed to search flights' }, { status: 500 })
  }
}