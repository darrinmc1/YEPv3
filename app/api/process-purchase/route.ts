/**
 * Process Purchase API Endpoint
 * Handles purchase processing, PDF generation, and email delivery
 */

import { NextRequest, NextResponse } from 'next/server'
import { searchIdeas } from '@/lib/services/google-sheets'
import {
  generateResearchReport,
  generateImplementationPlan,
  generateGenericImplementationGuide
} from '@/lib/services/pdf-generator'
import { savePurchase, updatePurchaseDelivery } from '@/lib/services/purchase-tracking'
import { sendPurchaseDeliveryEmail } from '@/lib/services/email'
import { validatePDFQuality, sendValidationAlert } from '@/lib/services/pdf-validator'

/**
 * Helper function to get idea by ID directly from sheet
 */
async function getIdeaById(ideaId: string) {
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

  // Try different sheet names
  let response
  try {
    // Try YEP_IdeasLibrary first
    response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'YEP_IdeasLibrary!A2:T1000', // Get all columns up to row 1000
    })
  } catch (e) {
    // Fallback to Sheet1
    response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!A2:T1000',
    })
  }

  const rows = response.data.values || []

  // Find the row with matching ID in column A
  const ideaRow = rows.find((row: any[]) => row[0] === ideaId)

  if (!ideaRow) {
    throw new Error(`Idea ${ideaId} not found`)
  }

  // Map row to idea object (based on your sheet columns)
  const idea = {
    id: ideaRow[0] || '',
    title: ideaRow[1] || '',
    category: ideaRow[2] || '',
    subcategory: ideaRow[3] || '',
    score: ideaRow[4] || '7',
    marketSize: ideaRow[5] || '',
    growthRate: ideaRow[6] || '',
    difficulty: ideaRow[7] || '',
    timeToFirstSale: ideaRow[8] || '',
    startupCost: ideaRow[9] || '',
    oneLiner: ideaRow[10] || '',
    whyNow: ideaRow[11] || '',
    quickInsights: ideaRow[12] || '[]',
    lockedContent: ideaRow[13] || '{}',
    costBreakdown: ideaRow[18] || '' // Column S
  }

  return idea
}

/**
 * Transform idea data for PDF generation
 */
function transformIdeaForPDF(idea: any, customerEmail: string) {
  //Parse JSON fields safely
  let quickInsights = []
  try {
    quickInsights = typeof idea.quickInsights === 'string'
      ? JSON.parse(idea.quickInsights)
      : idea.quickInsights || []
  } catch {
    quickInsights = ['Market analysis available in full report']
  }

  // Parse locked content for implementation details
  let lockedContent: any = {}
  try {
    lockedContent = typeof idea.lockedContent === 'string'
      ? JSON.parse(idea.lockedContent)
      : idea.lockedContent || {}
  } catch {
    lockedContent = {}
  }

  return {
    ideaTitle: idea.title || 'Business Idea',
    oneLiner: idea.oneLiner || 'Innovative business opportunity',
    industry: idea.industry || 'General',
    score: idea.score || 7,
    difficulty: idea.difficulty || 'Intermediate',
    timeToFirstSale: idea.timeToFirstSale || '4-8 weeks',
    startupCost: idea.startupCost || '$500-$2,000',
    costBreakdown: idea.costBreakdown || '',
    whyNow: idea.whyNow || 'Great timing for this business opportunity',
    quickInsights: quickInsights,
    marketSize: idea.marketSize || 'Growing market',
    growthRate: idea.growthRate || '10%+ annually',
    customerEmail,
    // Implementation-specific fields (if available)
    roadmap: lockedContent.roadmap || generateDefaultRoadmap(),
    techStack: lockedContent.techStack || generateDefaultTechStack(),
    marketingChannels: lockedContent.marketingChannels || generateDefaultMarketing(),
    launchChecklist: lockedContent.launchChecklist || generateDefaultChecklist(),
  }
}

// Default data generators for when locked content isn't available
function generateDefaultRoadmap() {
  return [
    'Week 1-2: Validate demand and refine concept',
    'Week 3-4: Build MVP or create service offering',
    'Week 5-6: Launch beta to first customers',
    'Week 7-8: Gather feedback and iterate',
    'Week 9-10: Refine and optimize offering',
    'Week 11-12: Scale customer acquisition'
  ]
}

function generateDefaultTechStack() {
  return [
    'Website: No-code builder (Carrd, Webflow)',
    'Payments: Stripe or PayPal',
    'Email: Free tier (Mailchimp, ConvertKit)',
    'Hosting: Free or low-cost platform',
    'Analytics: Google Analytics (free)'
  ]
}

function generateDefaultMarketing() {
  return [
    'Social media presence (organic)',
    'Content marketing and SEO',
    'Direct outreach to potential customers',
    'Community building and partnerships',
    'Small paid ad tests ($50-200)'
  ]
}

