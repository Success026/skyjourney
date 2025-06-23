'use client'
import { Suspense } from 'react'
import FlightBookingConfirmationPage from '../../../components/FlightBookingConfirmationPage'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FlightBookingConfirmationPage />
    </Suspense>
  )
}