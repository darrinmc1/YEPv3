import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

/**
 * Rate Limiting Configuration
 *
 * This module provides production-ready rate limiting using Upstash Redis.
 * Works across multiple serverless function instances (unlike in-memory solutions).
 *
 * Setup:
 * 1. Create a Redis database at https://console.upstash.com/
 * 2. Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to .env
 */

// Initialize Redis client
// Only create if environment variables are set
let redis: Redis | null = null
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })
}

/**
 * Rate Limiter Configurations
 *
 * sliding window: More accurate, prevents bursts at window boundaries
 * fixed window: Simpler, but can allow 2x requests at window boundaries
 */

// Free tier: 1 request per day per IP
export const ideaValidationLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(1, "1 d"), // 1 request per day
      analytics: true,
      prefix: "ratelimit:idea-validation",
    })
  : null

// API routes: 10 requests per minute per IP
export const apiLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per minute
      analytics: true,
      prefix: "ratelimit:api",
    })
  : null

// Auth routes: 5 attempts per 15 minutes per IP
export const authLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "15 m"), // 5 attempts per 15 min
      analytics: true,
      prefix: "ratelimit:auth",
    })
  : null

/**
 * Extract IP address from request
 * Handles various proxy headers (Vercel, Cloudflare, etc.)
 */
export function getClientIp(request: Request): string {
  // Try various headers in order of preference
  const forwardedFor = request.headers.get("x-forwarded-for")
  const realIp = request.headers.get("x-real-ip")
  const cfConnectingIp = request.headers.get("cf-connecting-ip")

  if (cfConnectingIp) return cfConnectingIp
  if (realIp) return realIp
  if (forwardedFor) return forwardedFor.split(",")[0].trim()

  return "unknown"
}

/**
 * Rate limit response type
 */
export type RateLimitResult = {
  success: boolean
  limit: number
  remaining: number
  reset: number
  pending: Promise<unknown>
}

/**
 * Apply rate limit and return standardized result
 *
 * @param limiter - The rate limiter instance to use
 * @param identifier - Unique identifier (usually IP address)
 * @returns Rate limit result with success, remaining, reset time
 */
export async function checkRateLimit(
  limiter: Ratelimit | null,
  identifier: string
): Promise<RateLimitResult> {
  // If rate limiting is not configured (missing env vars), allow all requests
  // This allows development without Redis, but logs a warning
  if (!limiter) {
    console.warn("⚠️ Rate limiting disabled: Missing Upstash Redis configuration")
    return {
      success: true,
      limit: 999999,
      remaining: 999999,
      reset: Date.now(),
      pending: Promise.resolve(),
    }
  }

  // Check rate limit
  const result = await limiter.limit(identifier)

  return result
}

/**
 * Helper to create rate limit error response
 */
export function createRateLimitResponse(reset: number) {
  const resetDate = new Date(reset)
  const now = new Date()
  const minutesUntilReset = Math.ceil((resetDate.getTime() - now.getTime()) / 60000)

  let resetMessage = ""
  if (minutesUntilReset < 60) {
    resetMessage = `${minutesUntilReset} minute${minutesUntilReset !== 1 ? "s" : ""}`
  } else {
    const hours = Math.ceil(minutesUntilReset / 60)
    resetMessage = `${hours} hour${hours !== 1 ? "s" : ""}`
  }

  return {
    error: "rate_limit_exceeded",
    message: "Too many requests. Please try again later.",
    resetTime: resetDate.toISOString(),
    resetIn: resetMessage,
  }
}

/**
 * Usage Example:
 *
 * ```typescript
 * import { ideaValidationLimiter, getClientIp, checkRateLimit, createRateLimitResponse } from "@/lib/rate-limit"
 *
 * export async function POST(request: Request) {
 *   const ip = getClientIp(request)
 *   const rateLimit = await checkRateLimit(ideaValidationLimiter, ip)
 *
 *   if (!rateLimit.success) {
 *     return NextResponse.json(
 *       createRateLimitResponse(rateLimit.reset),
 *       { status: 429 }
 *     )
 *   }
 *
 *   // Process request...
 * }
 * ```
 */
