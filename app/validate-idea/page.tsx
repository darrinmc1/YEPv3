import { SiteHeader } from "@/components/site-header"
import { IdeaValidationForm } from "@/components/idea-validation-form"
import { AppverseFooter } from "@/components/appverse-footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Free Idea Validation | YourExitPlans",
  description: "Get AI-powered validation for your business idea in 60 seconds. Market analysis, competitor research, and actionable next steps - completely free.",
}

export default function ValidateIdeaPage() {
  return (
    <main className="min-h-[100dvh] text-white">
      <SiteHeader />

      <section className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-blue-400"></div>
            <span className="text-xs uppercase tracking-wider text-blue-400">Free Tool</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl mb-4">
            Validate Your <span className="text-blue-400">Business Idea</span>
          </h1>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Get instant AI-powered analysis of your business concept. Free market validation, competitor insights, and expert recommendations in 60 seconds.
          </p>
        </div>

        <IdeaValidationForm />

        {/* Trust Indicators */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <div className="text-3xl font-bold text-blue-400 mb-2">100% Free</div>
              <p className="text-sm text-neutral-400">No credit card required</p>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-blue-400 mb-2">&lt;60s</div>
              <p className="text-sm text-neutral-400">Get results instantly</p>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-blue-400 mb-2">AI-Powered</div>
              <p className="text-sm text-neutral-400">Deep market analysis</p>
            </div>
          </div>
        </div>
      </section>

      <AppverseFooter />
    </main>
  )
}
