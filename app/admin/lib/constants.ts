import { ContentData, ActivityItem } from "../types"

export const defaultContent: ContentData = {
  hero: {
    title: "YourExitPlans from the 9-5 to Freedom",
    subtitle: "Stop telling people you're \"working on something\" and actually build it. We give you the idea, the plan, and the kick in the ass you need.",
    buttonText: "Start Building",
  },
  features: {
    title: "Stop Researching. Start Launching.",
    subtitle: "Seriously, stop researching. We transform market signals into validated, actionable business opportunities.",
  },
  footer: {
    tagline: "AI-Powered Business Opportunities & Market Intelligence",
    copyright: "© 2024 YourExitPlans. Made with ❤️ and too much caffeine by builders who want you to succeed. Stop reading the footer and go launch something.",
  },
  about: {
    title: "About YourExitPlans",
    description: "We help aspiring entrepreneurs validate and launch their business ideas.",
    mission: "To eliminate the guesswork in entrepreneurship.",
    vision: "A world where anyone with drive can build a successful business.",
    teamSize: "10+",
    founded: "2023",
    locations: "Global",
  },
  pricing: {
    startup: {
      price_usd: "29",
      price_inr: "2400",
      features: ["AI Market Analysis", "3 Validated Ideas", "Basic Support", "Community Access", "Weekly Updates", "Cancel Anytime"],
      videos: ["", "", "", "", "", "", "", "", ""],
    },
    pro: {
      price_usd: "49",
      price_inr: "4000",
      features: ["Everything in Startup", "10 Validated Ideas", "Priority Support", "Strategy Calls", "Deep Dive Reports", "Competitor Analysis"],
      videos: ["", "", "", "", "", "", "", "", ""],
    },
    premium: {
      price_usd: "99",
      price_inr: "8200",
      features: ["Everything in Pro", "Unlimited Ideas", "1-on-1 Mentoring", "Custom Roadmaps", "Investor Pitch Deck", "Legal Templates"],
      videos: ["", "", "", "", "", "", "", "", ""],
    },
  },
  orderForm: {
    whatsappNumber: "",
    modelingOptions: {
      simple: { price_usd: 35, price_inr: 2900, description: "Basic validation of your business idea" },
      medium: { price_usd: 60, price_inr: 5000, description: "Detailed market analysis and report" },
      complex: { price_usd: 120, price_inr: 10000, description: "Full implementation roadmap and strategy" },
    },
    renderOptions: {
      basic: { price_usd: 25, price_inr: 2000, quantity: 3 },
      standard: { price_usd: 35, price_inr: 2900, quantity: 5 },
      premium: { price_usd: 60, price_inr: 5000, quantity: 10 },
    },
    formSteps: [
      { enabled: true, title: "Package Selection", description: "Choose your package" },
      { enabled: true, title: "Question", description: "Tell us about your idea" },
      { enabled: true, title: "Add-on", description: "Select additional services" },
      { enabled: true, title: "Upsell", description: "Exclusive offers" },
      { enabled: true, title: "Order Summary", description: "Review and confirm your order" },
    ],
  },
  settings: {
    adminEmail: "admin@YourExitPlans.com",
    adminPassword: "1234",
  },
}



export const initialActivity: ActivityItem[] = []

export interface NotificationItem {
  id: string
  title: string
  message: string
  time: string
  read: boolean
}

export const initialNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "New Order",
    message: "New order #1234 received from John Doe",
    time: "2 min ago",
    read: false,
  },
  {
    id: "2",
    title: "System Update",
    message: "System maintenance scheduled for tonight",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    title: "New User",
    message: "Sarah Smith created an account",
    time: "3 hours ago",
    read: false,
  },
]

export const initialAnalyticsData = [
  { metric: "Page Views", value: "12,543", change: "+15.2%", trend: "up" as const },
  { metric: "Unique Visitors", value: "8,921", change: "+8.7%", trend: "up" as const },
  { metric: "Bounce Rate", value: "23.4%", change: "-5.1%", trend: "down" as const },
  { metric: "Avg. Session", value: "3m 42s", change: "+12.3%", trend: "up" as const },
]
