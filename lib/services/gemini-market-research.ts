import { GoogleGenerativeAI } from "@google/generative-ai"

interface MarketResearchInput {
  industry: string
  businessIdea: string
  targetAudience: string
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "")
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })

export async function performDeepMarketResearch(input: MarketResearchInput) {
  const prompt = `You are a high-end market research analyst. Perform a deep dive analysis for the following business idea:
  
  BUSINESS IDEA: ${input.businessIdea}
  INDUSTRY: ${input.industry}
  TARGET AUDIENCE: ${input.targetAudience}
  
  Provide a detailed report in JSON format with the following sections:
  1. marketTrends: Current trends in this specific niche (at least 3)
  2. competitiveLandscape: Analysis of existing solutions and their weaknesses
  3. audiencePainPoints: Deep psychological pain points of the target audience
  4. uniqueValueProposition: Suggested differentiated angle to win the market
  5. potentialObstacles: Regulatory, technical, or market entry barriers
  6. scalabilityRating: 1-10 with reasoning
  
  Format the output as a valid JSON object only.`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Simple JSON extraction
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Failed to parse research data" }
  } catch (error) {
    console.error("Gemini Market Research Error:", error)
    throw new Error("Market research failed")
  }
}
