/**
 * Explore Ideas API Route
 * Integrates: Gemini (matching) + Google Sheets (library & storage)
 */

import { NextRequest, NextResponse } from 'next/server'
import { searchIdeas, saveExploreRequest, checkRateLimit } from '@/lib/services/google-sheets'
import { sendExploreIdeasEmail } from '@/lib/services/email'
import { z } from 'zod'

// Helper to format idea for frontend
function formatIdeaForFrontend(item: any) {
  // Parse JSON fields safely
  let quickInsights = []
  let lockedContent = []
  
  try {
    quickInsights = item.quickInsights ? JSON.parse(item.quickInsights) : []
  } catch (e) {
    quickInsights = []
  }
  
  try {
    lockedContent = item.lockedContent ? JSON.parse(item.lockedContent) : []
  } catch (e) {
    lockedContent = []
  }
  
  return {
    id: item.id,
    title: item.title,
    oneLiner: item.oneLiner,
    industry: item.industry,
    score: item.score,
    marketSize: item.marketSize || 'TBD',
    growthRate: item.growthRate || 'TBD',
    difficulty: item.difficulty,
    timeToFirstSale: item.timeToFirstSale,
    startupCost: item.startupCost,
    costBreakdown: item.costBreakdown || '',
    whyNow: item.whyNow || `${item.industry} is growing rapidly with new opportunities emerging.`,
    quickInsights: quickInsights.length > 0 ? quickInsights : [
      `Target market in ${item.industry} sector`,
      `Estimated startup cost: ${item.startupCost}`,
      `Time to first sale: ${item.timeToFirstSale}`,
      `Difficulty level: ${item.difficulty}`
    ],
    lockedContent: lockedContent.length > 0 ? lockedContent : [
      'Full competitor analysis',
      'Revenue model breakdown with pricing tiers',
      '90-day launch roadmap with milestones',
      'Tech stack recommendations',
      'Marketing channels ranked by ROI',
      'Customer acquisition cost benchmarks'
    ]
  }
}

// Validation schema
const ExploreIdeasSchema = z.object({
  email: z.string().email('Valid email is required'),
  interests: z.string().optional().default(''),
  industry: z.string().default('any'),
  budget: z.string().default('any'),
  timeCommitment: z.string().default('any'),
  difficulty: z.string().default('any'),
  skills: z.array(z.string()).default([]),
  avoidTopics: z.string().optional().default(''),
})

export async function POST(req: NextRequest) {
  const startTime = Date.now()

  try {
    // Parse and validate input
    const body = await req.json()
    const validatedData = ExploreIdeasSchema.parse(body)

    // Check rate limit (free tier: 5 per day)
    if (process.env.ENABLE_RATE_LIMITING === 'true') {
      const rateLimit = await checkRateLimit(validatedData.email, 'explore')

      if (!rateLimit.allowed) {
        return NextResponse.json(
          {
            error: 'rate_limited',
            message: `You've used all ${process.env.FREE_EXPLORATIONS_PER_DAY || 5} free explorations today. Try again tomorrow or upgrade to unlimited.`,
            resetTime: rateLimit.resetTime,
          },
          { status: 429 }
        )
      }
    }

    // Step 1: Search ideas library in Google Sheets
    console.log('📚 Searching ideas library...')
    const allIdeas = await searchIdeas({
      industry: validatedData.industry,
      budget: validatedData.budget,
      difficulty: validatedData.difficulty,
      skills: validatedData.skills,
      searchTerm: validatedData.interests,
    })

    console.log(`Found ${allIdeas.length} ideas from library`)

    // Format for frontend
    const formattedIdeas = allIdeas.map(formatIdeaForFrontend)

    // Step 2: Save explore request to Google Sheets
    console.log('💾 Saving explore request...')
    await saveExploreRequest({
      timestamp: new Date().toISOString(),
      email: validatedData.email,
      interests: validatedData.interests,
      industry: validatedData.industry,
      budget: validatedData.budget,
      timeCommitment: validatedData.timeCommitment,
      difficulty: validatedData.difficulty,
      skills: JSON.stringify(validatedData.skills),
      avoidTopics: validatedData.avoidTopics,
      matchedIdeasCount: formattedIdeas.length,
      ideasDelivered: JSON.stringify(formattedIdeas.map(i => i.id)),
      status: 'completed',
    })

    // Step 3: Send email with matched ideas
    console.log('📧 Sending email with matched ideas...')
    try {
      await sendExploreIdeasEmail({
        email: validatedData.email,
        interests: validatedData.interests,
        matchedIdeas: formattedIdeas.map(idea => ({
          id: idea.id,
          title: idea.title,
          oneLiner: idea.oneLiner,
          industry: idea.industry,
          score: idea.score,
          difficulty: idea.difficulty,
          timeToFirstSale: idea.timeToFirstSale,
          startupCost: idea.startupCost,
        }))
      })
      console.log('✅ Email sent successfully')
    } catch (emailError) {
      console.error('⚠️ Email failed but continuing:', emailError)
      // Don't fail the whole request if email fails
    }

    // Step 4: Return matched ideas
    const response = {
      success: true,
      ideas: formattedIdeas,
      totalMatches: formattedIdeas.length,
      filters: {
        industry: validatedData.industry,
        budget: validatedData.budget,
        timeCommitment: validatedData.timeCommitment,
        difficulty: validatedData.difficulty,
      },
      metadata: {
        processingTime: Date.now() - startTime,
        librarySize: allIdeas.length,
      }
    }

    console.log(`✅ Exploration completed in ${Date.now() - startTime}ms`)

    return NextResponse.json(response)

  } catch (error) {
    console.error('Exploration error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'validation_error',
          details: error.errors,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'server_error',
        message: 'Failed to find ideas. Please try again.',
      },
      { status: 500 }
    )
  }
}

// Health check and stats
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const check = searchParams.get('check')

  if (check === 'health') {
    const services = {
      sheets: !!(process.env.GOOGLE_SHEETS_CLIENT_EMAIL && process.env.GOOGLE_SHEETS_PRIVATE_KEY),
    }

    return NextResponse.json({
      status: 'ok',
      services,
      timestamp: new Date().toISOString(),
    })
  }

  // Return library stats
  try {
    const allIdeas = await searchIdeas({})

    return NextResponse.json({
      librarySize: allIdeas.length,
      topIndustries: getTopIndustries(allIdeas),
      avgScore: calculateAvgScore(allIdeas),
    })
  } catch {
    return NextResponse.json({ error: 'Unable to fetch stats' }, { status: 500 })
  }
}

function getTopIndustries(ideas: any[]): string[] {
  const industries = ideas.map(i => i.industry)
  const counts = industries.reduce((acc: any, ind: string) => {
    acc[ind] = (acc[ind] || 0) + 1
    return acc
  }, {})

  return Object.entries(counts)
    .sort(([, a]: any, [, b]: any) => b - a)
    .slice(0, 5)
    .map(([ind]) => ind)
}

function calculateAvgScore(ideas: any[]): number {
  if (ideas.length === 0) return 0
  const sum = ideas.reduce((acc, idea) => acc + idea.score, 0)
  return Math.round(sum / ideas.length)
}
