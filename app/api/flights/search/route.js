import { readFileSync } from 'fs'
import path from 'path'

// Parse airlines: expects lines like "IATA – DL	Delta Air Lines"
const AIRLINES = readFileSync(
  path.join(process.cwd(), 'airnames.txt'),
  'utf-8'
)
  .split('\n')
  .map(line => {
    const match = line.match(/IATA\s*[-–]\s*([A-Z0-9]{2})\s+(.+)/i)
    if (match) {
      return { code: match[1].trim(), name: match[2].trim() }
    }
    const parts = line.split('\t')
    if (parts.length >= 2) {
      return { code: parts[0].replace(/IATA\s*[-–]\s*/i, '').trim(), name: parts[1].trim() }
    }
    return null
  })
  .filter(Boolean)

const AIRCRAFTS = readFileSync(
  path.join(process.cwd(), 'aircraft.txt'),
  'utf-8'
)
  .split('\n')
  .map(a => a.trim())
  .filter(Boolean)

// --- Seeded PRNG ---
function mulberry32(seed) {
  return function() {
    let t = seed += 0x6D2B79F5
    t = Math.imul(t ^ t >>> 15, t | 1)
    t ^= t + Math.imul(t ^ t >>> 7, t | 61)
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

// Create a numeric seed from a string
function stringToSeed(str) {
  let hash = 0, i, chr
  if (str.length === 0) return hash
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + chr
    hash |= 0
  }
  return Math.abs(hash)
}

function getRandomInt(prng, min, max) {
  return Math.floor(prng() * (max - min + 1)) + min
}

function getRandomElement(prng, arr) {
  return arr[getRandomInt(prng, 0, arr.length - 1)]
}

function pad(num) {
  return num.toString().padStart(2, '0')
}

function generateMockFlights(from, to, date) {
  // Use the search params as the seed
  const seed = stringToSeed(`${from}|${to}|${date}`)
  const prng = mulberry32(seed)

  const flights = []
  const numFlights = getRandomInt(prng, 3, 7)
  for (let i = 0; i < numFlights; i++) {
    const airline = getRandomElement(prng, AIRLINES)
    const aircraft = getRandomElement(prng, AIRCRAFTS)
    const depHour = getRandomInt(prng, 6, 22)
    const depMin = getRandomInt(prng, 0, 1) === 0 ? '00' : '30'
    const durationH = getRandomInt(prng, 1, 12)
    const durationM = getRandomInt(prng, 0, 59)
    const arrHour = (depHour + durationH) % 24
    const arrMin = depMin
    const price = getRandomInt(prng, 120, 1200)
    const stops = getRandomInt(prng, 0, 2)
    const flightNum = airline.code + getRandomInt(prng, 100, 999)
    flights.push({
      id: i + 1,
      airline: airline.name,
      airline_code: airline.code,
      flight_number: flightNum,
      duration: `${durationH}h ${durationM}min`,
      stops,
      price,
      departure_time: `${pad(depHour)}:${depMin}`,
      arrival_time: `${pad(arrHour)}:${arrMin}`,
      aircraft
    })
  }
  return flights
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const fromCode = searchParams.get('from')
  const toCode = searchParams.get('to')
  const date = searchParams.get('date')

  if (!fromCode || !toCode) {
    return Response.json([])
  }

  const mockFlights = generateMockFlights(fromCode, toCode, date)
  return Response.json(mockFlights)
}