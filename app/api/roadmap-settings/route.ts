// app/api/roadmap-settings/route.ts
// Lets users update their nudge frequency, coaching style, and content depth
// after the roadmap has been created. These settings drive how emails are sent.

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { roadmapId, nudgeFrequency, coachingStyle, contentDepth } = await req.json()

    if (!roadmapId) {
      return NextResponse.json({ error: 'Missing roadmapId' }, { status: 400 })
    }

    // Validate values
    const validNudge = ['daily', 'every_few_days', 'weekly', 'on_request']
    const validCoaching = ['direct', 'explain_why', 'hand_holding', 'challenging']
    const validDepth = ['essential', 'balanced', 'deep_dive']

    if (nudgeFrequency && !validNudge.includes(nudgeFrequency)) {
      return NextResponse.json({ error: 'Invalid nudgeFrequency' }, { status: 400 })
    }
    if (coachingStyle && !validCoaching.includes(coachingStyle)) {
      return NextResponse.json({ error: 'Invalid coachingStyle' }, { status: 400 })
    }
    if (contentDepth && !validDepth.includes(contentDepth)) {
      return NextResponse.json({ error: 'Invalid contentDepth' }, { status: 400 })
    }

    // Verify roadmap belongs to this user
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const roadmap = await prisma.roadmap.findFirst({
      where: { id: roadmapId, userId: user.id }
    })
    if (!roadmap) return NextResponse.json({ error: 'Roadmap not found' }, { status: 404 })

    // Build update object — only update fields that were sent
    const updateData: any = {}
    if (nudgeFrequency) updateData.nudgeFrequency = nudgeFrequency
    if (coachingStyle) updateData.coachingStyle = coachingStyle
    if (contentDepth) updateData.contentDepth = contentDepth

    const updated = await prisma.roadmap.update({
      where: { id: roadmapId },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      settings: {
        nudgeFrequency: updated.nudgeFrequency,
        coachingStyle: updated.coachingStyle,
        contentDepth: updated.contentDepth,
      }
    })
  } catch (err) {
    console.error('Settings update error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

// GET — return current settings for a roadmap
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const roadmapId = req.nextUrl.searchParams.get('roadmapId')
    if (!roadmapId) return NextResponse.json({ error: 'Missing roadmapId' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const roadmap = await prisma.roadmap.findFirst({
      where: { id: roadmapId, userId: user.id },
      select: {
        id: true,
        nudgeFrequency: true,
        coachingStyle: true,
        contentDepth: true,
        startDate: true,
        status: true,
        lastNudgeSent: true,
        lastEmailSent: true,
      }
    })

    if (!roadmap) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json({ settings: roadmap })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
