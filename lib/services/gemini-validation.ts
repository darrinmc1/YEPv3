/**
 * Google Gemini AI Service - VALIDATION
 * Handles idea validation using Google's free tier
 * FREE TIER: 15 requests per minute, 1500 per day
 */

import { GoogleGenerativeAI } from '@google/generative-ai'

interface ValidationInput {
  ideaName: string
  oneLiner: string
  problemSolved: string
  targetCustomer: string
  businessType: string
  industry: string
  priceRange: string
}

interface ValidationResult {
  marketValidation: {
    score: number
    summary: string
    keyInsights: string[]
  }
  competitorLandscape: {
    competition: string
    opportunities: string[]
  }
  quickWins: string[]
  redFlags: string[]
  nextSteps: string[]
}

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash-latest'

/**
 * Validate business idea using Gemini
 */
export async function validateIdeaWithGemini(
  input: ValidationInput
): Promise<ValidationResult> {
  if (!GEMINI_API_KEY) {
    throw new Error('Google Gemini API key not configured')
  }

  const startTime = Date.now()

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL })

    const prompt = buildValidationPrompt(input)
    
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    })

    const response = result.response.text()
    const analysis = parseGeminiResponse(response)
    
    const processingTime = Date.now() - startTime
    console.log(`Gemini validation completed in ${processingTime}ms`)

    return analysis
  } catch (error) {
    console.error('Gemini validation error:', error)
    // Return fallback validation
    return generateFallbackValidation(input)
  }
}

/**
 * Build validation prompt for Gemini
 */
function buildValidationPrompt(input: ValidationInput): string {
  return `You are a business validation expert. Analyze this business idea and provide structured, actionable feedback.

BUSINESS IDEA:
Name: ${input.ideaName}
Description: ${input.oneLiner}
Problem Solved: ${input.problemSolved}
Target Customer: ${input.targetCustomer}
Business Type: ${input.businessType}
Industry: ${input.industry}
Price Range: ${input.priceRange}

TASK: Provide a comprehensive validation analysis in JSON format with these sections:

1. MARKET VALIDATION
   - Overall opportunity score (0-100, be realistic)
   - Brief market summary (2-3 sentences explaining the opportunity)
   - 3-5 key market insights (specific, actionable points)

2. COMPETITION ANALYSIS
   - Competition level: Low, Medium, or High
   - 2-3 specific opportunity gaps in the market

3. QUICK WINS
   - 3-4 immediate actions they can take to validate/start (be specific)

4. RED FLAGS
   - 2-3 potential challenges or risks they should watch for

5. NEXT STEPS
   - 3-4 concrete next steps for moving forward

Format your response as valid JSON:
{
  "score": 75,
  "marketSummary": "Brief 2-3 sentence summary of the opportunity...",
  "keyInsights": [
    "Specific insight about market size or customer need",
    "Insight about competition or positioning",
    "Insight about timing or trends"
  ],
  "competitionLevel": "Medium",
  "opportunities": [
    "Specific gap in current market offerings",
    "Opportunity for differentiation"
  ],
  "quickWins": [
    "Specific action: Interview 10 target customers to validate X",
    "Specific action: Create a landing page to test demand",
    "Specific action: Build MVP with these 3 core features"
  ],
  "redFlags": [
    "Specific challenge or risk to watch",
    "Another potential obstacle"
  ],
  "nextSteps": [
    "Step 1: Specific action",
    "Step 2: Specific action",
    "Step 3: Specific action"
  ]
}

SCORING GUIDELINES:
- 80-100: Exceptional opportunity, clear market need, low competition
- 70-79: Strong opportunity, good market fit
- 60-69: Decent opportunity, needs more validation
- 50-59: Risky, significant challenges to overcome
- Below 50: Major concerns, recommend rethinking approach

IMPORTANT:
- Be specific and actionable in all feedback
- Focus on practical insights the founder can act on
- Score realistically (60-85 is typical range)
- Each item should be 1-2 sentences maximum

Return ONLY the JSON object, no other text or markdown formatting.`
}

/**
 * Parse Gemini response
 */
function parseGeminiResponse(response: string): ValidationResult {
  try {
    // Remove markdown code blocks if present
    let cleaned = response.trim()
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/```\n?/g, '')
    }

    // Extract JSON object
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

    const parsed = JSON.parse(jsonMatch[0])

    return {
      marketValidation: {
        score: parsed.score || 65,
        summary: parsed.marketSummary || 'Market analysis completed',
        keyInsights: Array.isArray(parsed.keyInsights) ? parsed.keyInsights : []
      },
      competitorLandscape: {
        competition: parsed.competitionLevel || 'Medium',
        opportunities: Array.isArray(parsed.opportunities) ? parsed.opportunities : []
      },
      quickWins: Array.isArray(parsed.quickWins) ? parsed.quickWins : [],
      redFlags: Array.isArray(parsed.redFlags) ? parsed.redFlags : [],
      nextSteps: Array.isArray(parsed.nextSteps) ? parsed.nextSteps : []
    }
  } catch (error) {
    console.error('Failed to parse Gemini response:', error)
    console.error('Raw response:', response)
    throw error
  }
}

/**
 * Fallback validation when Gemini fails
 */
function generateFallbackValidation(input: ValidationInput): ValidationResult {
  let score = 60

  // Adjust score based on inputs
  if (input.problemSolved.length > 100) score += 10
  if (input.targetCustomer.length > 50) score += 5
  
  const hotIndustries = ['technology', 'saas', 'ai', 'automation', 'software']
  if (hotIndustries.some(ind => input.industry.toLowerCase().includes(ind))) {
    score += 10
  }

  return {
    marketValidation: {
      score: Math.min(score, 85),
      summary: `${input.ideaName} addresses a need in the ${input.industry} space. The idea of ${input.problemSolved.substring(0, 100)}... represents a valid market opportunity worth exploring further.`,
      keyInsights: [
        `Target market of "${input.targetCustomer}" is clearly defined, which helps with focused customer acquisition`,
        `${input.businessType} business model aligns well with the problem-solution approach`,
        `Price point of "${input.priceRange}" is within typical market expectations for this industry`
      ]
    },
    competitorLandscape: {
      competition: 'Medium',
      opportunities: [
        'Market shows clear demand for solutions addressing this problem',
        'Potential to differentiate through unique value proposition and customer focus'
      ]
    },
    quickWins: [
      'Conduct 10-15 customer interviews to validate the problem and willingness to pay',
      'Create a simple landing page explaining your solution and collect email signups',
      'Build a minimal MVP focusing on the core problem to test with early users',
      'Join 3-5 online communities where your target customers gather'
    ],
    redFlags: [
      'Significant market validation needed before major investment or quitting day job',
      'Need to understand competitive landscape in detail to ensure differentiation'
    ],
    nextSteps: [
      'Define your unique value proposition: What makes your solution 10x better?',
      'Research top 5 competitors and identify their weaknesses',
      'Create a 90-day roadmap starting with customer validation',
      'Set clear success metrics: X interviews, Y signups, Z early users'
    ]
  }
}

/**
 * Check if Gemini API is available
 */
export async function checkGeminiHealthForValidation(): Promise<boolean> {
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
