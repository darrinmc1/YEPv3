/**
 * Test PDF Generation API Endpoint
 * Visit: http://localhost:3000/api/test-pdf?type=research or type=implementation
 */

import { NextRequest, NextResponse } from 'next/server'
import { generateResearchReport, generateImplementationPlan } from '@/lib/services/pdf-generator'

// Sample idea data for testing
const sampleIdea = {
  id: 'TEST001',
  ideaTitle: 'AI-Powered Resume Builder for Remote Workers',
  title: 'AI-Powered Resume Builder for Remote Workers',

  oneLiner: 'Help remote workers create ATS-optimized resumes that get noticed',
  industry: 'HR Tech / Career Services',
  score: 85,
  difficulty: 'Beginner',
  timeToFirstSale: '2-4 weeks',
  startupCost: '$500-$2,000',
  description: `An AI-powered platform that helps remote workers create professional, ATS-optimized resumes. 
  
Key features:
- AI-powered content suggestions based on job descriptions
- ATS optimization checking
- Real-time formatting preview
- Multiple professional templates
- Export to PDF, Word, and plain text
- Cover letter generator

Target market: Remote workers looking to switch jobs or advance their careers in the remote work economy.`,

  competitors: [
    'Resume.io - $2.95/month, basic templates',
    'Zety - $5.99/month, AI suggestions',
    'Novoresume - $16/month, premium features'
  ],

  revenueModel: 'Freemium SaaS - Free basic version, $9.99/month for premium features, $29.99 for one-time professional review',

  customerProfile: `Primary: Remote workers aged 25-45
- Tech-savvy professionals
- Currently employed but looking to advance
- Willing to invest in career development
- Active on LinkedIn and job boards
- Annual income: $50k-$120k`,

  costBreakdown: `AI Tools & APIs: $100-$300
- OpenAI API credits: $50-$150/month
- Resume parsing API: $29/month
- Grammar checking API: $20/month

Marketing & Launch: $200-$800
- Landing page template: $49 one-time
- Email marketing tool: $15/month (Mailchimp)
- Google Ads initial budget: $150-$500
- Social media graphics: $0 (Canva free)

Development & Technical: $100-$500
- Domain name: $12/year
- Hosting (Vercel/Netlify): $0-$20/month
- Database (Supabase): $0-$25/month
- SSL certificate: $0 (free with hosting)
- Template builder library: $0 (open source)

Legal & Administrative: $50-$200
- Business registration: $0-$100 (varies by state)
- Privacy policy generator: $0 (free tools)
- Terms of service template: $0
- Accounting software: $15/month (Wave free or QuickBooks)

Optional Enhancements: $0-$200
- Premium resume templates: $0-$100
- Additional AI models access: $0-$50/month
- Customer support tool: $0-$50/month (Crisp)`,

  // Add missing fields for PDF generation
  whyNow: 'Remote work is exploding post-pandemic. 70% of workers want to stay remote, creating massive demand for tools that help them succeed in the remote job market.',
  quickInsights: [
    'Remote workers change jobs more frequently than office workers',
    'ATS systems reject 75% of resumes - huge pain point',
    'People pay premium for services that land them better jobs'
  ],
  marketSize: '$28.68B global online recruitment market',
  growthRate: '7.1% CAGR (Remote segment: 15%+)',
  customerEmail: 'test@yourexitplans.com'
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get('type') || 'research'

  try {
    console.log(`📄 Generating ${type} PDF...`)

    let pdfBuffer: Buffer
    let filename: string

    if (type === 'research') {
      pdfBuffer = await generateResearchReport(sampleIdea)
      filename = 'Test_Research_Report.pdf'
    } else if (type === 'implementation') {
      // Add implementation-specific fields
      const implementationData = {
        ...sampleIdea,
        roadmap: [
          'Week 1-2: Set up landing page and payment processing',
          'Week 3-4: Build core resume builder with 3 templates',
          'Week 5-6: Integrate AI API for content suggestions',
          'Week 7-8: Launch beta to 20 remote workers',
          'Week 9-10: Gather feedback and iterate',
          'Week 11-12: Official launch with paid ads'
        ],
        techStack: [
          'Frontend: Next.js + Tailwind CSS',
          'Backend: Supabase (PostgreSQL + Auth)',
          'AI: OpenAI GPT-4 API',
          'Payments: Stripe',
          'Hosting: Vercel (free tier)'
        ],
        marketingChannels: [
          'LinkedIn posts targeting remote workers',
          'Reddit communities (r/remotework, r/digitalnomad)',
          'Google Ads ("remote resume builder")',
          'Partnership with remote job boards',
          'Content marketing (SEO blog)'
        ],
        launchChecklist: [
          'Domain registered and DNS configured',
          'Landing page with clear value prop',
          'Payment processing tested',
          'AI integration working smoothly',
          '3 professional templates ready',
          'Email drip sequence set up',
          'Analytics tracking installed',
          'Customer support system ready'
        ]
      }
      pdfBuffer = await generateImplementationPlan(implementationData)
      filename = 'Test_Implementation_Plan.pdf'
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Use ?type=research or ?type=implementation' },
        { status: 400 }
      )
    }

    console.log(`✅ PDF generated successfully! Size: ${(pdfBuffer.length / 1024).toFixed(2)} KB`)

    // Return PDF for download
    return new NextResponse(pdfBuffer as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })

  } catch (error) {
    console.error('❌ PDF generation failed:', error)
    return NextResponse.json(
      {
        error: 'PDF generation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
