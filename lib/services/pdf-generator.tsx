/**
 * PDF Generation Service - Clean Professional Design
 * Simple, elegant, error-free reports
 */

import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

// Clean professional styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  
  // Simple header
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
  
  // Section
  section: {
    marginBottom: 24,
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
    lineHeight: 1.7,
    color: '#374151',
    marginBottom: 10,
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
    marginBottom: 10,
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
    lineHeight: 1.6,
    color: '#374151',
    flex: 1,
  },
  
  // Info box
  infoBox: {
    backgroundColor: '#eff6ff',
    borderLeft: '3px solid #3b82f6',
    padding: 14,
    marginBottom: 16,
    borderRadius: 4,
  },
  infoText: {
    fontSize: 10,
    lineHeight: 1.6,
    color: '#374151',
  },
  
  // Cost section
  costCategory: {
    marginBottom: 14,
  },
  costHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    paddingBottom: 4,
    borderBottom: '1px solid #e5e7eb',
  },
  costItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 9,
    color: '#4b5563',
    marginBottom: 4,
    paddingLeft: 8,
  },
  costName: {
    flex: 1,
  },
  costPrice: {
    fontFamily: 'Courier',
    width: 140,
    textAlign: 'right',
  },
  
  // Timeline
  timelineItem: {
    marginBottom: 14,
    paddingLeft: 16,
    borderLeft: '2px solid #e5e7eb',
  },
  timelineWeek: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#7c3aed',
    marginBottom: 4,
  },
  timelineText: {
    fontSize: 10,
    lineHeight: 1.6,
    color: '#374151',
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
      const header = lines[0];
      return {
        category: header,
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
      {/* Page 1 */}
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.companyName}>YOUREXITPLANS</Text>
          <Text style={styles.title}>{data.ideaTitle}</Text>
          <Text style={styles.subtitle}>{data.oneLiner}</Text>
        </View>

        {/* Overview Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Overview</Text>
          
          <View style={styles.statsBox}>
            <View style={styles.statsRow}>
              <Text style={styles.statLabel}>Industry</Text>
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
              <Text style={styles.statLabel}>Startup Investment</Text>
              <Text style={styles.statValue}>{data.startupCost}</Text>
            </View>
          </View>
        </View>

        {/* Why Now Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Now?</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>{data.whyNow}</Text>
          </View>
        </View>

        {/* Market Opportunity Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Market Opportunity</Text>
          <Text style={styles.paragraph}>
            <Text style={{fontWeight: 'bold'}}>Market Size: </Text>{data.marketSize}
          </Text>
          <Text style={styles.paragraph}>
            <Text style={{fontWeight: 'bold'}}>Growth Rate: </Text>{data.growthRate}
          </Text>
        </View>

        {/* Key Insights Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Insights</Text>
          <View style={styles.bulletList}>
            {data.quickInsights.map((insight, i) => (
              <View key={i} style={styles.bullet}>
                <View style={styles.bulletDot} />
                <Text style={styles.bulletText}>{insight}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Generated for {data.customerEmail}</Text>
          <Text style={styles.footerBrand}>YourExitPlans.com</Text>
        </View>
      </Page>

      {/* Page 2 - Cost Breakdown */}
      <Page size="A4" style={styles.page}>
        
        <View style={styles.header}>
          <Text style={styles.companyName}>YOUREXITPLANS</Text>
          <Text style={styles.title}>Startup Cost Analysis</Text>
          <Text style={styles.subtitle}>{data.ideaTitle}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Investment Breakdown: {data.startupCost}</Text>
          
          {costSections.map((section, i) => (
            <View key={i} style={styles.costCategory}>
              <Text style={styles.costHeader}>{section.category}</Text>
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
          <Text style={styles.footerText}>© {new Date().getFullYear()} YourExitPlans</Text>
          <Text style={styles.footerBrand}>YourExitPlans.com</Text>
        </View>
      </Page>
    </Document>
  );
};

interface ImplementationPlanData extends ResearchReportData {
  roadmap: string[];
  techStack: string[];
  marketingChannels: string[];
  launchChecklist: string[];
}

const ImplementationPlanPDF = ({ data }: { data: ImplementationPlanData }) => {
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

  const costSections = parseCostBreakdown(data.costBreakdown).slice(0, 3);

  return (
    <Document>
      {/* Page 1 - Overview */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.companyName}>YOUREXITPLANS</Text>
          <Text style={styles.title}>{data.ideaTitle}</Text>
          <Text style={styles.subtitle}>90-Day Implementation Plan</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Overview</Text>
          <Text style={styles.paragraph}>{data.oneLiner}</Text>
          
          <View style={styles.statsBox}>
            <View style={styles.statsRow}>
              <Text style={styles.statLabel}>Industry</Text>
              <Text style={styles.statValue}>{data.industry}</Text>
            </View>
            <View style={styles.statsRow}>
              <Text style={styles.statLabel}>Score</Text>
              <Text style={styles.statValue}>{data.score} / 10</Text>
            </View>
            <View style={styles.statsRow}>
              <Text style={styles.statLabel}>Difficulty</Text>
              <Text style={styles.statValue}>{data.difficulty}</Text>
            </View>
            <View style={styles.statsRow}>
              <Text style={styles.statLabel}>Investment</Text>
              <Text style={styles.statValue}>{data.startupCost}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Now?</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>{data.whyNow}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Investment Areas</Text>
          {costSections.map((section, i) => (
            <View key={i} style={styles.costCategory}>
              <Text style={styles.costHeader}>{section.category}</Text>
              {section.items.slice(0, 3).map((item, j) => (
                <View key={j} style={styles.costItem}>
                  <Text style={styles.costName}>{item.name}</Text>
                  <Text style={styles.costPrice}>{item.price}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Page 1 of 3</Text>
          <Text style={styles.footerBrand}>YourExitPlans.com</Text>
        </View>
      </Page>

      {/* Page 2 - Roadmap */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.companyName}>YOUREXITPLANS</Text>
          <Text style={styles.title}>90-Day Launch Roadmap</Text>
          <Text style={styles.subtitle}>{data.ideaTitle}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Launch Timeline</Text>
          {data.roadmap.map((item, i) => {
            const weekMatch = item.match(/Week\s+(\d+-?\d*)/i);
            const weekLabel = weekMatch ? weekMatch[0] : '';
            const description = item.replace(/Week\s+\d+-?\d*:?\s*/i, '');
            
            return (
              <View key={i} style={styles.timelineItem}>
                {weekLabel && <Text style={styles.timelineWeek}>{weekLabel}</Text>}
                <Text style={styles.timelineText}>{description}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Page 2 of 3</Text>
          <Text style={styles.footerBrand}>YourExitPlans.com</Text>
        </View>
      </Page>

      {/* Page 3 - Execution Details */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.companyName}>YOUREXITPLANS</Text>
          <Text style={styles.title}>Execution Strategy</Text>
          <Text style={styles.subtitle}>{data.ideaTitle}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technology Stack</Text>
          <View style={styles.bulletList}>
            {data.techStack.map((tool, i) => (
              <View key={i} style={styles.bullet}>
                <View style={styles.bulletDot} />
                <Text style={styles.bulletText}>{tool}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Marketing Channels</Text>
          <View style={styles.bulletList}>
            {data.marketingChannels.map((channel, i) => (
              <View key={i} style={styles.bullet}>
                <View style={styles.bulletDot} />
                <Text style={styles.bulletText}>{channel}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Launch Checklist</Text>
          <View style={styles.bulletList}>
            {data.launchChecklist.map((item, i) => (
              <View key={i} style={styles.bullet}>
                <View style={styles.bulletDot} />
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Generated for {data.customerEmail} • Page 3 of 3</Text>
          <Text style={styles.footerBrand}>YourExitPlans.com</Text>
        </View>
      </Page>
    </Document>
  );
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
    roadmap: [
      "Week 1-2: Validate demand with 20+ customer interviews",
      "Week 3-4: Build minimum viable product or service",
      "Week 5-6: Launch beta to first 10-20 customers",
      "Week 7-8: Gather feedback and iterate",
      "Week 9-10: Refine pricing and positioning",
      "Week 11-12: Scale to 50+ customers"
    ],
    techStack: [
      "Website: Carrd ($19/year), Webflow (free), or WordPress",
      "Payments: Stripe (2.9% + 30¢) or PayPal",
      "Email: ConvertKit, Mailchimp (free tiers available)",
      "Automation: Zapier (free) or Make.com",
      "Analytics: Google Analytics (free)",
      "Support: Crisp (free) or Intercom"
    ],
    marketingChannels: [
      "Direct outreach via LinkedIn and email",
      "Content marketing (blog, social media)",
      "Paid ads ($50-200 test budget)",
      "Strategic partnerships",
      "Community building (Facebook, Reddit, Slack)",
      "SEO for long-term traffic"
    ],
    launchChecklist: [
      "Domain registered and email configured",
      "Landing page live and tested",
      "Payment processing integrated",
      "First 10-20 customers identified",
      "Pricing validated",
      "Analytics tracking installed",
      "Email automation configured",
      "Support process defined",
      "Legal basics covered",
      "Launch content prepared"
    ]
  };

  return generateImplementationPlan(genericData);
}
