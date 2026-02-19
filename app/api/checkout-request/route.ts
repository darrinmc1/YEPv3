import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Initialize Resend client lazily to avoid build-time errors if key is missing
// const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  // Check for API key at runtime
  if (!process.env.RESEND_API_KEY) {
    console.error('Missing RESEND_API_KEY')
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    )
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const body = await req.json()

    const {
      name,
      email,
      phone,
      productName,
      productPrice,
      ideaName,
      ideaId,
      additionalNotes
    } = body

    // Validate required fields
    if (!name || !email || !productName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Email to YOU (Darrin)
    const ownerEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Purchase Request</title>
</head>
<body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <div style="background: white; padding: 30px; border-radius: 10px;">
    <h1 style="color: #3b82f6; margin-top: 0;">🎉 New Purchase Request!</h1>
    
    <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h2 style="margin-top: 0; color: #1e40af;">Customer Details</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Name:</td>
          <td style="padding: 8px 0;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Email:</td>
          <td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td>
        </tr>
        ${phone ? `
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
          <td style="padding: 8px 0;">${phone}</td>
        </tr>
        ` : ''}
      </table>
    </div>

    <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h2 style="margin-top: 0; color: #15803d;">Product Requested</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Product:</td>
          <td style="padding: 8px 0;">${productName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Price:</td>
          <td style="padding: 8px 0; font-size: 20px; color: #15803d;">$${productPrice}</td>
        </tr>
        ${ideaName ? `
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">For Idea:</td>
          <td style="padding: 8px 0;">${ideaName}</td>
        </tr>
        ` : ''}
        ${ideaId ? `
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Idea ID:</td>
          <td style="padding: 8px 0;">${ideaId}</td>
        </tr>
        ` : ''}
      </table>
    </div>

    ${additionalNotes ? `
    <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #92400e;">Additional Notes:</h3>
      <p style="margin: 0; white-space: pre-wrap;">${additionalNotes}</p>
    </div>
    ` : ''}

    <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
      <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">
        <strong>Next Steps:</strong>
      </p>
      <ol style="color: #6b7280; font-size: 14px; margin: 10px 0; padding-left: 20px;">
        <li>Reply to customer at: <a href="mailto:${email}">${email}</a></li>
        <li>Send payment link or invoice</li>
        <li>Deliver product materials after payment</li>
      </ol>
    </div>
  </div>
</body>
</html>
    `

    // Email to CUSTOMER (User)
    const customerEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Purchase Request Received</title>
</head>
<body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0a0a0a;">
  <div style="background: linear-gradient(to bottom, #1a1a1a, #0f0f0f); padding: 40px; border-radius: 16px; border: 1px solid #2a2a2a;">
    
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="display: inline-block; padding: 8px 20px; background-color: rgba(74, 222, 128, 0.1); border: 1px solid rgba(74, 222, 128, 0.3); border-radius: 100px; margin-bottom: 20px;">
        <span style="font-size: 14px; font-weight: 600; color: #4ade80;">Request Received</span>
      </div>
      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Thanks, ${name.split(' ')[0]}!</h1>
    </div>

    <div style="background: rgba(59, 130, 246, 0.1); border-left: 4px solid #3b82f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h2 style="color: #60a5fa; margin: 0 0 10px 0; font-size: 18px;">Your Request</h2>
      <p style="color: #d4d4d4; margin: 5px 0;"><strong style="color: #a3a3a3;">Product:</strong> ${productName}</p>
      <p style="color: #d4d4d4; margin: 5px 0;"><strong style="color: #a3a3a3;">Price:</strong> $${productPrice}</p>
      ${ideaName ? `<p style="color: #d4d4d4; margin: 5px 0;"><strong style="color: #a3a3a3;">For Idea:</strong> ${ideaName}</p>` : ''}
    </div>

    <div style="background: rgba(34, 197, 94, 0.1); padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="color: #4ade80; margin: 0 0 15px 0; font-size: 16px;">What Happens Next?</h3>
      <ol style="color: #d4d4d4; margin: 0; padding-left: 20px; line-height: 1.8;">
        <li>We'll review your request</li>
        <li>You'll receive a payment link within 24 hours</li>
        <li>After payment, we'll deliver your materials immediately</li>
      </ol>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <p style="color: #a3a3a3; margin: 0 0 10px 0; font-size: 14px;">Questions? Reply to this email or contact:</p>
      <a href="mailto:support@yourexitplans.com" style="color: #60a5fa; text-decoration: none; font-weight: 600;">support@yourexitplans.com</a>
    </div>

    <div style="border-top: 1px solid #2a2a2a; padding-top: 20px; text-align: center;">
      <p style="color: #666; font-size: 12px; margin: 0;">
        YourExitPlans • Validate, Build, and Exit
      </p>
    </div>

  </div>
</body>
</html>
    `

    // Send email to YOU
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'YourExitPlans <onboarding@resend.dev>',
      to: 'darrinmc1@yahoo.com', // YOUR EMAIL
      replyTo: email, // Customer's email for easy reply
      subject: `💰 New Purchase Request: ${productName} ($${productPrice})`,
      html: ownerEmailHtml,
    })

    // Send confirmation to customer
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'YourExitPlans <onboarding@resend.dev>',
      to: email,
      replyTo: process.env.RESEND_REPLY_TO || 'support@yourexitplans.com',
      subject: `Request Received: ${productName}`,
      html: customerEmailHtml,
    })

    return NextResponse.json({
      success: true,
      message: 'Request submitted successfully'
    })

  } catch (error) {
    console.error('Checkout request error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process request'
      },
      { status: 500 }
    )
  }
}
