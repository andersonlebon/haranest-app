import { updateSession } from '@/utils/supabase/middleware'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Get session/user
  const { user, response } = await updateSession(request)

  const url = request.nextUrl.clone()
  const pathname = url.pathname

  // Define private and public routes
  const privateRoutes = ['/dashboard', '/profile', '/settings'] // protected routes
  const publicRoutes = ['/login', '/signup', '/about', '/'] // accessible without auth

  // Redirect unauthenticated users trying to access private routes
  if (privateRoutes.some((route) => pathname.startsWith(route)) && !user) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Optional: redirect authenticated users away from public pages like login/signup
  if (user && ['/login', '/signup'].some((route) => pathname.startsWith(route))) {
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}