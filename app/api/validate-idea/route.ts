import { NextResponse } from "next/server"

// Simple in-memory rate limiting
// In a real production app with multiple instances, use Redis (e.g., @upstash/ratelimit)
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5
const ipRequestMap = new Map<string, { count: number; lastReset: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const record = ipRequestMap.get(ip)

  if (!record) {
    ipRequestMap.set(ip, { count: 1, lastReset: now })
    return false
  }

  if (now - record.lastReset > RATE_LIMIT_WINDOW) {
    // Reset window
    record.count = 1
    record.lastReset = now
    return false
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return true
  }

  record.count++
  return false
}

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting
    // In Next.js App Router, extracting IP can be tricky.
    // For this simple example, we'll try to get it from headers or fallback.
    const forwardedFor = req.headers.get("x-forwarded-for")
    const ip = forwardedFor ? forwardedFor.split(",")[0] : "unknown-ip"

    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          error: "Too Many Requests",
          message: "You have reached the limit of free analyses. Please try again in a minute.",
          resetTime: "1 minute"
        },
        { status: 429 }
      )
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

    // 3. Forward the request
    const body = await req.json()
    
    // Optional: Add server-side validation here if needed
    
    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
         // Add any secret headers here if N8N expects them
         // "X-Secret-Key": process.env.N8N_SECRET_KEY
      },
      body: JSON.stringify(body)
    })

    if (!webhookResponse.ok) {
      console.error(`Webhook error: ${webhookResponse.status}`)
      return NextResponse.json(
        { error: "External API Error", message: "Failed to process analysis." },
        { status: webhookResponse.status }
      )
    }

    const data = await webhookResponse.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error("API Route Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error", message: "Something went wrong processing your request." },
      { status: 500 }
    )
  }
}
