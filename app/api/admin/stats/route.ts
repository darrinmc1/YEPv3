import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user || session.user.email !== process.env.ADMIN_EMAIL) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const userCount = await prisma.user.count()

        return NextResponse.json({ userCount })
    } catch (error) {
        console.error("Error fetching admin stats:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
