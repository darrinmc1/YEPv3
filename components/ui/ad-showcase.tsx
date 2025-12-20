"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export function AdShowcase() {
  return (
    <section id="showcase" className="container mx-auto px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-8 text-center text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          See Our Work in Action
        </h2>
        <p className="mb-12 text-center text-lg text-white/80">
          From concept to execution, we bring your vision to life with stunning 3D animation
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="liquid-glass border border-white/20">
            <CardContent className="p-4">
              <div className="relative aspect-video overflow-hidden rounded-lg border border-white/10">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="3D Product Animation Showcase"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">Product Launch</h3>
              <p className="mt-2 text-sm text-white/70">
                Dynamic 3D animation for tech product reveal
              </p>
            </CardContent>
          </Card>

          <Card className="liquid-glass border border-white/20">
            <CardContent className="p-4">
              <div className="relative aspect-video overflow-hidden rounded-lg border border-white/10">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Brand Advertisement Animation"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">Brand Campaign</h3>
              <p className="mt-2 text-sm text-white/70">
                Eye-catching visuals for social media marketing
              </p>
            </CardContent>
          </Card>

          <Card className="liquid-glass border border-white/20">
            <CardContent className="p-4">
              <div className="relative aspect-video overflow-hidden rounded-lg border border-white/10">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Explainer Video Animation"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">Explainer Video</h3>
              <p className="mt-2 text-sm text-white/70">
                Clear, engaging 3D visualization of complex concepts
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
