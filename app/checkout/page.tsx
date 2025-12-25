import { SiteHeader } from "@/components/site-header"
import { CheckoutRequestForm } from "@/components/checkout-request-form"
import { AppverseFooter } from "@/components/appverse-footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Request Purchase | YourExitPlans",
  description: "Express your interest and we'll get back to you shortly.",
}

export default function CheckoutPage() {
  return (
    <main className="min-h-[100dvh] text-white">
      <SiteHeader />

      <section className="container mx-auto px-4 py-16 sm:py-24">
        <CheckoutRequestForm />
      </section>

      <AppverseFooter />
    </main>
  )
}
