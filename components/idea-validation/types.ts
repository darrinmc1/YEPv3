export interface IdeaFormData {
    ideaName: string
    oneLiner: string
    problemSolved: string
    targetCustomer: string
    businessType: string
    industry: string
    priceRange: string
    email: string
}

export interface AnalysisResult {
    marketValidation: {
        score: number
        summary: string
        keyInsights: string[]
    }
    competitorLandscape: {
        competition: string
        opportunities: string[]
    }
    quickWins: string[]
    redFlags: string[]
    nextSteps: string[]
}

export interface LimitReachedResponse {
    error: string
    message: string
    resetTime?: string
}

export type FormStatus = "idle" | "loading" | "success" | "error" | "rate-limited"
