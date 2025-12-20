"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function AdShowcase() {
  const [activeAd, setActiveAd] = useState(0)

  const ads = [
    {
      title: "Skip the Research Grind",
      image: "/add_images/Skip_the_Research_Grind__version_1.png",
      alt: "Skip the research grind - AI-validated business opportunities",
    },
    {
      title: "Start Launching",
      image: "/add_images/Start_Launching__version_1.png",
      alt: "Start launching your business with validated ideas",
    },
    {
      title: "Stop Researching",
      image: "/add_images/Stop_Researching__version_1.png",
      alt: "Stop researching, start building with proven opportunities",
    },
    {
      title: "You Don't Need More Data",
      image: "/add_images/You_Don't_Need_More_Data__version_1.png",
      alt: "You don't need more data, you need validated opportunities",
    },
  ]

  return (
    <section className="container mx-auto px-4 py-16 sm:py-24">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl mb-4">
          Real Opportunities. <span className="text-blue-400">Real Results.</span>
        </h2>
        <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
          Every week, we deliver validated business ideas with complete market analysis and implementation roadmaps
        </p>
      </div>

      {/* Main Featured Ad */}
      <div className="mb-8 rounded-3xl overflow-hidden border border-white/20 bg-black/40 backdrop-blur-sm">
        <div className="relative aspect-[16/9] md:aspect-[21/9]">
          <Image
            src={ads[activeAd].image}
            alt={ads[activeAd].alt}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
          />
        </div>
      </div>

      {/* Thumbnail Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {ads.map((ad, index) => (
          <button
            key={index}
            onClick={() => setActiveAd(index)}
            className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all duration-300 ${
              activeAd === index
                ? "border-blue-400 ring-2 ring-blue-400/50 scale-105"
                : "border-white/20 hover:border-blue-400/50 hover:scale-102"
            }`}
          >
            <Image
              src={ad.image}
              alt={ad.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            {activeAd === index && (
              <div className="absolute inset-0 bg-blue-400/10 flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-blue-400 animate-pulse"></div>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center">
        <Button
          asChild
          className="rounded-full bg-blue-500 px-8 py-6 text-base font-semibold text-black hover:bg-blue-400 hover:scale-105 transition-all shadow-[0_0_25px_rgba(198,255,58,0.3)]"
        >
          <a href="#pricing">See All Opportunities</a>
        </Button>
        <p className="mt-4 text-sm text-neutral-400">
          Join hundreds of aspiring entrepreneurs discovering their next big opportunity
        </p>
      </div>
    </section>
  )
}
