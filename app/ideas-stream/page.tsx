import React from 'react';

const ideas = [
  { title: "AI Golf Coach", valueProp: "Personalized AI platform analyzing swing videos.", target: "Amateur golfers." },
  { title: "Estate Paperwork Bot", valueProp: "AI tool automating 47 complex forms for grieving families.", target: "Funeral homes." },
  { title: "AI Housemate Screener", valueProp: "Predicts compatibility for co-living operators.", target: "Property managers." },
  { title: "Sleep Data Aggregator", valueProp: "Unified dashboard for wearable health insights.", target: "Biohackers." },
  { title: "Smart Plant Care", valueProp: "AI app diagnosing plant health and schedules.", target: "Urban gardeners." },
];

export default function IdeasStreamPage() {
  return (
    <main className="bg-[#0a0a0a] text-white min-h-screen py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Your <span className="text-[#d4af37]">Ideas</span> Stream</h1>
        <div className="grid md:grid-cols-2 gap-12">
          {ideas.map((idea, i) => (
            <div key={i} className="p-8 rounded-2xl border border-gray-800 bg-[#0f0f0f] hover:border-[#d4af37]/50 transition-all">
              <h3 className="text-3xl font-bold mb-4 text-[#d4af37]">{idea.title}</h3>
              <p className="text-gray-300 text-lg mb-4">{idea.valueProp}</p>
              <p className="text-gray-500 uppercase tracking-widest text-sm">Target: {idea.target}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
