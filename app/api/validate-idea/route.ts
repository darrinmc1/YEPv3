import { NextResponse } from "next/server"
import {
  ideaValidationLimiter,
  getClientIp,
  checkRateLimit,
  createRateLimitResponse,
} from "@/lib/rate-limit"

/**
 * POST /api/validate-idea
 *
 * Validates a business idea by forwarding to n8n webhook with AI analysis.
 * Implements Redis-based rate limiting: 1 request per day per IP (free tier).
 *
 * Rate Limit: 1 request per 24 hours per IP address
 * Returns: 429 if rate limit exceeded, 200 with analysis on success
 */
export async function POST(request: Request) {
  try {
    // 1. Rate Limiting with Redis (production-ready)
    const ip = getClientIp(request)
    const rateLimit = await checkRateLimit(ideaValidationLimiter, ip)

    if (!rateLimit.success) {
      console.log(`Rate limit exceeded for IP: ${ip}`)
      return NextResponse.json(createRateLimitResponse(rateLimit.reset), {
        status: 429,
        headers: {
          "X-RateLimit-Limit": rateLimit.limit.toString(),
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
          "X-RateLimit-Reset": rateLimit.reset.toString(),
        },
      })
    }

    // 2. Validate Configuration
    const webhookUrl = process.env.N8N_WEBHOOK_URL
    if (!webhookUrl) {
      console.error("Missing N8N_WEBHOOK_URL environment variable")
      return NextResponse.json(
        { error: "Configuration Error", message: "Server configuration invalid." },
        { status: 500 }
      )
    }

    // 3. Parse and validate request body
    const body = await request.json()

    // Optional: Add Zod schema validation here for extra security
    // const validatedBody = ideaValidationSchema.parse(body)

    // 4. Forward to n8n webhook for AI analysis
    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add secret header if n8n webhook requires authentication
        // "X-Webhook-Secret": process.env.N8N_WEBHOOK_SECRET || "",
      },
      body: JSON.stringify(body),
    })

    if (!webhookResponse.ok) {
      console.error(`n8n webhook error: ${webhookResponse.status}`)

      // Check if it's a rate limit from n8n side
      if (webhookResponse.status === 429) {
        return NextResponse.json(
          {
            error: "rate_limit_exceeded",
            message: "Analysis service is currently busy. Please try again in a few minutes.",
          },
          { status: 429 }
        )
      }

      return NextResponse.json(
        { error: "External API Error", message: "Failed to process analysis." },
        { status: webhookResponse.status }
      )
    }

    // 5. Return analysis results
    const data = await webhookResponse.json()

    return NextResponse.json(data, {
      headers: {
        "X-RateLimit-Limit": rateLimit.limit.toString(),
        "X-RateLimit-Remaining": rateLimit.remaining.toString(),
        "X-RateLimit-Reset": rateLimit.reset.toString(),
      },
    })
  } catch (error) {
    console.error("API Route Error:", error)

    // Don't leak error details to client
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Something went wrong processing your request. Please try again later.",
      },
      { status: 500 }
    )
  }
}
