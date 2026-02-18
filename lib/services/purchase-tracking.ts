/**
 * Purchase Tracking Service
 * Handles purchase records in Google Sheets
 */

import { google } from 'googleapis'

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

export interface PurchaseRecord {
  timestamp: string
  email: string
  productType: 'research' | 'implementation' | 'idea-bundle' | 'premium-bundle'
  price: number
  ideaId?: string // For single idea purchases
  ideaTitle?: string
  ideaIds?: string[] // For bundles
  status: 'pending' | 'completed' | 'failed'
  paymentId?: string // Stripe payment ID (when we add Stripe)
  deliveryStatus: 'pending' | 'sent' | 'failed'
  deliveryTime?: string
}

export async function savePurchase(purchase: PurchaseRecord) {
  const sheets = getSheets()
  const sheetId = process.env.GOOGLE_SHEET_ID_PURCHASES

  if (!sheetId) {
    throw new Error('GOOGLE_SHEET_ID_PURCHASES not configured')
  }

  const row = [
    purchase.timestamp,
    purchase.email,
    purchase.productType,
    purchase.price,
    purchase.ideaId || '',
    purchase.ideaTitle || '',
    purchase.ideaIds?.join(', ') || '',
    purchase.status,
    purchase.paymentId || '',
    purchase.deliveryStatus,
    purchase.deliveryTime || '',
  ]

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: 'Sheet1!A:K',
    valueInputOption: 'RAW',
    requestBody: {
      values: [row],
    },
  })
}

export async function updatePurchaseDelivery(
  email: string,
  timestamp: string,
  deliveryStatus: 'sent' | 'failed',
  deliveryTime: string
) {
  const sheets = getSheets()
  const sheetId = process.env.GOOGLE_SHEET_ID_PURCHASES

  if (!sheetId) {
    throw new Error('GOOGLE_SHEET_ID_PURCHASES not configured')
  }

  // Fetch all purchases to find the matching one
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Sheet1!A:K',
  })

  const rows = response.data.values || []
  
  // Find matching row (skip header)
  const rowIndex = rows.findIndex((row, i) => 
    i > 0 && row[0] === timestamp && row[1] === email
  )

  if (rowIndex === -1) {
    throw new Error('Purchase not found')
  }

  // Update delivery status columns (J and K)
  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: `Sheet1!J${rowIndex + 1}:K${rowIndex + 1}`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [[deliveryStatus, deliveryTime]]
    }
  })
}

export async function getPurchasesByEmail(email: string): Promise<PurchaseRecord[]> {
  const sheets = getSheets()
  const sheetId = process.env.GOOGLE_SHEET_ID_PURCHASES

  if (!sheetId) {
    throw new Error('GOOGLE_SHEET_ID_PURCHASES not configured')
  }

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Sheet1!A2:K', // Skip header
  })

  const rows = response.data.values || []
  
  return rows
    .filter(row => row[1] === email)
    .map(row => ({
      timestamp: row[0],
      email: row[1],
      productType: row[2] as any,
      price: parseFloat(row[3]),
      ideaId: row[4] || undefined,
      ideaTitle: row[5] || undefined,
      ideaIds: row[6] ? row[6].split(', ') : undefined,
      status: row[7] as any,
      paymentId: row[8] || undefined,
      deliveryStatus: row[9] as any,
      deliveryTime: row[10] || undefined,
    }))
}
