import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About YourExitPlans - AI-Powered Business Launch System',
  description: 'Learn how YourExitPlans transforms expert frameworks into personalized, actionable daily roadmaps that help aspiring entrepreneurs go from idea to income.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-blue-600 mb-4">
            About YourExitPlans
          </h1>
          <p className="text-2xl text-gray-600">
            Because starting a business shouldn't feel like reading a tax manual.
          </p>
        </div>
      </header>

      {/* What We Do */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold mb-6">What We Do</h2>
          <p className="text-lg text-gray-700 mb-4">
            YourExitPlans is an AI-powered business launch system that transforms world-class 
            entrepreneurship frameworks into personalized, actionable daily roadmaps. We help 
            aspiring entrepreneurs go from "I have an idea" (or "I need an idea") to earning 
            their first dollar—without drowning in generic advice or expensive consultants.
          </p>
          
          <div className="bg-gray-50 border-l-4 border-blue-600 p-8 my-8 rounded-lg">
            <p className="text-lg">
              <strong className="text-blue-600">Our Mission:</strong> To eliminate the gap 
              between wanting to start a business and actually doing it. Most business education 
              tells you what to do. We tell you what to do <em>today</em>, <em>tomorrow</em>, 
              and <em>every day after</em> until you're profitable.
            </p>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold mb-6">The Problem We're Solving</h2>
          <p className="text-lg text-gray-700 mb-4">
            Here's the truth: Most people don't fail because they lack knowledge. They fail 
            because they're overwhelmed by it.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            You can Google "how to start a business" and get 8 billion results. You can buy 
            courses, read books, watch YouTube videos. But at the end of the day, you're still 
            sitting there thinking: <em>"Okay... but what do I actually DO right now?"</em>
          </p>
          <p className="text-lg text-gray-700">
            That paralysis? That's what we fix.
          </p>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold mb-10 text-center">Our Approach</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-200 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">🎯 Not Theory. Action.</h3>
              <p className="text-gray-700">
                We don't teach concepts—we give you a checklist. Day 1 is never "Think about 
                your target market." It's "List 10 real people who could buy this, with their 
                names and where to find them."
              </p>
            </div>
            
            <div className="bg-white border border-gray-200 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">🤖 AI-Powered, Not AI-Generated</h3>
              <p className="text-gray-700">
                Our AI doesn't hallucinate generic advice. It's trained on proven frameworks 
                from the world's top entrepreneurship experts and customizes them to YOUR 
                business, YOUR goals, and YOUR constraints.
              </p>
            </div>
            
            <div className="bg-white border border-gray-200 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">📊 Built on Battle-Tested Frameworks</h3>
              <p className="text-gray-700">
                We've distilled insights from Eric Ries (Lean Startup), Rob Fitzpatrick 
                (The Mom Test), Alex Hormozi ($100M Offers), and other proven methodologies 
                into a system that actually works.
              </p>
            </div>
            
            <div className="bg-white border border-gray-200 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">⚡ Start Now, Not Someday</h3>
              <p className="text-gray-700">
                No "get ready to get ready" nonsense. Our plans are designed so you can make 
                real progress in your first week—even if you only have an hour a day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold mb-10 text-center">How It Works</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "💡",
                title: "Choose Your Starting Point",
                description: "Need an idea? Browse 1,000+ validated opportunities. Have an idea? Get free AI validation in minutes."
              },
              {
                icon: "📋",
                title: "Get Your Custom Roadmap",
                description: "Receive a personalized launch plan with day-by-day tasks, templates, and frameworks—no more guessing."
              },
              {
                icon: "🚀",
                title: "Execute & Launch",
                description: "Daily emails keep you accountable. Our AI coach answers questions. You focus on what matters."
              },
              {
                icon: "💰",
                title: "Reach Your First $$$",
                description: "Whether it's $1,000 or replacing your salary—our plans adapt to your goals and get you there faster."
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-white border border-gray-200 p-6 rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-700 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Frameworks */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold mb-6">Standing on the Shoulders of Giants</h2>
          <p className="text-lg text-gray-700 mb-6">
            We didn't reinvent entrepreneurship—we just made the best advice actually usable. 
            Our system synthesizes proven frameworks from:
          </p>
          
          <div className="bg-blue-50 p-8 rounded-lg">
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="font-bold text-blue-600 mr-2">•</span>
                <span><strong>Eric Ries</strong> – Lean Startup methodology (build-measure-learn cycles)</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-blue-600 mr-2">•</span>
                <span><strong>Rob Fitzpatrick</strong> – The Mom Test (how to validate ideas through real conversations)</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-blue-600 mr-2">•</span>
                <span><strong>Alex Hormozi</strong> – $100M Offers (creating irresistible value propositions)</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-blue-600 mr-2">•</span>
                <span><strong>April Dunford</strong> – Positioning strategies (how to stand out in crowded markets)</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-blue-600 mr-2">•</span>
                <span><strong>Sean Ellis</strong> – Growth hacking & product-market fit</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-blue-600 mr-2">•</span>
                <span><strong>Steve Blank</strong> – Customer development process</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-blue-600 mr-2">•</span>
                <span><strong>Sahil Lavingia</strong> – The minimalist entrepreneur approach</span>
              </li>
            </ul>
          </div>
          
          <p className="text-lg text-gray-700 mt-6">
            These aren't just names we drop—these are the methodologies baked into every plan 
            we generate. Every step has a reason, backed by someone who's done it at scale.
          </p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold mb-6">Our Philosophy</h2>
          
          <div className="bg-gray-100 border-l-4 border-blue-600 p-8 my-8 rounded-lg space-y-3">
            <p className="text-lg">
              We believe starting a business should be <strong className="text-blue-600">challenging</strong>, 
              not <strong className="text-blue-600">confusing</strong>.
            </p>
            <p className="text-lg">
              We're allergic to corporate jargon. If we catch ourselves saying "leverage synergies," 
              we stop immediately.
            </p>
            <p className="text-lg">
              We celebrate small wins because they matter. Talked to your first potential customer? 
              That's huge—most people never get that far.
            </p>
            <p className="text-lg">
              We're honest, even when it's uncomfortable. Not every idea is worth pursuing. We'll tell you.
            </p>
          </div>
          
          <h3 className="text-2xl font-bold mb-4 mt-8">Our Coaching Style</h3>
          <p className="text-lg text-gray-700 mb-4">
            Think: <em>Tough love with a sense of humor.</em>
          </p>
          
          <ul className="space-y-3 text-gray-700">
            <li><strong className="text-blue-600">Direct but warm.</strong> We care about you, which is WHY we're honest.</li>
            <li><strong className="text-blue-600">Action-first.</strong> Lead with what to do, explain why if you want the detail.</li>
            <li><strong className="text-blue-600">No BS.</strong> We've failed at businesses too—we're not shy about it.</li>
            <li><strong className="text-blue-600">Real-world analogies.</strong> We explain concepts using everyday situations, not MBA textbooks.</li>
            <li><strong className="text-blue-600">Accountability built-in.</strong> Daily emails, progress tracking, and checkpoints keep you moving.</li>
          </ul>
        </div>
      </section>

      {/* Why AI + Expert Frameworks */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold mb-6">Why AI + Expert Frameworks = Better Results</h2>
          
          <p className="text-lg text-gray-700 mb-4">
            You might be thinking: "Can't I just ask ChatGPT?"
          </p>
          
          <p className="text-lg text-gray-700 mb-6">
            Sure. And you'll get 4,000 words of generic advice that sounds smart but leaves you 
            exactly where you started: not knowing what to do next.
          </p>
          
          <p className="text-lg text-gray-700 mb-6 font-bold">
            Here's what makes us different:
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-red-600">❌ Generic AI</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Overwhelming walls of text</li>
                <li>• No structure or sequence</li>
                <li>• Can't track your progress</li>
                <li>• Repeats itself if you ask twice</li>
                <li>• No accountability system</li>
                <li>• Forgets context between sessions</li>
              </ul>
            </div>
            <div className="bg-white border border-blue-600 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-blue-600">✅ YourExitPlans</h3>
              <ul className="space-y-2 text-blue-700">
                <li>• Bite-sized daily actions</li>
                <li>• Proven, sequenced frameworks</li>
                <li>• Built-in progress tracking</li>
                <li>• Consistent, curated advice</li>
                <li>• Daily email accountability</li>
                <li>• Maintains your full context</li>
              </ul>
            </div>
          </div>
          
          <p className="text-lg text-gray-700 mt-6">
            We use AI as a <em>personalization engine</em>, not a content generator. The frameworks 
            are human-tested. The sequence is proven. The AI just customizes it to YOU.
          </p>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold mb-10 text-center">Who This Is For</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "🏢 Corporate Escapees",
                description: "You're in a job you want to leave but don't know what business to start or how to start it without quitting first."
              },
              {
                title: "💡 Side Hustlers",
                description: "You have an idea but limited time. You need a clear plan that fits around your day job—no 60-hour work weeks."
              },
              {
                title: "🔄 Career Changers",
                description: "You're recently unemployed or facing industry disruption (hello, AI). You need to pivot fast and earn income quickly."
              },
              {
                title: "📈 Serial Entrepreneurs",
                description: "You've started businesses before but want a faster, more systematic approach to testing and validating new ideas."
              }
            ].map((persona, index) => (
              <div key={index} className="bg-white border border-gray-200 p-6 rounded-lg hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold mb-3">{persona.title}</h3>
                <p className="text-gray-700 text-sm">{persona.description}</p>
              </div>
            ))}
          </div>
          
          <p className="text-center text-xl font-bold text-gray-800 mt-10">
            If you're someone who's tired of researching and ready to start building—you're in the right place.
          </p>
        </div>
      </section>

      {/* The Numbers */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold mb-10 text-center">The Numbers That Matter</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white border-l-4 border-blue-600 p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-4">⏱️ Time Saved</h3>
              <p className="text-gray-700 mb-2"><strong>DIY Research:</strong> 160-250 hours</p>
              <p className="text-gray-700 mb-2"><strong>With YourExitPlans:</strong> 16 hours</p>
              <p className="text-blue-600 font-bold text-xl">You save 144-234 hours</p>
            </div>
            
            <div className="bg-white border-l-4 border-blue-600 p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-4">💰 Money Saved</h3>
              <p className="text-gray-700 mb-2"><strong>Business Consultants:</strong> $150-500/hour</p>
              <p className="text-gray-700 mb-2"><strong>YourExitPlans:</strong> $29-999 one-time</p>
              <p className="text-blue-600 font-bold text-xl">You save 95-99% in costs</p>
            </div>
          </div>
          
          <div className="bg-white border-l-4 border-blue-600 p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-4">✅ Completion Rate</h3>
            <p className="text-gray-700">
              <strong className="text-blue-600">82%</strong> of users complete their launch plan 
              with our daily accountability system vs. industry average of <strong>5-10%</strong> for 
              self-guided programs.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-4xl font-bold mb-4">Ready to Stop Planning and Start Building?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of entrepreneurs who've turned ideas into income with YourExitPlans.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="/explore-ideas" 
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-all hover:-translate-y-1"
            >
              Explore Business Ideas
            </a>
            <span className="text-blue-200">or</span>
            <a 
              href="/validate-idea" 
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-all hover:-translate-y-1"
            >
              Validate Your Idea (Free)
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 text-center">
        <div className="container mx-auto px-4">
          <p className="text-gray-400">© 2026 YourExitPlans. Built for builders.</p>
        </div>
      </footer>
    </div>
  );
}
