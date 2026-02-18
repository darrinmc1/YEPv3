import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About YourExitPlans - AI-Powered Business Launch System',
  description: 'Learn how YourExitPlans transforms expert frameworks into personalized, actionable daily roadmaps that help aspiring entrepreneurs go from idea to income.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-white/10 py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-blue-400 mb-4">
            About YourExitPlans
          </h1>
          <p className="text-2xl text-neutral-400">
            Because "hustle culture" is exhausting and buying courses is expensive. We built the thing we wished we had.
          </p>
        </div>
      </header>

      {/* What We Do */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold mb-6 text-white">What We Do</h2>
          <p className="text-lg text-neutral-300 mb-4">
            YourExitPlans is an AI-powered business launch system that transforms world-class
            entrepreneurship frameworks into personalized, actionable daily roadmaps. We help
            aspiring entrepreneurs go from &quot;I have an idea&quot; (or &quot;I need an idea&quot;) to earning
            their first dollar—without drowning in generic advice or expensive consultants.
          </p>

          <div className="bg-white/5 border-l-4 border-blue-400 p-8 my-8 rounded-lg">
            <p className="text-lg text-neutral-200">
              <strong className="text-blue-400">Our Mission:</strong> To eliminate the gap
              between wanting to start a business and actually doing it. Most business education
              tells you what to do. We tell you what to do <em>today</em>, <em>tomorrow</em>,
              and <em>every day after</em> until you&apos;re profitable.
            </p>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-16 bg-white/[0.02] border-y border-white/5">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold mb-6 text-white">The Problem We&apos;re Solving</h2>
          <p className="text-lg text-neutral-300 mb-4">
            Here&apos;s the truth: Most people don&apos;t fail because they lack knowledge. They fail
            because they&apos;re overwhelmed by it.
          </p>
          <p className="text-lg text-neutral-300 mb-4">
            You can Google "how to start a business" and get 8 billion results, mostly from 22-year-olds in rented Lamborghinis. You can watch 500 hours of YouTube tutorials. But eventually, you have to close the tab and actually *do* something. That's the scary part. That's the part we fix.
          </p>
          <p className="text-lg text-neutral-200 font-medium">
            That paralysis? That&apos;s what we fix.
          </p>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold mb-10 text-center text-white">Our Approach</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 border border-white/10 p-8 rounded-xl hover:border-blue-400/30 transition-colors">
              <h3 className="text-2xl font-bold mb-4 text-white">🎯 Not Theory. Action.</h3>
              <p className="text-neutral-300">
                We don't do "theory." Theory is for textbooks. We give you orders. Day 1 isn't "Meditate on your customer avatar." It's "Find 10 real humans who might pay you money, DM them, and don't come back until you have a reply."
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-xl hover:border-blue-400/30 transition-colors">
              <h3 className="text-2xl font-bold mb-4 text-white">🤖 AI-Powered, Not AI-Generated</h3>
              <p className="text-neutral-300">
                Our AI doesn&apos;t hallucinate generic advice. It&apos;s trained on proven frameworks
                from the world&apos;s top entrepreneurship experts and customizes them to YOUR
                business, YOUR goals, and YOUR constraints.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-xl hover:border-blue-400/30 transition-colors">
              <h3 className="text-2xl font-bold mb-4 text-white">📊 Built on Battle-Tested Frameworks</h3>
              <p className="text-neutral-300">
                We&apos;ve distilled insights from Eric Ries (Lean Startup), Rob Fitzpatrick
                (The Mom Test), Alex Hormozi ($100M Offers), and other proven methodologies
                into a system that actually works.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-xl hover:border-blue-400/30 transition-colors">
              <h3 className="text-2xl font-bold mb-4 text-white">⚡ Start Now, Not Someday</h3>
              <p className="text-neutral-300">
                No &quot;get ready to get ready&quot; nonsense. Our plans are designed so you can make
                real progress in your first week—even if you only have an hour a day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white/[0.02] border-y border-white/5">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold mb-10 text-center text-white">How It Works</h2>

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
                className="bg-white/5 border border-white/10 p-6 rounded-xl hover:border-blue-400/30 transition-colors"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                <p className="text-neutral-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Frameworks */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold mb-6 text-white">Standing on the Shoulders of Giants</h2>
          <p className="text-lg text-neutral-300 mb-6">
            We didn't invent business. People have been trading stuff for shiny rocks for a long time. We just took the smartest frameworks from the smartest people, stripped out the boring parts, and turned them into a daily to-do list.
          </p>

          <div className="bg-blue-400/5 border border-blue-400/20 p-8 rounded-xl">
            <ul className="space-y-3 text-neutral-300">
              <li className="flex items-start">
                <span className="font-bold text-blue-400 mr-2">•</span>
                <span><strong className="text-white">Eric Ries</strong> – Lean Startup methodology (build-measure-learn cycles)</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-blue-400 mr-2">•</span>
                <span><strong className="text-white">Rob Fitzpatrick</strong> – The Mom Test (how to validate ideas through real conversations)</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-blue-400 mr-2">•</span>
                <span><strong className="text-white">Alex Hormozi</strong> – $100M Offers (creating irresistible value propositions)</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-blue-400 mr-2">•</span>
                <span><strong className="text-white">April Dunford</strong> – Positioning strategies (how to stand out in crowded markets)</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-blue-400 mr-2">•</span>
                <span><strong className="text-white">Sean Ellis</strong> – Growth hacking &amp; product-market fit</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-blue-400 mr-2">•</span>
                <span><strong className="text-white">Steve Blank</strong> – Customer development process</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-blue-400 mr-2">•</span>
                <span><strong className="text-white">Sahil Lavingia</strong> – The minimalist entrepreneur approach</span>
              </li>
            </ul>
          </div>

          <p className="text-lg text-neutral-300 mt-6">
            These aren&apos;t just names we drop—these are the methodologies baked into every plan
            we generate. Every step has a reason, backed by someone who&apos;s done it at scale.
          </p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-16 bg-white/[0.02] border-y border-white/5">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold mb-6 text-white">Our Philosophy</h2>

          <div className="bg-white/5 border-l-4 border-blue-400 p-8 my-8 rounded-lg space-y-3">
            <p className="text-lg text-neutral-200">
              We believe starting a business should be <strong className="text-blue-400">challenging</strong>,
              not <strong className="text-blue-400">confusing</strong>.
            </p>
            <p className="text-lg text-neutral-200">
              We&apos;re allergic to corporate jargon. If we catch ourselves saying &quot;leverage synergies,&quot;
              we stop immediately.
            </p>
            <p className="text-lg text-neutral-200">
              We celebrate small wins because they matter. Talked to your first potential customer?
              That&apos;s huge—most people never get that far.
            </p>
            <p className="text-lg text-neutral-200">
              We&apos;re honest, even when it&apos;s uncomfortable. Not every idea is worth pursuing. We&apos;ll tell you.
            </p>
          </div>

          <h3 className="text-2xl font-bold mb-4 mt-8 text-white">Our Coaching Style</h3>
          <p className="text-lg text-neutral-300 mb-4">
            Think: <em>Tough love with a sense of humor.</em>
          </p>

          <ul className="space-y-3 text-neutral-300">
            <li><strong className="text-blue-400">Direct but warm.</strong> We care about you, which is WHY we&apos;re honest.</li>
            <li><strong className="text-blue-400">Action-first.</strong> Lead with what to do, explain why if you want the detail.</li>
            <li><strong className="text-blue-400">No BS.</strong> We&apos;ve failed at businesses too—we&apos;re not shy about it.</li>
            <li><strong className="text-blue-400">Real-world analogies.</strong> We explain concepts using everyday situations, not MBA textbooks.</li>
            <li><strong className="text-blue-400">Accountability built-in.</strong> Daily emails, progress tracking, and checkpoints keep you moving.</li>
          </ul>
        </div>
      </section>

      {/* Why AI + Expert Frameworks */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold mb-6 text-white">Why AI + Expert Frameworks = Better Results</h2>

          <p className="text-lg text-neutral-300 mb-4">
            You might be thinking: &quot;Can&apos;t I just ask ChatGPT?&quot;
          </p>

          <p className="text-lg text-neutral-300 mb-6">
            You could ask ChatGPT. It will happily write you a 4,000-word essay that sounds confident, uses the word "delve" six times, and tells you absolutely nothing about how to actually get your first stripe notification. We use AI to customize *proven* strategies, not to hallucinate new ones.
          </p>

          <p className="text-lg text-neutral-200 mb-6 font-bold">
            Here&apos;s what makes us different:
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4 text-red-400">❌ Generic AI</h3>
              <ul className="space-y-2 text-neutral-400">
                <li>• Overwhelming walls of text</li>
                <li>• No structure or sequence</li>
                <li>• Can&apos;t track your progress</li>
                <li>• Repeats itself if you ask twice</li>
                <li>• No accountability system</li>
                <li>• Forgets context between sessions</li>
              </ul>
            </div>
            <div className="bg-blue-400/5 border border-blue-400/30 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4 text-blue-400">✅ YourExitPlans</h3>
              <ul className="space-y-2 text-blue-300">
                <li>• Bite-sized daily actions</li>
                <li>• Proven, sequenced frameworks</li>
                <li>• Built-in progress tracking</li>
                <li>• Consistent, curated advice</li>
                <li>• Daily email accountability</li>
                <li>• Maintains your full context</li>
              </ul>
            </div>
          </div>

          <p className="text-lg text-neutral-300 mt-6">
            We use AI as a <em>personalization engine</em>, not a content generator. The frameworks
            are human-tested. The sequence is proven. The AI just customizes it to YOU.
          </p>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="py-16 bg-white/[0.02] border-y border-white/5">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold mb-10 text-center text-white">Who This Is For</h2>

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
              <div key={index} className="bg-white/5 border border-white/10 p-6 rounded-xl hover:border-blue-400/30 transition-colors">
                <h3 className="text-xl font-bold mb-3 text-white">{persona.title}</h3>
                <p className="text-neutral-400 text-sm">{persona.description}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-xl font-bold text-neutral-200 mt-10">
            If you&apos;re someone who&apos;s tired of researching and ready to start building—you&apos;re in the right place.
          </p>
        </div>
      </section>

      {/* The Numbers */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold mb-10 text-center text-white">The Numbers That Matter</h2>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white/5 border-l-4 border-blue-400 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4 text-white">⏱️ Time Saved</h3>
              <p className="text-neutral-300 mb-2"><strong className="text-white">DIY Research:</strong> 160-250 hours</p>
              <p className="text-neutral-300 mb-2"><strong className="text-white">With YourExitPlans:</strong> 16 hours</p>
              <p className="text-blue-400 font-bold text-xl">You save 144-234 hours</p>
            </div>

            <div className="bg-white/5 border-l-4 border-blue-400 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4 text-white">💰 Money Saved</h3>
              <p className="text-neutral-300 mb-2"><strong className="text-white">Business Consultants:</strong> $150-500/hour</p>
              <p className="text-neutral-300 mb-2"><strong className="text-white">YourExitPlans:</strong> $29-999 one-time</p>
              <p className="text-blue-400 font-bold text-xl">You save 95-99% in costs</p>
            </div>
          </div>

          <div className="bg-white/5 border-l-4 border-blue-400 p-8 rounded-xl">
            <h3 className="text-2xl font-bold mb-4 text-white">✅ Completion Rate</h3>
            <p className="text-neutral-300">
              <strong className="text-blue-400">82%</strong> of users complete their launch plan
              with our daily accountability system vs. industry average of <strong className="text-white">5-10%</strong> for
              self-guided programs.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-4xl font-bold mb-4 text-white">Ready to Stop Planning and Start Building?</h2>
          <p className="text-xl mb-8 text-neutral-400">
            Join entrepreneurs who are turning ideas into income with YourExitPlans.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/explore-ideas"
              className="bg-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-400 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              Explore Business Ideas
            </a>
            <span className="text-neutral-600">or</span>
            <a
              href="/validate-idea"
              className="bg-white/10 border border-white/20 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all hover:-translate-y-1"
            >
              Validate Your Idea (Free)
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center">
        <div className="container mx-auto px-4">
          <p className="text-neutral-500">© 2026 YourExitPlans. Built for builders.</p>
        </div>
      </footer>
    </div>
  );
}
