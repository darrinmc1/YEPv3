/**
 * Resend Email Service
 * Handles all email sending for validation results and explore requests
 */

import { Resend } from 'resend'

interface ValidationEmailData {
  email: string
  ideaName: string
  score: number
  marketSummary: string
  quickWins: string[]
  redFlags: string[]
  keyInsights: string[]
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
