// app/api/generate-roadmap/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { GoogleGenerativeAI } from '@google/generative-ai'

// ─── Timeline helpers ─────────────────────────────────────────────────────────

function getMultiplier(hours: string): number {
  return ({ '5-10': 2.5, '10-20': 1.5, '20-40': 1.0, '40+': 0.7 } as Record<string,number>)[hours] ?? 1.0
}

function getFirstSaleTarget(hours: string): string {
  return ({ '5-10': 'Week 15–20', '10-20': 'Week 9–12', '20-40': 'Week 5–6', '40+': 'Week 3–4' } as Record<string,string>)[hours] ?? 'Week 5–6'
}

function getStartPhase(stage: string): number {
  return ({ idea: 1, researching: 1, validated: 3, building_mvp: 3, have_mvp: 7, first_customers: 9, growing: 10 } as Record<string,number>)[stage] ?? 1
}

// ─── Master prompt ────────────────────────────────────────────────────────────

const MASTER_PROMPT = `You are a business coach for YourExitPlans - but not the boring, corporate kind. You're the friend who actually started businesses (and failed at some), gives honest advice even when it's uncomfortable, uses humor to make hard things feel doable, and cuts through business jargon like it personally offended you.

PERSONALITY: Warm but direct. Occasionally self-deprecating. Allergic to corporate speak. Encouraging but not fake.

COMMUNICATION RULES:
1. Lead with the action, then explain why
2. One clear next step at the end of every response
3. Use their business context in ALL examples - never give generic advice`

// ─── Build generation prompt ──────────────────────────────────────────────────

function buildPrompt(intake: any): string {
  const multiplier = getMultiplier(intake.resources.hours_per_week)
  const totalWeeks = Math.round(12 * multiplier)
  const startPhase = getStartPhase(intake.business.stage)
  const firstSaleTarget = getFirstSaleTarget(intake.resources.hours_per_week)

  const coachingNote: Record<string,string> = {
    direct: 'Be brief. Lead with actions. Short punchy sentences.',
    explain_why: 'Explain reasoning behind each action.',
    hand_holding: 'More detail, gentler tone, more reassurance.',
    challenging: 'Push hard. Call out procrastination.',
  }

  const depthNote: Record<string,string> = {
    essential: '1-2 sentence task descriptions, bullet points only.',
    balanced: 'Key concepts with 1-2 examples.',
    deep_dive: 'Full explanations, case studies, expert references.',
  }

  return `${MASTER_PROMPT}

---
GENERATE A PERSONALIZED BUSINESS LAUNCH ROADMAP.

USER CONTEXT:
- Business: ${intake.business.description}
- Business Type: ${intake.business.type}
- Current Stage: ${intake.business.stage}
- Target Customer: ${intake.customer.description}
- Industry: ${intake.customer.industry}
- Core Problem Solved: ${intake.customer.problem_solved}
- Hours/Week: ${intake.resources.hours_per_week}
- Budget: ${intake.resources.budget}
- Strengths: ${(intake.resources.strengths || []).join(', ')}
- Biggest Gap: ${intake.resources.biggest_gap}
- Revenue Goal: ${intake.goals.revenue_12_month}
- Success Definition: ${intake.goals.success_definition ?? 'not specified'}
- Coaching Style: ${intake.preferences.coaching_style} — ${coachingNote[intake.preferences.coaching_style] ?? ''}
- Content Depth: ${intake.preferences.content_depth} — ${depthNote[intake.preferences.content_depth] ?? ''}
- Main Challenge: ${intake.preferences.current_challenge ?? 'not specified'}

PLAN PARAMETERS:
- Timeline multiplier: ${multiplier}x (${intake.resources.hours_per_week} hrs/week)
- Total duration: ${totalWeeks} weeks
- Start at Phase: ${startPhase} (skip phases before this)
- First sale target: ${firstSaleTarget}
- Give EXTRA detail for weakness area: ${intake.resources.biggest_gap}

THE 10 PHASES (scale all durations by ${multiplier}x, start from phase ${startPhase}):
1. Idea Clarity & Vision | 2. Customer Definition | 3. MVP Definition | 4. Pricing & Offer
5. Business Setup | 6. Brand & Presence | 7. First Outreach | 8. First Sale
9. Feedback & Iteration | 10. Scale Preparation

Return ONLY valid JSON with this exact structure (no markdown, no code blocks):
{
  "executive_summary": "2-3 paragraphs personalised to their situation",
  "coach_message": "2-3 sentences. Personal. One excitement. One honest heads-up.",
  "phases": [
    {
      "number": 1,
      "name": "Idea Clarity & Vision",
      "goal": "one sentence goal",
      "duration_days": 14,
      "weeks": "Week 1-2",
      "exit_criteria": ["Can explain business in 60 seconds"],
      "expert_references": [{"name": "Simon Sinek", "resource": "Start With Why", "url": "https://simonsinek.com"}]
    }
  ],
  "tasks": [
    {
      "id": "task-001",
      "day": 1,
      "week": 1,
      "phase": 1,
      "phase_name": "Idea Clarity & Vision",
      "title": "Write Your 60-Second Pitch",
      "description": "Industry-specific description for their ${intake.customer.industry} ${intake.business.type}",
      "time_estimate": "45 minutes",
      "type": "creation",
      "resources": ["resource name"],
      "is_milestone": false,
      "completion_criteria": "Done when..."
    }
  ],
  "milestones": [
    {"day": 7, "label": "MVP Defined", "description": "celebration + what this unlocks"}
  ]
}

CRITICAL RULES:
- Generate 3-5 tasks per week for ALL ${totalWeeks} weeks (~${Math.round(totalWeeks * 4)} tasks total)
- Every task description must reference their specific ${intake.customer.industry} / ${intake.business.type}
- Milestone tasks at: end of each phase, first contact, first sale
- Task types: action, research, creation, outreach, review, milestone`
}

