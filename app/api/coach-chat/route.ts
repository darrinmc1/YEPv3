// app/api/coach-chat/route.ts
//
// AI Business Coach chat powered by Google Gemini.
// Each message is stored in the DB so history persists across sessions.
// The coach has full context of the user's roadmap and progress.
//
// POST /api/coach-chat   — send a message, get a streaming response
// GET  /api/coach-chat   — get chat history for a roadmap

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { GoogleGenerativeAI } from "@google/generative-ai"

const COACH_SYSTEM_PROMPT = `You are a business coach for YourExitPlans — but not the boring, corporate kind.

You're the friend who actually started businesses (and failed at some), gives honest advice even when it's uncomfortable, uses humor to make hard things feel doable, and cuts through business jargon like it personally offended you.

PERSONALITY:
- Warm but direct
- Occasionally self-deprecating
- Allergic to corporate speak
- Encouraging but not fake
- Uses concrete examples, never vague platitudes

COMMUNICATION RULES:
1. Lead with the action, then explain why
2. One clear next step at the end of every response
3. Use their specific business context in ALL examples — never give generic advice
4. Keep responses concise (under 300 words unless they ask for deep detail)
5. Ask ONE follow-up question if you need clarification — not five
6. If they're stuck or scared, acknowledge it briefly, then move them forward
7. Never say "Great question!" or "Certainly!" — those phrases are banned

If you don't know something specific about their situation, ask. If they haven't told you their business details yet, ask what they're working on before giving advice.`

// Build context string from roadmap data
function buildRoadmapContext(roadmap: any, intakeData: any, progress: any): string {
  if (!roadmap) return ""

  const intake = typeof intakeData === "string" ? JSON.parse(intakeData) : intakeData
  const completed = progress?.completedCount ?? 0
  const total = progress?.totalTasks ?? 0
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  return `
USER'S BUSINESS CONTEXT (use this in ALL advice):
- Business: ${intake?.business?.description || roadmap.title}
- Type: ${intake?.business?.type || roadmap.businessType}
- Industry: ${intake?.customer?.industry || roadmap.industry}
- Target Customer: ${intake?.customer?.description || "not specified"}
- Problem They Solve: ${intake?.customer?.problem_solved || "not specified"}
- Hours/Week Available: ${intake?.resources?.hours_per_week || roadmap.hoursPerWeek}
- Budget: ${intake?.resources?.budget || "not specified"}
- Biggest Gap/Weakness: ${intake?.resources?.biggest_gap || "not specified"}
- Revenue Goal: ${intake?.goals?.revenue_12_month || "not specified"}
- Roadmap Progress: ${completed}/${total} tasks (${pct}% complete)
- Current Plan Day: ${progress?.currentPlanDay || 1} of ${(roadmap.totalWeeks || 12) * 7}
- First Sale Target: ${roadmap.firstSaleTarget || "not set"}
- Coaching Style Preference: ${roadmap.coachingStyle || "balanced"}
`
}

// GET — return chat history
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const roadmapId = req.nextUrl.searchParams.get("roadmapId")
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "50")

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ messages: [] })

    const messages = await prisma.chatMessage.findMany({
      where: {
        userId: user.id,
        ...(roadmapId ? { roadmapId } : {}),
      },
      orderBy: { createdAt: "asc" },
      take: limit,
    })

    return NextResponse.json({ messages })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

// POST — send a message and get a response
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { message, roadmapId } = await req.json()

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    // Load roadmap context if roadmapId is provided
    let roadmapContext = ""
    let roadmapData: any = null

    if (roadmapId) {
      const roadmap = await prisma.roadmap.findFirst({
        where: { id: roadmapId, userId: user.id },
      })
      if (roadmap) {
        const parsedRoadmap = JSON.parse(roadmap.roadmapData)
        const intakeData = roadmap.intakeData
        const completedTasks = JSON.parse(roadmap.completedTasks || "[]")
        const totalTasks = parsedRoadmap.tasks?.length ?? 0
        const now = new Date()
        const startDate = new Date(roadmap.startDate)
        const currentPlanDay = Math.max(
          1,
          Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
        )
        roadmapData = roadmap
        roadmapContext = buildRoadmapContext(roadmap, intakeData, {
          completedCount: completedTasks.length,
          totalTasks,
          currentPlanDay,
        })
      }
    }

    // Load recent chat history (last 20 messages for context)
    const history = await prisma.chatMessage.findMany({
      where: {
        userId: user.id,
        ...(roadmapId ? { roadmapId } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    })
    const historyReversed = history.reverse()

    // Save user message to DB
    await prisma.chatMessage.create({
      data: {
        userId: user.id,
        roadmapId: roadmapId || null,
        role: "user",
        content: message,
      },
    })

    // Build Gemini conversation
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI service not configured. Add GOOGLE_GEMINI_API_KEY to .env.local" },
        { status: 500 }
      )
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
      generationConfig: { temperature: 0.8, maxOutputTokens: 1024 },
      systemInstruction: COACH_SYSTEM_PROMPT + (roadmapContext ? `\n\n${roadmapContext}` : ""),
    })

    // Build message history for multi-turn chat
    const chatHistory = historyReversed
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }))

    const chat = model.startChat({ history: chatHistory })
    const result = await chat.sendMessage(message)
    const assistantReply = result.response.text()

    // Save assistant reply to DB
    const savedReply = await prisma.chatMessage.create({
      data: {
        userId: user.id,
        roadmapId: roadmapId || null,
        role: "assistant",
        content: assistantReply,
      },
    })

    return NextResponse.json({
      message: {
        id: savedReply.id,
        role: "assistant",
        content: assistantReply,
        createdAt: savedReply.createdAt,
      },
    })
  } catch (err) {
    console.error("Coach chat error:", err)
    return NextResponse.json(
      { error: "Failed to get response from coach", details: String(err) },
      { status: 500 }
    )
  }
}

// DELETE — clear chat history for a roadmap
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const roadmapId = req.nextUrl.searchParams.get("roadmapId")

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    await prisma.chatMessage.deleteMany({
      where: {
        userId: user.id,
        ...(roadmapId ? { roadmapId } : {}),
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
