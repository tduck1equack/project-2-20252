import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Role to portal mapping
const rolePortals: Record<string, string> = {
    CUSTOMER: '/customer',
    EMPLOYEE: '/employee',
    MANAGER: '/manager',
    ADMIN: '/admin',
    ACCOUNTANT: '/employee', // Accountants use employee portal
};

// Protected routes that require authentication
const protectedPaths = ['/customer', '/employee', '/manager', '/admin'];

// Public paths that don't require auth
const publicPaths = ['/', '/login', '/register'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip API routes and static files
    if (
        pathname.startsWith('/api') ||
        pathname.startsWith('/_next') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // Check if path is protected
    const isProtectedPath = protectedPaths.some((path) =>
        pathname.startsWith(path)
    );

    // For now, middleware just lets requests through
    // Client-side auth context handles redirects
    // Full server-side validation would require JWT verification here

    // Note: Cookie-based JWT validation could be added here
    // But for simplicity, we rely on client-side auth context

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Match all paths except static files
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
