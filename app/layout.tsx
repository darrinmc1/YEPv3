import type React from "react"
import "./globals.css"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import { Suspense } from "react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import { ScrollProgress } from "@/components/scroll-progress"
import Plasma from "@/components/plasma"



// import { validateEnv } from "@/lib/env"

// Validate environment variables on server startup
// if (typeof window === 'undefined') {
//   validateEnv()
// }

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
        {/* Google Tag Manager - DISABLED: Replace GTM-XXXXXXX with your actual GTM ID */}
        {/* <Script id="gtm-script" strategy="lazyOnload" key="gtm-script">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-XXXXXXX');`}
        </Script> */}

        {/* Google Analytics - Replace with your GA ID */}
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
