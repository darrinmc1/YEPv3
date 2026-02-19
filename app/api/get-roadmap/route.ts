// app/api/get-roadmap/route.ts
// Returns a single roadmap by ID (must belong to the logged-in user)

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

    const id = req.nextUrl.searchParams.get("id")
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const saved = await prisma.roadmap.findFirst({
      where: { id, userId: user.id }
    })

    if (!saved) return NextResponse.json({ error: 'Roadmap not found' }, { status: 404 })

    return NextResponse.json({
      roadmap: JSON.parse(saved.roadmapData),
      completedTasks: JSON.parse(saved.completedTasks || '[]'),
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
