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
  Database,
  Sparkles,
  BookOpen,
  type LucideProps,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Stat } from "./animated-stat"

const rotatingWords = [
  { text: "Freedom", icon: Bird, color: "text-orange-400", emoji: "🐦" },
  { text: "Owner", icon: Crown, color: "text-green-400", emoji: "👑" },
  { text: "Balance", icon: Flag, color: "text-purple-400", emoji: "⚖️" },
  { text: "Income", icon: CircleDollarSign, color: "text-yellow-400", emoji: "💰" },
  { text: "Started", icon: Rocket, color: "text-teal-400", emoji: "🚀" },
]

const rotatingPhrases = [
  { text: "the 9-5", icon: Clock, emoji: "⏰" },
  { text: "Employee", icon: Briefcase, emoji: "💼" },
  { text: "Burnout", icon: Flame, emoji: "🔥" },
  { text: "Idea", icon: Lightbulb, emoji: "💡" },
  { text: "Stuck", icon: Anchor, emoji: "⚓" },
]

const IconWrapper = ({ icon: Icon, emoji, color, ...props }: { icon: React.ComponentType<LucideProps>, emoji?: string, color?: string } & LucideProps) => {
  const [useEmoji, setUseEmoji] = useState(true)
  const [emojiLoaded, setEmojiLoaded] = useState(false)

  useEffect(() => {
    // Test if emoji rendering is supported
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillText('🏆', 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const hasEmoji = imageData.data.some(channel => channel !== 0)
      setEmojiLoaded(hasEmoji)
      setUseEmoji(hasEmoji && !!emoji)
    } else {
      setUseEmoji(false)
    }
  }, [emoji])

  if (useEmoji && emoji && emojiLoaded) {
    return (
      <span
        className="inline-flex items-center justify-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-none shrink-0 min-w-[1.2em]"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
      >
        {emoji}
      </span>
    )
  }

  return <Icon className={`inline-flex items-center justify-center shrink-0 h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 ${color || ''}`} {...props} />
}

const ROTATION_INTERVAL_MS = 2500

export function Hero() {
  const [wordIndex, setWordIndex] = useState(0)
  const [phraseIndex, setPhraseIndex] = useState(0)

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setWordIndex(prevIndex => (prevIndex + 1) % rotatingWords.length)
    }, ROTATION_INTERVAL_MS)

    const phraseInterval = setInterval(() => {
      setPhraseIndex(prevIndex => (prevIndex + 1) % rotatingPhrases.length)
    }, ROTATION_INTERVAL_MS)

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
          <h1 className="mt-3 max-w-5xl text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl px-4">
            <div className="flex flex-col items-center justify-center gap-2">
              <span className="block text-blue-400 text-center w-full mb-1">YourExitPlans</span>
              {/* From line */}
              <div className="flex items-center justify-center gap-2 w-full">
                <span className="text-white shrink-0 whitespace-nowrap">from</span>
                <div className="relative inline-flex min-w-[160px] sm:min-w-[200px] md:min-w-[260px] lg:min-w-[320px] justify-center min-h-[2em]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={phraseIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 flex items-center justify-center gap-2 text-cyan-400 whitespace-nowrap"
                    >
                      <span className="shrink-0">{currentPhraseData.text}</span>
                      <IconWrapper icon={CurrentPhraseIcon} emoji={currentPhraseData.emoji} color="text-cyan-400" />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
              {/* To line */}
              <div className="flex items-center justify-center gap-2 w-full">
                <span className="text-white shrink-0 whitespace-nowrap">to</span>
                <div className="relative inline-flex min-w-[160px] sm:min-w-[200px] md:min-w-[260px] lg:min-w-[320px] justify-center min-h-[2em]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={wordIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className={`absolute inset-0 flex items-center justify-center gap-2 ${currentWordData.color} whitespace-nowrap`}
                    >
                      <span className="shrink-0">{currentWordData.text}</span>
                      <IconWrapper icon={CurrentWordIcon} emoji={currentWordData.emoji} color={currentWordData.color} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 max-w-2xl text-center text-lg text-neutral-300 sm:text-xl">
            Stop procrastinating. Discover validated business ideas with market research, step-by-step guides, and AI insights — stop researching and start building.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button
              asChild
              className="rounded-full bg-blue-500 px-8 py-6 text-base font-semibold text-black hover:bg-blue-400 hover:scale-105 transition-all shadow-[0_0_25px_rgba(198,255,58,0.3)]"
            >
              <Link href="/validate-idea">Validate Your Idea Free</Link>
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
              <Database className="h-5 w-5 text-blue-400" />
              <span>2000+ Ideas in database</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-400" />
              <span>AI-Validated Opportunities</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-400" />
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
