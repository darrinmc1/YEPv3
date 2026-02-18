import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"

export default function FAQPage() {
  return (
    <>
      <SiteHeader />
      <section className="bg-[#0a0a0a] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl liquid-glass p-6 sm:p-10 shadow-xl">
              <div className="relative space-y-12">
                <header className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tight text-blue-400">Frequently Asked Questions</h1>
                  <p className="text-neutral-400 text-lg">
                    What you need to know about YourExitPlans implementation programs and how they help you build your business.
                  </p>
                </header>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-white">
                    1. What exactly do I get with YourExitPlans?
                  </h2>
                  <p className="text-neutral-300">
                    Think of it as a GPS for your business, but instead of "turn left in 500 feet," it says "send this email to these 10 people." You get a step-by-step roadmap—up to 120 days—that tells you exactly what to do every single morning. No more guessing, no more "researching" (aka doom-scrolling), just clear instructions to get you from idea to income.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-white">2. What&apos;s the difference between the tiers?</h2>
                  <p className="text-neutral-300">
                    <strong>Starter ($99 one-time or $25/mo):</strong> Basic action steps, self-guided<br />
                    <strong>Silver ($198 one-time or $50/mo):</strong> Everything in Starter + templates, frameworks, weekly automated check-ins<br />
                    <strong>Gold ($297 one-time or $75/mo):</strong> Everything in Silver + motivation content, YouTube tutorials, weekly question support<br />
                    <strong>Platinum - still being developed </strong> Everything in previous tiers and a "push to the finish line" help with tools, products and other needed help<br />
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-white">
                    3. How long does the program take?
                  </h2>
                  <p className="text-neutral-300">
                    The full Launch Phase is 120 days—about 4 months, or roughly the time it takes to finally cancel that gym membership you never use. It's a Monday-Friday grind (building isn't a hobby), with weekends reserved for planning, learning, or just remembering what your family looks like.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-white">4. What if I fall behind or need to pause?</h2>
                  <p className="text-neutral-300">
                    Life happens. The dog gets sick, the boss gets demanding, Netflix releases a new season. That's why every 30 days we include a "Catch Up Week"—no new tasks, just time to breathe and clear your backlog. Platinum members can also hit the pause button anytime, because burning out is so 2015.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-white">5. Is this for a specific type of business?</h2>
                  <p className="text-neutral-300">
                    Surprisingly, selling SaaS and selling soap have a lot in common: you need customers, a product, and a way to accept money. Our framework covers the universal laws of business—finding a market, validating the offer, and getting paid—whether you're building the next Uber or a local consulting firm.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-white">
                    6. Do I need technical skills or coding knowledge?
                  </h2>
                  <p className="text-neutral-300">
                    Absolutely not. If you can order a pizza online, you have enough technical skill to survive this program. We focus entirely on "no-code" tools that let you build websites and apps by dragging and dropping blocks. Leave the coding to the people who enjoy debugging at 3 AM.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-white">7. What&apos;s the difference between one-time and monthly payments?</h2>
                  <p className="text-neutral-300">
                    One-time payments give you immediate access to all templates and resources upfront. Monthly payments provide the same content but templates unlock as you progress through the days (drip-fed).
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-white">
                    8. What happens after Day 120?
                  </h2>
                  <p className="text-neutral-300">
                    After completing the 120-day Launch Phase, we are developing further assistance plans where you can continue with our Growth Phase (Days 121-240) and Scale Phase (Days 241-365) programs. These focus on advanced tactics, team building, and sustainable scaling as you grow your business.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-white">
                    9. Can I upgrade my tier later?
                  </h2>
                  <p className="text-neutral-300">
                    Yes! You can upgrade to a higher tier at the start of any new month. Simply pay the difference and you&apos;ll immediately get access to the enhanced content and support for that tier.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-white">10. Is there a refund policy?</h2>
                  <p className="text-neutral-300">
                    We offer a 7-day money-back guarantee. If you&apos;re not satisfied with the program within the first 7 days, contact us for a full refund. After 7 days, all sales are final as you have access to the complete 120-day roadmap.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-white">
                    11. Do you provide one-on-one coaching or calls?
                  </h2>
                  <p className="text-neutral-300">
                    Not yet. Right now, our robots (and plans) do the heavy lifting to keep costs down. We might add 1:1 coaching to the Platinum tier later if enough people ask nicely, but for now, think of this as a self-guided mission with really, really good maps.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-white">12. What tools and software do I need?</h2>
                  <p className="text-neutral-300">
                    Most tools we recommend are free or have free tiers: Google Workspace (free), v0.dev (free tier), Canva (free), and basic project management tools. We may recommend paid tools, but free alternatives are always provided.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-white">
                    13. How much time do I need to commit each day?
                  </h2>
                  <p className="text-neutral-300">
                    You'll need about 1-3 hours a day, Monday through Friday. Yes, that means you might have to sacrifice your evening TV time. But look at it this way: In 120 days, you could either be caught up on "The Bachelor" or have a revenue-generating business. Choose wisely.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-white">14. How do I get started?</h2>
                  <p className="text-neutral-300">
                    Simply{" "}
                    <a href="/checkout" className="text-blue-400 underline">
                      choose your tier
                    </a>
                    , complete your purchase, and you&apos;ll receive immediate access to your Day 1 materials and the complete roadmap. Start building your business tomorrow!
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-white">15. Still have questions?</h2>
                  <p className="text-neutral-300">
                    <a href="mailto:support@yourexitplans.com" className="text-blue-400 underline">
                      Contact us
                    </a>{" "}
                    and we&apos;ll get back to you with answers to any questions not covered here.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>
      <AppverseFooter />
    </>
  )
}
