/**
 * Google Sheets Database Service
 * Handles all database operations using Google Sheets as backend
 */

import { google } from 'googleapis'

// Initialize Google Sheets client
const getSheets = () => {
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n')
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL

  if (!privateKey || !clientEmail) {
    throw new Error('Missing Google Sheets credentials')
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  return google.sheets({ version: 'v4', auth })
}

// ============================================
// VALIDATED IDEAS OPERATIONS
// ============================================

export interface ValidatedIdea {
  timestamp: string
  email: string
  ideaName: string
  oneLiner: string
  problemSolved: string
  targetCustomer: string
  businessType: string
  industry: string
  priceRange: string
  score: number
  marketValidation: string // JSON string
  quickWins: string // JSON array
  redFlags: string // JSON array
  aiModelUsed: string
  processingTime: number
  status: string
}

export async function saveValidatedIdea(data: ValidatedIdea) {
  const sheets = getSheets()
  const sheetId = process.env.GOOGLE_SHEET_ID_VALIDATED

  const row = [
    data.timestamp,
    data.email,
    data.ideaName,
    data.oneLiner,
    data.problemSolved,
    data.targetCustomer,
    data.businessType,
    data.industry,
    data.priceRange,
    data.score,
    data.marketValidation,
    data.quickWins,
    data.redFlags,
    data.aiModelUsed,
    data.processingTime,
    data.status,
  ]

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: 'Sheet1!A:P',
    valueInputOption: 'RAW',
    requestBody: {
      values: [row],
    },
  })
}

export async function getValidatedIdeasByEmail(email: string): Promise<ValidatedIdea[]> {
  const sheets = getSheets()
  const sheetId = process.env.GOOGLE_SHEET_ID_VALIDATED

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Sheet1!A2:P', // Skip header
  })

  const rows = response.data.values || []
  
  return rows
    .filter(row => row[1] === email) // Match email column
    .map(row => ({
      timestamp: row[0],
      email: row[1],
      ideaName: row[2],
      oneLiner: row[3],
      problemSolved: row[4],
      targetCustomer: row[5],
      businessType: row[6],
      industry: row[7],
      priceRange: row[8],
      score: Number(row[9]),
      marketValidation: row[10],
      quickWins: row[11],
      redFlags: row[12],
      aiModelUsed: row[13],
      processingTime: Number(row[14]),
      status: row[15],
    }))
}

// ============================================
// EXPLORE REQUESTS OPERATIONS
// ============================================

export interface ExploreRequest {
  timestamp: string
  email: string
  interests: string
  industry: string
  budget: string
  timeCommitment: string
  difficulty: string
  skills: string // JSON array
  avoidTopics: string
  matchedIdeasCount: number
  ideasDelivered: string // JSON array of idea IDs
  status: string
}

export async function saveExploreRequest(data: ExploreRequest) {
  const sheets = getSheets()
  const sheetId = process.env.GOOGLE_SHEET_ID_EXPLORE

  const row = [
    data.timestamp,
    data.email,
    data.interests,
    data.industry,
    data.budget,
    data.timeCommitment,
    data.difficulty,
    data.skills,
    data.avoidTopics,
    data.matchedIdeasCount,
    data.ideasDelivered,
    data.status,
  ]

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: 'Sheet1!A:L',
    valueInputOption: 'RAW',
    requestBody: {
      values: [row],
    },
  })
}

// ============================================
// IDEAS LIBRARY OPERATIONS
// ============================================

export interface IdeaLibraryItem {
  ideaId: string
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
  quickInsights: string // JSON array
  fullContentJson: string // JSON object with all locked content
  tags: string // comma-separated
  targetBudget: string
  requiredSkills: string // comma-separated
  createdAt: string
}

export async function addIdeaToLibrary(idea: IdeaLibraryItem) {
  const sheets = getSheets()
  const sheetId = process.env.GOOGLE_SHEET_ID_LIBRARY

  const row = [
    idea.ideaId,
    idea.title,
    idea.oneLiner,
    idea.industry,
    idea.score,
    idea.marketSize,
    idea.growthRate,
    idea.difficulty,
    idea.timeToFirstSale,
    idea.startupCost,
    idea.whyNow,
    idea.quickInsights,
    idea.fullContentJson,
    idea.tags,
    idea.targetBudget,
    idea.requiredSkills,
    idea.createdAt,
  ]

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: 'Sheet1!A:Q',
    valueInputOption: 'RAW',
    requestBody: {
      values: [row],
    },
  })
}

