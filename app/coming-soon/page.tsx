import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Coming Soon | YourExitPlans",
  description: "This feature is coming soon. We're working hard to make it available.",
  robots: { index: false, follow: false },
}

export default function ComingSoonPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center space-y-8">

        {/* Icon */}
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-400/10 border border-blue-400/20">
            <svg
              className="h-10 w-10 text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Something good is{" "}
            <span className="text-blue-400">coming soon</span>
          </h1>
          <p className="text-neutral-400 text-lg leading-relaxed">
            We&apos;re still setting this up — payments, bank accounts, the whole nine yards.
            Check back shortly. In the meantime, the free tools are fully live and ready for you.
          </p>
        </div>

        {/* What you CAN do right now */}
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
    </main>
  )
}
