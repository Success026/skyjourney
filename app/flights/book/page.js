'use client'
import { Suspense } from 'react'
import FlightBookingPage from '../../../components/FlightBookingPage'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FlightBookingPage />
    </Suspense>
  )
}