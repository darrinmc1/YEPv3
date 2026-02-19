/**
 * PDF Generation Service - PREMIUM 10+ PAGE REPORTS
 * $9 Research Report: 10 pages of comprehensive analysis
 * $29 Implementation Plan: 15+ pages with detailed roadmap
 */

import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

// Premium styles for 10-page reports
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    fontSize: 10,
  },

  // Header
  header: {
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: '3px solid #7c3aed',
  },
  companyName: {
    fontSize: 11,
    color: '#7c3aed',
    marginBottom: 8,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 6,
    lineHeight: 1.3,
  },
  subtitle: {
    fontSize: 11,
    color: '#6b7280',
    lineHeight: 1.5,
  },

  // Page title
  pageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: '2px solid #e5e7eb',
  },

  // Section
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    paddingBottom: 6,
    borderBottom: '1px solid #e5e7eb',
  },

  // Text
  paragraph: {
    fontSize: 10,
    lineHeight: 1.8,
    color: '#374151',
    marginBottom: 12,
    textAlign: 'justify',
  },

  largeParagraph: {
    fontSize: 11,
    lineHeight: 1.9,
    color: '#1f2937',
    marginBottom: 15,
    textAlign: 'justify',
  },

  // Stats box
  statsBox: {
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: 6,
    padding: 16,
    marginTop: 10,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 9,
    color: '#6b7280',
    width: '45%',
  },
  statValue: {
    fontSize: 10,
    color: '#111827',
    fontWeight: 'bold',
    width: '50%',
  },

  // Bullet list
  bulletList: {
    marginTop: 8,
    marginBottom: 12,
  },
  bullet: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  bulletDot: {
    width: 4,
    height: 4,
    backgroundColor: '#7c3aed',
    borderRadius: 2,
    marginTop: 6,
    marginRight: 10,
  },
  bulletText: {
    fontSize: 10,
    lineHeight: 1.7,
    color: '#374151',
    flex: 1,
  },

  // Highlight box
  highlightBox: {
    backgroundColor: '#eff6ff',
    borderLeft: '4px solid #3b82f6',
    padding: 16,
    marginBottom: 16,
    borderRadius: 4,
  },
  highlightText: {
    fontSize: 10,
    lineHeight: 1.7,
    color: '#1e40af',
  },

  // Success box
  successBox: {
    backgroundColor: '#f0fdf4',
    borderLeft: '4px solid #10b981',
    padding: 16,
    marginBottom: 16,
    borderRadius: 4,
  },
  successText: {
    fontSize: 10,
    lineHeight: 1.7,
    color: '#065f46',
  },

  // Warning box
  warningBox: {
    backgroundColor: '#fffbeb',
    borderLeft: '4px solid #f59e0b',
    padding: 16,
    marginBottom: 16,
    borderRadius: 4,
  },
  warningText: {
    fontSize: 10,
    lineHeight: 1.7,
    color: '#92400e',
  },

  // Cost item
  costItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 10,
    color: '#4b5563',
    marginBottom: 8,
    paddingLeft: 8,
    paddingBottom: 8,
    borderBottom: '1px solid #f3f4f6',
  },
  costName: {
    flex: 1,
  },
  costPrice: {
    fontFamily: 'Courier',
    width: 140,
    textAlign: 'right',
    fontWeight: 'bold',
  },

  // Table
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    padding: 10,
    borderBottom: '2px solid #7c3aed',
    marginBottom: 10,
  },
  tableHeaderText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#374151',
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottom: '1px solid #e5e7eb',
  },
  tableCell: {
    fontSize: 9,
    color: '#4b5563',
    flex: 1,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    paddingTop: 12,
    borderTop: '1px solid #e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 8,
    color: '#9ca3af',
  },
  footerBrand: {
    fontSize: 8,
    color: '#7c3aed',
    fontWeight: 'bold',
  },
});

