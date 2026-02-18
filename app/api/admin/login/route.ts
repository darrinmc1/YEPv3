import { NextRequest, NextResponse } from "next/server"
import { adminLoginSchema } from "@/lib/validations/schemas"
import { verifyAdminCredentials } from "@/lib/admin-auth"
import { generateAdminToken } from "@/lib/auth-token"
import { checkRateLimit, getRateLimitHeaders, authLimiter } from "@/lib/rate-limit"

export async function POST(req: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = req.headers.get('x-forwarded-for') ||
      req.headers.get('x-real-ip') ||
      'unknown'

    // Rate limiting: 5 attempts per 15 minutes per IP
    // Rate limiting: 5 attempts per 15 minutes per IP
    const rateLimit = await checkRateLimit(
      authLimiter,
      `admin-login:${ip}`
    )

    if (!rateLimit.success) {
      const resetDate = new Date(rateLimit.reset)
      return NextResponse.json(
        {
          success: false,
          error: "Too many login attempts. Please try again later.",
          resetTime: resetDate.toISOString()
        },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimit)
        }
      )
    }

    // Parse and validate request body
    const body = await req.json()
    const validation = adminLoginSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input",
          details: validation.error.errors
        },
        {
          status: 400,
          headers: getRateLimitHeaders(rateLimit)
        }
      )
    }

    const { email, password } = validation.data

    // Verify credentials
    const isValid = verifyAdminCredentials(email, password)

    if (!isValid) {
      // Add artificial delay to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 1000))

      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password"
        },
        {
          status: 401,
          headers: getRateLimitHeaders(rateLimit)
        }
      )
    }

    // Generate JWT token
    const token = await generateAdminToken(email)

    // Create response with secure cookie
    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful"
      },
      {
        status: 200,
        headers: getRateLimitHeaders(rateLimit)
      }
    )

    // Set secure HTTP-only cookie
    const isProduction = process.env.NODE_ENV === 'production'
    const cookieOptions = [
      'admin-token=' + token,
      'Path=/',
      'HttpOnly',
      'SameSite=Strict',
      'Max-Age=' + (24 * 60 * 60), // 24 hours
      ...(isProduction ? ['Secure'] : [])
    ].join('; ')

    response.headers.set('Set-Cookie', cookieOptions)

    return response

  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred during login"
      },
      { status: 500 }
    )
  }
}

// Logout endpoint
export async function DELETE(req: NextRequest) {
  const response = NextResponse.json(
    { success: true, message: "Logged out successfully" },
    { status: 200 }
  )

  // Clear the cookie
  response.headers.set(
    'Set-Cookie',
    'admin-token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0'
  )

  return response
}
