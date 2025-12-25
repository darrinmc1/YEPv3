import type React from "react"
import "./globals.css"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import Plasma from "@/components/plasma"
import { Suspense } from "react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import { ScrollProgress } from "@/components/scroll-progress"
import { validateEnv } from "@/lib/env"

// Validate environment variables on server startup
if (typeof window === 'undefined') {
  validateEnv()
}

const inter = Inter({ subsets: ["latin"], display: "swap" })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export const metadata: Metadata = {
  title: "YourExitPlans | Free AI Business Validation - Start Risk-Free",
  description:
    "Start FREE. Explore business ideas or validate your own—no credit card required. Get your opportunity score, then unlock your personalized 120-day roadmap.",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: "YourExitPlans | AI-Powered Business Ideas & Exit Plans",
    description: "Start FREE. Explore business ideas or validate your own—no credit card required.",
    url: "https://yourexitplans.com",
    siteName: "YourExitPlans",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "YourExitPlans - AI Business Validation"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YourExitPlans | AI-Powered Business Ideas",
    description: "Start FREE. Explore business ideas or validate your own.",
    images: ["/og-image.png"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-4YSQPT6D0J" strategy="lazyOnload" key="gtag-src" />
        <Script id="gtag-init" strategy="lazyOnload" key="gtag-init">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4YSQPT6D0J');
          `}
        </Script>
      </head>
      <body>
        <ScrollProgress />
        <Suspense fallback={null}>
          <div className="fixed inset-0 z-0 bg-black">
            <Plasma color="#001d3d" speed={0.7} scale={1.8} opacity={0.8} mouseInteractive={false} />
          </div>
          <div className="relative z-10">{children}</div>
        </Suspense>

        {/* Vercel Speed Insights and Analytics components */}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
