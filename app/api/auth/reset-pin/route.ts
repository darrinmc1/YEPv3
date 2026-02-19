import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { Resend } from "resend"
import crypto from "crypto"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

import { prisma } from "@/lib/prisma"
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json()

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 })
        }

        // Rate Limiting
        if (process.env.UPSTASH_REDIS_REST_URL) {
            const redis = new Redis({
                url: process.env.UPSTASH_REDIS_REST_URL,
                token: process.env.UPSTASH_REDIS_REST_TOKEN!,
            })

            const ratelimit = new Ratelimit({
                redis,
                limiter: Ratelimit.slidingWindow(3, "1 h"), // 3 emails per hour
                analytics: true,
            })

            const { success } = await ratelimit.limit(`auth_reset_${email}`)
            if (!success) {
                return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 })
            }
        }

        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            // Return success even if user not found to prevent enumeration
            return NextResponse.json({ success: true, message: "If an account exists, a reset link has been sent." })
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex")
        const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

        await prisma.user.update({
            where: { email },
            data: {
                resetToken,
                resetTokenExpiry
            }
        })

        // Send email
        const resetLink = `${process.env.NEXTAUTH_URL}/reset-pin?token=${resetToken}`

        await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
            to: email,
            subject: "Reset your YourExitPlans PIN",
            html: `<p>Click <a href="${resetLink}">here</a> to reset your 4-digit PIN.</p><p>This link expires in 1 hour.</p>`
        })

        return NextResponse.json({ success: true, message: "Reset link sent" })

    } catch (error) {
        console.error("Reset PIN error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
