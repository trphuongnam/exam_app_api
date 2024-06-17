import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { authenticationRouter } from './app/common/util/functions/authenticationRouter'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  if (!authenticationRouter(request.cookies)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/top', '/exam/:id'],
}