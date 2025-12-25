import { z } from "zod"

// Admin Login Schema
export const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase(),
  password: z.string().min(4, "Password must be at least 4 characters"),
})

export type AdminLoginInput = z.infer<typeof adminLoginSchema>

// Explore Ideas Schema
export const exploreIdeasSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase(),
  interests: z.string().max(500, "Interests must be less than 500 characters").optional(),
  industry: z.string().max(100).optional(),
  budget: z.string().max(50).optional(),
  timeCommitment: z.string().max(50).optional(),
  difficulty: z.string().max(50).optional(),
  skills: z.string().max(500).optional(),
  avoidTopics: z.string().max(500).optional(),
})

export type ExploreIdeasInput = z.infer<typeof exploreIdeasSchema>

// Idea Validation Schema
export const ideaValidationSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase(),
  ideaTitle: z.string().min(3, "Title must be at least 3 characters").max(200),
  ideaDescription: z.string().min(10, "Description must be at least 10 characters").max(2000),
  targetMarket: z.string().max(500).optional(),
  budget: z.string().max(50).optional(),
  timeframe: z.string().max(50).optional(),
})

export type IdeaValidationInput = z.infer<typeof ideaValidationSchema>

// Waitlist Schema
export const waitlistSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase(),
  name: z.string().min(2, "Name must be at least 2 characters").max(100).optional(),
  interests: z.string().max(500).optional(),
})

export type WaitlistInput = z.infer<typeof waitlistSchema>

// Generic Email Schema
export const emailSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase(),
})

export type EmailInput = z.infer<typeof emailSchema>
