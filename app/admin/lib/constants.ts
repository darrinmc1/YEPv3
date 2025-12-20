import { ContentData, ActivityItem } from "../types"

export const defaultContent: ContentData = {
  hero: {
    title: "",
    subtitle: "",
    buttonText: "Chat With Us",
  },
  features: {
    title: ".",
    subtitle: "",
  },
  footer: {
    tagline: "E",
    copyright: "",
  },
  about: {
    title: "",
    description: "",
    mission: "",
    vision: "",
    teamSize: "",
    founded: "",
    locations: "",
  },
  pricing: {
    startup: {
      price_usd: "",
      price_inr: "",
      features: ["", "s", "", "", "", ""],
      videos: ["", "", "", "", "", "", "", "", ""],
    },
    pro: {
      price_usd: "",
      price_inr: "",
      features: ["", "", "", "", "", ""],
      videos: ["", "", "", "", "", "", "", "", ""],
    },
    premium: {
      price_usd: "",
      price_inr: "",
      features: ["", "", "", "", "", ""],
      videos: ["", "", "", "", "", "", "", "", ""],
    },
  },
  orderForm: {
    whatsappNumber: "",
    modelingOptions: {
      simple: { price_usd: 35, price_inr: 2900, description: "" },
      medium: { price_usd: 60, price_inr: 5000, description: "" },
      complex: { price_usd: 120, price_inr: 10000, description: "" },
    },
    renderOptions: {
      basic: { price_usd: 25, price_inr: 2000, quantity: 3 },
      standard: { price_usd: 35, price_inr: 2900, quantity: 5 },
      premium: { price_usd: 60, price_inr: 5000, quantity: 10 },
    },
    formSteps: [
      { enabled: true, title: "Package Selection", description: "Choose your package" },
      { enabled: true, title: "Question", description: "" },
      { enabled: true, title: "Add-on", description: "" },
      { enabled: true, title: "Upsell", description: "" },
      { enabled: true, title: "Order Summary", description: "Review and confirm your order" },
    ],
  },
  settings: {
    adminEmail: "admin@YourExitPlans.com",
    adminPassword: "1234",
  },
}

export const initialActivity: ActivityItem[] = [
  {
    id: "1",
    name: "Homepage Content",
    status: "Updated",
    change: "+2.1%",
    icon: "🏠",
    time: "2 hours ago",
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
  },
  {
    id: "2",
    name: "Pricing Plans",
    status: "Modified",
    change: "+1.8%",
    icon: "💰",
    time: "4 hours ago",
    timestamp: Date.now() - 4 * 60 * 60 * 1000,
  },
  {
    id: "3",
    name: "About Page",
    status: "Published",
    change: "+3.2%",
    icon: "ℹ️",
    time: "6 hours ago",
    timestamp: Date.now() - 6 * 60 * 60 * 1000,
  },
  {
    id: "4",
    name: "Footer Content",
    status: "Updated",
    change: "+0.9%",
    icon: "📄",
    time: "8 hours ago",
    timestamp: Date.now() - 8 * 60 * 60 * 1000,
  },
]

export const initialAnalyticsData = [
  { metric: "Page Views", value: "12,543", change: "+15.2%", trend: "up" as const },
  { metric: "Unique Visitors", value: "8,921", change: "+8.7%", trend: "up" as const },
  { metric: "Bounce Rate", value: "23.4%", change: "-5.1%", trend: "down" as const },
  { metric: "Avg. Session", value: "3m 42s", change: "+12.3%", trend: "up" as const },
]
