import { cookies } from 'next/headers'

// Replace with real authentication
const ADMIN_USER = 'scott'
const ADMIN_PASSWORD = '123flyhigh' // In production, use hashed passwords!

export async function POST(request) {
  const data = await request.json()
  const { username, password } = data

  if (username === ADMIN_USER && password === ADMIN_PASSWORD) {
    const cookieStore = await cookies()
    // Set token cookie
    cookieStore.set({
      name: 'token',
      value: 'admin-session-token',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 1 day
    })
    // Set role cookie
    cookieStore.set({
      name: 'role',
      value: 'admin',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 1 day
    })
    // Set admin_auth cookie
    cookieStore.set({
      name: 'admin_auth',
      value: 'true',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 1 day
    })
    return Response.json({ success: true })
  } else {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 })
  }
}