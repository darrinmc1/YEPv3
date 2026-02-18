import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Implementation Plan | YourExitPlans",
  description: "The premium 120-day business launch roadmap. Coming soon.",
}

export default function ImplementationPage() {
  return (
    <main className="bg-[#0a0a0a] text-white min-h-screen py-24 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-16" style={{ fontFamily: "'Playfair Display', serif" }}>
          The <span className="text-[#d4af37]">Business-in-a-Box</span>
        </h1>
        <div className="p-12 rounded-3xl bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border-2 border-[#d4af37]">
          <h2 className="text-4xl font-bold mb-4">The Premium 120-Day Roadmap</h2>
          <p className="text-gray-400 mb-8 text-lg">Includes all T1-T10 templates, AI prompts, and launch checklists.</p>
          <div className="text-5xl font-bold mb-8 text-[#d4af37]">$97</div>

          {/* Coming soon notice */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 px-5 py-2.5">
            <div className="h-2 w-2 rounded-full bg-[#d4af37] animate-pulse" />
            <span className="text-sm font-medium text-[#d4af37]">Payments launching very soon</span>
          </div>

          <div className="flex flex-col items-center gap-4">
            <Link
              href="/coming-soon"
              className="inline-block bg-[#d4af37] text-black px-12 py-4 rounded-full text-xl font-bold hover:scale-105 transition-transform"
            >
              Get Notified When Live
            </Link>
            <Link href="/" className="text-sm text-neutral-400 hover:text-white transition-colors">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
