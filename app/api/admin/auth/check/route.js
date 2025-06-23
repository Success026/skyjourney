import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  const adminAuth = cookieStore.get('admin_auth')
  
  return Response.json({ authenticated: adminAuth?.value === 'true' })
}