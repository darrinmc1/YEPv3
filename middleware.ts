import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyAdminToken } from "@/lib/admin-auth"

export function middleware(request: NextRequest) {
  // Only check admin routes, not the login page
  if (
    request.nextUrl.pathname === "/admin" ||
    (request.nextUrl.pathname.startsWith("/admin/") && 
     !request.nextUrl.pathname.startsWith("/admin/login"))
  ) {
    // Check for admin token cookie
    const adminToken = request.cookies.get("admin-token")

    if (!adminToken) {
      // No token found - redirect to login
      const loginUrl = new URL("/admin/login", request.url)
      loginUrl.searchParams.set("from", request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Verify the JWT token
    const payload = verifyAdminToken(adminToken.value)

    if (!payload) {
      // Invalid or expired token - redirect to login
      const loginUrl = new URL("/admin/login", request.url)
      loginUrl.searchParams.set("from", request.nextUrl.pathname)
      loginUrl.searchParams.set("error", "session_expired")
      
      // Clear the invalid cookie
      const response = NextResponse.redirect(loginUrl)
      response.cookies.set("admin-token", "", {
        path: "/",
        maxAge: 0,
      })
      
      return response
    }

    // Token is valid - allow access
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
