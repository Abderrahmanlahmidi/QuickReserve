import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('access_token')?.value
    const userCookie = request.cookies.get('user')?.value
    const { pathname } = request.nextUrl

    let user = null
    if (userCookie) {
        try {
            user = JSON.parse(decodeURIComponent(userCookie))
        } catch (e) {
            console.error('Middleware: Failed to parse user cookie', e)
        }
    }

    const authRoutes = ['/auth/login', '/auth/register']
    const protectedRoutes = ['/events', '/my-events', '/dashboard', '/profile']


    if (token && authRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    if (!token && protectedRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    if (token && user) {
        if (pathname.startsWith('/my-events') || pathname.startsWith('/dashboard')) {
            if (user.role !== 'ADMIN') {
                return NextResponse.redirect(new URL('/', request.url))
            }
        }

        if (pathname.startsWith('/events')) {}
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
