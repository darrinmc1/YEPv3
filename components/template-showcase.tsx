"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  FileText, Calendar, Mail, Zap, TrendingUp, Users, DollarSign, 
  Target, Rocket, CheckCircle2, Eye, ShoppingCart, Package
} from "lucide-react"

interface Template {
  id: string
  name: string
  category: "roadmap" | "template" | "ai-prompt" | "email" | "marketing" | "sales"
  price: number
  description: string
  icon: any
  whatYouGet: string[]
  example: {
    title: string
    preview: string[]
  }
  bundledIn: ("quick-start" | "launch-system" | "complete-build")[]
}

const templates: Template[] = [
  {
    id: "30-day-roadmap",
    name: "30-Day Launch Roadmap",
    category: "roadmap",
    price: 19,
    description: "Week-by-week action plan with daily tasks to launch your MVP in 30 days",
    icon: Calendar,
    whatYouGet: [
      "4 weekly sprint plans with objectives",
      "Daily task breakdowns (120+ tasks)",
      "Milestone checklist (15 key milestones)",
      "Time tracking template",
      "Launch countdown calendar"
    ],
    example: {
      title: "Week 1 Example - Validation Phase",
      preview: [
        "Day 1: Define your problem statement (2 hours)",
        "Day 2: Create customer persona (1 hour)",
        "Day 3: Research 5 competitors (3 hours)",
        "Day 4: Conduct 3 customer interviews (2 hours)",
        "Day 5: Analyze interview data (1 hour)",
        "Day 6: Refine value proposition (2 hours)",
        "Day 7: Weekly review and planning (1 hour)"
      ]
    },
    bundledIn: ["quick-start", "launch-system", "complete-build"]
  },
  {
    id: "90-day-roadmap",
    name: "90-Day Implementation Roadmap",
    category: "roadmap",
    price: 39,
    description: "Complete 3-phase system: Validate → Build → Launch",
    icon: Rocket,
    whatYouGet: [
      "Phase 1: Validation (Days 1-30)",
      "Phase 2: Build MVP (Days 31-60)",
      "Phase 3: Launch & Growth (Days 61-90)",
      "Weekly sprint templates",
      "Daily execution checklist",
      "Pivot decision framework"
    ],
    example: {
      title: "Phase 2 Example - Build Week 5",
      preview: [
        "Mon: Finalize MVP feature list (2 hrs)",
        "Tue: Create wireframes for core screens (3 hrs)",
        "Wed: Set up development environment (2 hrs)",
        "Thu: Build authentication system (4 hrs)",
        "Fri: Implement core feature #1 (4 hrs)",
        "Sat: Code review and bug fixes (2 hrs)",
        "Sun: Weekly demo and pivot check (1 hr)"
      ]
    },
    bundledIn: ["launch-system", "complete-build"]
  },
  {
    id: "business-plan-template",
    name: "Business Plan Template",
    category: "template",
    price: 12,
    description: "15-page professional business plan with financial projections",
    icon: FileText,
    whatYouGet: [
      "Executive summary template",
      "Market analysis framework",
      "Competitive analysis section",
      "Financial projections spreadsheet",
      "Go-to-market strategy template"
    ],
    example: {
      title: "Market Analysis Section Example",
      preview: [
        "1. Total Addressable Market (TAM)",
        "   - Calculate market size: [methodology]",
        "   - Industry growth rate: [sources]",
        "",
        "2. Serviceable Available Market (SAM)",
        "   - Your target segment: [define]",
        "   - Segment size and trends",
        "",
        "3. Serviceable Obtainable Market (SOM)",
        "   - Your realistic 1-year capture: X%",
        "   - Supporting data and assumptions"
      ]
    },
    bundledIn: ["launch-system", "complete-build"]
  },
  {
    id: "customer-interview-script",
    name: "Customer Interview Script",
    category: "template",
    price: 7,
    description: "10 proven questions to validate your idea with real customers",
    icon: Users,
    whatYouGet: [
      "10 open-ended discovery questions",
      "Follow-up question framework",
      "Interview note-taking template",
      "Data synthesis worksheet",
      "Insight extraction guide"
    ],
    example: {
      title: "Sample Interview Questions",
      preview: [
        "Q1: Tell me about the last time you experienced [problem]. Walk me through what happened.",
        "",
        "Q2: How are you currently solving this problem? What do you like/dislike about your current solution?",
        "",
        "Q3: If you had a magic wand and could solve this perfectly, what would that look like?",
        "",
        "Q4: How much time/money does this problem cost you each month?",
        "",
        "[+ 6 more strategic questions designed to uncover real pain points]"
      ]
    },
    bundledIn: ["quick-start", "launch-system", "complete-build"]
  },
  {
    id: "ai-prompts-content",
    name: "Content Creation AI Prompts (8)",
    category: "ai-prompt",
    price: 9,
    description: "8 battle-tested prompts for blog posts, social media, and landing pages",
    icon: Zap,
    whatYouGet: [
      "Blog post outline generator",
      "Social media caption writer (LinkedIn, Twitter)",
      "Landing page copywriter",
      "Email subject line generator",
      "SEO meta description writer"
    ],
    example: {
      title: "Landing Page Copywriter Prompt",
      preview: [
        "\"You are a conversion copywriter. Write compelling landing page copy for [PRODUCT].",
        "",
        "Target audience: [PERSONA]",
        "Main benefit: [BENEFIT]",
        "Proof points: [DATA]",
        "",
        "Include:",
        "- Attention-grabbing headline (10 words max)",
        "- Emotional sub-headline",
        "- 3 benefit-focused bullet points",
        "- Social proof section",
        "- Strong CTA with urgency",
        "",
        "Tone: Professional yet conversational, outcome-focused\"",
        "",
        "[Works with ChatGPT, Claude, or any AI]"
      ]
    },
    bundledIn: ["launch-system", "complete-build"]
  },
  {
    id: "email-sequences-launch",
    name: "Launch Email Sequence (5 emails)",
    category: "email",
    price: 15,
    description: "5-email sequence for your product launch week",
    icon: Mail,
    whatYouGet: [
      "Pre-launch teaser email",
      "Launch day announcement",
      "Day 2: Social proof email",
      "Day 4: Urgency/scarcity email",
      "Final call closing email",
      "Subject line formulas for each"
    ],
    example: {
      title: "Email #1 - Pre-Launch Teaser",
      preview: [
        "Subject: Tomorrow changes everything [FIRSTNAME]",
        "",
        "Hey [FIRSTNAME],",
        "",
        "I'm launching [PRODUCT] tomorrow at 10am EST.",
        "",
        "Here's what you need to know:",
        "",
        "✅ What it does: [ONE SENTENCE BENEFIT]",
        "✅ Who it's for: [TARGET CUSTOMER]",
        "✅ Special launch bonus: [INCENTIVE]",
        "",
        "I've spent [TIME] building this after seeing [PROBLEM] repeatedly...",
        "",
        "[Continue with story and value proposition]",
        "",
        "Reply \"IN\" and I'll send you early access 30 mins before public launch.",
        "",
        "[SIGNATURE]"
      ]
    },
    bundledIn: ["complete-build"]
  },
  {
    id: "email-sequences-onboarding",
    name: "Onboarding Email Sequence (12 emails)",
    category: "email",
    price: 29,
    description: "12-email automated onboarding sequence for new customers",
    icon: Mail,
    whatYouGet: [
      "Welcome email with first steps",
      "Day 2: Quick win email",
      "Day 3: Feature education",
      "Day 5: Case study/social proof",
      "Day 7: Engagement check-in",
      "... + 7 more strategic touchpoints",
      "Subject line A/B test variations"
    ],
    example: {
      title: "Email #2 - Quick Win (Day 2)",
      preview: [
        "Subject: Get your first [RESULT] today 🚀",
        "",
        "Hey [FIRSTNAME],",
        "",
        "Yesterday you joined [PRODUCT] - welcome!",
        "",
        "Today, let's get you your first quick win in under 10 minutes.",
        "",
        "Here's your mission:",
        "1. [SIMPLE ACTION 1] (2 mins)",
        "2. [SIMPLE ACTION 2] (3 mins)",
        "3. [SIMPLE ACTION 3] (5 mins)",
        "",
        "Once done, you'll have [TANGIBLE OUTCOME].",
        "",
        "[Video walkthrough: LINK]",
        "",
        "Need help? Just reply to this email.",
        "",
        "Cheering you on,",
        "[SIGNATURE]"
      ]
    },
    bundledIn: ["complete-build"]
  },
  {
    id: "pitch-deck-template",
    name: "Investor Pitch Deck Template",
    category: "template",
    price: 19,
    description: "12-slide pitch deck template used to raise $50M+",
    icon: TrendingUp,
    whatYouGet: [
      "12 professionally designed slides",
      "Slide-by-slide content guide",
      "Do's and don'ts for each section",
      "Example decks from successful raises",
      "Powerpoint + Google Slides format"
    ],
    example: {
      title: "Slide Structure",
      preview: [
        "Slide 1: Problem (the pain you're solving)",
        "Slide 2: Solution (your product in 1 sentence)",
        "Slide 3: Market Size (TAM, SAM, SOM)",
        "Slide 4: Product Demo (screenshots/video)",
        "Slide 5: Business Model (how you make money)",
        "Slide 6: Traction (metrics, growth, proof)",
        "Slide 7: Competition (unique positioning)",
        "Slide 8: Go-to-Market Strategy",
        "Slide 9: Team (why you'll win)",
        "Slide 10: Financials (3-year projection)",
        "Slide 11: The Ask (amount + use of funds)",
        "Slide 12: Vision (the big picture)"
      ]
    },
    bundledIn: ["launch-system", "complete-build"]
  },
  {
    id: "marketing-calendar",
    name: "90-Day Marketing Calendar",
    category: "marketing",
    price: 14,
    description: "Pre-filled content calendar with 90 days of marketing activities",
    icon: Calendar,
    whatYouGet: [
      "Daily content prompts (90 days)",
      "Social media posting schedule",
      "Content themes by week",
      "Hashtag research list",
      "Performance tracking template"
    ],
    example: {
      title: "Week 1 - Launch Phase",
      preview: [
        "Monday: Behind-the-scenes post (Instagram Story)",
        "Tuesday: Blog post - 'Why I Built [Product]'",
        "Wednesday: LinkedIn thought leadership",
        "Thursday: Product teaser video (30 sec)",
        "Friday: User testimonial feature",
        "Saturday: Community engagement day",
        "Sunday: Weekly recap + next week preview",
        "",
        "[Each day includes: Platform, Content Type, Hook, CTA, Hashtags]"
      ]
    },
    bundledIn: ["launch-system", "complete-build"]
  },
  {
    id: "sales-page-template",
    name: "High-Converting Sales Page Template",
    category: "sales",
    price: 22,
    description: "Proven sales page formula that converts at 3-5%",
    icon: DollarSign,
    whatYouGet: [
      "Complete page structure (12 sections)",
      "Copywriting formulas for each section",
      "Psychology triggers to use",
      "A/B testing checklist",
      "HTML + Figma files"
    ],
    example: {
      title: "Sales Page Structure",
      preview: [
        "1. Hero: Benefit-driven headline + sub-headline",
        "2. The Problem: Agitate the pain (storytelling)",
        "3. The Solution: Introduce your product",
        "4. How It Works: 3-step process",
        "5. Features & Benefits: Transform features to outcomes",
        "6. Social Proof: Testimonials + numbers",
        "7. Pricing: Clear packages with anchoring",
        "8. FAQ: Address objections",
        "9. Guarantee: Risk reversal",
        "10. Urgency: Limited time/spots",
        "11. Final CTA: Strong action language",
        "12. PS: Reinforce core benefit"
      ]
    },
    bundledIn: ["complete-build"]
  }
]

