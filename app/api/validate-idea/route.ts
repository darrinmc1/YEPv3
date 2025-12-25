/**
 * Idea Validation API Route - UPDATED
 * PRIMARY: Gemini (FREE) + OPTIONAL: Perplexity (research) + Google Sheets (storage)
 * BACKUP: Ollama (if installed locally)
 */

import { NextRequest, NextResponse } from 'next/server'
import { validateIdeaWithGemini } from '@/lib/services/gemini-validation'
import { validateIdeaWithOllama, checkOllamaHealth } from '@/lib/services/ollama'
import { researchMarketWithPerplexity } from '@/lib/services/perplexity'
import { saveValidatedIdea, checkRateLimit } from '@/lib/services/google-sheets'
import { z } from 'zod'

// Validation schema
const IdeaValidationSchema = z.object({
  ideaName: z.string().min(3, 'Idea name must be at least 3 characters'),
  oneLiner: z.string().min(10, 'One-liner must be at least 10 characters'),
  problemSolved: z.string().min(20, 'Problem description must be at least 20 characters'),
  targetCustomer: z.string().min(10, 'Target customer must be at least 10 characters'),
  businessType: z.string().min(1, 'Business type is required'),
  industry: z.string().min(1, 'Industry is required'),
  priceRange: z.string().min(1, 'Price range is required'),
  email: z.string().email('Valid email is required'),
})

export async function POST(req: NextRequest) {
  const startTime = Date.now()

  try {
    // Parse and validate input
    const body = await req.json()
    const validatedData = IdeaValidationSchema.parse(body)

    // Check rate limit (free tier: 3 per day)
    if (process.env.ENABLE_RATE_LIMITING === 'true') {
      const rateLimit = await checkRateLimit(validatedData.email, 'validate')
      
      if (!rateLimit.allowed) {
        return NextResponse.json(
          {
            error: 'rate_limited',
            message: `You've used all ${process.env.FREE_VALIDATIONS_PER_DAY || 3} free validations today. Try again tomorrow or upgrade to unlimited.`,
            resetTime: rateLimit.resetTime,
          },
          { status: 429 }
        )
      }
    }

    let validation
    let aiModelUsed = 'Gemini'

    // Step 1: Try Gemini FIRST (FREE and cloud-based)
    console.log('🤖 Running Gemini validation...')
    try {
      validation = await validateIdeaWithGemini({
        ideaName: validatedData.ideaName,
        oneLiner: validatedData.oneLiner,
        problemSolved: validatedData.problemSolved,
        targetCustomer: validatedData.targetCustomer,
        businessType: validatedData.businessType,
        industry: validatedData.industry,
        priceRange: validatedData.priceRange,
      })
    } catch (geminiError) {
      console.error('Gemini failed, trying Ollama fallback...', geminiError)
      
      // Step 1b: Fallback to Ollama if available
      const ollamaAvailable = await checkOllamaHealth()
      if (ollamaAvailable) {
        console.log('🔄 Using Ollama as fallback...')
        validation = await validateIdeaWithOllama({
          ideaName: validatedData.ideaName,
          oneLiner: validatedData.oneLiner,
          problemSolved: validatedData.problemSolved,
          targetCustomer: validatedData.targetCustomer,
          businessType: validatedData.businessType,
          industry: validatedData.industry,
          priceRange: validatedData.priceRange,
        })
        aiModelUsed = 'Ollama'
      } else {
        // Both failed, re-throw Gemini error
        throw geminiError
      }
    }

    // Step 2: (Optional) Enhanced research with Perplexity
    // Only run for high-scoring ideas to save costs
    let marketResearch = null
    if (validation.marketValidation.score >= 70 && process.env.PERPLEXITY_API_KEY) {
      console.log('🔍 Running Perplexity research for high-scoring idea...')
      try {
        marketResearch = await researchMarketWithPerplexity({
          ideaName: validatedData.ideaName,
          industry: validatedData.industry,
          targetMarket: validatedData.targetCustomer,
        })
      } catch (error) {
        console.error('Perplexity research failed:', error)
        // Continue without research data
      }
    }

    // Step 3: Save to Google Sheets
    console.log('💾 Saving to Google Sheets...')
    await saveValidatedIdea({
      timestamp: new Date().toISOString(),
      email: validatedData.email,
      ideaName: validatedData.ideaName,
      oneLiner: validatedData.oneLiner,
      problemSolved: validatedData.problemSolved,
      targetCustomer: validatedData.targetCustomer,
      businessType: validatedData.businessType,
      industry: validatedData.industry,
      priceRange: validatedData.priceRange,
      score: validation.marketValidation.score,
      marketValidation: JSON.stringify(validation.marketValidation),
      quickWins: JSON.stringify(validation.quickWins),
      redFlags: JSON.stringify(validation.redFlags),
      aiModelUsed: aiModelUsed,
      processingTime: Date.now() - startTime,
      status: 'completed',
    })

    // Step 4: Return results
    const response = {
      success: true,
      marketValidation: {
        score: validation.marketValidation.score,
        summary: validation.marketValidation.summary,
        keyInsights: validation.marketValidation.keyInsights,
      },
      competitorLandscape: {
        competition: validation.competitorLandscape.competition,
        opportunities: validation.competitorLandscape.opportunities,
      },
      quickWins: validation.quickWins,
      redFlags: validation.redFlags,
      nextSteps: validation.nextSteps,
      // Include enhanced research if available
      ...(marketResearch && {
        enhancedResearch: {
          marketSize: marketResearch.marketSize,
          growthRate: marketResearch.growthRate,
          topCompetitors: marketResearch.competitorAnalysis.slice(0, 3),
          citations: marketResearch.citations,
        }
      }),
      metadata: {
        processingTime: Date.now() - startTime,
        aiModel: aiModelUsed,
        researchEnhanced: !!marketResearch,
      }
    }

    console.log(`✅ Validation completed in ${Date.now() - startTime}ms using ${aiModelUsed}`)

    return NextResponse.json(response)

  } catch (error) {
    console.error('Validation error:', error)

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
        message: 'Failed to validate idea. Please try again.',
      },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const check = searchParams.get('check')

  if (check === 'health') {
    // Check all services
    const { checkGeminiHealthForValidation } = await import('@/lib/services/gemini-validation')
    const { checkPerplexityHealth } = await import('@/lib/services/perplexity')

    const services = {
      gemini: process.env.GOOGLE_GEMINI_API_KEY ? await checkGeminiHealthForValidation() : false,
      ollama: await checkOllamaHealth(),
      perplexity: process.env.PERPLEXITY_API_KEY ? await checkPerplexityHealth() : false,
      sheets: !!(process.env.GOOGLE_SHEETS_CLIENT_EMAIL && process.env.GOOGLE_SHEETS_PRIVATE_KEY),
    }

    return NextResponse.json({
      status: 'ok',
      services,
      primary: services.gemini ? 'Gemini' : services.ollama ? 'Ollama' : 'None',
      timestamp: new Date().toISOString(),
    })
  }

  return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
}