function generateDefaultChecklist() {
  return [
    'Domain name registered',
    'Landing page or website live',
    'Payment processing configured',
    'First customers identified',
    'Pricing validated',
    'Basic analytics set up',
    'Email system ready',
    'Support process defined'
  ]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, productType, price, ideaId, ideaIds } = body as {
      email: string
      productType: 'research' | 'implementation' | 'idea-bundle' | 'premium-bundle'
      price: number
      ideaId?: string
      ideaIds?: string[]
    }

    // Validate input
    if (!email || !productType || !price) {
      return NextResponse.json(
        { error: 'Missing required fields: email, productType, price' },
        { status: 400 }
      )
    }

    console.log(`📦 Processing ${productType} purchase for ${email}`)

    // Initialize purchase record
    const timestamp = new Date().toISOString()
    const purchaseRecord = {
      timestamp,
      email,
      productType,
      price,
      ideaId: ideaId || '',
      ideaTitle: '',
      ideaIds: ideaIds || [],
      status: 'pending' as const,
      paymentId: '', // Will be populated when Stripe is integrated
      deliveryStatus: 'pending' as const,
    }

    // Save initial purchase record
    await savePurchase(purchaseRecord)

    // Fetch idea data and generate PDFs based on product type
    let pdfAttachments: Array<{ filename: string; content: Buffer }> = []
    let ideaTitle = ''

    try {
      if (productType === 'research' || productType === 'implementation') {
        // Single idea purchase
        if (!ideaId) {
          throw new Error('Idea ID required for single idea purchases')
        }

        // Fetch idea data from database
        console.log(`🔍 Fetching idea: ${ideaId}`)
        const idea = await getIdeaById(ideaId)
        ideaTitle = idea.title

        // Transform idea data for PDF
        const pdfData = transformIdeaForPDF(idea, email)

        // Generate research report PDF
        console.log(`📄 Generating research report for: ${idea.title}`)
        const researchPdf = await generateResearchReport(pdfData)

        // Validate PDF quality
        const validation = await validatePDFQuality(researchPdf, {
          productType,
          ideaTitle: idea.title,
          expectedPages: 2
        })

        console.log(`🔍 PDF Validation: ${validation.isValid ? 'PASSED' : 'FAILED'} (Score: ${validation.score}/100)`)

        if (!validation.isValid) {
          await sendValidationAlert(validation, {
            productType,
            ideaTitle: idea.title,
            customerEmail: email
          })
          console.warn('⚠️ PDF validation failed but proceeding with delivery')
        }
        pdfAttachments.push({
          filename: `${idea.title.replace(/[^a-zA-Z0-9]/g, '_')}_Research_Report.pdf`,
          content: researchPdf,
        })

        // Generate implementation plan if needed
        if (productType === 'implementation') {
          console.log(`📋 Generating implementation plan for: ${idea.title}`)
          const implementationPdf = await generateImplementationPlan(pdfData)
          pdfAttachments.push({
            filename: `${idea.title.replace(/[^a-zA-Z0-9]/g, '_')}_Implementation_Plan.pdf`,
            content: implementationPdf,
          })
        }

      } else if (productType === 'idea-bundle' || productType === 'premium-bundle') {
        // Bundle purchase
        if (!ideaIds || ideaIds.length === 0) {
          throw new Error('Idea IDs required for bundle purchases')
        }

        const expectedCount = productType === 'idea-bundle' ? 7 : 10

        if (ideaIds.length !== expectedCount) {
          throw new Error(`Expected ${expectedCount} ideas for ${productType}, got ${ideaIds.length}`)
        }

        // Fetch all ideas
        console.log(`📚 Fetching ${ideaIds.length} ideas for bundle...`)
        const allIdeas = []

        for (const id of ideaIds) {
          try {
            const idea = await getIdeaById(id)
            allIdeas.push(idea)
          } catch (error) {
            console.warn(`⚠️ Could not find idea: ${id}`)
          }
        }

        if (allIdeas.length !== ideaIds.length) {
          throw new Error(`Could not find all ideas. Found ${allIdeas.length} of ${ideaIds.length}`)
        }

        // Generate research reports for all ideas
        for (const idea of allIdeas) {
          console.log(`📄 Generating research report for: ${idea.title}`)
          const pdfData = transformIdeaForPDF(idea, email)
          const researchPdf = await generateResearchReport(pdfData)
          pdfAttachments.push({
            filename: `${idea.title.replace(/[^a-zA-Z0-9]/g, '_')}_Research.pdf`,
            content: researchPdf,
          })
        }

        // Add generic implementation guide for premium bundle
        if (productType === 'premium-bundle') {
          console.log(`📋 Generating generic implementation guide`)
          const guidePdf = await generateGenericImplementationGuide(email)
          pdfAttachments.push({
            filename: 'Generic_Implementation_Guide.pdf',
            content: guidePdf,
          })
        }

        ideaTitle = `${allIdeas.length} Ideas Bundle`
      }

      // Send email with PDF attachments
      console.log(`📧 Sending delivery email with ${pdfAttachments.length} PDFs...`)
      const emailResult = await sendPurchaseDeliveryEmail({
        email,
        productType,
        price,
        ideaTitle: ideaTitle || undefined,
        ideaCount: pdfAttachments.length,
        pdfAttachments,
      })

      if (!emailResult.success) {
        throw new Error('Failed to send delivery email')
      }

      // Update purchase record as completed
      await updatePurchaseDelivery(email, timestamp, 'sent', new Date().toISOString())

      console.log(`✅ Purchase completed successfully for ${email}`)

      return NextResponse.json({
        success: true,
        message: 'Purchase processed and delivered successfully',
        email,
        productType,
        filesDelivered: pdfAttachments.length,
      })

    } catch (pdfError) {
      console.error('❌ Error generating PDFs or sending email:', pdfError)

      // Update purchase record as failed
      await updatePurchaseDelivery(email, timestamp, 'failed', new Date().toISOString())

      return NextResponse.json(
        {
          error: 'Failed to generate or deliver purchase',
          details: pdfError instanceof Error ? pdfError.message : 'Unknown error'
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('❌ Purchase processing error:', error)
    return NextResponse.json(
      {
        error: 'Failed to process purchase',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
