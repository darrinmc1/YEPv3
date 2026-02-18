import React from 'react';

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
          <a href="YOUR_STRIPE_LINK_HERE" className="inline-block bg-[#d4af37] text-black px-12 py-4 rounded-full text-xl font-bold hover:scale-105 transition-transform">
            Buy Now
          </a>
        </div>
      </div>
    </main>
  );
}
