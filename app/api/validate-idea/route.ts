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
 * Async Implementation:
 * 1. Checks rate limit
 * 2. Creates a "VALIDATION" job in DB
 * 3. Triggers n8n webhook with job details
 * 4. Returns jobId to client for polling
 */
export async function POST(request: Request) {
  try {
    // 1. Rate Limiting
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

    // 2. Create Job
    const job = await createJob("VALIDATION")

    // 3. Trigger n8n (Async)
    // We expect n8n to respond immediately to acknowledge receipt, 
    // then process in background and call our webhook.
    const baseUrl = process.env.NEXTAUTH_URL
      ? process.env.NEXTAUTH_URL
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"

    const callbackUrl = `${baseUrl}/api/webhooks/job-result`

    // N8N Webhook URL
    const n8nUrl = process.env.N8N_VALIDATION_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL

    if (n8nUrl) {
      // Fire and forget - or await depending on n8n config. 
      // Ideally n8n responds 200 OK immediately.
      // We pass the payload + jobId + callbackUrl
      await callN8nWebhook(n8nUrl, {
        ...body,
        jobId: job.id,
        callbackUrl
      })
    } else {
      // Fallback for dev/missing env: Mark as failed immediately
      console.error("N8N Webhook URL missing")
      return NextResponse.json({ error: "Configuration Error" }, { status: 500 })
    }

    // 4. Return Job ID
    return NextResponse.json({
      jobId: job.id,
      status: "PENDING"
    }, {
      headers: {
        "X-RateLimit-Limit": rateLimit.limit.toString(),
        "X-RateLimit-Remaining": rateLimit.remaining.toString(),
        "X-RateLimit-Reset": rateLimit.reset.toString(),
      },
    })

  } catch (error) {
    console.error("API Route Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
