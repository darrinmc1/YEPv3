/**
 * Resend Email Service
 * Handles all email sending for validation results and explore requests
 */

import { Resend } from 'resend'

export interface ValidationEmailData {
  email: string
  ideaName: string
  score: number
  marketSummary: string
  quickWins: string[]
  redFlags: string[]
  keyInsights: string[]
}

export interface ExploreIdeasEmailData {
  email: string
  interests: string
  matchedIdeas: Array<{
    id: string
    title: string
    oneLiner: string
    industry: string
    score: number
    difficulty: string
    timeToFirstSale: string
    startupCost: string
  }>
}

export interface PurchaseDeliveryEmailData {
  email: string
  productType: 'research' | 'implementation' | 'idea-bundle' | 'premium-bundle'
  price: number
  ideaTitle?: string
  ideaCount?: number
  pdfAttachments: Array<{
    filename: string
    content: Buffer
  }>
}

/**
 * Send validation results email
 */
export async function sendValidationEmail(data: ValidationEmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('Resend API key not configured, skipping email')
    return { success: false, error: 'Email service not configured' }
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const emailHtml = buildValidationEmailHtml(data)

    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'YourExitPlans <onboarding@resend.dev>',
      to: data.email,
      replyTo: process.env.RESEND_REPLY_TO || 'support@yourexitplans.com',
      subject: `Your Idea Validation Results: ${data.ideaName} (Score: ${data.score}/100)`,
      html: emailHtml,
    })

    console.log('✅ Validation email sent:', result)
    return { success: true, id: result.data?.id }
  } catch (error) {
    console.error('❌ Failed to send validation email:', error)
    return { success: false, error }
  }
}

/**
 * Send explore ideas results email
 */
export async function sendExploreIdeasEmail(data: ExploreIdeasEmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('Resend API key not configured, skipping email')
    return { success: false, error: 'Email service not configured' }
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const emailHtml = buildExploreIdeasEmailHtml(data)

    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'YourExitPlans <onboarding@resend.dev>',
      to: data.email,
      replyTo: process.env.RESEND_REPLY_TO || 'support@yourexitplans.com',
      subject: `Your ${data.matchedIdeas.length} Matched Exit Plans ${data.interests ? `for "${data.interests}"` : ''}`,
      html: emailHtml,
    })

    console.log('✅ Explore ideas email sent:', result)
    return { success: true, id: result.data?.id }
  } catch (error) {
    console.error('❌ Failed to send explore ideas email:', error)
    return { success: false, error }
  }
}

/**
 * Build HTML email for validation results
 */
