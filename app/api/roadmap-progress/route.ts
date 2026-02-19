// app/api/roadmap-progress/route.ts
// Saves completed task IDs back to the database

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

    const { roadmapId, completedTasks } = await req.json()

    // Verify the roadmap belongs to this user
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const roadmap = await prisma.roadmap.findFirst({
      where: { id: roadmapId, userId: user.id }
    })

    if (!roadmap) {
      return NextResponse.json({ error: 'Roadmap not found' }, { status: 404 })
    }

    await prisma.roadmap.update({
      where: { id: roadmapId },
      data: { completedTasks: JSON.stringify(completedTasks) }
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
