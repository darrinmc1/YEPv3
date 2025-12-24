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
  type LucideProps,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Stat } from "./animated-stat"

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
            <div className="flex flex-col items-center justify-center gap-2">
              {/* First line: from [problem] */}
              <div className="flex items-center justify-center gap-4 w-full text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
                <span className="text-neutral-500 text-right w-[40%] sm:w-[35%] md:w-[30%]">from</span>
                <div className="relative flex-1 max-w-[500px] h-[1.3em] text-left">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={phraseIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 flex items-center justify-start text-red-500"
                    >
                      <span className="whitespace-nowrap">{currentPhraseData.text}</span>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Second line: to [goal] */}
              <div className="flex items-center justify-center gap-4 w-full text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
                <span className="text-white text-right w-[40%] sm:w-[35%] md:w-[30%]">to</span>
                <div className="relative flex-1 max-w-[500px] h-[1.3em] text-left">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={wordIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className={`absolute inset-0 flex items-center justify-start ${currentWordData.color}`}
                    >
                      <span className="whitespace-nowrap">{currentWordData.text}</span>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </h1>

          {/* Subheadline */}
          <p className="mt-8 max-w-3xl text-center text-base sm:text-lg md:text-xl text-neutral-300 px-4 leading-relaxed">
            Stop procrastinating. Discover validated business ideas with market research, step-by-step guides, and AI insights — stop researching and start building.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
              <Button
                asChild
                size="lg"
                className="rounded-lg bg-blue-500 px-10 py-7 text-lg font-semibold text-white hover:bg-blue-400 transition-all shadow-lg hover:shadow-xl"
              >
                <a href="#choose-your-path" className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  <span>Choose Your Path</span>
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-lg border-2 border-white/20 bg-white/5 backdrop-blur-sm px-10 py-7 text-lg font-semibold text-white hover:bg-white/10 hover:border-white/30 transition-all"
              >
                <a href="#features" className="flex items-center gap-2">
                  <Rocket className="h-5 w-5" />
                  <span>See How It Works</span>
                </a>
              </Button>
            </div>

            {/* FREE badge */}
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-green-400/30 bg-green-400/10 px-6 py-2">
              <Zap className="h-4 w-4 text-green-400" />
              <span className="text-sm font-bold text-green-400 uppercase tracking-wider">All Routes Start FREE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
