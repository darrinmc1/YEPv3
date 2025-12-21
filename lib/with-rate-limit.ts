import { NextResponse } from "next/server"
import type { Ratelimit } from "@upstash/ratelimit"
import { getClientIp, checkRateLimit, createRateLimitResponse } from "./rate-limit"

/**
 * Higher-order function to wrap API routes with rate limiting
 *
 * Usage:
 * ```typescript
 * import { apiLimiter } from "@/lib/rate-limit"
 * import { withRateLimit } from "@/lib/with-rate-limit"
 *
 * export const GET = withRateLimit(apiLimiter, async (request) => {
 *   // Your route logic here
 *   return NextResponse.json({ data: "..." })
 * })
 * ```
 */
export function withRateLimit(
  limiter: Ratelimit | null,
  handler: (request: Request) => Promise<Response>
) {
  return async (request: Request): Promise<Response> => {
    // Apply rate limiting
    const ip = getClientIp(request)
    const rateLimit = await checkRateLimit(limiter, ip)

    if (!rateLimit.success) {
      return NextResponse.json(createRateLimitResponse(rateLimit.reset), {
        status: 429,
        headers: {
          "X-RateLimit-Limit": rateLimit.limit.toString(),
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
          "X-RateLimit-Reset": rateLimit.reset.toString(),
        },
      })
    }

    // Execute the actual handler
    const response = await handler(request)

    // Add rate limit headers to successful responses
    const headers = new Headers(response.headers)
    headers.set("X-RateLimit-Limit", rateLimit.limit.toString())
    headers.set("X-RateLimit-Remaining", rateLimit.remaining.toString())
    headers.set("X-RateLimit-Reset", rateLimit.reset.toString())

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    })
  }
}

/**
 * Example usage with custom identifier (e.g., user ID instead of IP)
 *
 * ```typescript
 * export const POST = async (request: Request) => {
 *   const userId = await getUserId(request)
 *   const rateLimit = await checkRateLimit(apiLimiter, `user:${userId}`)
 *
 *   if (!rateLimit.success) {
 *     return NextResponse.json(createRateLimitResponse(rateLimit.reset), { status: 429 })
 *   }
 *
 *   // Continue with route logic...
 * }
 * ```
 */
