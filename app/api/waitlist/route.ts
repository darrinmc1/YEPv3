/**
 * POST /api/waitlist
 *
 * Saves an email + interest to the subscribers/waitlist Google Sheet
 * and sends a confirmation email via Resend.
 *
 * Sheet: GOOGLE_SHEET_ID_SUBSCRIBERS = 19lVPPJHJ63MQ75aiHFQAN4bzDztVaPKZUVFPVTgYF8A
 * Columns match existing sheet:
 *   A: Email | B: Name (blank) | C: Plan Type = "Waitlist" | D: Start Date
 *   E: Current Day (blank) | F: Program Length (blank) | G: Status = "waitlist"
 *   H: Last Email Sent (blank) | I: Stripe Customer (blank) | J: Purchase ID (blank)
 *   K: Notes (interest + source)
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { saveWaitlistEntry, isAlreadyOnWaitlist } from '@/lib/services/google-sheets'
import { sendWaitlistConfirmationEmail } from '@/lib/services/email'

const WaitlistSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  interest: z.enum(
    ['validate-my-idea', 'explore-ideas', 'implementation-plan', 'just-browsing'],
    { errorMap: () => ({ message: 'Please select what you are most interested in' }) }
  ),
})

export async function POST(req: NextRequest) {
  try {
    // 1. Parse + validate
    const body = await req.json()
    const parsed = WaitlistSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'validation_error',
          message: parsed.error.errors[0]?.message ?? 'Invalid input',
        },
        { status: 400 }
      )
    }

    const { email, interest } = parsed.data

    // 2. Check for duplicate (soft check — don't block, just skip write)
    let alreadyExists = false
    try {
      alreadyExists = await isAlreadyOnWaitlist(email)
    } catch {
      // If Sheets is down we still want a graceful response — just continue
    }

    if (!alreadyExists) {
      // 3. Save to Google Sheet
      try {
        await saveWaitlistEntry({
          timestamp: new Date().toISOString(),
          email,
          interest,
          source: 'coming-soon-page',
          status: 'waitlist',
        })
      } catch (sheetsError) {
        console.error('Waitlist Sheets write failed:', sheetsError)
        // Don't fail the whole request — still send the email
      }
    }

    // 4. Send confirmation email (fire and forget — don't block response)
    sendWaitlistConfirmationEmail(email, interest).catch(err => {
      console.error('Waitlist confirmation email failed:', err)
    })

    // 5. Return success (same message whether duplicate or new — no enum leakage)
    return NextResponse.json({
      success: true,
      message: alreadyExists
        ? 'You are already on the list — we will be in touch soon!'
        : 'You are on the list! Check your inbox for a confirmation.',
    })
  } catch (error) {
    console.error('Waitlist API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'server_error',
        message: 'Something went wrong. Please try again.',
      },
      { status: 500 }
    )
  }
}
