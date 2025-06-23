'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Package, Plane, LogOut, User, Settings } from 'lucide-react'

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Skip auth check for login page
    if (isLoginPage) {
      setLoading(false)
      return
    }

    // Check if admin is logged in
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/auth/check')
        const data = await res.json()
        
        if (!data.authenticated) {
          router.push('/admin/login')
        } else {
          setIsAuthenticated(true)
        }
      } catch (error) {
        router.push('/admin/login')
      } finally {
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [router, isLoginPage])

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  // Special case for login page - just render the children without the admin layout
  if (isLoginPage) {
    return <div className="min-h-screen bg-gray-100">{children}</div>
  }
  
  // For other admin pages, check authentication
  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  // Normal admin layout with sidebar
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white">
        <div className="p-4">
          <h1 className="text-xl font-bold mb-6">Admin Dashboard</h1>
          
          <nav className="space-y-2">
            <Link href="/admin" className="flex items-center p-2 rounded hover:bg-blue-700">
              <Settings className="mr-2 h-5 w-5" />
              Dashboard
            </Link>
            <Link href="/admin/parcels" className="flex items-center p-2 rounded hover:bg-blue-700">
              <Package className="mr-2 h-5 w-5" />
              Parcels
            </Link>
            <Link href="/admin/flights" className="flex items-center p-2 rounded hover:bg-blue-700">
              <Plane className="mr-2 h-5 w-5" />
              Flights
            </Link>
            <button 
              onClick={handleLogout}
              className="flex w-full items-center p-2 rounded hover:bg-blue-700 mt-8"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </button>
          </nav>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
}