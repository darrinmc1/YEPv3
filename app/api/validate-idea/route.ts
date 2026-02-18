import { NextResponse } from "next/server"
import {
  ideaValidationLimiter,
  getClientIp,
  checkRateLimit,
  createRateLimitResponse,
} from "@/lib/rate-limit"
import { validateIdeaWithGemini } from "@/lib/services/gemini-validation"

/**
 * POST /api/validate-idea
 *
 * Validates a business idea by forwarding to n8n webhook with AI analysis.
 * Implements Redis-based rate limiting: 1 request per day per IP (free tier).
 * 
 * Falls back to direct Gemini AI analysis if n8n webhook fails.
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

    // 2. Parse request body
    const body = await request.json()

    // 3. Try n8n webhook for AI analysis
    const webhookUrl = process.env.N8N_WEBHOOK_URL

    if (webhookUrl) {
      try {
        console.log("Attempting n8n validation...")
        const webhookResponse = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
          // Short timeout for n8n to avoid hanging
          signal: AbortSignal.timeout(10000),
        })

        if (webhookResponse.ok) {
          const data = await webhookResponse.json()
          console.log("n8n validation successful")
          return NextResponse.json(data, {
            headers: {
              "X-RateLimit-Limit": rateLimit.limit.toString(),
              "X-RateLimit-Remaining": rateLimit.remaining.toString(),
              "X-RateLimit-Reset": rateLimit.reset.toString(),
            },
          })
        }
        console.warn(`n8n webhook returned error: ${webhookResponse.status}`)
      } catch (webhookError) {
        console.error("n8n webhook connection failed, falling back to Gemini", webhookError)
      }
    } else {
      console.warn("Missing N8N_WEBHOOK_URL, using Gemini fallback directly")
    }

    // 4. Fallback to direct Gemini AI for validation
    console.log("Running Gemini validation fallback...")
    try {
      const geminiResult = await validateIdeaWithGemini({
        ideaName: body.ideaName,
        oneLiner: body.oneLiner,
        problemSolved: body.problemSolved,
        targetCustomer: body.targetCustomer,
        businessType: body.businessType,
        industry: body.industry,
        priceRange: body.priceRange,
      })

      return NextResponse.json(geminiResult, {
        headers: {
          "X-RateLimit-Limit": rateLimit.limit.toString(),
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
          "X-RateLimit-Reset": rateLimit.reset.toString(),
        },
      })
    } catch (geminiError) {
      console.error("Gemini validation fallback failed", geminiError)
      throw new Error("All AI validation providers failed. Please try again later.")
    }

  } catch (error) {
    console.error("API Route Error:", error)

    // Don't leak error details to client
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Something went wrong processing your request. Please try again later.",
      },
      { status: 500 }
    )
  }
}