// ─── Fallback roadmap ─────────────────────────────────────────────────────────

function buildFallback(intake: any) {
  const multiplier = getMultiplier(intake.resources.hours_per_week)
  const totalWeeks = Math.round(12 * multiplier)

  return {
    executive_summary: `You're building a ${intake.business.type} targeting ${intake.customer.description} in ${intake.customer.industry}. The problem you're solving: ${intake.customer.problem_solved}.\n\nWith ${intake.resources.hours_per_week} hours/week, your roadmap runs ${totalWeeks} weeks. First paying customer target: ${getFirstSaleTarget(intake.resources.hours_per_week)}.\n\nWe'll give you extra support around your biggest gap: ${intake.resources.biggest_gap}.`,
    coach_message: `I'm genuinely excited about the gap you've spotted in ${intake.customer.industry}. Watch out for: ${intake.resources.biggest_gap} — that's where most people stall. We've front-loaded the parts you're strong at so you build momentum first.`,
    phases: [],
    tasks: [
      { id: 't001', day: 1, week: 1, phase: 1, phase_name: 'Idea Clarity & Vision', title: 'Write Your 60-Second Pitch', description: `Describe your ${intake.business.type} in one sentence. Focus on the problem you solve for ${intake.customer.description}.`, time_estimate: '45 minutes', type: 'creation', resources: ['Google Docs'], is_milestone: false, completion_criteria: 'Can say it out loud without checking notes' },
      { id: 't002', day: 2, week: 1, phase: 1, phase_name: 'Idea Clarity & Vision', title: "Write Your 'Why I'm Building This' Statement", description: 'Your personal fuel for hard days. Not for customers — for you. What changes in the world if you succeed?', time_estimate: '30 minutes', type: 'creation', is_milestone: false },
      { id: 't003', day: 3, week: 1, phase: 2, phase_name: 'Customer Definition', title: 'Name 10 Real Potential Customers', description: `Not categories — actual people in ${intake.customer.industry}. LinkedIn, your network. Write names.`, time_estimate: '60 minutes', type: 'research', resources: ['LinkedIn'], is_milestone: false },
      { id: 't004', day: 5, week: 1, phase: 2, phase_name: 'Customer Definition', title: 'Have 3 Discovery Conversations', description: `Call or message 3 people. Don't pitch. Ask: "What's the hardest part of [${intake.customer.problem_solved}]?" This is intel-gathering, not selling.`, time_estimate: '90 minutes', type: 'outreach', resources: ['The Mom Test — Rob Fitzpatrick'], is_milestone: true, milestone_label: '🎯 First Customer Conversations' },
      { id: 't005', day: 8, week: 2, phase: 3, phase_name: 'MVP Definition', title: 'Strip Your MVP to the Minimum', description: `List every feature. Cut everything not needed to solve the ONE core problem for ${intake.customer.description}. What's left = your v1.`, time_estimate: '60 minutes', type: 'action', is_milestone: false },
      { id: 't006', day: 10, week: 2, phase: 4, phase_name: 'Pricing & Offer', title: 'Set Your Price', description: "Research 3 competitors. Calculate the value you deliver. Set a price 20% above what feels comfortable. You can always discount.", time_estimate: '45 minutes', type: 'research', is_milestone: false },
      { id: 't007', day: 14, week: 2, phase: 5, phase_name: 'Business Setup', title: 'Set Up Payment Processing', description: "Stripe. 30 minutes. If you can't accept money, you can't make money.", time_estimate: '30 minutes', type: 'action', resources: ['stripe.com'], is_milestone: false },
      { id: 't008', day: Math.round(totalWeeks * 7 * 0.4), week: Math.round(totalWeeks * 0.4), phase: 7, phase_name: 'First Outreach', title: 'Send First 10 Outreach Messages', description: `Personalized messages to your prospect list. Reference something specific about each person. Ask for 15 minutes, not to buy.`, time_estimate: '90 minutes', type: 'outreach', is_milestone: true, milestone_label: '📬 First Outreach Sent' },
      { id: 't009', day: Math.round(totalWeeks * 7 * 0.5), week: Math.round(totalWeeks * 0.5), phase: 8, phase_name: 'First Sale', title: '🎯 Close Your First Paying Customer', description: "Present your offer. Name your price. Stop talking. Let the silence work.", time_estimate: '60 minutes', type: 'milestone', is_milestone: true, milestone_label: '💰 FIRST SALE' },
    ],
    milestones: [
      { day: 5, label: 'First Customer Conversations', description: "You've talked to real humans. Most founders never do this." },
      { day: Math.round(totalWeeks * 7 * 0.3), label: 'MVP Defined', description: "You know exactly what you're selling. No more scope creep." },
      { day: Math.round(totalWeeks * 7 * 0.5), label: 'First Sale', description: "Real money from a real customer. This changes everything." },
    ],
  }
}

