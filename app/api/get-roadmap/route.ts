// app/api/get-roadmap/route.ts
// Returns a single roadmap by ID with ALL saved preferences
// so the dashboard, email system, and AI can all read from one source

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const id = req.nextUrl.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const saved = await prisma.roadmap.findFirst({
      where: { id, userId: user.id }
    })

    if (!saved) return NextResponse.json({ error: 'Roadmap not found' }, { status: 404 })

    const roadmapData = JSON.parse(saved.roadmapData)
    const intakeData = JSON.parse(saved.intakeData)
    const completedTasks = JSON.parse(saved.completedTasks || '[]')

    // Calculate current plan day from start date
    const now = new Date()
    const startDate = new Date(saved.startDate)
    const currentPlanDay = Math.max(1, Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1)

    // Progress stats
    const totalTasks = roadmapData.tasks?.length ?? 0
    const completedCount = completedTasks.length
    const progressPct = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0

    return NextResponse.json({
      // The full roadmap for display
      roadmap: roadmapData,

      // The saved preferences — used by dashboard settings panel + email system
      preferences: {
        coachingStyle: saved.coachingStyle,
        nudgeFrequency: saved.nudgeFrequency,
        contentDepth: saved.contentDepth,
      },

      // The full intake — used to regenerate or update the plan
      intake: intakeData,

      // Progress data
      completedTasks,
      progress: {
        currentPlanDay,
        totalDays: saved.totalWeeks * 7,
        totalWeeks: saved.totalWeeks,
        progressPct,
        completedCount,
        totalTasks,
        firstSaleTarget: saved.firstSaleTarget,
        startDate: saved.startDate,
      },

      // Metadata
      meta: {
        id: saved.id,
        title: saved.title,
        businessType: saved.businessType,
        industry: saved.industry,
        status: saved.status,
        createdAt: saved.createdAt,
        lastNudgeSent: saved.lastNudgeSent,
        lastEmailSent: saved.lastEmailSent,
      }
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
