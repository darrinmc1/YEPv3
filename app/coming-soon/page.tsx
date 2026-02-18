"use client"

import { useState } from "react"
import Link from "next/link"

const INTERESTS = [
  { value: "validate-my-idea",    label: "💡 I have an idea I want to validate" },
  { value: "explore-ideas",       label: "🔍 I want to browse pre-researched ideas" },
  { value: "implementation-plan", label: "🗺️ I want a step-by-step launch roadmap" },
  { value: "just-browsing",       label: "👀 Just checking things out for now" },
]

type FormState = "idle" | "loading" | "success" | "error"

export default function ComingSoonPage() {
  const [email, setEmail]       = useState("")
  const [interest, setInterest] = useState("")
  const [formState, setFormState] = useState<FormState>("idle")
  const [message, setMessage]   = useState("")
  const [fieldError, setFieldError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFieldError("")

    if (!email) { setFieldError("Pop your email in — we promise not to spam you."); return }
    if (!interest) { setFieldError("Let us know what you're after so we can tailor the heads-up."); return }

    setFormState("loading")

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, interest }),
      })

      const data = await res.json()

      if (data.success) {
        setFormState("success")
        setMessage(data.message)
      } else {
        setFormState("error")
        setMessage(data.message || "Something went wrong. Give it another go.")
      }
    } catch {
      setFormState("error")
      setMessage("Couldn't reach the server. Check your connection and try again.")
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6 py-16">
      <div className="max-w-lg w-full space-y-10">

        {/* Icon */}
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-400/10 border border-blue-400/20">
            <svg className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Something good is{" "}
            <span className="text-blue-400">coming soon</span>
          </h1>
          <p className="text-neutral-400 text-lg leading-relaxed">
            We&apos;re still wiring up payments — bank accounts, the whole nine yards.
            Drop your email and we&apos;ll let you know the moment it&apos;s live.
          </p>
        </div>

        {/* --- WAITLIST FORM --- */}
        {formState === "success" ? (
          /* Success state */
          <div className="rounded-2xl border border-green-400/20 bg-green-400/5 p-8 text-center space-y-4">
            <div className="flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-400/10">
                <svg className="h-7 w-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
            </div>
            <p className="font-semibold text-white text-lg">{message}</p>
            <p className="text-neutral-400 text-sm">
              Keep an eye on your inbox — we&apos;ll be in touch.
            </p>
          </div>
        ) : (
          /* Form */
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-white/10 bg-white/5 p-7 space-y-5"
            noValidate
          >
            <div className="space-y-1.5">
              <label htmlFor="waitlist-email" className="block text-sm font-medium text-neutral-300">
                Your email
              </label>
              <input
                id="waitlist-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={formState === "loading"}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-600
                           focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50
                           disabled:opacity-50 transition-colors text-sm"
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-neutral-300">What are you most interested in?</p>
              <div className="grid gap-2">
                {INTERESTS.map(opt => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-all text-sm
                      ${interest === opt.value
                        ? "border-blue-400/50 bg-blue-400/10 text-white"
                        : "border-white/10 bg-white/[0.03] text-neutral-400 hover:border-white/20 hover:text-white"
                      }
                      ${formState === "loading" ? "pointer-events-none opacity-50" : ""}
                    `}
                  >
                    <input
                      type="radio"
                      name="interest"
                      value={opt.value}
                      checked={interest === opt.value}
                      onChange={() => setInterest(opt.value)}
                      className="sr-only"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Field error */}
            {fieldError && (
              <p className="text-sm text-amber-400">{fieldError}</p>
            )}

            {/* API error */}
            {formState === "error" && (
              <p className="text-sm text-red-400">{message}</p>
            )}

            <button
              type="submit"
              disabled={formState === "loading"}
              className="w-full rounded-xl bg-blue-500 px-6 py-3.5 text-sm font-semibold text-white
                         hover:bg-blue-400 active:scale-[0.98] transition-all
                         disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {formState === "loading" ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Adding you to the list…
                </>
              ) : (
                "Let me know when it's ready"
              )}
            </button>

            <p className="text-center text-xs text-neutral-600">
              Just your email. No spam, no selling your info, no nonsense.
            </p>
          </form>
        )}

        {/* --- FREE TOOLS SECTION --- */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
            Ready right now ↓
          </p>
          <div className="space-y-3">
            <Link
              href="/validate-idea"
              className="flex items-center gap-3 rounded-xl border border-blue-400/20 bg-blue-400/10 p-4 hover:bg-blue-400/20 transition-colors group"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-400/20">
                <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m1.636-6.364l.707.707M12 20v1M5.636 5.636l.707.707m10.021 10.021l.707.707" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                  Validate Your Idea — Free
                </p>
                <p className="text-sm text-neutral-400">Get an AI opportunity score in under 60 seconds</p>
              </div>
            </Link>

            <Link
              href="/explore-ideas"
              className="flex items-center gap-3 rounded-xl border border-purple-400/20 bg-purple-400/10 p-4 hover:bg-purple-400/20 transition-colors group"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-400/20">
                <svg className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                  Explore 1000+ Business Ideas
                </p>
                <p className="text-sm text-neutral-400">Browse pre-researched, AI-scored opportunities</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Back home */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to home
          </Link>
        </div>

      </div>
    </main>
  )
}
