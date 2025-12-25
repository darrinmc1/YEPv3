import { SiteHeader } from "@/components/site-header"
import { ExploreIdeasForm } from "@/components/explore-ideas-form"
import { AppverseFooter } from "@/components/appverse-footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Explore Business Ideas | YourExitPlans",
  description: "Browse 1000+ pre-researched, AI-validated business opportunities. Filter by industry, budget, and skills to find your perfect Exit Plan.",
}

export default function ExploreIdeasPage() {
  return (
    <main className="min-h-[100dvh] text-white">
      <SiteHeader />

      <section className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-12">
          {/* Badge - Different from Validate (purple vs blue) */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-400/10 px-4 py-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-purple-400"></div>
            <span className="text-xs uppercase tracking-wider text-purple-400">Pre-Researched Ideas</span>
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl mb-4">
            Find Your <span className="text-purple-400">Exit Plan</span>
          </h1>
          
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto mb-2">
            Browse 1000+ business opportunities that have already been researched, validated, and scored.
          </p>
          
          {/* Key Differentiator */}
          <p className="text-sm text-purple-400/80 max-w-xl mx-auto">
            Not random ideas — each opportunity includes market data, competitor analysis, and implementation roadmaps.
          </p>
        </div>

        <ExploreIdeasForm />

        {/* Trust Indicators - Emphasize Pre-Research */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="text-3xl font-bold text-purple-400 mb-2">1000+</div>
              <p className="text-sm text-neutral-400">Researched Ideas</p>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-purple-400 mb-2">100+hrs</div>
              <p className="text-sm text-neutral-400">Research Per Idea</p>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-purple-400 mb-2">50+</div>
              <p className="text-sm text-neutral-400">Data Sources</p>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-purple-400 mb-2">Weekly</div>
              <p className="text-sm text-neutral-400">New Opportunities</p>
            </div>
          </div>
        </div>

        {/* What Makes These Different */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-8">
            <h3 className="text-xl font-bold text-white mb-4 text-center">
              Why These Ideas Are Different
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="text-center">
                <div className="text-2xl mb-2">🔬</div>
                <div className="font-semibold text-white mb-1">Pre-Validated</div>
                <p className="text-neutral-400">Every idea scored on market size, competition, and timing</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">📊</div>
                <div className="font-semibold text-white mb-1">Real Data</div>
                <p className="text-neutral-400">Market research from Reddit, Google Trends, G2, and more</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🗺️</div>
                <div className="font-semibold text-white mb-1">Action Ready</div>
                <p className="text-neutral-400">Each includes step-by-step implementation guides</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AppverseFooter />
    </main>
  )
}
