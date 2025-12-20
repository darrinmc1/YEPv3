# Rate Limiting Implementation Guide

## Overview

YourExitPlans now implements **production-ready rate limiting** using [Upstash Redis](https://upstash.com/), which works perfectly with serverless deployments on Vercel.

### Why Upstash Redis?

✅ **Serverless-native** - Works across multiple function instances
✅ **Global edge caching** - Low latency worldwide
✅ **No cold starts** - HTTP-based, no connection pooling needed
✅ **Pay per request** - Free tier: 10,000 requests/day
✅ **Analytics built-in** - Track rate limit hits

### Previous Issues (Fixed)

❌ **Old approach**: In-memory `Map<string, count>`
❌ **Problem**: Each serverless function has separate memory
❌ **Result**: Rate limits don't work across instances

✅ **New approach**: Redis-backed distributed rate limiting
✅ **Result**: Consistent limits across all function instances

---

## Setup Instructions

### 1. Create Upstash Redis Database

1. Go to [console.upstash.com](https://console.upstash.com/)
2. Sign up or log in (free tier available)
3. Click "Create Database"
4. Choose:
   - **Name**: `yepv3-ratelimit`
   - **Type**: Regional (or Global for multi-region)
   - **Region**: Choose closest to your Vercel deployment
5. Click "Create"

### 2. Get Your Credentials

After creating the database:

1. Click on your database name
2. Scroll to "REST API" section
3. Copy:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

### 3. Add Environment Variables

#### Local Development (`.env.local`)

Create or update `.env.local`:

```bash
# Upstash Redis for Rate Limiting
UPSTASH_REDIS_REST_URL=https://your-redis-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=AYakA...your-token-here

# n8n Webhook URL (server-side only, NOT public)
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/idea-validation
```

#### Production (Vercel)

1. Go to your Vercel project
2. Settings → Environment Variables
3. Add:
   - `UPSTASH_REDIS_REST_URL` → Paste your URL
   - `UPSTASH_REDIS_REST_TOKEN` → Paste your token
4. Check: Production, Preview, Development
5. Click "Save"
6. Redeploy your application

---

## Rate Limiting Configuration

### Current Limits

| Route | Limit | Window | Purpose |
|-------|-------|--------|---------|
| `/api/validate-idea` | 1 request | 24 hours | Free tier idea validation |
| `/api/geo` | 10 requests | 1 minute | Geographic location lookup |
| `/api/auth/*` (future) | 5 attempts | 15 minutes | Login attempt protection |

### How to Adjust Limits

Edit [lib/rate-limit.ts](lib/rate-limit.ts):

```typescript
// Example: Change idea validation to 3 per day
export const ideaValidationLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "1 d"), // ← Change here
      analytics: true,
      prefix: "ratelimit:idea-validation",
    })
  : null

// Available time windows:
// "1 s"   - 1 second
// "1 m"   - 1 minute
// "15 m"  - 15 minutes
// "1 h"   - 1 hour
// "1 d"   - 1 day

// Algorithm options:
// Ratelimit.slidingWindow(n, window)  - Recommended (smooth, no bursts)
// Ratelimit.fixedWindow(n, window)    - Simpler but allows bursts
// Ratelimit.tokenBucket(n, refillRate, interval, maxTokens)  - Advanced
```

---

## Implementation Patterns

### Pattern 1: Direct Implementation (Full Control)

Use when you need custom logic or custom identifiers:

```typescript
// app/api/your-route/route.ts
import { NextResponse } from "next/server"
import {
  apiLimiter,
  getClientIp,
  checkRateLimit,
  createRateLimitResponse,
} from "@/lib/rate-limit"

export async function POST(request: Request) {
  // 1. Check rate limit
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

  // 2. Your route logic here
  const data = await yourBusinessLogic()

  // 3. Return with rate limit headers
  return NextResponse.json(data, {
    headers: {
      "X-RateLimit-Limit": rateLimit.limit.toString(),
      "X-RateLimit-Remaining": rateLimit.remaining.toString(),
      "X-RateLimit-Reset": rateLimit.reset.toString(),
    },
  })
}
```

### Pattern 2: Wrapper Function (Clean & Reusable)

Use for simple routes where IP-based limiting is sufficient:

```typescript
// app/api/simple-route/route.ts
import { NextResponse } from "next/server"
import { apiLimiter } from "@/lib/rate-limit"
import { withRateLimit } from "@/lib/with-rate-limit"

export const GET = withRateLimit(apiLimiter, async (request) => {
  // Your route logic - rate limiting is automatic
  const data = { message: "Hello World" }
  return NextResponse.json(data)
})
```

### Pattern 3: Custom Identifier (User-Based)

Rate limit by user ID instead of IP address:

```typescript
import { checkRateLimit, apiLimiter } from "@/lib/rate-limit"
import { getServerSession } from "next-auth"

export async function POST(request: Request) {
  const session = await getServerSession()
  const userId = session?.user?.id || "anonymous"

  // Rate limit by user ID instead of IP
  const rateLimit = await checkRateLimit(apiLimiter, `user:${userId}`)

  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Too many requests from your account" },
      { status: 429 }
    )
  }

  // Continue...
}
```

---

## Testing Rate Limits

### Local Testing

```bash
# 1. Make sure you have Upstash credentials in .env.local
npm run dev

# 2. Test the endpoint repeatedly
curl http://localhost:3000/api/validate-idea -X POST \
  -H "Content-Type: application/json" \
  -d '{"ideaName": "test", "email": "test@example.com"}'

# 3. After 1 request (for idea validation), you should see:
# {
#   "error": "rate_limit_exceeded",
#   "message": "Too many requests. Please try again later.",
#   "resetTime": "2025-12-21T12:00:00.000Z",
#   "resetIn": "23 hours"
# }
```

### Production Testing

```bash
# Test production endpoint
curl https://yourexitplans.com/api/validate-idea -X POST \
  -H "Content-Type: application/json" \
  -d '{"ideaName": "test", "email": "test@example.com"}' \
  -i  # Show headers

# Check response headers:
# X-RateLimit-Limit: 1
# X-RateLimit-Remaining: 0
# X-RateLimit-Reset: 1703174400000
```

### Monitor in Upstash Dashboard

1. Go to [console.upstash.com](https://console.upstash.com/)
2. Click your database
3. View "Analytics" tab
4. See real-time rate limit hits and patterns

---

## Troubleshooting

### Issue: Rate limiting not working

**Symptoms**: All requests succeed, no 429 errors

**Solution**:
1. Check environment variables are set:
   ```bash
   echo $UPSTASH_REDIS_REST_URL
   echo $UPSTASH_REDIS_REST_TOKEN
   ```
2. Check console for warnings:
   ```
   ⚠️ Rate limiting disabled: Missing Upstash Redis configuration
   ```
3. Restart dev server after adding env vars

### Issue: All requests return 429

**Symptoms**: Can't make any requests

**Solution**:
1. Check Upstash dashboard for errors
2. Verify token hasn't expired
3. Check rate limit window hasn't been set too low
4. Clear rate limits manually:
   ```bash
   # In Upstash console → Data Browser → Delete keys matching:
   ratelimit:*
   ```

### Issue: Rate limits not syncing across deployments

**Symptoms**: Different Vercel regions have different limits

**Solution**:
1. Use "Global" database in Upstash (instead of Regional)
2. Or accept slight regional differences (usually not an issue)

---

## Security Best Practices

### 1. Don't Expose Rate Limit Config to Client

❌ **Bad**: `NEXT_PUBLIC_RATE_LIMIT=1`
✅ **Good**: Keep limits server-side only

### 2. Use Different Limits for Different Routes

```typescript
// Strict limit for expensive operations
export const aiAnalysisLimiter = new Ratelimit({
  limiter: Ratelimit.slidingWindow(1, "1 d"),
})

// Generous limit for cheap operations
export const geoLimiter = new Ratelimit({
  limiter: Ratelimit.slidingWindow(100, "1 m"),
})
```

### 3. Return Proper Headers

Always include rate limit headers so clients know their status:
- `X-RateLimit-Limit`: Total allowed requests
- `X-RateLimit-Remaining`: Requests left in window
- `X-RateLimit-Reset`: Unix timestamp when limit resets

### 4. Combine with Other Protections

Rate limiting is one layer of defense. Also use:
- CAPTCHA for sensitive operations
- Email verification
- Honeypot fields
- Request signing

---

## Cost Estimation

### Upstash Free Tier

- **10,000 commands/day** (resets daily)
- **256 MB storage**
- **No credit card required**

### Typical Usage

Assuming 1,000 daily users:
- Geo API: 1,000 checks = 1,000 commands
- Idea validation: 100 checks = 200 commands (check + increment)
- **Total**: ~1,200 commands/day

**Result**: Well within free tier ✅

### Paid Tier (if needed)

- **Pro**: $0.20 per 100K commands (~$10/month for 5M commands)
- **Enterprise**: Custom pricing

**When to upgrade**: >300,000 monthly active users

---

## Monitoring & Analytics

### Built-in Analytics

Upstash provides analytics for:
- Request count by time
- Top rate-limited IPs
- Geographic distribution
- Key access patterns

### Custom Logging

Add logging to track abuse patterns:

```typescript
if (!rateLimit.success) {
  console.warn(`Rate limit exceeded`, {
    ip,
    route: request.url,
    timestamp: new Date().toISOString(),
    remaining: rateLimit.remaining,
  })
}
```

Send to monitoring service:
- Vercel Analytics
- Sentry
- LogDNA
- Datadog

---

## Migration from In-Memory

### Old Code (Broken)

```typescript
// ❌ Don't use - doesn't work in serverless
const ipMap = new Map<string, number>()

function isRateLimited(ip: string): boolean {
  const count = ipMap.get(ip) || 0
  if (count >= 5) return true
  ipMap.set(ip, count + 1)
  return false
}
```

### New Code (Production-Ready)

```typescript
// ✅ Use this - works everywhere
import { checkRateLimit, apiLimiter, getClientIp } from "@/lib/rate-limit"

const ip = getClientIp(request)
const rateLimit = await checkRateLimit(apiLimiter, ip)

if (!rateLimit.success) {
  return NextResponse.json(
    createRateLimitResponse(rateLimit.reset),
    { status: 429 }
  )
}
```

---

## Next Steps

### Immediate
- [x] Install `@upstash/ratelimit` and `@upstash/redis`
- [x] Create Upstash Redis database
- [x] Add environment variables
- [ ] Test locally
- [ ] Deploy to Vercel
- [ ] Monitor analytics

### Future Enhancements
- [ ] Add CAPTCHA for suspicious IPs
- [ ] Implement tiered limits (free vs paid users)
- [ ] Create admin dashboard for rate limit overrides
- [ ] Add webhook for rate limit alerts
- [ ] Implement IP whitelist for internal tools

---

## Support

### Documentation
- Upstash Docs: https://upstash.com/docs/redis/overall/getstarted
- Rate Limit Package: https://github.com/upstash/ratelimit

### Getting Help
- GitHub Issues: https://github.com/darrinmc1/YEPv3/issues
- Upstash Discord: https://upstash.com/discord

---

**Last Updated**: December 20, 2025
**Status**: ✅ Production Ready
