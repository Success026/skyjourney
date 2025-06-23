import axios from 'axios'

const API_KEY = process.env.AVIATIONSTACK_API_KEY
const BASE_URL = 'http://api.aviationstack.com/v1'

export const aviationStackAPI = {
  // Search flights
  searchFlights: async (params) => {
    try {
      const response = await axios.get(`${BASE_URL}/flights`, {
        params: {
          access_key: API_KEY,
          ...params
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching flights:', error)
      throw error
    }
  },

  // Track specific flight
  trackFlight: async (flightNumber) => {
    try {
      const response = await axios.get(`${BASE_URL}/flights`, {
        params: {
          access_key: API_KEY,
          flight_iata: flightNumber
        }
      })
      return response.data
    } catch (error) {
      console.error('Error tracking flight:', error)
      throw error
    }
  },

  // Get airline information
  getAirlines: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/airlines`, {
        params: {
          access_key: API_KEY
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching airlines:', error)
      throw error
    }
  }
}