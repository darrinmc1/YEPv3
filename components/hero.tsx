"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bird,
  Crown,
  Flag,
  CircleDollarSign,
  Rocket,
  Clock,
  Briefcase,
  Flame,
  Lightbulb,
  Anchor,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const rotatingWords = [
  { text: "Freedom", icon: Bird, color: "text-emerald-400" },
  { text: "Boss", icon: Crown, color: "text-amber-400" },
  { text: "Wealth", icon: CircleDollarSign, color: "text-green-400" },
  { text: "Success", icon: Rocket, color: "text-blue-400" },
  { text: "Independence", icon: Flag, color: "text-purple-400" },
]

const rotatingPhrases = [
  { text: "Burnout", icon: Flame },
  { text: "Dead-End Job", icon: Anchor },
  { text: "Paycheck to Paycheck", icon: Clock },
  { text: "Corporate Grind", icon: Briefcase },
  { text: "Just an Idea", icon: Lightbulb },
]

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
        <div className="flex flex-col items-center justify-center py-20 sm:py-32">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-5 py-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-blue-400"></div>
            <p className="text-xs uppercase tracking-[0.2em] text-blue-400 font-medium">AI-Powered Market Intelligence</p>
          </div>

          {/* Main Headline */}
          <h1 className="max-w-5xl text-center px-4">
            <div className="flex flex-col items-center justify-center gap-6">
              {/* First line: from [problem] */}
              <div className="flex items-baseline justify-center gap-4 w-full text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
                <span className="text-neutral-500">from</span>
                <div className="relative inline-block" style={{ minWidth: '300px' }}>
                  <span className="invisible">&nbsp;</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={phraseIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute left-0 top-0 text-red-500 whitespace-nowrap inline-flex items-center gap-3"
                    >
                      <span>{currentPhraseData.text}</span>
                      <CurrentPhraseIcon className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14" />
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>

              {/* Second line: to [goal] */}
              <div className="flex items-baseline justify-center gap-4 w-full text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
                <span className="text-white">to</span>
                <div className="relative inline-block" style={{ minWidth: '300px' }}>
                  <span className="invisible">&nbsp;</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={wordIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`absolute left-0 top-0 whitespace-nowrap inline-flex items-center gap-3 ${currentWordData.color}`}
                    >
                      <span>{currentWordData.text}</span>
                      <CurrentWordIcon className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14" />
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </h1>

          {/* Subheadline */}
          <p className="mt-8 max-w-3xl text-center text-base sm:text-lg md:text-xl text-neutral-300 px-4 leading-relaxed">
            Validated business ideas with market research, competitor analysis, and step-by-step launch guides. Stop researching. Start building.
          </p>

          {/* CTA Button */}
          <div className="mt-12 flex flex-col items-center gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-blue-500 px-12 py-8 text-xl font-bold text-white hover:bg-blue-400 hover:scale-105 transition-all shadow-[0_0_30px_rgba(59,130,246,0.4)]"
            >
              <a href="#choose-your-path">Start for Free</a>
            </Button>
            <p className="text-sm text-neutral-400 font-medium">
              First two are free • No credit card required
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
