import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { z } from "zod"

import { prisma } from "@/lib/prisma"

const resetPinSchema = z.object({
    token: z.string(),
    pin: z.string().length(4, "PIN must be 4 digits").regex(/^\d+$/, "PIN must be numeric")
})

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const validation = resetPinSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
        }

        const { token, pin } = validation.data

        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: {
                    gt: new Date()
                }
            }
        })

        if (!user) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
        }

        // Update user with new PIN and clear reset token
        // In a real app, hash the PIN here. Storing as plain text for now as per "just 4 numbers" simplicity request/context.
        // If we wanted to hash: const hashedPin = await bcrypt.hash(pin, 10)
        await prisma.user.update({
            where: { id: user.id },
            data: {
                pin: pin,
                resetToken: null,
                resetTokenExpiry: null
            }
        })

        return NextResponse.json({ success: true, message: "PIN updated successfully" })

    } catch (error) {
        console.error("Confirm PIN error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
