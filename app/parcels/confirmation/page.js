'use client'
import { Suspense } from 'react'
import ParcelConfirmationPage from '../../../components/ParcelConfirmationPage'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ParcelConfirmationPage />
    </Suspense>
  )
}