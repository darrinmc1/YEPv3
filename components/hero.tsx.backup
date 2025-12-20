"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bird,
  Trophy,
  Flag,
  CircleDollarSign,
  TrendingUp,
  Clock,
  Briefcase,
  Flame,
  Rocket,
  Cog,
  type LucideProps,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Stat } from "./animated-stat"

const rotatingWords = [
  { text: "Freedom", icon: Bird, color: "text-orange-400" },
  { text: "Success", icon: Trophy, color: "text-green-400" },
  { text: "Balance", icon: Flag, color: "text-purple-400" },
  { text: "Wealth", icon: CircleDollarSign, color: "text-yellow-400" },
  { text: "Growth", icon: TrendingUp, color: "text-teal-400" },
]

const rotatingPhrases = [
  { text: "the 9-5", icon: Clock },
  { text: "your job", icon: Briefcase },
  { text: "burnout", icon: Flame },
  { text: "the grind", icon: Cog },
  { text: "side hustle", icon: Rocket },
]

const IconWrapper = ({ icon: Icon, ...props }: { icon: React.ComponentType<LucideProps> } & LucideProps) => (
  <Icon className="inline-block h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16" {...props} />
)

export function Hero() {
  const [wordIndex, setWordIndex] = useState(0)
  const [phraseIndex, setPhraseIndex] = useState(0)

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setWordIndex(prevIndex => (prevIndex + 1) % rotatingWords.length)
    }, 2500)

    const phraseInterval = setInterval(() => {
      setPhraseIndex(prevIndex => (prevIndex + 1) % rotatingPhrases.length)
    }, 2500)

    return () => {
      clearInterval(wordInterval)
      clearInterval(phraseInterval)
    }
  }, [])

  const currentWordData = rotatingWords[wordIndex]
  const currentPhraseData = rotatingPhrases[phraseIndex]
  const CurrentWordIcon = currentWordData.icon
  const CurrentPhraseIcon = currentPhraseData.icon

  return (
    <section className="relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center justify-center py-14 sm:py-20">
          {/* Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-blue-400"></div>
            <p className="text-xs uppercase tracking-[0.2em] text-blue-400">AI-Powered Market Intelligence</p>
          </div>

          {/* Main Headline */}
          <h1 className="mt-3 max-w-5xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <div className="flex flex-col items-center justify-center gap-4">
              <span className="block text-blue-400 text-center w-full">YourExitPlans</span>
              {/* Grid container for stable alignment */}
              <div className="grid grid-cols-[1fr,auto,1fr] items-center justify-center w-full max-w-2xl mx-auto">
                <span className="text-right text-white">from</span>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={phraseIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="col-start-2 inline-flex items-center gap-3 px-4 text-cyan-400"
                  >
                    {currentPhraseData.text} <IconWrapper icon={CurrentPhraseIcon} />
                  </motion.div>
                </AnimatePresence>
                <div /> {/* Empty div to balance the grid */}
              </div>
              <div className="grid grid-cols-[1fr,auto,1fr] items-center justify-center w-full max-w-2xl mx-auto">
                <span className="text-right text-white">to</span>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={wordIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className={`col-start-2 inline-flex items-center gap-3 px-4 ${currentWordData.color}`}
                  >
                    {currentWordData.text} <IconWrapper icon={CurrentWordIcon} />
                  </motion.div>
                </AnimatePresence>
                <div /> {/* Empty div to balance the grid */}
              </div>
            </div>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 max-w-2xl text-center text-lg text-neutral-300 sm:text-xl">
            Stop procrastinating. Get validated business opportunities with deep market analysis,
            step-by-step guides, and AI-powered insights.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button
              asChild
              className="rounded-full bg-blue-500 px-8 py-6 text-base font-semibold text-black hover:bg-blue-400 hover:scale-105 transition-all shadow-[0_0_25px_rgba(198,255,58,0.3)]"
            >
              <a href="#choose-your-path">Get Started Free</a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-2 border-blue-400/50 bg-transparent px-8 py-6 text-base font-semibold text-white hover:bg-blue-400/10 hover:border-blue-400"
            >
              <a href="#features">See How It Works</a>
            </Button>
          </div>

          {/* Trust Signals */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-neutral-400">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>200+ Ideas in database</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>AI-Validated Opportunities</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Step-by-Step Guides</span>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-16 grid w-full max-w-4xl grid-cols-2 gap-6 sm:grid-cols-4">
            <Stat value={50} suffix="+" label="Data Sources" />
            <Stat value="Daily" label="New Ideas" />
            <Stat value="100+" suffix="hrs" label="Analysis Time" />
            <Stat prefix="$" value={0} label="To Start" />
          </div>
        </div>
      </div>
    </section>
  )
}
