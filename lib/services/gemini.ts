/**
 * Google Gemini AI Service
 * Handles idea exploration and matching using Google's free tier
 * FREE TIER: 15 requests per minute, 1500 per day
 */

import { GoogleGenerativeAI } from '@google/generative-ai'

interface ExploreInput {
  interests: string
  industry: string
  budget: string
  timeCommitment: string
  difficulty: string
  skills: string[]
  avoidTopics: string
}

export interface IdeaMatch {
  id: string
  title: string
  oneLiner: string
  industry: string
  score: number
  marketSize: string
  growthRate: string
  difficulty: string
  timeToFirstSale: string
  startupCost: string
  whyNow: string
  quickInsights: string[]
  matchReason: string // Why this idea matched user's interests
}

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash'

/**
 * Generate content for a specific template
 */
export async function generateTemplateContent(
  templateName: string,
  templateDescription: string,
  businessContext?: string
): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('Google Gemini API key not configured')
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL })

    const prompt = `You are a professional business consultant and expert content creator.
    
    TASK: Create a comprehensive entry for the following business template: "${templateName}".
    
    DESCRIPTION: ${templateDescription}
    
    ${businessContext ? `BUSINESS CONTEXT: ${businessContext}` : 'CONTEXT: Create a generic, high-quality template that can be used by any business.'}
    
    REQUIREMENTS:
    - distinct sections with clear headings
    - Professional tone
    - Actionable content
    - If it's a spreadsheet/roadmap, use Markdown tables
    - If it's a document/plan, use Markdown headers and bullet points
    
    OUTPUT FORMAT: Markdown only.`

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    })

    return result.response.text()
  } catch (error) {
    console.error('Gemini template generation error:', error)
    throw new Error('Failed to generate template content')
  }
}

/**
 * Find matching ideas using Gemini
 */
export async function findIdeasWithGemini(
  input: ExploreInput,
  ideasLibrary: any[]
): Promise<IdeaMatch[]> {
  if (!GEMINI_API_KEY) {
    throw new Error('Google Gemini API key not configured')
  }

  const startTime = Date.now()

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL })

    const prompt = buildExplorePrompt(input, ideasLibrary)

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.8,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    })

    const response = result.response.text()
    const matches = parseGeminiResponse(response, ideasLibrary)

    const processingTime = Date.now() - startTime
    console.log(`Gemini matching completed in ${processingTime}ms`)

    return matches
  } catch (error) {
    console.error('Gemini matching error:', error)
    // Return fallback matches
    return generateFallbackMatches(input, ideasLibrary)
  }
}

/**
 * Build exploration prompt for Gemini
 */
function buildExplorePrompt(input: ExploreInput, ideasLibrary: any[]): string {
  // Prepare ideas summary
  const ideasSummary = ideasLibrary.slice(0, 20).map(idea =>
    `ID: ${idea.ideaId}
Title: ${idea.title}
Industry: ${idea.industry}
Score: ${idea.score}
Difficulty: ${idea.difficulty}
Cost: ${idea.startupCost}
Quick: ${idea.oneLiner}`
  ).join('\n\n')

  return `You are a business opportunity matching expert. Your task is to match a user with the best business ideas from our library based on their preferences.

USER PREFERENCES:
${input.interests ? `Interests: ${input.interests}` : 'No specific interests mentioned'}
Industry: ${input.industry}
Budget: ${input.budget}
Time Available: ${input.timeCommitment}
Difficulty Preference: ${input.difficulty}
Skills: ${input.skills.join(', ') || 'None specified'}
${input.avoidTopics ? `Avoid: ${input.avoidTopics}` : ''}

AVAILABLE IDEAS (Top 20):
${ideasSummary}

TASK: Select the top 3-5 ideas that best match this user's profile and interests.

For each selected idea, explain:
1. Why it matches their interests/skills
2. How it aligns with their constraints (budget, time, difficulty)
3. What makes it a good fit specifically for them

Format as JSON array:
[
  {
    "ideaId": "idea-001",
    "matchScore": 90,
    "matchReason": "This idea perfectly aligns with your interest in AI tools and requires only basic technical skills. The $500-2000 budget fits your range, and you can start getting sales in 4-6 weeks which matches your timeline."
  },
  ...
]

Return ONLY the JSON array, no other text.

Selection criteria:
1. Interest alignment (most important)
2. Budget match
3. Time commitment fit
4. Skill level match
5. Avoid topics compliance
6. Overall opportunity score

Return 3-5 best matches, ranked by match quality.`
}

/**
 * Parse Gemini response
 */
