import {
    FileText, Calendar, Mail, Zap, TrendingUp, Users, DollarSign,
    Target, Rocket, CheckCircle2, Eye, ShoppingCart, Package
} from "lucide-react"

export interface Template {
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

export const templates: Template[] = [
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
                "Q5: What is the hardest part about [problem]?",
                "",
                "Q6: Why is that hard? (The '5 Whys' technique)",
                "",
                "Q7: Have you tried other solutions? What failed?",
                "",
                "Q8: How often do you face this problem?",
                "",
                "Q9: Who else do you know has this problem?",
                "",
                "Q10: Would you be willing to pay [price] for [solution]?"
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
                "Works with ChatGPT, Claude, Gemini, or any LLM."
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