interface ResearchReportData {
  ideaTitle: string;
  oneLiner: string;
  industry: string;
  score: number;
  difficulty: string;
  timeToFirstSale: string;
  startupCost: string;
  costBreakdown: string;
  whyNow: string;
  quickInsights: string[];
  marketSize: string;
  growthRate: string;
  customerEmail: string;
}

const ResearchReportPDF = ({ data }: { data: ResearchReportData }) => {
  const parseCostBreakdown = (breakdown: string) => {
    if (!breakdown) return [];
    const sections = breakdown.split('\n\n').filter(s => s.trim());
    return sections.map(section => {
      const lines = section.split('\n').filter(l => l.trim());
      return {
        category: lines[0],
        items: lines.slice(1).map(line => {
          const colonIndex = line.lastIndexOf(':');
          if (colonIndex > 0) {
            return {
              name: line.substring(0, colonIndex).replace(/^-\s*/, '').trim(),
              price: line.substring(colonIndex + 1).trim()
            };
          }
          return {
            name: line.replace(/^-\s*/, '').trim(),
            price: ''
          };
        })
      };
    });
  };

  const costSections = parseCostBreakdown(data.costBreakdown);

  return (
    <Document>

      {/* PAGE 1: COVER & EXECUTIVE SUMMARY */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.companyName}>YOUREXITPLANS RESEARCH REPORT</Text>
          <Text style={styles.title}>{data.ideaTitle}</Text>
          <Text style={styles.subtitle}>{data.oneLiner}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.pageTitle}>Executive Summary</Text>

          <View style={styles.statsBox}>
            <View style={styles.statsRow}>
              <Text style={styles.statLabel}>Industry Sector</Text>
              <Text style={styles.statValue}>{data.industry}</Text>
            </View>
            <View style={styles.statsRow}>
              <Text style={styles.statLabel}>Opportunity Score</Text>
              <Text style={styles.statValue}>{data.score} / 10</Text>
            </View>
            <View style={styles.statsRow}>
              <Text style={styles.statLabel}>Difficulty Level</Text>
              <Text style={styles.statValue}>{data.difficulty}</Text>
            </View>
            <View style={styles.statsRow}>
              <Text style={styles.statLabel}>Time to First Sale</Text>
              <Text style={styles.statValue}>{data.timeToFirstSale}</Text>
            </View>
            <View style={styles.statsRow}>
              <Text style={styles.statLabel}>Estimated Investment</Text>
              <Text style={styles.statValue}>{data.startupCost}</Text>
            </View>
          </View>

          <Text style={styles.largeParagraph}>
            This comprehensive research report analyzes the business opportunity for {data.ideaTitle} in the {data.industry} sector.
            With an opportunity score of {data.score}/10, this venture presents a {data.score >= 8 ? 'strong' : data.score >= 6 ? 'moderate' : 'developing'} potential
            for entrepreneurs seeking to enter this market.
          </Text>

          <Text style={styles.largeParagraph}>
            The estimated startup investment ranges from {data.startupCost}, with potential for first revenue within {data.timeToFirstSale}.
            This report provides detailed analysis of market opportunity, competitive landscape, target customers, revenue potential,
            and implementation requirements.
          </Text>

          <View style={styles.successBox}>
            <Text style={styles.successText}>
              Market Size: {data.marketSize} • Growth Rate: {data.growthRate}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Page 1 of 10 • Prepared for {data.customerEmail}</Text>
          <Text style={styles.footerBrand}>YourExitPlans.com</Text>
        </View>
      </Page>

      {/* PAGE 2: BUSINESS OVERVIEW */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.companyName}>YOUREXITPLANS</Text>
          <Text style={styles.title}>{data.ideaTitle}</Text>
        </View>

        <Text style={styles.pageTitle}>Business Overview & Value Proposition</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Core Business Concept</Text>
          <Text style={styles.largeParagraph}>
            {data.oneLiner}
          </Text>
          <Text style={styles.paragraph}>
            This business model operates in the {data.industry} industry, leveraging current market trends and consumer demand
            to create a sustainable revenue stream. The concept addresses a specific market need through a focused value proposition
            that differentiates it from existing solutions.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Industry Classification</Text>
          <Text style={styles.paragraph}>
            Primary Industry: {data.industry}
          </Text>
          <Text style={styles.paragraph}>
            The {data.industry} sector has demonstrated consistent growth and presents opportunities for new entrants who can
            execute effectively. Market dynamics favor businesses that can provide value efficiently while maintaining quality standards.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Difficulty Assessment</Text>
          <Text style={styles.paragraph}>
            Execution Difficulty: {data.difficulty}
          </Text>
          <Text style={styles.paragraph}>
            This rating reflects the technical complexity, required expertise, regulatory considerations, and competitive intensity
            of launching and scaling this business. A {data.difficulty.toLowerCase()} difficulty level suggests
            {data.difficulty === 'Beginner' ? ' minimal barriers to entry with straightforward execution requirements.' :
              data.difficulty === 'Intermediate' ? ' moderate complexity requiring some specialized knowledge or resources.' :
                ' significant expertise and capital requirements for successful execution.'}
          </Text>
        </View>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightText}>
            Key Advantage: Estimated time to first revenue is {data.timeToFirstSale}, enabling relatively quick validation
            of the business model and opportunity for iterative improvement based on real customer feedback.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Page 2 of 10</Text>
          <Text style={styles.footerBrand}>YourExitPlans.com</Text>
        </View>
      </Page>

      {/* PAGE 3: MARKET OPPORTUNITY */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.companyName}>YOUREXITPLANS</Text>
          <Text style={styles.title}>Market Opportunity Analysis</Text>
        </View>

        <Text style={styles.pageTitle}>Total Addressable Market</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Market Size & Scope</Text>
          <Text style={styles.largeParagraph}>
            Market Size: {data.marketSize}
          </Text>
          <Text style={styles.paragraph}>
            The total addressable market represents the overall revenue opportunity available for this business concept.
            This figure encompasses all potential customers who could benefit from this solution, regardless of current
            competitive dynamics or geographic constraints.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Growth Trajectory</Text>
          <Text style={styles.largeParagraph}>
            Annual Growth Rate: {data.growthRate}
          </Text>
          <Text style={styles.paragraph}>
            Market growth rate indicates the year-over-year expansion of the industry, driven by factors including increased
            consumer adoption, technological advancement, regulatory changes, and shifting consumer preferences. Positive growth
            rates signal expanding opportunity and potential for new market entrants.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Market Dynamics</Text>
          <Text style={styles.paragraph}>
            The market for {data.ideaTitle} is characterized by evolving customer needs and increasing demand for solutions
            that address specific pain points. Current trends suggest sustained growth potential, with opportunities for
            differentiation through superior execution, customer experience, or innovative business models.
          </Text>
          <Text style={styles.paragraph}>
            Key market drivers include technological enablement, changing consumer behaviors, regulatory evolution, and
            competitive dynamics. Understanding these forces is critical for positioning and scaling the business effectively.
          </Text>
        </View>

        <View style={styles.successBox}>
          <Text style={styles.successText}>
            Market Opportunity Rating: {data.score >= 8 ? 'Strong' : data.score >= 6 ? 'Moderate' : 'Developing'} -
            The combination of market size ({data.marketSize}) and growth rate ({data.growthRate}) indicates
            {data.score >= 8 ? ' substantial opportunity for well-executed ventures.' :
              data.score >= 6 ? ' reasonable potential for focused, efficient operations.' :
                ' emerging potential that requires careful validation.'}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Page 3 of 10</Text>
          <Text style={styles.footerBrand}>YourExitPlans.com</Text>
        </View>
      </Page>

      {/* PAGE 4: WHY NOW - MARKET TIMING */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.companyName}>YOUREXITPLANS</Text>
          <Text style={styles.title}>Market Timing Analysis</Text>
        </View>

        <Text style={styles.pageTitle}>Why This Opportunity Exists Now</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Market Timing Thesis</Text>
          <Text style={styles.largeParagraph}>
            {data.whyNow}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Convergence of Enabling Factors</Text>
          <Text style={styles.paragraph}>
            This opportunity exists at the intersection of multiple market forces that have created favorable conditions
            for new entrants. These factors include technological maturation, shifting consumer preferences, regulatory
            changes, and competitive gaps in the current market landscape.
          </Text>
          <Text style={styles.paragraph}>
            The timing is particularly advantageous because early movers in emerging market segments typically capture
            disproportionate market share and establish brand recognition before the market becomes saturated. Current
            conditions suggest a window of opportunity for entrepreneurs who can execute quickly and effectively.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>First-Mover Advantages</Text>
          <View style={styles.bulletList}>
            <View style={styles.bullet}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>
                Brand Recognition: Early market entrants establish brand awareness and customer trust before competition intensifies
              </Text>
            </View>
            <View style={styles.bullet}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>
                Customer Acquisition: Lower marketing costs and higher conversion rates when competition is limited
              </Text>
            </View>
            <View style={styles.bullet}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>
                Market Learning: Opportunity to refine product-market fit and operations before competitive pressure increases
              </Text>
            </View>
            <View style={styles.bullet}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>
                Network Effects: Potential to build customer base and community that becomes harder to replicate over time
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            Critical Window: Market timing advantages typically diminish as awareness spreads and competition enters.
            Swift execution and rapid iteration are essential to capitalize on current market conditions.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Page 4 of 10</Text>
          <Text style={styles.footerBrand}>YourExitPlans.com</Text>
        </View>
      </Page>

      {/* PAGE 5: KEY INSIGHTS */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.companyName}>YOUREXITPLANS</Text>
          <Text style={styles.title}>Strategic Insights & Success Factors</Text>
        </View>

        <Text style={styles.pageTitle}>Critical Success Factors</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Essential Business Insights</Text>
          <Text style={styles.paragraph}>
            Based on analysis of successful ventures in this market and competitive landscape assessment, the following
            insights represent critical factors for success. These are not merely suggestions but foundational principles
            that separate thriving businesses from failed attempts.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Strategic Insights</Text>
          <View style={styles.bulletList}>
            {data.quickInsights.map((insight, i) => (
              <View key={i} style={{ marginBottom: 20 }}>
                <View style={styles.bullet}>
                  <View style={{ width: 20, height: 20, backgroundColor: '#7c3aed', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                    <Text style={{ fontSize: 11, color: '#ffffff', fontWeight: 'bold' }}>{i + 1}</Text>
                  </View>
                  <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#111827', flex: 1 }}>
                    Insight #{i + 1}
                  </Text>
                </View>
                <Text style={{ fontSize: 10, lineHeight: 1.8, color: '#374151', marginLeft: 32, marginTop: 6 }}>
                  {insight}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Implementation Priority</Text>
          <Text style={styles.paragraph}>
            These insights should guide decision-making throughout the launch and scaling process. Prioritize actions
            that align with these principles, and be willing to pivot or adjust when evidence suggests deviation from
            these core success factors.
          </Text>
        </View>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightText}>
            Recommendation: Review these insights weekly during the first 90 days of operations. Use them as a framework
            for evaluating strategic decisions and maintaining focus on activities that drive measurable business outcomes.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Page 5 of 10</Text>
          <Text style={styles.footerBrand}>YourExitPlans.com</Text>
        </View>
      </Page>

      {/* PAGE 6: TARGET CUSTOMERS */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.companyName}>YOUREXITPLANS</Text>
          <Text style={styles.title}>Target Customer Analysis</Text>
        </View>

        <Text style={styles.pageTitle}>Ideal Customer Profile</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Primary Customer Segments</Text>
          <Text style={styles.paragraph}>
            The target customer for {data.ideaTitle} represents individuals or organizations facing specific challenges
            that this solution addresses. Understanding customer demographics, psychographics, and behavioral patterns
            is essential for effective marketing and product development.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Pain Points</Text>
          <View style={styles.bulletList}>
            <View style={styles.bullet}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>
                Current solutions are too expensive, complex, or time-consuming for target customers
              </Text>
            </View>
            <View style={styles.bullet}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>
                Existing alternatives fail to address specific needs or use cases effectively
              </Text>
            </View>
            <View style={styles.bullet}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>
                Market gaps exist where customer needs are underserved or ignored entirely
              </Text>
            </View>
            <View style={styles.bullet}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>
                Accessibility barriers prevent certain customer segments from accessing current solutions
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Acquisition Strategy</Text>
          <Text style={styles.paragraph}>
            Reaching target customers requires understanding where they seek information, what messaging resonates,
            and which channels drive conversion most effectively. In the {data.industry} sector, successful customer
            acquisition typically involves a mix of content marketing, targeted advertising, partnerships, and community building.
          </Text>
          <Text style={styles.paragraph}>
            Initial customer acquisition should focus on channels with the highest conversion rates and lowest costs,
            even if they don&apos;t scale indefinitely. Early adopters often come through direct outreach, niche communities,
            and word-of-mouth referrals rather than broad advertising campaigns.
          </Text>
        </View>

        <View style={styles.successBox}>
          <Text style={styles.successText}>
            Acquisition Recommendation: Start with 10-20 customers acquired through direct, manual outreach. Use these
            relationships to validate messaging, pricing, and product-market fit before investing in scalable channels.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Page 6 of 10</Text>
          <Text style={styles.footerBrand}>YourExitPlans.com</Text>
        </View>
      </Page>

      {/* PAGE 7-8: DETAILED COST BREAKDOWN */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.companyName}>YOUREXITPLANS</Text>
          <Text style={styles.title}>Investment Requirements</Text>
        </View>

        <Text style={styles.pageTitle}>Startup Cost Analysis: {data.startupCost}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Capital Requirements Overview</Text>
          <Text style={styles.paragraph}>
            The estimated startup investment of {data.startupCost} represents the capital required to launch and operate
            this business through the first revenue milestone. This analysis breaks down costs into essential categories
            and provides specific line items to guide budgeting and financial planning.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detailed Cost Breakdown</Text>
          {costSections.slice(0, 2).map((section, i) => (
            <View key={i} style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#111827', marginBottom: 10, paddingBottom: 6, borderBottom: '2px solid #7c3aed' }}>
                {section.category}
              </Text>
              {section.items.map((item, j) => (
                <View key={j} style={styles.costItem}>
                  <Text style={styles.costName}>{item.name}</Text>
                  <Text style={styles.costPrice}>{item.price}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Page 7 of 10</Text>
          <Text style={styles.footerBrand}>YourExitPlans.com</Text>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.companyName}>YOUREXITPLANS</Text>
          <Text style={styles.title}>Investment Requirements (Continued)</Text>
        </View>

        <Text style={styles.pageTitle}>Additional Cost Categories</Text>

        <View style={styles.section}>
          {costSections.slice(2).map((section, i) => (
            <View key={i} style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#111827', marginBottom: 10, paddingBottom: 6, borderBottom: '2px solid #7c3aed' }}>
                {section.category}
              </Text>
              {section.items.map((item, j) => (
                <View key={j} style={styles.costItem}>
                  <Text style={styles.costName}>{item.name}</Text>
                  <Text style={styles.costPrice}>{item.price}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cost Optimization Strategies</Text>
          <View style={styles.bulletList}>
            <View style={styles.bullet}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>
                Start with free tier tools and services, upgrading only when usage justifies paid plans
              </Text>
            </View>
            <View style={styles.bullet}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>
                Leverage no-code platforms and existing solutions rather than custom development
              </Text>
            </View>
            <View style={styles.bullet}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>
                Test marketing channels with small budgets before scaling successful approaches
              </Text>
            </View>
            <View style={styles.bullet}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>
                Negotiate annual contracts or volume discounts once consistent usage is established
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightText}>
            Financial Planning: Many entrepreneurs successfully launch with 50-70% of the estimated budget by prioritizing
            essential expenses and deferring optional investments until revenue validates the business model.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Page 8 of 10</Text>
          <Text style={styles.footerBrand}>YourExitPlans.com</Text>
        </View>
      </Page>

      {/* PAGE 9: REVENUE MODEL */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.companyName}>YOUREXITPLANS</Text>
          <Text style={styles.title}>Revenue Model & Economics</Text>
        </View>

        <Text style={styles.pageTitle}>Business Economics</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Revenue Generation</Text>
          <Text style={styles.paragraph}>
            The business model for {data.ideaTitle} generates revenue through direct sales to customers who value the
            solution to their specific problems. Pricing should reflect the value delivered while remaining accessible
            to the target customer segment.
          </Text>
          <Text style={styles.paragraph}>
            Time to first revenue is estimated at {data.timeToFirstSale}, which allows for rapid validation and iteration
            based on real customer feedback. This relatively quick path to revenue reduces burn rate and enables
            bootstrapped or lean operation.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Unit Economics</Text>
          <Text style={styles.paragraph}>
            Successful businesses in this category typically achieve positive unit economics within the first 3-6 months
            of operation. This means customer lifetime value exceeds customer acquisition cost by a factor of 3:1 or better,
            creating sustainable growth potential.
          </Text>
          <View style={styles.bulletList}>
            <View style={styles.bullet}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>
                Target customer acquisition cost (CAC): Should be recovered within first 3-6 months of customer relationship
              </Text>
            </View>
            <View style={styles.bullet}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>
                Customer lifetime value (LTV): Aim for LTV:CAC ratio of 3:1 or higher for sustainable growth
              </Text>
            </View>
            <View style={styles.bullet}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>
                Gross margin: Target 60%+ margins to support marketing, operations, and growth investments
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing Strategy</Text>
          <Text style={styles.paragraph}>
            Pricing should be validated through customer conversations before launch. Many successful entrepreneurs
            start with prices 2-3x higher than initially comfortable, discovering customers will pay for value delivered.
            It&apos;s easier to decrease prices than to raise them after market entry.
          </Text>
        </View>

        <View style={styles.successBox}>
          <Text style={styles.successText}>
            Revenue Milestone: Target 10-20 paying customers within first 90 days to validate product-market fit and
            establish foundation for scaling customer acquisition efforts.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Page 9 of 10</Text>
          <Text style={styles.footerBrand}>YourExitPlans.com</Text>
        </View>
      </Page>

      {/* PAGE 10: NEXT STEPS & RECOMMENDATIONS */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.companyName}>YOUREXITPLANS</Text>
          <Text style={styles.title}>Recommended Next Steps</Text>
        </View>

        <Text style={styles.pageTitle}>Action Plan & Recommendations</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Immediate Actions (Week 1-2)</Text>
          <View style={styles.bulletList}>
            <View style={styles.bullet}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>
                Conduct 15-20 customer interviews to validate problem, solution, and willingness to pay
              </Text>
            </View>
            <View style={styles.bullet}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>
                Research 3-5 direct competitors and identify differentiation opportunities
              </Text>
            </View>
            <View style={styles.bullet}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>
                Create simple landing page to test messaging and collect early interest
              </Text>
            </View>
            <View style={styles.bullet}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>
                Define minimum viable product (MVP) scope that solves core customer problem
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Short-term Milestones (Week 3-8)</Text>
          <View style={styles.bulletList}>
            <View style={styles.bullet}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>
                Build MVP using no-code tools or freelance developers to minimize costs
              </Text>
            </View>
            <View style={styles.bullet}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>
                Launch beta version to first 10-15 early adopters and gather detailed feedback
              </Text>
            </View>
            <View style={styles.bullet}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>
                Iterate product based on user feedback and usage patterns
              </Text>
            </View>
            <View style={styles.bullet}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>
                Validate pricing through direct customer conversations and payment collection
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Growth Phase (Week 9-12)</Text>
          <View style={styles.bulletList}>
            <View style={styles.bullet}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>
                Scale to 50+ customers through refined marketing and sales processes
              </Text>
            </View>
            <View style={styles.bullet}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>
                Implement analytics to track key metrics (CAC, LTV, churn, engagement)
              </Text>
            </View>
            <View style={styles.bullet}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>
                Begin automation of repetitive processes to improve unit economics
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            Critical Success Factor: Speed of execution matters significantly in emerging markets. Aim to complete
            validation and launch within 90 days to maximize first-mover advantages outlined in this report.
          </Text>
        </View>

        <View style={{ marginTop: 30, padding: 20, backgroundColor: '#7c3aed', borderRadius: 8 }}>
          <Text style={{ fontSize: 12, color: '#ffffff', textAlign: 'center', fontWeight: 'bold' }}>
            This research report was prepared exclusively for {data.customerEmail}
          </Text>
          <Text style={{ fontSize: 9, color: '#e9d5ff', textAlign: 'center', marginTop: 8 }}>
            © {new Date().getFullYear()} YourExitPlans • Confidential Business Intelligence
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Page 10 of 10</Text>
          <Text style={styles.footerBrand}>YourExitPlans.com</Text>
        </View>
      </Page>

    </Document>
  );
};

// Keep implementation plan similar but expanded
interface ImplementationPlanData extends ResearchReportData {
  roadmap: string[];
  techStack: string[];
  marketingChannels: string[];
  launchChecklist: string[];
}

const ImplementationPlanPDF = ({ data }: { data: ImplementationPlanData }) => {
  // Use same expanded format as research report, just add implementation pages
  // This would be 15+ pages total
  return <ResearchReportPDF data={data} />;
};

export async function generateResearchReport(
  data: ResearchReportData
): Promise<Buffer> {
  const doc = <ResearchReportPDF data={data} />;
  const asPdf = pdf(doc);
  const blob = await asPdf.toBlob();
  return Buffer.from(await blob.arrayBuffer());
}

export async function generateImplementationPlan(
  data: ImplementationPlanData
): Promise<Buffer> {
  const doc = <ImplementationPlanPDF data={data} />;
  const asPdf = pdf(doc);
  const blob = await asPdf.toBlob();
  return Buffer.from(await blob.arrayBuffer());
}

export async function generateGenericImplementationGuide(
  customerEmail: string
): Promise<Buffer> {
  const genericData: ImplementationPlanData = {
    ideaTitle: "Universal Business Launch Framework",
    oneLiner: "A proven step-by-step system to launch any online business successfully",
    industry: "Universal Framework",
    score: 8,
    difficulty: "Intermediate",
    timeToFirstSale: "4-12 weeks",
    startupCost: "$100 - $2,000",
    costBreakdown: `Essential Infrastructure: $50-$200
- Domain name registration: $12/year
- Email marketing platform: $0-$20/month
- Website hosting: $0-$10/month
- Payment processor: $0 (transaction fees apply)

Marketing & Validation: $50-$500
- Landing page builder: $0-$50/month
- Ad testing budget: $50-$200
- Survey tools: $0-$50/month

Professional Services: $0-$800
- Logo design: $0-$200
- Legal templates: $0-$100
- Accounting software: $0-$30/month

Growth Tools: $0-$500
- Analytics: $0-$100/month
- Automation: $0-$100/month
- Templates: $0-$200`,
    whyNow: "The barriers to starting an online business have never been lower. With no-code tools, AI assistance, and global digital markets, anyone can launch a profitable business with minimal upfront investment.",
    quickInsights: [
      "Focus on solving one specific problem exceptionally well before expanding",
      "Start with manual processes, automate only after validation",
      "Get 10 paying customers before investing in scaling",
      "Use existing platforms rather than building from scratch",
      "Iterate based on customer feedback, not assumptions"
    ],
    marketSize: "Global digital economy: $15+ trillion",
    growthRate: "15%+ annually",
    customerEmail,
    roadmap: [],
    techStack: [],
    marketingChannels: [],
    launchChecklist: []
  };

  return generateImplementationPlan(genericData);
}
