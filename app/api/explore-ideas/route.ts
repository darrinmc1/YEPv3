/**
 * Explore Ideas API Route
 * Integrates: Gemini (matching) + Google Sheets (library & storage)
 */

import { NextRequest, NextResponse } from 'next/server'
import { findIdeasWithGemini } from '@/lib/services/gemini'
import { searchIdeas, saveExploreRequest, checkRateLimit } from '@/lib/services/google-sheets'
import { z } from 'zod'

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

    // Step 2: Use Gemini to find best matches (if interests provided)
    let matchedIdeas = allIdeas
    
    if (validatedData.interests && process.env.GOOGLE_GEMINI_API_KEY) {
      console.log('🤖 Using Gemini to find best matches...')
      try {
        matchedIdeas = await findIdeasWithGemini(
          {
            interests: validatedData.interests,
            industry: validatedData.industry,
            budget: validatedData.budget,
            timeCommitment: validatedData.timeCommitment,
            difficulty: validatedData.difficulty,
            skills: validatedData.skills,
            avoidTopics: validatedData.avoidTopics,
          },
          allIdeas
        )
      } catch (error) {
        console.error('Gemini matching failed, using fallback:', error)
        // Continue with filtered results
        matchedIdeas = allIdeas.slice(0, 5)
      }
    } else {
      // No Gemini or no interests - just return top scored ideas
      matchedIdeas = allIdeas.slice(0, 5)
    }

    // Step 3: Save explore request to Google Sheets
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
      matchedIdeasCount: matchedIdeas.length,
      ideasDelivered: JSON.stringify(matchedIdeas.map(i => i.id)),
      status: 'completed',
    })

    // Step 4: Return matched ideas
    const response = {
      success: true,
      ideas: matchedIdeas,
      totalMatches: matchedIdeas.length,
      filters: {
        industry: validatedData.industry,
        budget: validatedData.budget,
        timeCommitment: validatedData.timeCommitment,
        difficulty: validatedData.difficulty,
      },
      metadata: {
        processingTime: Date.now() - startTime,
        aiModel: process.env.GOOGLE_GEMINI_API_KEY ? 'Gemini' : 'Basic Filter',
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
    const { checkGeminiHealth } = await import('@/lib/services/gemini')

    const services = {
      gemini: process.env.GOOGLE_GEMINI_API_KEY ? await checkGeminiHealth() : false,
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
    .sort(([,a]: any, [,b]: any) => b - a)
    .slice(0, 5)
    .map(([ind]) => ind)
}

function calculateAvgScore(ideas: any[]): number {
  if (ideas.length === 0) return 0
  const sum = ideas.reduce((acc, idea) => acc + idea.score, 0)
  return Math.round(sum / ideas.length)
}
