// app/api/coach-nudge/route.ts
//
// Called from the dashboard to request an on-demand AI coaching nudge.
// Triggers n8n workflow 04_ai_coach_nudge_on_demand.json which
// generates a personalised Gemini message and sends an email.
//
// POST /api/coach-nudge

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { roadmapId, requestType = 'check_in', blockedReason = '' } = await req.json()

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // Load roadmap context
    const roadmap = await prisma.roadmap.findFirst({
      where: { id: roadmapId, userId: user.id },
    })
    if (!roadmap) return NextResponse.json({ error: 'Roadmap not found' }, { status: 404 })

    const roadmapData = JSON.parse(roadmap.roadmapData)
    const completedIds = new Set(JSON.parse(roadmap.completedTasks || '[]'))
    const allTasks: any[] = roadmapData.tasks ?? []
    const totalTasks = allTasks.length
    const completedCount = completedIds.size
    const progressPct = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0

    const now = new Date()
    const currentPlanDay = Math.floor((now.getTime() - roadmap.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

    // Today's tasks
    const todaysTasks = allTasks
      .filter((t: any) => t.day === currentPlanDay && !completedIds.has(t.id))
      .slice(0, 3)

    // Fire n8n webhook (fire-and-forget, returns immediately)
    const n8nUrl = process.env.N8N_COACH_NUDGE_WEBHOOK_URL ||
      (process.env.N8N_BASE_URL ? `${process.env.N8N_BASE_URL}/webhook/coach-nudge` : null)

    if (n8nUrl) {
      fetch(n8nUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          userName: user.name ?? user.email?.split('@')[0],
          businessTitle: roadmap.title,
          roadmapId: roadmap.id,
          currentDay: currentPlanDay,
          progressPct,
          coachingStyle: roadmap.coachingStyle,
          contentDepth: roadmap.contentDepth,
          todaysTasks,
          blockedReason,
          requestType,
        }),
        signal: AbortSignal.timeout(5000),
      }).catch(err => console.error('n8n coach-nudge fire error:', err))
    }

    return NextResponse.json({
      success: true,
      message: 'Nudge on its way to your inbox!',
      currentDay: currentPlanDay,
      progressPct,
    })
  } catch (err) {
    console.error('Coach nudge error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
