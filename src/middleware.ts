import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const token = request.cookies.get('token')?.value
  const user = request.cookies.get('user')?.value

  // Allow public paths
  if (pathname === '/login' || pathname.startsWith('/_next') || pathname.startsWith('/public')) {
    return NextResponse.next()
  }

  // Check if user is authenticated
  if (!token || !user) {
    // Redirect to login if accessing protected routes
    if (pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }

  // Parse user from cookie
  try {
    const decodedUser = user.startsWith('%') ? decodeURIComponent(user) : user
    const userData = JSON.parse(decodedUser)
    const userRole = userData.role

    // Protect RT routes
    if (pathname.startsWith('/dashboard/rt')) {
      if (userRole !== 'RT') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    // Protect warga-specific routes
    if (pathname === '/dashboard' || pathname.startsWith('/dashboard/katalog') || pathname.startsWith('/dashboard/pinjaman') || pathname.startsWith('/dashboard/riwayat') || pathname.startsWith('/dashboard/profil')) {
      if (userRole !== 'WARGA') {
        return NextResponse.redirect(new URL('/dashboard/rt', request.url))
      }
    }
  } catch (error) {
    console.error('Error parsing user cookie:', error)
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}
