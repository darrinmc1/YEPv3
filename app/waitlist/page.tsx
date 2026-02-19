import { SiteHeader } from "@/components/site-header"
import { WaitlistForm } from "@/components/waitlist-form"
import { AppverseFooter } from "@/components/appverse-footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Join the Waitlist | YourExitPlans",
  description: "Be first to know when Gold and Platinum tiers launch. Get early-bird pricing and help shape the features.",
}

export default function WaitlistPage() {
  return (
    <main className="min-h-[100dvh] text-white">
      <SiteHeader />

      <section className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-amber-400"></div>
            <span className="text-xs uppercase tracking-wider text-amber-400">Coming Soon</span>
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl mb-4">
            Gold & Platinum <span className="text-amber-400">Waitlist</span>
          </h1>
          
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Be the first to know when our premium tiers launch. Get early-bird pricing and help us build exactly what you need.
          </p>
        </div>

        <WaitlistForm />

      </section>

      <AppverseFooter />
    </main>
  )
}