export function TemplateShowcase() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const categories = [
    { id: "all", label: "All Templates", icon: Package },
    { id: "roadmap", label: "Roadmaps", icon: Calendar },
    { id: "template", label: "Business Templates", icon: FileText },
    { id: "ai-prompt", label: "AI Prompts", icon: Zap },
    { id: "email", label: "Email Sequences", icon: Mail },
    { id: "marketing", label: "Marketing", icon: TrendingUp },
    { id: "sales", label: "Sales", icon: DollarSign }
  ]

  const filteredTemplates = selectedCategory === "all" 
    ? templates 
    : templates.filter(t => t.category === selectedCategory)

  return (
    <>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-12">
        {categories.map((cat) => (
          <Button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            variant={selectedCategory === cat.id ? "default" : "outline"}
            className={selectedCategory === cat.id 
              ? "bg-blue-500 hover:bg-blue-400 text-white" 
              : "border-white/20 text-white hover:bg-white/10"
            }
          >
            <cat.icon className="h-4 w-4 mr-2" />
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="bg-black/40 border-white/10 hover:border-blue-400/30 transition-all">
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <template.icon className="h-6 w-6 text-blue-400" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">${template.price}</div>
                  <div className="text-xs text-neutral-500">one-time</div>
                </div>
              </div>
              <CardTitle className="text-white text-lg">{template.name}</CardTitle>
              <p className="text-sm text-neutral-400 mt-2">{template.description}</p>
            </CardHeader>
            <CardContent>
              {/* What You Get - Preview */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-neutral-400 uppercase mb-2">What You Get:</h4>
                <ul className="space-y-1">
                  {template.whatYouGet.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-neutral-300">
                      <CheckCircle2 className="h-3 w-3 text-green-400 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                  {template.whatYouGet.length > 3 && (
                    <li className="text-xs text-blue-400">+ {template.whatYouGet.length - 3} more items</li>
                  )}
                </ul>
              </div>

              {/* Bundled In */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-neutral-400 uppercase mb-2">Included In:</h4>
                <div className="flex flex-wrap gap-1">
                  {template.bundledIn.map((bundle) => (
                    <Badge key={bundle} variant="outline" className="text-xs border-green-400/20 text-green-400">
                      {bundle === "quick-start" && "Quick Start"}
                      {bundle === "launch-system" && "Launch System"}
                      {bundle === "complete-build" && "Complete Build"}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={() => setSelectedTemplate(template)}
                  variant="outline"
                  className="flex-1 border-blue-400/30 text-blue-400 hover:bg-blue-500/10"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button
                  onClick={() => window.location.href = `/checkout?item=${template.id}`}
                  className="flex-1 bg-blue-500 hover:bg-blue-400 text-white"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Buy ${template.price}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bundle CTA */}
      <div className="mt-16 max-w-4xl mx-auto p-8 rounded-2xl bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-400/20">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Want Everything? Save with Bundles</h3>
          <p className="text-neutral-300 mb-6">
            Get all templates, roadmaps, and resources in our complete systems
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-black/40">
              <div className="text-sm text-neutral-400 mb-1">Quick Start</div>
              <div className="text-2xl font-bold text-white mb-2">$29</div>
              <div className="text-xs text-neutral-500 mb-3">$197 value • Save $168</div>
              <Button asChild className="w-full bg-white/10 hover:bg-white/20 text-white text-sm">
                <a href="/validate-idea#pricing">View Bundle</a>
              </Button>
            </div>
            <div className="p-4 rounded-lg bg-green-500/5 border-2 border-green-400/30">
              <div className="text-sm text-green-400 mb-1 font-semibold">Most Popular</div>
              <div className="text-2xl font-bold text-white mb-2">$49</div>
              <div className="text-xs text-neutral-500 mb-3">$497 value • Save $448</div>
              <Button asChild className="w-full bg-green-500 hover:bg-green-400 text-white text-sm">
                <a href="/validate-idea#pricing">View Bundle</a>
              </Button>
            </div>
            <div className="p-4 rounded-lg bg-black/40">
              <div className="text-sm text-neutral-400 mb-1">Complete Build</div>
              <div className="text-2xl font-bold text-white mb-2">$99</div>
              <div className="text-xs text-neutral-500 mb-3">$997 value • Save $898</div>
              <Button asChild className="w-full bg-blue-500 hover:bg-blue-400 text-white text-sm">
                <a href="/validate-idea#pricing">View Bundle</a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {selectedTemplate && (
        <Dialog open={true} onOpenChange={() => setSelectedTemplate(null)}>
          <DialogContent className="bg-gradient-to-br from-gray-900 to-black border border-white/10 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
                <selectedTemplate.icon className="h-6 w-6 text-blue-400" />
                {selectedTemplate.name}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">${selectedTemplate.price}</span>
                <span className="text-lg text-neutral-400">one-time purchase</span>
              </div>

              {/* Description */}
              <p className="text-neutral-300">{selectedTemplate.description}</p>

              {/* What You Get - Full List */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">What's Included:</h4>
                <ul className="space-y-2">
                  {selectedTemplate.whatYouGet.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 shrink-0" />
                      <span className="text-neutral-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Example Preview */}
              <div className="p-6 rounded-lg bg-black/60 border border-blue-400/20">
                <h4 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  {selectedTemplate.example.title}
                </h4>
                <div className="font-mono text-xs text-neutral-300 whitespace-pre-wrap bg-black/40 p-4 rounded border border-white/10">
                  {selectedTemplate.example.preview.join('\n')}
                </div>
              </div>

              {/* Also Included In */}
              <div className="p-4 rounded-lg bg-green-500/5 border border-green-400/20">
                <h4 className="text-sm font-semibold text-green-400 mb-2">💡 Save Money: This is also included in:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.bundledIn.map((bundle) => (
                    <Badge key={bundle} className="bg-green-500/20 text-green-400 border-green-400/30">
                      {bundle === "quick-start" && "Quick Start ($29)"}
                      {bundle === "launch-system" && "Launch System ($49)"}
                      {bundle === "complete-build" && "Complete Build ($99)"}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={() => window.location.href = `/checkout?item=${selectedTemplate.id}`}
                  className="flex-1 bg-blue-500 hover:bg-blue-400 text-white font-semibold py-6"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Buy Now - ${selectedTemplate.price}
                </Button>
                <Button
                  onClick={() => setSelectedTemplate(null)}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