function parseGeminiResponse(response: string, ideasLibrary: any[]): IdeaMatch[] {
  try {
    // Extract JSON from response
    const jsonMatch = response.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error('No JSON array found in response')
    }

    const matches = JSON.parse(jsonMatch[0])

    // Enrich with full idea data
    return matches.map((match: any) => {
      const idea = ideasLibrary.find(i => i.ideaId === match.ideaId)
      if (!idea) return null

      return {
        id: idea.ideaId,
        title: idea.title,
        oneLiner: idea.oneLiner,
        industry: idea.industry,
        score: idea.score,
        marketSize: idea.marketSize,
        growthRate: idea.growthRate,
        difficulty: idea.difficulty,
        timeToFirstSale: idea.timeToFirstSale,
        startupCost: idea.startupCost,
        whyNow: idea.whyNow,
        quickInsights: JSON.parse(idea.quickInsights || '[]'),
        matchReason: match.matchReason
      }
    }).filter(Boolean)
  } catch (error) {
    console.error('Failed to parse Gemini response:', error)
    throw error
  }
}

/**
 * Fallback matching when Gemini is unavailable
 */
function generateFallbackMatches(
  input: ExploreInput,
  ideasLibrary: any[]
): IdeaMatch[] {
  // Simple keyword-based matching
  let scored = ideasLibrary.map(idea => {
    let score = 0

    // Industry match
    if (input.industry && input.industry !== 'any') {
      if (idea.industry.toLowerCase().includes(input.industry.toLowerCase())) {
        score += 30
      }
    }

    // Interest match (basic keyword)
    if (input.interests) {
      const interests = input.interests.toLowerCase().split(' ')
      const ideaText = `${idea.title} ${idea.oneLiner} ${idea.tags}`.toLowerCase()
      interests.forEach(interest => {
        if (interest.length > 3 && ideaText.includes(interest)) {
          score += 10
        }
      })
    }

    // Budget match
    if (matchesBudgetConstraint(idea.startupCost, input.budget)) {
      score += 15
    }

    // Difficulty match
    if (input.difficulty && input.difficulty !== 'any') {
      if (idea.difficulty.toLowerCase() === input.difficulty.toLowerCase()) {
        score += 15
      }
    }

    // Skills match
    if (input.skills.length > 0) {
      const requiredSkills = idea.requiredSkills?.toLowerCase() || ''
      input.skills.forEach(skill => {
        if (requiredSkills.includes(skill.toLowerCase())) {
          score += 10
        }
      })
    }

    // Avoid topics
    if (input.avoidTopics) {
      const avoid = input.avoidTopics.toLowerCase().split(',')
      const ideaText = `${idea.title} ${idea.oneLiner} ${idea.tags}`.toLowerCase()
      avoid.forEach(topic => {
        if (topic.trim().length > 0 && ideaText.includes(topic.trim())) {
          score -= 50 // Heavy penalty
        }
      })
    }

    // Boost by opportunity score
    score += idea.score / 10

    return { ...idea, matchScore: score }
  })

  // Sort by match score
  scored.sort((a, b) => b.matchScore - a.matchScore)

  // Take top 5
  return scored.slice(0, 5).map(idea => ({
    id: idea.ideaId,
    title: idea.title,
    oneLiner: idea.oneLiner,
    industry: idea.industry,
    score: idea.score,
    marketSize: idea.marketSize,
    growthRate: idea.growthRate,
    difficulty: idea.difficulty,
    timeToFirstSale: idea.timeToFirstSale,
    startupCost: idea.startupCost,
    whyNow: idea.whyNow,
    quickInsights: JSON.parse(idea.quickInsights || '[]'),
    matchReason: generateMatchReason(idea, input)
  }))
}

function matchesBudgetConstraint(ideaCost: string, filterBudget: string): boolean {
  if (filterBudget === 'any') return true

  const budgetMap: { [key: string]: number } = {
    'bootstrap': 0,
    'low': 500,
    'medium': 2000,
    'high': 10000,
  }

  const ideaMax = extractMaxBudget(ideaCost)
  const filterMax = budgetMap[filterBudget] || Infinity

  return ideaMax <= filterMax
}

function extractMaxBudget(budgetString: string): number {
  const numbers = budgetString.match(/\d+/g)
  if (!numbers) return 0
  return Math.max(...numbers.map(n => parseInt(n.replace(',', ''))))
}

function generateMatchReason(idea: any, input: ExploreInput): string {
  const reasons = []

  if (input.industry && input.industry !== 'any' &&
    idea.industry.toLowerCase().includes(input.industry.toLowerCase())) {
    reasons.push(`matches your ${input.industry} industry interest`)
  }

  if (matchesBudgetConstraint(idea.startupCost, input.budget)) {
    reasons.push(`fits your ${input.budget} budget`)
  }

  if (idea.difficulty.toLowerCase() === input.difficulty?.toLowerCase()) {
    reasons.push(`aligns with your ${input.difficulty} skill level`)
  }

  if (reasons.length === 0) {
    reasons.push('shows strong market opportunity')
  }

  return `This idea ${reasons.join(', ')} with a ${idea.score}/100 opportunity score.`
}

/**
 * Check if Gemini API is available
 */
export async function checkGeminiHealth(): Promise<boolean> {
  if (!GEMINI_API_KEY) return false

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL })

    await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: 'Test' }] }],
    })

    return true
  } catch {
    return false
  }
}
