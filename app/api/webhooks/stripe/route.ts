// app/api/webhooks/stripe/route.ts
//
// Receives purchase notifications from n8n (workflow 06_stripe_purchase_webhook.json)
// after Stripe fires an event. n8n validates the Stripe event then calls this endpoint
// with a clean payload to record the purchase in the DB.
//
// Also handles direct Stripe webhook events if you wire Stripe → this endpoint directly
// in the Stripe dashboard (add STRIPE_WEBHOOK_SECRET to .env.local for signature verification).

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Optional: verify Stripe signature when called directly by Stripe
async function verifyStripeSignature(req: NextRequest, rawBody: string): Promise<boolean> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) return true // skip if not configured

  const sig = req.headers.get('stripe-signature')
  if (!sig) return false

  try {
    // Dynamic import so Stripe SDK is optional
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2023-10-16' as any })
    stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
    return true
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  try {
    // Allow calls from n8n (x-n8n-secret) OR direct from Stripe (stripe-signature)
    const n8nSecret = req.headers.get('x-n8n-secret')
    const stripeSignature = req.headers.get('stripe-signature')

    const rawBody = await req.text()
    let body: any

    try {
      body = JSON.parse(rawBody)
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    // Validate caller
    const isFromN8n = n8nSecret === process.env.CRON_SECRET
    const isFromStripe = stripeSignature ? await verifyStripeSignature(req, rawBody) : false

    if (!isFromN8n && !isFromStripe) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // If called directly from Stripe, extract the event payload
    let email: string
    let customerName: string
    let amountPaid: number
    let currency: string
    let sessionId: string
    let productName: string
    let planTier: string
    let roadmapId: string
    let metadata: Record<string, string>

    if (isFromStripe && body.type) {
      // Direct Stripe event
      const eventData = body.data?.object || {}
      email = eventData.customer_details?.email || eventData.receipt_email || ''
      customerName = eventData.customer_details?.name || ''
      amountPaid = (eventData.amount_total || eventData.amount_received || 0) / 100
      currency = (eventData.currency || 'aud').toUpperCase()
      sessionId = eventData.id || ''
      metadata = eventData.metadata || {}
      productName = metadata.productName || metadata.product_name || 'YourExitPlans'
      planTier = metadata.planTier || metadata.plan_tier || 'starter'
      roadmapId = metadata.roadmapId || metadata.roadmap_id || ''
    } else {
      // From n8n (already extracted)
      email = body.email || ''
      customerName = body.customerName || ''
      amountPaid = body.amountPaid || 0
      currency = body.currency || 'AUD'
      sessionId = body.sessionId || ''
      productName = body.productName || 'YourExitPlans'
      planTier = body.planTier || 'starter'
      roadmapId = body.roadmapId || ''
      metadata = body.metadata || {}
    }

    if (!email) {
      return NextResponse.json({ error: 'No email in payload' }, { status: 400 })
    }

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: customerName || null,
        },
      })
      console.log(`Created new user for purchase: ${email}`)
    }

    // Log the purchase (stored in Roadmap metadata for now)
    // When Stripe is fully integrated, you'd create a Purchase model in prisma.
    // For now we update any matching roadmap's status or log to console.
    if (roadmapId) {
      const roadmap = await prisma.roadmap.findFirst({
        where: { id: roadmapId, userId: user.id },
      })
      if (roadmap) {
        await prisma.roadmap.update({
          where: { id: roadmapId },
          data: { status: 'active' },
        })
      }
    }

    console.log(`Purchase recorded: ${email} | ${productName} | ${currency} $${amountPaid} | Session: ${sessionId}`)

    return NextResponse.json({
      success: true,
      message: 'Purchase recorded',
      email,
      productName,
      amount: `${currency} $${amountPaid}`,
    })
  } catch (err) {
    console.error('Stripe webhook error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
