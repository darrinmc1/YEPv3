"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  CheckCircle2,
  Loader2,
  Crown,
  Star,
  ArrowRight
} from "lucide-react"

export function WaitlistForm() {
  const searchParams = useSearchParams()
  const initialTier = searchParams.get("tier") || "gold"

  const [selectedTier, setSelectedTier] = useState(initialTier)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [currentBusiness, setCurrentBusiness] = useState("")
  const [biggestChallenge, setBiggestChallenge] = useState("")
  const [priceWilling, setPriceWilling] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // TODO: Connect to your email service or database
      // await fetch("/api/waitlist", {
      //   method: "POST",
      //   body: JSON.stringify({
      //     tier: selectedTier,
      //     email,
      //     name,
      //     currentBusiness,
      //     biggestChallenge,
      //     priceWilling
      //   })
      // })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setIsSubmitted(true)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Success State
  if (isSubmitted) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="liquid-glass border border-white/20 rounded-2xl p-8 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-400/10 mb-6">
            <CheckCircle2 className="h-8 w-8 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">You&apos;re on the List!</h3>
          <p className="text-neutral-400 mb-6">
            We&apos;ll email you at <span className="text-white">{email}</span> as soon as {selectedTier === "platinum" ? "Platinum" : "Gold"} launches.
          </p>
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-400/20">
            <p className="text-sm text-neutral-300">
              <span className="text-blue-400 font-semibold">What&apos;s next?</span> Check your inbox for a confirmation.
              In the meantime, explore our free ideas or grab a Starter plan to get building now.
            </p>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-blue-500 hover:bg-blue-400 text-white">
              <Link href="/explore-ideas">Explore Free Ideas</Link>
            </Button>
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Link href="/#pricing">View Current Plans</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Tier Selection */}
        <div className="liquid-glass border border-white/20 rounded-2xl p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-white mb-4">How fast do you want to get rich?</h3>

          <RadioGroup value={selectedTier} onValueChange={setSelectedTier} className="grid md:grid-cols-2 gap-4">
            {/* Gold Option */}
            <div className={`relative rounded-xl border p-4 cursor-pointer transition-all ${selectedTier === "gold"
              ? "border-amber-400/50 bg-amber-400/10"
              : "border-white/10 hover:border-white/20"
              }`}>
              <RadioGroupItem value="gold" id="gold" className="sr-only" />
              <label htmlFor="gold" className="cursor-pointer block">
                <div className="flex items-center gap-3 mb-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-amber-400/20">
                    <Crown className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Gold</div>
                    <div className="text-xs text-neutral-400">I want to build a real business</div>
                  </div>
                </div>
                <ul className="space-y-1 text-sm text-neutral-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-amber-400" />
                    52-week implementation guide
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-amber-400" />
                    Tech stack recommendations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-amber-400" />
                    Financial projections
                  </li>
                </ul>
              </label>
            </div>

            {/* Platinum Option */}
            <div className={`relative rounded-xl border p-4 cursor-pointer transition-all ${selectedTier === "platinum"
              ? "border-purple-400/50 bg-purple-400/10"
              : "border-white/10 hover:border-white/20"
              }`}>
              <RadioGroupItem value="platinum" id="platinum" className="sr-only" />
              <label htmlFor="platinum" className="cursor-pointer block">
                <div className="flex items-center gap-3 mb-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-purple-400/20">
                    <Star className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Platinum</div>
                    <div className="text-xs text-neutral-400">I want you to hold my hand (and maybe help build it with me)</div>
                  </div>
                </div>
                <ul className="space-y-1 text-sm text-neutral-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-purple-400" />
                    Exclusive idea rights
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-purple-400" />
                    Weekly strategy calls
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-purple-400" />
                    Investor introductions
                  </li>
                </ul>
              </label>
            </div>
          </RadioGroup>
        </div>

        {/* Contact Info */}
        <div className="liquid-glass border border-white/20 rounded-2xl p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Your Details</h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-neutral-300">Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-black/40 border-white/20 text-white placeholder:text-neutral-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-neutral-300">
                Email <span className="text-red-400">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-black/40 border-white/20 text-white placeholder:text-neutral-500"
              />
            </div>
          </div>
        </div>

        {/* Survey Questions */}
        <div className="liquid-glass border border-white/20 rounded-2xl p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Help Us Build What You Need</h3>

          <div className="space-y-2">
            <Label htmlFor="business" className="text-neutral-300">
              What&apos;s your current business or job? <span className="text-neutral-500">(optional)</span>
            </Label>
            <Input
              id="business"
              placeholder="e.g., Marketing manager, Freelance developer, Student..."
              value={currentBusiness}
              onChange={(e) => setCurrentBusiness(e.target.value)}
              className="bg-black/40 border-white/20 text-white placeholder:text-neutral-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="challenge" className="text-neutral-300">
              What&apos;s stopping you? Be honest. <span className="text-neutral-500">(optional)</span>
            </Label>
            <Textarea
              id="challenge"
              placeholder="e.g., Finding the right idea, not enough time, don't know where to start..."
              value={biggestChallenge}
              onChange={(e) => setBiggestChallenge(e.target.value)}
              className="bg-black/40 border-white/20 text-white placeholder:text-neutral-500 min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-neutral-300">
              How much is your financial freedom worth? <span className="text-neutral-500">(optional)</span>
            </Label>
            <RadioGroup value={priceWilling} onValueChange={setPriceWilling} className="flex flex-wrap gap-3">
              {selectedTier === "gold" ? (
                <>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="99" id="p99" className="border-white/30" />
                    <Label htmlFor="p99" className="text-neutral-300 cursor-pointer">$99/mo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="149" id="p149" className="border-white/30" />
                    <Label htmlFor="p149" className="text-neutral-300 cursor-pointer">$149/mo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="199" id="p199" className="border-white/30" />
                    <Label htmlFor="p199" className="text-neutral-300 cursor-pointer">$199/mo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="249" id="p249" className="border-white/30" />
                    <Label htmlFor="p249" className="text-neutral-300 cursor-pointer">$249/mo</Label>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="499" id="p499" className="border-white/30" />
                    <Label htmlFor="p499" className="text-neutral-300 cursor-pointer">$499/mo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="749" id="p749" className="border-white/30" />
                    <Label htmlFor="p749" className="text-neutral-300 cursor-pointer">$749/mo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="999" id="p999" className="border-white/30" />
                    <Label htmlFor="p999" className="text-neutral-300 cursor-pointer">$999/mo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="more" id="pmore" className="border-white/30" />
                    <Label htmlFor="pmore" className="text-neutral-300 cursor-pointer">More</Label>
                  </div>
                </>
              )}
            </RadioGroup>
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={!email || isSubmitting}
          className={`w-full rounded-full py-6 text-lg font-semibold transition-all ${selectedTier === "platinum"
            ? "bg-purple-500 hover:bg-purple-400"
            : "bg-amber-500 hover:bg-amber-400"
            } text-white disabled:opacity-50`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Joining Waitlist...
            </>
          ) : (
            <>
              Join {selectedTier === "platinum" ? "Platinum" : "Gold"} Waitlist
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>

        <p className="text-center text-xs text-neutral-500">
          We&apos;ll only email you about {selectedTier === "platinum" ? "Platinum" : "Gold"} updates. No spam.
        </p>
      </form>
    </div>
  )
}
