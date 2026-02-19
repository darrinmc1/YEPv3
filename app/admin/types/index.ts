export interface ContentData {
  hero: {
    title: string
    subtitle: string
    buttonText: string
  }
  features: {
    title: string
    subtitle: string
  }
  footer: {
    tagline: string
    copyright: string
  }
  about: {
    title: string
    description: string
    mission: string
    vision: string
    teamSize: string
    founded: string
    locations: string
  }
  pricing: {
    startup: PricingTier
    pro: PricingTier
    premium: PricingTier
  }
  orderForm: {
    whatsappNumber: string
    modelingOptions: {
      simple: ModelingOption
      medium: ModelingOption
      complex: ModelingOption
    }
    renderOptions: {
      basic: RenderOption
      standard: RenderOption
      premium: RenderOption
    }
    formSteps: FormStep[]
  }
  settings: {
    adminEmail: string
    adminPassword: string
  }
}

export interface PricingTier {
  price_usd: string
  price_inr: string
  features: string[]
  videos: string[]
}

export interface ModelingOption {
  price_usd: number
  price_inr: number
  description: string
}

export interface RenderOption {
  price_usd: number
  price_inr: number
  quantity: number
}

export interface FormStep {
  enabled: boolean
  title: string
  description: string
}

export interface ActivityItem {
  id: string
  name: string
  status: string
  change: string
  icon: string
  time: string
  timestamp: number
}

export interface AnalyticsMetric {
  metric: string
  value: string
  change: string
  trend: "up" | "down"
}
