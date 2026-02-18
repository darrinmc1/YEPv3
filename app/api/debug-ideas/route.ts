import { NextResponse } from 'next/server'

interface Idea {
  id: string
  title: string
  industry: string
  score: string
}

export async function GET() {
  try {
    console.log('🔍 Fetching ideas from Google Sheets...')

    // Get first 50 ideas from sheet
    const ideas = await getIdeasFromSheet(50)

    console.log(`✅ Found ${ideas.length} ideas`)

    return NextResponse.json({
      success: true,
      count: ideas.length,
      ideas: ideas.map((idea: Idea) => ({
        id: idea.id,
        title: idea.title,
        industry: idea.industry,
        score: idea.score
      }))
    })
  } catch (error: any) {
    console.error('❌ Error fetching ideas:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.toString()
    }, { status: 500 })
  }
}

async function getIdeasFromSheet(limit: number = 50): Promise<Idea[]> {
  const { google } = require('googleapis')

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  })

  const sheets = google.sheets({ version: 'v4', auth })
  const spreadsheetId = process.env.GOOGLE_SHEET_ID_LIBRARY

  // Get data from sheet (try different sheet names)
  let response
  try {
    // Try YEP_IdeasLibrary first
    response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `YEP_IdeasLibrary!A2:D${limit + 1}`,
    })
  } catch (e) {
    // Fallback to Sheet1
    response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `Sheet1!A2:D${limit + 1}`,
    })
  }

  const rows = response.data.values || []

  return rows.map((row: any[]) => ({
    id: row[0] || '',
    title: row[1] || '',
    industry: row[2] || '',
    score: row[3] || ''
  }))
}