function buildValidationEmailHtml(data: ValidationEmailData): string {
  const scoreColor = data.score >= 70 ? '#4ade80' : data.score >= 50 ? '#fbbf24' : '#f87171'
  const verdict = data.score >= 70 ? 'Strong Opportunity' : data.score >= 50 ? 'Worth Exploring' : 'Needs More Work'

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Validation Results</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a; color: #ffffff;">
  
  <!-- Email Container -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        
        <!-- Content Card -->
        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(to bottom, #1a1a1a, #0f0f0f); border: 1px solid #2a2a2a; border-radius: 16px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 1px solid #2a2a2a;">
              <h1 style="margin: 0 0 10px; font-size: 28px; font-weight: 700; color: #ffffff;">
                Your Idea Validation Results
              </h1>
              <p style="margin: 0; font-size: 16px; color: #a3a3a3;">
                ${data.ideaName}
              </p>
            </td>
          </tr>

          <!-- Score Badge -->
          <tr>
            <td style="padding: 30px 40px; text-align: center;">
              <div style="display: inline-block; padding: 8px 20px; background-color: rgba(74, 222, 128, 0.1); border: 1px solid ${scoreColor}33; border-radius: 100px; margin-bottom: 20px;">
                <span style="font-size: 14px; font-weight: 600; color: ${scoreColor};">
                  ${verdict}
                </span>
              </div>
              <div style="font-size: 64px; font-weight: 700; color: ${scoreColor}; margin: 10px 0;">
                ${data.score}<span style="font-size: 24px; color: #666;">/100</span>
              </div>
              <p style="margin: 10px 0 0; font-size: 16px; color: #a3a3a3;">
                ${data.marketSummary}
              </p>
            </td>
          </tr>

          <!-- Quick Wins -->
          <tr>
            <td style="padding: 20px 40px;">
              <div style="background-color: #1a2e1a; border-left: 4px solid #4ade80; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="margin: 0 0 15px; font-size: 18px; font-weight: 600; color: #4ade80;">
                  ✨ Quick Wins
                </h2>
                <ul style="margin: 0; padding-left: 20px;">
                  ${data.quickWins.map(win => `
                    <li style="margin-bottom: 8px; color: #d4d4d4; font-size: 14px; line-height: 1.6;">
                      ${win}
                    </li>
                  `).join('')}
                </ul>
              </div>
            </td>
          </tr>

          <!-- Red Flags -->
          <tr>
            <td style="padding: 0 40px 20px;">
              <div style="background-color: #2e1f1a; border-left: 4px solid #fbbf24; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="margin: 0 0 15px; font-size: 18px; font-weight: 600; color: #fbbf24;">
                  ⚠️ Things to Consider
                </h2>
                <ul style="margin: 0; padding-left: 20px;">
                  ${data.redFlags.map(flag => `
                    <li style="margin-bottom: 8px; color: #d4d4d4; font-size: 14px; line-height: 1.6;">
                      ${flag}
                    </li>
                  `).join('')}
                </ul>
              </div>
            </td>
          </tr>

          <!-- Key Insights -->
          <tr>
            <td style="padding: 0 40px 20px;">
              <div style="background-color: #1a1e2e; border-left: 4px solid #60a5fa; padding: 20px; border-radius: 8px;">
                <h2 style="margin: 0 0 15px; font-size: 18px; font-weight: 600; color: #60a5fa;">
                  💡 Key Market Insights
                </h2>
                <ul style="margin: 0; padding-left: 20px;">
                  ${data.keyInsights.map(insight => `
                    <li style="margin-bottom: 8px; color: #d4d4d4; font-size: 14px; line-height: 1.6;">
                      ${insight}
                    </li>
                  `).join('')}
                </ul>
              </div>
            </td>
          </tr>

          <!-- CTA Section -->
          <tr>
            <td style="padding: 30px 40px; text-align: center; border-top: 1px solid #2a2a2a;">
              <h3 style="margin: 0 0 15px; font-size: 20px; font-weight: 600; color: #ffffff;">
                Ready to Take Action?
              </h3>
              <p style="margin: 0 0 20px; font-size: 14px; color: #a3a3a3;">
                Get your personalized 90-day roadmap, AI prompts, and templates
              </p>
              <a href="https://yourexitplans.com/validate-idea" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Get Implementation Plan
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; text-align: center; border-top: 1px solid #2a2a2a;">
              <p style="margin: 0 0 10px; font-size: 12px; color: #666;">
                YourExitPlans • Validate, Build, and Exit
              </p>
              <p style="margin: 0; font-size: 12px; color: #666;">
                You received this email because you validated an idea at yourexitplans.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `
}

/**
 * Send purchase delivery email with PDF attachments
 */
export async function sendPurchaseDeliveryEmail(data: PurchaseDeliveryEmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('Resend API key not configured, skipping email')
    return { success: false, error: 'Email service not configured' }
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const emailHtml = buildPurchaseDeliveryEmailHtml(data)

    // Convert PDF attachments to base64
    const attachments = data.pdfAttachments.map(pdf => ({
      filename: pdf.filename,
      content: pdf.content.toString('base64'),
    }))

    const productNames = {
      'research': 'Research Report',
      'implementation': 'Research + Implementation Plan',
      'idea-bundle': '7 Ideas Bundle',
      'premium-bundle': '10 Ideas + Implementation Bundle'
    }

    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'YourExitPlans <onboarding@resend.dev>',
      to: data.email,
      replyTo: process.env.RESEND_REPLY_TO || 'support@yourexitplans.com',
      subject: `Your ${productNames[data.productType]} is Ready! 🎉`,
      html: emailHtml,
      attachments,
    })

    console.log('✅ Purchase delivery email sent:', result)
    return { success: true, id: result.data?.id }
  } catch (error) {
    console.error('❌ Failed to send purchase delivery email:', error)
    return { success: false, error }
  }
}

/**
 * Build HTML email for purchase delivery
 */
function buildPurchaseDeliveryEmailHtml(data: PurchaseDeliveryEmailData): string {
  const productTitles = {
    'research': 'Research Report',
    'implementation': 'Research + Implementation Plan',
    'idea-bundle': '7 Ideas Research Bundle',
    'premium-bundle': '10 Ideas + Implementation Bundle'
  }

  const productDescriptions = {
    'research': 'Your complete market analysis and business validation report',
    'implementation': 'Your complete research report plus 90-day launch roadmap',
    'idea-bundle': 'Research reports for 7 validated business ideas',
    'premium-bundle': 'Research reports for 10 ideas plus generic implementation guide'
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Purchase is Ready!</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a; color: #ffffff;">
  
  <!-- Email Container -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        
        <!-- Content Card -->
        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(to bottom, #1a1a1a, #0f0f0f); border: 1px solid #2a2a2a; border-radius: 16px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 1px solid #2a2a2a;">
              <div style="font-size: 48px; margin-bottom: 15px;">🎉</div>
              <h1 style="margin: 0 0 10px; font-size: 28px; font-weight: 700; color: #ffffff;">
                Your Purchase is Ready!
              </h1>
              <p style="margin: 0; font-size: 16px; color: #a3a3a3;">
                ${productTitles[data.productType]}
              </p>
            </td>
          </tr>

          <!-- Product Info -->
          <tr>
            <td style="padding: 30px 40px;">
              <div style="background-color: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 12px; padding: 24px; margin-bottom: 20px;">
                ${data.ideaTitle ? `
                <h2 style="margin: 0 0 8px; font-size: 20px; font-weight: 600; color: #ffffff;">
                  ${data.ideaTitle}
                </h2>
                ` : ''}
                <p style="margin: 0; font-size: 14px; color: #d4d4d4; line-height: 1.6;">
                  ${productDescriptions[data.productType]}
                </p>
              </div>
            </td>
          </tr>

          <!-- Attachments Info -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <h3 style="margin: 0 0 15px; font-size: 18px; font-weight: 600; color: #ffffff;">
                📎 Your Files Are Attached
              </h3>
              <div style="background-color: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 8px; padding: 20px;">
                ${data.pdfAttachments.map(pdf => `
                <div style="display: flex; align-items: center; margin-bottom: 12px;">
                  <div style="background-color: #a855f7; width: 36px; height: 36px; border-radius: 6px; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                    <span style="font-size: 18px;">📄</span>
                  </div>
                  <div>
                    <div style="font-size: 14px; font-weight: 500; color: #ffffff;">${pdf.filename}</div>
                    <div style="font-size: 12px; color: #a3a3a3;">PDF Document</div>
                  </div>
                </div>
                `).join('')}
                <p style="margin: 15px 0 0; font-size: 13px; color: #a3a3a3; padding-top: 15px; border-top: 1px solid #2a2a2a;">
                  💡 <strong>Tip:</strong> Can't find the attachments? Check your spam/promotions folder or download them from your email client.
                </p>
              </div>
            </td>
          </tr>

          <!-- What's Included -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <h3 style="margin: 0 0 15px; font-size: 18px; font-weight: 600; color: #ffffff;">
                ✨ What's Inside
              </h3>
              <div style="background-color: rgba(59, 130, 246, 0.1); border-left: 4px solid #3b82f6; padding: 20px; border-radius: 8px;">
                ${data.productType === 'research' ? `
                <ul style="margin: 0; padding-left: 20px; color: #d4d4d4;">
                  <li style="margin-bottom: 8px;">Market size and growth analysis</li>
                  <li style="margin-bottom: 8px;">Competitor landscape breakdown</li>
                  <li style="margin-bottom: 8px;">Target customer profiles</li>
                  <li style="margin-bottom: 8px;">Revenue potential estimates</li>
                  <li style="margin-bottom: 8px;">Detailed startup cost breakdown</li>
                </ul>
                ` : ''}
                ${data.productType === 'implementation' ? `
                <ul style="margin: 0; padding-left: 20px; color: #d4d4d4;">
                  <li style="margin-bottom: 8px;">Complete research report</li>
                  <li style="margin-bottom: 8px;">90-day launch roadmap with milestones</li>
                  <li style="margin-bottom: 8px;">Recommended tech stack</li>
                  <li style="margin-bottom: 8px;">Marketing and customer acquisition strategy</li>
                  <li style="margin-bottom: 8px;">Week-by-week action plan</li>
                </ul>
                ` : ''}
                ${data.productType === 'idea-bundle' ? `
                <ul style="margin: 0; padding-left: 20px; color: #d4d4d4;">
                  <li style="margin-bottom: 8px;">7 complete research reports</li>
                  <li style="margin-bottom: 8px;">Side-by-side comparison matrix</li>
                  <li style="margin-bottom: 8px;">Market analysis for each idea</li>
                  <li style="margin-bottom: 8px;">Startup costs and timelines</li>
                  <li style="margin-bottom: 8px;">Revenue potential estimates</li>
                </ul>
                ` : ''}
                ${data.productType === 'premium-bundle' ? `
                <ul style="margin: 0; padding-left: 20px; color: #d4d4d4;">
                  <li style="margin-bottom: 8px;">10 complete research reports</li>
                  <li style="margin-bottom: 8px;">Generic 90-day implementation guide</li>
                  <li style="margin-bottom: 8px;">Business model frameworks</li>
                  <li style="margin-bottom: 8px;">Launch checklist and templates</li>
                  <li style="margin-bottom: 8px;">Marketing playbook</li>
                </ul>
                ` : ''}
              </div>
            </td>
          </tr>

          <!-- Repeat Purchase Discount -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <div style="background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2)); border: 2px solid #a855f7; border-radius: 12px; padding: 24px; text-align: center;">
                <div style="font-size: 16px; font-weight: 600; color: #ffffff; margin-bottom: 8px;">
                  🎁 Your Loyalty Reward
                </div>
                <div style="font-size: 14px; color: #d4d4d4; margin-bottom: 15px;">
                  Get <strong style="color: #a855f7;">10% OFF</strong> your next purchase of the same tier!
                </div>
                <div style="font-size: 13px; color: #a3a3a3;">
                  ${data.productType === 'research' ? 'Next $9 report: $8.10' : ''}
                  ${data.productType === 'implementation' ? 'Next $29 plan: $26.10' : ''}
                  ${data.productType === 'idea-bundle' ? 'Next $49 bundle: $44.10' : ''}
                  ${data.productType === 'premium-bundle' ? 'Next $99 bundle: $89.10' : ''}
                </div>
              </div>
            </td>
          </tr>

          <!-- Next Steps -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <h3 style="margin: 0 0 15px; font-size: 18px; font-weight: 600; color: #ffffff;">
                🚀 Next Steps
              </h3>
              <div style="background-color: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 8px; padding: 20px;">
                <ol style="margin: 0; padding-left: 20px; color: #d4d4d4;">
                  <li style="margin-bottom: 12px;">Review your attached PDF(s) carefully</li>
                  <li style="margin-bottom: 12px;">Save them to your device for future reference</li>
                  <li style="margin-bottom: 12px;">${data.productType === 'implementation' || data.productType === 'premium-bundle' ? 'Follow the 90-day roadmap step by step' : 'Use the research to validate your decision'}</li>
                  <li style="margin-bottom: 12px;">Take action on the quick wins identified</li>
                  <li>Need help? Reply to this email anytime!</li>
                </ol>
              </div>
            </td>
          </tr>

          <!-- Support Section -->
          <tr>
            <td style="padding: 0 40px 30px; text-align: center;">
              <p style="margin: 0 0 15px; font-size: 14px; color: #a3a3a3;">
                Questions or need guidance? We're here to help!
              </p>
              <a href="mailto:support@yourexitplans.com" style="display: inline-block; padding: 12px 28px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
                Contact Support
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; text-align: center; border-top: 1px solid #2a2a2a;">
              <p style="margin: 0 0 10px; font-size: 12px; color: #666;">
                YourExitPlans • Validate, Build, and Exit
              </p>
              <p style="margin: 0; font-size: 12px; color: #666;">
                Thank you for your purchase! Your success is our mission.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `
}

/**
 * Build HTML email for explore ideas results
 */
function buildExploreIdeasEmailHtml(data: ExploreIdeasEmailData): string {
  const topIdeas = data.matchedIdeas.slice(0, 10) // Show top 10 in email
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Matched Exit Plans</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a; color: #ffffff;">
  
  <!-- Email Container -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        
        <!-- Content Card -->
        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(to bottom, #1a1a1a, #0f0f0f); border: 1px solid #2a2a2a; border-radius: 16px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 1px solid #2a2a2a;">
              <div style="display: inline-block; padding: 8px 20px; background-color: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 100px; margin-bottom: 20px;">
                <span style="font-size: 14px; font-weight: 600; color: #a855f7;">
                  ${data.matchedIdeas.length} Ideas Found
                </span>
              </div>
              <h1 style="margin: 0 0 10px; font-size: 28px; font-weight: 700; color: #ffffff;">
                Your Matched Exit Plans
              </h1>
              ${data.interests ? `
              <p style="margin: 0; font-size: 16px; color: #a3a3a3;">
                Based on: "${data.interests}"
              </p>
              ` : ''}
            </td>
          </tr>

          <!-- Ideas List -->
          ${topIdeas.map((idea, index) => `
          <tr>
            <td style="padding: ${index === 0 ? '30px 40px 20px' : '20px 40px'};">
              <div style="background-color: rgba(168, 85, 247, 0.05); border: 1px solid rgba(168, 85, 247, 0.2); border-radius: 12px; padding: 24px;">
                
                <!-- Idea Header -->
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                  <div style="flex: 1;">
                    <div style="font-size: 12px; color: #a855f7; font-weight: 600; margin-bottom: 8px;">
                      ${idea.industry}
                    </div>
                    <h3 style="margin: 0 0 8px; font-size: 18px; font-weight: 600; color: #ffffff;">
                      ${idea.title}
                    </h3>
                    <p style="margin: 0; font-size: 14px; color: #d4d4d4; line-height: 1.5;">
                      ${idea.oneLiner}
                    </p>
                  </div>
                  <div style="text-align: right; margin-left: 20px;">
                    <div style="display: inline-block; padding: 6px 12px; background-color: rgba(168, 85, 247, 0.2); border-radius: 20px;">
                      <span style="font-size: 16px; font-weight: 700; color: #a855f7;">${idea.score}</span>
                    </div>
                    <div style="font-size: 10px; color: #666; margin-top: 4px;">Score</div>
                  </div>
                </div>

                <!-- Idea Stats -->
                <div style="display: flex; gap: 20px; margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(168, 85, 247, 0.1);">
                  <div>
                    <div style="font-size: 11px; color: #a3a3a3; margin-bottom: 4px;">Difficulty</div>
                    <div style="font-size: 13px; color: #ffffff; font-weight: 500;">${idea.difficulty}</div>
                  </div>
                  <div>
                    <div style="font-size: 11px; color: #a3a3a3; margin-bottom: 4px;">First Sale</div>
                    <div style="font-size: 13px; color: #ffffff; font-weight: 500;">${idea.timeToFirstSale}</div>
                  </div>
                  <div>
                    <div style="font-size: 11px; color: #a3a3a3; margin-bottom: 4px;">Cost</div>
                    <div style="font-size: 13px; color: #ffffff; font-weight: 500;">${idea.startupCost}</div>
                  </div>
                </div>

              </div>
            </td>
          </tr>
          `).join('')}

          <!-- Pricing Options -->
          <tr>
            <td style="padding: 30px 40px; border-top: 1px solid #2a2a2a;">
              <h3 style="margin: 0 0 20px; font-size: 20px; font-weight: 600; color: #ffffff; text-align: center;">
                Choose Your Path
              </h3>
              
              <!-- $9 Research -->
              <div style="background-color: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 12px; padding: 20px; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                  <div>
                    <div style="font-size: 18px; font-weight: 600; color: #ffffff; margin-bottom: 4px;">Research Report</div>
                    <div style="font-size: 14px; color: #d4d4d4;">Deep dive into any single idea</div>
                  </div>
                  <div style="font-size: 28px; font-weight: 700; color: #60a5fa;">$9</div>
                </div>
                <div style="font-size: 13px; color: #a3a3a3; margin-bottom: 8px;">
                  ✓ Market analysis ✓ Competitors ✓ Customer profile ✓ Revenue potential
                </div>
                <div style="font-size: 12px; color: #60a5fa; margin-bottom: 15px;">
                  + Get 10% off your next $9 purchase ($8.10)
                </div>
                <a href="https://yourexitplans.com/explore-ideas" style="display: inline-block; width: 100%; padding: 12px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; text-align: center;">
                  Get Research Report
                </a>
              </div>

              <!-- $29 Implementation -->
              <div style="background-color: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 12px; padding: 20px; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                  <div>
                    <div style="font-size: 18px; font-weight: 600; color: #ffffff; margin-bottom: 4px;">Research + Implementation</div>
                    <div style="font-size: 14px; color: #d4d4d4;">Everything you need to launch</div>
                  </div>
                  <div style="font-size: 28px; font-weight: 700; color: #a855f7;">$29</div>
                </div>
                <div style="font-size: 13px; color: #a3a3a3; margin-bottom: 8px;">
                  ✓ Research report ✓ 90-day roadmap ✓ Tech stack ✓ Marketing playbook
                </div>
                <div style="font-size: 12px; color: #a855f7; margin-bottom: 15px;">
                  + Get 10% off your next $29 purchase ($26.10)
                </div>
                <a href="https://yourexitplans.com/explore-ideas" style="display: inline-block; width: 100%; padding: 12px; background-color: #a855f7; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; text-align: center;">
                  Get Complete Plan
                </a>
              </div>

              <!-- $49 Bundle -->
              <div style="background-color: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 12px; padding: 20px; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                  <div>
                    <div style="font-size: 18px; font-weight: 600; color: #ffffff; margin-bottom: 4px;">7 Ideas Bundle</div>
                    <div style="font-size: 14px; color: #d4d4d4;">Explore 7 ideas, choose the best fit</div>
                  </div>
                  <div>
                    <div style="font-size: 28px; font-weight: 700; color: #60a5fa;">$49</div>
                    <div style="font-size: 11px; color: #a3a3a3; text-decoration: line-through;">$63</div>
                  </div>
                </div>
                <div style="font-size: 13px; color: #a3a3a3; margin-bottom: 8px;">
                  ✓ 7 research reports ✓ Comparison matrix ✓ Save $14
                </div>
                <div style="font-size: 12px; color: #60a5fa; margin-bottom: 15px;">
                  + Get 10% off your next bundle ($44.10)
                </div>
                <a href="https://yourexitplans.com/checkout?plan=idea-bundle" style="display: inline-block; width: 100%; padding: 12px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; text-align: center;">
                  Get 7 Ideas Bundle
                </a>
              </div>

              <!-- $99 Bundle - FEATURED -->
              <div style="background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2)); border: 2px solid #a855f7; border-radius: 12px; padding: 20px; position: relative;">
                <div style="position: absolute; top: -12px; right: 20px; background-color: #a855f7; color: #ffffff; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 700; text-transform: uppercase;">
                  Best Value
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                  <div>
                    <div style="font-size: 18px; font-weight: 600; color: #ffffff; margin-bottom: 4px;">10 Ideas + Implementation</div>
                    <div style="font-size: 14px; color: #d4d4d4;">Explore 10 ideas, launch the best one</div>
                  </div>
                  <div>
                    <div style="font-size: 28px; font-weight: 700; color: #a855f7;">$99</div>
                    <div style="font-size: 11px; color: #a3a3a3; text-decoration: line-through;">$119</div>
                  </div>
                </div>
                <div style="font-size: 13px; color: #a3a3a3; margin-bottom: 8px;">
                  ✓ 10 research reports ✓ Generic implementation plan ✓ Save $20
                </div>
                <div style="font-size: 12px; color: #a855f7; margin-bottom: 15px;">
                  + Get 10% off your next premium bundle ($89.10)
                </div>
                <a href="https://yourexitplans.com/checkout?plan=premium-bundle" style="display: inline-block; width: 100%; padding: 14px; background: linear-gradient(135deg, #a855f7, #ec4899); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 15px; text-align: center;">
                  Get Premium Bundle
                </a>
              </div>

            </td>
          </tr>

          ${data.matchedIdeas.length > 10 ? `
          <!-- More Ideas Notice -->
          <tr>
            <td style="padding: 0 40px 30px; text-align: center;">
              <p style="margin: 0; font-size: 14px; color: #a3a3a3;">
                + ${data.matchedIdeas.length - 10} more ideas waiting for you...
              </p>
            </td>
          </tr>
          ` : ''}

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; text-align: center; border-top: 1px solid #2a2a2a;">
              <p style="margin: 0 0 10px; font-size: 12px; color: #666;">
                YourExitPlans • Validate, Build, and Exit
              </p>
              <p style="margin: 0; font-size: 12px; color: #666;">
                You received this email because you explored business ideas at yourexitplans.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `
}
