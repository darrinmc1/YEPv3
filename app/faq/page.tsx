import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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
                    Everything you need to know about YourExitPlans implementation programs and how they help you build your business.
                  </p>
                </header>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-white/10">
                    <AccordionTrigger className="text-xl font-semibold text-white hover:text-blue-400 text-left">
                      1. What exactly do I get with YourExitPlans?
                    </AccordionTrigger>
                    <AccordionContent className="text-neutral-300 text-base">
                      You get a complete 120-day step-by-step implementation plan to launch and grow your business. Each day includes specific actions, templates, frameworks, and resources tailored to your tier level. Higher tiers include strategic guidance, video tutorials, and personalized support.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2" className="border-white/10">
                    <AccordionTrigger className="text-xl font-semibold text-white hover:text-blue-400 text-left">
                      2. What&apos;s the difference between the tiers?
                    </AccordionTrigger>
                    <AccordionContent className="text-neutral-300 text-base">
                      <p className="mb-2"><strong>Starter ($99 one-time or $25/mo):</strong> Basic action steps, self-guided</p>
                      <p className="mb-2"><strong>Silver ($198 one-time or $50/mo):</strong> Everything in Starter + templates, frameworks, weekly automated check-ins</p>
                      <p className="mb-2"><strong>Gold ($297 one-time or $75/mo):</strong> Everything in Silver + motivation content, YouTube tutorials, weekly question support</p>
                      <p><strong>Platinum ($999 for 6 months or $199/mo):</strong> Everything in Gold + regional customization, weekly AI-personalized guidance, pause feature</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3" className="border-white/10">
                    <AccordionTrigger className="text-xl font-semibold text-white hover:text-blue-400 text-left">
                      3. How long does the program take?
                    </AccordionTrigger>
                    <AccordionContent className="text-neutral-300 text-base">
                      The complete Launch Phase is 120 days (about 4 months). This includes 15 weeks of action days plus 4 review weeks to catch up and assess progress. You work Monday-Friday with weekends for learning and planning.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4" className="border-white/10">
                    <AccordionTrigger className="text-xl font-semibold text-white hover:text-blue-400 text-left">
                      4. What if I fall behind or need to pause?
                    </AccordionTrigger>
                    <AccordionContent className="text-neutral-300 text-base">
                      Every 30 days includes a review week specifically designed for catching up on incomplete tasks. Platinum tier customers can also pause their daily tasks if overwhelmed while still receiving support content and resources.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5" className="border-white/10">
                    <AccordionTrigger className="text-xl font-semibold text-white hover:text-blue-400 text-left">
                      5. Is this for a specific type of business?
                    </AccordionTrigger>
                    <AccordionContent className="text-neutral-300 text-base">
                      No, the implementation framework works for any business type — online services, e-commerce, SaaS, local businesses, consulting, and more. The action steps are universal, while higher tiers provide guidance customized to your specific business model.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-6" className="border-white/10">
                    <AccordionTrigger className="text-xl font-semibold text-white hover:text-blue-400 text-left">
                      6. Do I need technical skills or coding knowledge?
                    </AccordionTrigger>
                    <AccordionContent className="text-neutral-300 text-base">
                      No. We focus on no-code and low-code tools like v0.dev, Lovable.dev, and Google Workspace. The program teaches you how to use these tools step-by-step, even if you&apos;re a complete beginner.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-7" className="border-white/10">
                    <AccordionTrigger className="text-xl font-semibold text-white hover:text-blue-400 text-left">
                      7. What&apos;s the difference between one-time and monthly payments?
                    </AccordionTrigger>
                    <AccordionContent className="text-neutral-300 text-base">
                      One-time payments give you immediate access to all templates and resources upfront. Monthly payments provide the same content but templates unlock as you progress through the days (drip-fed). Both options include the full 120-day program.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-8" className="border-white/10">
                    <AccordionTrigger className="text-xl font-semibold text-white hover:text-blue-400 text-left">
                      8. What happens after Day 120?
                    </AccordionTrigger>
                    <AccordionContent className="text-neutral-300 text-base">
                      After completing the 120-day Launch Phase, you can continue with our Growth Phase (Days 121-240) and Scale Phase (Days 241-365) programs. These focus on advanced tactics, team building, and sustainable scaling as you grow your business.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-9" className="border-white/10">
                    <AccordionTrigger className="text-xl font-semibold text-white hover:text-blue-400 text-left">
                      9. Can I upgrade my tier later?
                    </AccordionTrigger>
                    <AccordionContent className="text-neutral-300 text-base">
                      Yes! You can upgrade to a higher tier at the start of any new month. Simply pay the difference and you&apos;ll immediately get access to the enhanced content and support for that tier.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-10" className="border-white/10">
                    <AccordionTrigger className="text-xl font-semibold text-white hover:text-blue-400 text-left">
                      10. Is there a refund policy?
                    </AccordionTrigger>
                    <AccordionContent className="text-neutral-300 text-base">
                      We offer a 7-day money-back guarantee. If you&apos;re not satisfied with the program within the first 7 days, contact us for a full refund. After 7 days, all sales are final as you have access to the complete 120-day roadmap.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-11" className="border-white/10">
                    <AccordionTrigger className="text-xl font-semibold text-white hover:text-blue-400 text-left">
                      11. Do you provide one-on-one coaching or calls?
                    </AccordionTrigger>
                    <AccordionContent className="text-neutral-300 text-base">
                      The program is entirely automated and self-paced — no live calls required. Platinum tier includes weekly AI-powered personalized check-ins via email where you can ask questions and receive tailored guidance, but all support is asynchronous.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-12" className="border-white/10">
                    <AccordionTrigger className="text-xl font-semibold text-white hover:text-blue-400 text-left">
                      12. What tools and software do I need?
                    </AccordionTrigger>
                    <AccordionContent className="text-neutral-300 text-base">
                      Most tools we recommend are free or have free tiers: Google Workspace (free), v0.dev (free tier), Lovable.dev, Canva (free), and basic project management tools. Higher tiers may recommend paid tools, but free alternatives are always provided.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-13" className="border-white/10">
                    <AccordionTrigger className="text-xl font-semibold text-white hover:text-blue-400 text-left">
                      13. How much time do I need to commit each day?
                    </AccordionTrigger>
                    <AccordionContent className="text-neutral-300 text-base">
                      Plan for 1-3 hours per day Monday-Friday for action tasks. Weekends require 30-60 minutes for reading and planning. The workload is designed to be manageable alongside a full-time job, especially in the early weeks.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-14" className="border-white/10">
                    <AccordionTrigger className="text-xl font-semibold text-white hover:text-blue-400 text-left">
                      14. How do I get started?
                    </AccordionTrigger>
                    <AccordionContent className="text-neutral-300 text-base">
                      Simply{" "}
                      <a href="/pricing" className="text-blue-400 underline">
                        choose your tier
                      </a>
                      , complete your purchase, and you&apos;ll receive immediate access to your Day 1 materials and the complete roadmap. Start building your business tomorrow!
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-15" className="border-white/10 border-b-0">
                    <AccordionTrigger className="text-xl font-semibold text-white hover:text-blue-400 text-left">
                      15. Still have questions?
                    </AccordionTrigger>
                    <AccordionContent className="text-neutral-300 text-base">
                      <a href="/contact" className="text-blue-400 underline">
                        Contact us
                      </a>{" "}
                      and we&apos;ll get back to you within 24 hours with answers to any questions not covered here.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </section>
      <AppverseFooter />
    </>
  )
}
