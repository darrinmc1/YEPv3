import { NextResponse } from "next/server"
import {
  ideaValidationLimiter,
  getClientIp,
  checkRateLimit,
  createRateLimitResponse,
} from "@/lib/rate-limit"
import { createJob } from "@/lib/services/jobs"
import { callN8nWebhook } from "@/lib/services/n8n"

/**
 * POST /api/validate-idea
 *
 * Async flow:
 * 1. Rate limit check
 * 2. Create a Job in the DB (returns jobId)
 * 3. Fire n8n webhook with jobId + callbackUrl
 * 4. Return jobId — client polls /api/jobs/[id] for result
 */
export async function POST(request: Request) {
  try {
    // 1. Rate limiting
    const ip = getClientIp(request)
    const rateLimit = await checkRateLimit(ideaValidationLimiter, ip)

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

    const body = await request.json()

    // 2. Create async job
    const job = await createJob("VALIDATION")

    // 3. Build callback URL so n8n can POST the result back
    const baseUrl = process.env.NEXTAUTH_URL
      ? process.env.NEXTAUTH_URL
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"

    const callbackUrl = `${baseUrl}/api/webhooks/job-result`

    const n8nUrl =
      process.env.N8N_VALIDATION_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL

    if (!n8nUrl) {
      console.error("N8N Webhook URL missing — set N8N_VALIDATION_WEBHOOK_URL")
      return NextResponse.json(
        { error: "Configuration Error", message: "Server not configured for idea validation." },
        { status: 500 }
      )
    }

    // Fire and forget — n8n responds 200 immediately then processes async
    callN8nWebhook(n8nUrl, {
      ...body,
      jobId: job.id,
      callbackUrl,
    }).catch((err) => console.error("n8n fire-and-forget error:", err))

    // 4. Return jobId for polling
    return NextResponse.json(
      { jobId: job.id, status: "PENDING" },
      {
        headers: {
          "X-RateLimit-Limit": rateLimit.limit.toString(),
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
          "X-RateLimit-Reset": rateLimit.reset.toString(),
        },
      }
    )
  } catch (error) {
    console.error("API Route Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error", message: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
