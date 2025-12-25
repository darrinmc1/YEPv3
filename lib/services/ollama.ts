/**
 * Ollama AI Service
 * Handles idea validation using local/self-hosted Ollama
 * FREE - No API costs!
 */

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

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.1:8b'

/**
 * Validate business idea using Ollama
 */
export async function validateIdeaWithOllama(
  input: ValidationInput
): Promise<ValidationResult> {
  const startTime = Date.now()

  try {
    const prompt = buildValidationPrompt(input)
    
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          num_predict: 2000,
        }
      }),
    })

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`)
    }

    const data = await response.json()
    const analysis = parseOllamaResponse(data.response)
    
    const processingTime = Date.now() - startTime
    console.log(`Ollama validation completed in ${processingTime}ms`)

    return analysis
  } catch (error) {
    console.error('Ollama validation error:', error)
    // Return fallback response
    return generateFallbackValidation(input)
  }
}

/**
 * Build validation prompt for Ollama
 */
function buildValidationPrompt(input: ValidationInput): string {
  return `You are a business validation expert. Analyze this business idea and provide structured feedback.

BUSINESS IDEA:
Name: ${input.ideaName}
Description: ${input.oneLiner}
Problem: ${input.problemSolved}
Target Customer: ${input.targetCustomer}
Business Type: ${input.businessType}
Industry: ${input.industry}
Price Range: ${input.priceRange}

TASK: Provide a comprehensive validation analysis in JSON format with these sections:

1. MARKET VALIDATION (score 0-100)
   - Overall opportunity score
   - Brief market summary (2-3 sentences)
   - 3-5 key market insights

2. COMPETITION
   - Competition level (Low/Medium/High)
   - 2-3 opportunity gaps in market

3. QUICK WINS
   - 3-4 actionable quick wins they can implement immediately

4. RED FLAGS
   - 2-3 potential challenges or risks to watch

5. NEXT STEPS
   - 3-4 concrete next steps for validation

Format your response as valid JSON with this structure:
{
  "score": 75,
  "marketSummary": "...",
  "keyInsights": ["insight 1", "insight 2", "insight 3"],
  "competitionLevel": "Medium",
  "opportunities": ["opp 1", "opp 2"],
  "quickWins": ["win 1", "win 2", "win 3"],
  "redFlags": ["flag 1", "flag 2"],
  "nextSteps": ["step 1", "step 2", "step 3"]
}

IMPORTANT: 
- Be specific and actionable
- Focus on practical insights
- Score should be realistic (40-85 range typical)
- Keep each item concise (1-2 sentences max)

Return ONLY the JSON, no other text.`
}

/**
 * Parse Ollama response and structure it
 */
function parseOllamaResponse(response: string): ValidationResult {
  try {
    // Try to extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

    const parsed = JSON.parse(jsonMatch[0])

    return {
      marketValidation: {
        score: parsed.score || 65,
        summary: parsed.marketSummary || 'Market analysis completed',
        keyInsights: parsed.keyInsights || []
      },
      competitorLandscape: {
        competition: parsed.competitionLevel || 'Medium',
        opportunities: parsed.opportunities || []
      },
      quickWins: parsed.quickWins || [],
      redFlags: parsed.redFlags || [],
      nextSteps: parsed.nextSteps || []
    }
  } catch (error) {
    console.error('Failed to parse Ollama response:', error)
    throw error
  }
}

/**
 * Fallback validation when Ollama is unavailable
 */
function generateFallbackValidation(input: ValidationInput): ValidationResult {
  // Generate score based on inputs
  let score = 60

  // Adjust score based on problem clarity
  if (input.problemSolved.length > 100) score += 10
  
  // Adjust for target customer specificity
  if (input.targetCustomer.length > 50) score += 5

  // Industry factors
  const hotIndustries = ['technology', 'saas', 'ai', 'automation', 'software']
  if (hotIndustries.some(ind => input.industry.toLowerCase().includes(ind))) {
    score += 10
  }

  return {
    marketValidation: {
      score: Math.min(score, 85),
      summary: `${input.ideaName} shows potential in the ${input.industry} space. The idea addresses ${input.problemSolved.substring(0, 100)}... which is a valid market need.`,
      keyInsights: [
        `Target market of "${input.targetCustomer}" is clearly defined`,
        `${input.businessType} model fits the problem-solution approach`,
        `Price point of "${input.priceRange}" aligns with market expectations`
      ]
    },
    competitorLandscape: {
      competition: 'Medium',
      opportunities: [
        'Market shows demand for solutions in this space',
        'Potential to differentiate through unique value proposition'
      ]
    },
    quickWins: [
      'Validate assumptions with 10-20 target customers through interviews',
      'Create a simple landing page to test demand',
      'Build an MVP version to test core functionality'
    ],
    redFlags: [
      'Market validation needed before significant investment',
      'Consider competitive landscape in detail'
    ],
    nextSteps: [
      'Conduct customer interviews to validate problem',
      'Research existing solutions and competitors',
      'Define your unique value proposition',
      'Create a minimum viable product (MVP) plan'
    ]
  }
}

/**
 * Check if Ollama is available
 */
export async function checkOllamaHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000) // 3 second timeout
    })
    return response.ok
  } catch {
    return false
  }
}

/**
 * Get available Ollama models
 */
export async function getAvailableModels(): Promise<string[]> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`)
    if (!response.ok) return []
    
    const data = await response.json()
    return data.models?.map((m: any) => m.name) || []
  } catch {
    return []
  }
}
