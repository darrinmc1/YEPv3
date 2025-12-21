import { NextResponse } from "next/server"
import { apiLimiter, getClientIp, checkRateLimit, createRateLimitResponse } from "@/lib/rate-limit"

const SOUTH_ASIA = new Set(["IN", "PK", "BD"])

/**
 * GET /api/geo
 *
 * Returns user's geographic location and currency preference.
 * Rate limited to 10 requests per minute per IP.
 */
export async function GET(request: Request) {
  // Apply rate limiting
  const ip = getClientIp(request)
  const rateLimit = await checkRateLimit(apiLimiter, ip)

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

  // Prefer Vercel country header; fall back to Accept-Language / timezone heuristics.
  const countryHeader =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("x-country-code") ||
    request.headers.get("cf-ipcountry") ||
    ""

  let country = countryHeader.toUpperCase()

  // If no server-provided country, use very light heuristics from headers
  if (!country) {
    const acceptLang = request.headers.get("accept-language") || ""
    if (/-(IN|PK|BD)\b/i.test(acceptLang)) {
      country = acceptLang.match(/-(IN|PK|BD)\b/i)?.[1]?.toUpperCase() || ""
    }
  }

  const isSouthAsia = SOUTH_ASIA.has(country)
  const currency = isSouthAsia ? "INR" : "USD"

  return NextResponse.json(
    {
      country: country || null,
      region: isSouthAsia ? "SOUTH_ASIA" : "OTHER",
      currency, // "INR" or "USD"
    },
    {
      headers: {
        "X-RateLimit-Limit": rateLimit.limit.toString(),
        "X-RateLimit-Remaining": rateLimit.remaining.toString(),
        "X-RateLimit-Reset": rateLimit.reset.toString(),
      },
    }
  )
}