// ─── GET saved roadmap ────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { roadmaps: { orderBy: { createdAt: 'desc' } } }
    })

    if (!user) return NextResponse.json({ roadmaps: [] })

    return NextResponse.json({
      roadmaps: user.roadmaps.map(r => ({
        id: r.id,
        title: r.title,
        businessType: r.businessType,
        industry: r.industry,
        totalWeeks: r.totalWeeks,
        firstSaleTarget: r.firstSaleTarget,
        createdAt: r.createdAt,
        status: r.status,
        completedTasks: JSON.parse(r.completedTasks || '[]'),
        totalTasks: JSON.parse(r.roadmapData || '{}').tasks?.length ?? 0,
        // Preferences — used by dashboard settings and email system
        preferences: {
          coachingStyle: r.coachingStyle,
          nudgeFrequency: r.nudgeFrequency,
          contentDepth: r.contentDepth,
        }
      }))
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

// ─── POST generate roadmap ────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const intake = await req.json()

    if (!intake.business?.description || !intake.resources?.hours_per_week) {
      return NextResponse.json({ error: 'Missing required intake fields' }, { status: 400 })
    }

    const multiplier = getMultiplier(intake.resources.hours_per_week)
    const totalWeeks = Math.round(12 * multiplier)

    let roadmapData: any

    // Try Gemini
    try {
      const apiKey = process.env.GOOGLE_GEMINI_API_KEY
      if (!apiKey) throw new Error('No Gemini API key')

      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({
        model: process.env.GEMINI_MODEL || 'gemini-1.5-pro',
        generationConfig: { temperature: 0.7, maxOutputTokens: 8192 } as any,
      })

      const result = await model.generateContent(buildPrompt(intake))
      const raw = result.response.text()
      const clean = raw.replace(/```json\n?|\n?```/g, '').trim()
      roadmapData = JSON.parse(clean)
    } catch (aiErr) {
      console.warn('Gemini failed, using fallback:', aiErr)
      roadmapData = buildFallback(intake)
    }

    const roadmap = {
      id: `roadmap-${Date.now()}`,
      generated_at: new Date().toISOString(),
      intake_summary: {
        business_name: intake.business.name || intake.business.type,
        business_type: intake.business.type,
        hours_per_week: intake.resources.hours_per_week,
        timeline_weeks: totalWeeks,
        first_sale_target: getFirstSaleTarget(intake.resources.hours_per_week),
        coaching_style: intake.preferences.coaching_style,
      },
      executive_summary: roadmapData.executive_summary ?? '',
      coach_message: roadmapData.coach_message ?? '',
      phases: roadmapData.phases ?? [],
      tasks: (roadmapData.tasks ?? []).sort((a: any, b: any) => a.day - b.day),
      total_days: totalWeeks * 7,
      total_weeks: totalWeeks,
      milestones: roadmapData.milestones ?? [],
    }

    // Save to database linked to the user
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (user) {
      const saved = await prisma.roadmap.create({
        data: {
          userId: user.id,
          title: intake.business.name || `${intake.business.type} in ${intake.customer.industry}`,
          businessType: intake.business.type,
          industry: intake.customer.industry || '',
          hoursPerWeek: intake.resources.hours_per_week,
          totalWeeks,
          firstSaleTarget: getFirstSaleTarget(intake.resources.hours_per_week),
          coachingStyle: intake.preferences.coaching_style,
          nudgeFrequency: intake.preferences.nudge_frequency || 'every_few_days',
          contentDepth: intake.preferences.content_depth || 'balanced',
          startDate: new Date(),
          status: 'active',
          intakeData: JSON.stringify(intake),
          roadmapData: JSON.stringify(roadmap),
        },
      })
      roadmap.id = saved.id // Use DB id so progress saves correctly
    }

    return NextResponse.json({ success: true, roadmap })
  } catch (err) {
    console.error('Roadmap generation error:', err)
    return NextResponse.json({ error: 'Failed to generate roadmap', details: String(err) }, { status: 500 })
  }
}