export async function searchIdeas(filters: {
  industry?: string
  budget?: string
  difficulty?: string
  skills?: string[]
  searchTerm?: string
}): Promise<any[]> {
  const sheets = getSheets()
  const sheetId = process.env.GOOGLE_SHEET_ID_LIBRARY

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Sheet1!A2:S', // Include cost breakdown column
  })

  const rows = response.data.values || []
  
  // Map to our new structure
  let ideas = rows.map(row => ({
    id: row[0] || '',              // A: Idea ID
    title: row[1] || '',           // B: Idea Name
    industry: row[2] || '',        // C: Category
    subcategory: row[3] || '',     // D: Subcategory
    score: parseFloat(row[4]) || 7.0,  // E: Score
    marketSize: row[5] || 'TBD',   // F: Market Size
    growthRate: row[6] || 'TBD',   // G: Growth Rate
    difficulty: row[7] || 'Intermediate',  // H: Difficulty
    timeToFirstSale: row[8] || '4-8 weeks',  // I: Time to First Sale
    startupCost: row[9] || 'TBD',  // J: Startup Cost
    oneLiner: row[10] || '',       // K: One-liner
    whyNow: row[11] || '',         // L: Why Now
    quickInsights: row[12] || '[]',  // M: Quick Insights (JSON)
    lockedContent: row[13] || '[]',  // N: Locked Content (JSON)
    dateAdded: row[14] || '',      // O: Date Added
    status: row[15] || '',         // P: Status
    fullDescription: row[16] || '', // Q: Full Description
    pricingModel: row[17] || 'N/A', // R: Pricing Model
    costBreakdown: row[18] || '',  // S: Cost Breakdown
  }))

  // Apply filters
  if (filters.industry && filters.industry !== 'any') {
    ideas = ideas.filter(idea => 
      idea.industry.toLowerCase().includes(filters.industry!.toLowerCase())
    )
  }

  if (filters.difficulty && filters.difficulty !== 'any') {
    ideas = ideas.filter(idea => 
      idea.difficulty.toLowerCase() === filters.difficulty!.toLowerCase()
    )
  }

  if (filters.budget && filters.budget !== 'any') {
    ideas = ideas.filter(idea => 
      matchesBudget(idea.startupCost, filters.budget!)
    )
  }

  if (filters.searchTerm) {
    const searchTerms = filters.searchTerm.toLowerCase().split(/\s+/).filter(t => t.length > 2) // Split by spaces, ignore short words
    ideas = ideas.filter(idea => {
      const searchableText = [
        idea.title,
        idea.oneLiner,
        idea.industry,
        idea.subcategory,
        idea.fullDescription
      ].join(' ').toLowerCase()
      
      // Match if ANY search term appears
      return searchTerms.some(term => searchableText.includes(term))
    })
  }

  // Sort by score (highest first)
  ideas.sort((a, b) => b.score - a.score)

  return ideas.slice(0, 10) // Return top 10 matches
}

function matchesBudget(ideaBudget: string, filterBudget: string): boolean {
  // Budget matching logic
  const budgetMap: { [key: string]: number } = {
    'bootstrap': 0,
    'low': 500,
    'medium': 2000,
    'high': 10000,
  }

  const ideaMax = extractMaxBudget(ideaBudget)
  const filterMax = budgetMap[filterBudget] || Infinity

  return ideaMax <= filterMax
}

function extractMaxBudget(budgetString: string): number {
  // Extract number from strings like "$500 - $2,000"
  const numbers = budgetString.match(/\d+/g)
  if (!numbers) return 0
  return Math.max(...numbers.map(n => parseInt(n.replace(',', ''))))
}

// ============================================
// RATE LIMITING (Using sheets as simple counter)
// ============================================

export async function checkRateLimit(email: string, type: 'validate' | 'explore'): Promise<{
  allowed: boolean
  remaining: number
  resetTime: string
}> {
  const limit = type === 'validate' 
    ? parseInt(process.env.FREE_VALIDATIONS_PER_DAY || '3')
    : parseInt(process.env.FREE_EXPLORATIONS_PER_DAY || '5')

  const sheets = getSheets()
  const sheetId = type === 'validate' 
    ? process.env.GOOGLE_SHEET_ID_VALIDATED
    : process.env.GOOGLE_SHEET_ID_EXPLORE

  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
  
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Sheet1!A2:B',
  })

  const rows = response.data.values || []
  const todayCount = rows.filter(row => {
    const timestamp = row[0]
    const rowEmail = row[1]
    return rowEmail === email && timestamp.startsWith(today)
  }).length

  const resetTime = new Date()
  resetTime.setHours(24, 0, 0, 0) // Midnight tonight

  return {
    allowed: todayCount < limit,
    remaining: Math.max(0, limit - todayCount),
    resetTime: resetTime.toISOString(),
  }
}
