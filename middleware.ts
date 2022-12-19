// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone()
    if(url.pathname.substring(1).split('/')[0] !== '_next' && url.pathname !== '/weather') {
        url.pathname = '/weather'
        return NextResponse.redirect(url)
    }
}