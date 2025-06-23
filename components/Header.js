'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Plane } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Plane className="w-8 h-8" />
            <span className="text-xl font-bold">SkyJourney</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="hover:text-blue-200 transition-colors">
              Home
            </Link>
            <Link href="/flights" className="hover:text-blue-200 transition-colors">
              Flights
            </Link>
            <Link href="/parcels" className="hover:text-blue-200 transition-colors">
              Parcels
            </Link>
            <Link href="/about" className="hover:text-blue-200 transition-colors">
              About
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-blue-500">
            <div className="flex flex-col space-y-2">
              <Link href="/" className="py-2 hover:text-blue-200 transition-colors">
                Home
              </Link>
              <Link href="/flights" className="py-2 hover:text-blue-200 transition-colors">
                Flights
              </Link>
              <Link href="/parcels" className="py-2 hover:text-blue-200 transition-colors">
                Parcels
              </Link>
              <Link href="/about" className="py-2 hover:text-blue-200 transition-colors">
                About
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}