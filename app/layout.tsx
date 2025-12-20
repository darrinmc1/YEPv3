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
import { ErrorBoundary } from "@/components/error-boundary"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"], display: "swap" })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export const metadata: Metadata = {
  title: "YourExitPlans | AI-Powered Business Opportunities & Market Intelligence",
  description:
    "Transform market signals into validated, actionable business ideas with AI-powered analysis. Get deep market research and step-by-step implementation guides to build your freedom.",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
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
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} strategy="lazyOnload" key="gtag-src" />
            <Script id="gtag-init" strategy="lazyOnload" key="gtag-init">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body>
        <ErrorBoundary>
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

          {/* Toast notifications */}
          <Toaster position="top-right" richColors closeButton />
        </ErrorBoundary>
      </body>
    </html>
  )
}
