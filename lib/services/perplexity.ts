/**
 * Perplexity AI Service
 * Handles deep research and competitive analysis using Perplexity's search-augmented AI
 * PAID: ~$0.002 per request with sonar-small model
 */

interface ResearchInput {
  ideaName: string
  industry: string
  targetMarket: string
}

interface ResearchResult {
  marketSize: string
  growthRate: string
  competitorAnalysis: {
    name: string
    position: string
    weakness: string
  }[]
  trendAnalysis: string[]
  citations: string[]
}

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY
const PERPLEXITY_MODEL = process.env.PERPLEXITY_MODEL || 'llama-3.1-sonar-small-128k-online'
const PERPLEXITY_BASE_URL = 'https://api.perplexity.ai'

/**
 * Conduct market research using Perplexity
 */
export async function researchMarketWithPerplexity(
  input: ResearchInput
): Promise<ResearchResult> {
  if (!PERPLEXITY_API_KEY) {
    throw new Error('Perplexity API key not configured')
  }

  const startTime = Date.now()

  try {
    const prompt = buildResearchPrompt(input)
    
    const response = await fetch(`${PERPLEXITY_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: PERPLEXITY_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a business market research analyst. Provide data-backed insights with citations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3, // Lower for more factual
        top_p: 0.9,
        return_citations: true,
        search_recency_filter: 'month', // Recent data
        max_tokens: 1500,
      }),
    })

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.statusText}`)
    }

    const data = await response.json()
    const result = parsePerplexityResponse(data)
    
    const processingTime = Date.now() - startTime
    console.log(`Perplexity research completed in ${processingTime}ms`)

    return result
  } catch (error) {
    console.error('Perplexity research error:', error)
    // Return fallback research
    return generateFallbackResearch(input)
  }
}

/**
 * Build research prompt for Perplexity
 */
function buildResearchPrompt(input: ResearchInput): string {
  return `Research the market opportunity for: "${input.ideaName}"

Industry: ${input.industry}
Target Market: ${input.targetMarket}

Provide a structured market analysis with:

1. MARKET SIZE & GROWTH
   - Current market size (in USD)
   - Growth rate (YoY %)
   - Market trends driving growth

2. TOP 5 COMPETITORS
   For each competitor, provide:
   - Company name
   - Market position (leader/challenger/niche)
   - Key weakness or gap they don't address

3. RECENT TRENDS (Last 6 months)
   - 3-5 key trends or changes in this market
   - New technologies or approaches emerging

Format as JSON:
{
  "marketSize": "$X.XB",
  "growthRate": "+XX%",
  "competitors": [
    {
      "name": "CompanyX",
      "position": "Market leader",
      "weakness": "Expensive pricing leaves budget segment open"
    }
  ],
  "trends": [
    "Trend 1 description",
    "Trend 2 description"
  ]
}

Use current data from 2024-2025. Be specific with numbers.`
}

/**
 * Parse Perplexity response
 */
function parsePerplexityResponse(data: any): ResearchResult {
  try {
    const content = data.choices[0].message.content
    const citations = data.citations || []

    // Try to extract JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      
      return {
        marketSize: parsed.marketSize || 'Data not available',
        growthRate: parsed.growthRate || 'Growth data pending',
        competitorAnalysis: parsed.competitors || [],
        trendAnalysis: parsed.trends || [],
        citations: citations
      }
    }

    // Fallback: parse from text
    return extractFromText(content, citations)
  } catch (error) {
    console.error('Failed to parse Perplexity response:', error)
    throw error
  }
}

/**
 * Extract structured data from text response
 */
function extractFromText(text: string, citations: string[]): ResearchResult {
  // Simple extraction logic
  const marketSizeMatch = text.match(/\$[\d.]+[BMK]/i)
  const growthRateMatch = text.match(/(\+|\-)?\d+%/g)

  return {
    marketSize: marketSizeMatch ? marketSizeMatch[0] : 'Not specified',
    growthRate: growthRateMatch ? growthRateMatch[0] : 'Growing',
    competitorAnalysis: extractCompetitors(text),
    trendAnalysis: extractTrends(text),
    citations: citations
  }
}

function extractCompetitors(text: string): ResearchResult['competitorAnalysis'] {
  // Very basic competitor extraction
  const competitors: ResearchResult['competitorAnalysis'] = []
  
  // Look for company names (capitalized words)
  const lines = text.split('\n')
  lines.forEach(line => {
    if (line.match(/^\d\./)) { // Numbered list
      const nameMatch = line.match(/\d\.\s*([A-Z][a-zA-Z0-9\s&]+)/)
      if (nameMatch) {
        competitors.push({
          name: nameMatch[1].trim(),
          position: 'Competitor',
          weakness: 'Analysis in progress'
        })
      }
    }
  })

  return competitors
}

function extractTrends(text: string): string[] {
  const trends: string[] = []
  const lines = text.split('\n')
  
  lines.forEach(line => {
    if (line.toLowerCase().includes('trend') || 
        line.toLowerCase().includes('growth') ||
        line.match(/^\d\./)) {
      const cleaned = line.replace(/^\d\.\s*/, '').trim()
      if (cleaned.length > 20 && cleaned.length < 200) {
        trends.push(cleaned)
      }
    }
  })

  return trends.slice(0, 5)
}

/**
 * Fallback research when Perplexity is unavailable
 */
function generateFallbackResearch(input: ResearchInput): ResearchResult {
  return {
    marketSize: 'Market size estimation in progress',
    growthRate: 'Growth analysis pending',
    competitorAnalysis: [
      {
        name: 'Research in progress',
        position: 'Competitor analysis will be completed with live data',
        weakness: 'Detailed competitive analysis available with premium research'
      }
    ],
    trendAnalysis: [
      `${input.industry} market shows continued growth`,
      'Digital transformation driving new opportunities',
      'Customer expectations evolving rapidly'
    ],
    citations: []
  }
}

/**
 * Lightweight competitor search (cheaper than full research)
 */
export async function searchCompetitors(
  industry: string,
  specificNiche: string
): Promise<string[]> {
  if (!PERPLEXITY_API_KEY) {
    return ['Research unavailable - Perplexity API key not configured']
  }

  try {
    const response = await fetch(`${PERPLEXITY_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: PERPLEXITY_MODEL,
        messages: [
          {
            role: 'user',
            content: `List the top 5 companies in ${industry} focusing on ${specificNiche}. Just company names, one per line.`
          }
        ],
        temperature: 0.2,
        max_tokens: 200,
      }),
    })

    if (!response.ok) throw new Error('Search failed')

    const data = await response.json()
    const content = data.choices[0].message.content
    
    return content
      .split('\n')
      .filter((line: string) => line.trim().length > 0)
      .map((line: string) => line.replace(/^\d+\.\s*/, '').trim())
      .slice(0, 5)
  } catch (error) {
    console.error('Competitor search error:', error)
    return []
  }
}

/**
 * Check if Perplexity API is available
 */
export async function checkPerplexityHealth(): Promise<boolean> {
  if (!PERPLEXITY_API_KEY) return false

  try {
    const response = await fetch(`${PERPLEXITY_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: PERPLEXITY_MODEL,
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 10,
      }),
      signal: AbortSignal.timeout(5000)
    })

    return response.ok
  } catch {
    return false
  }
}
