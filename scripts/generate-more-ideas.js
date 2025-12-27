const { google } = require('googleapis');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

const PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n');
const CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
const TARGET_SHEET_ID = process.env.GOOGLE_SHEET_ID_LIBRARY;
const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: CLIENT_EMAIL,
    private_key: PRIVATE_KEY,
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

console.log('------------------------------------------------');
if (!GEMINI_API_KEY) {
  console.error('❌ CRITICAL: GOOGLE_GEMINI_API_KEY is missing from .env.local');
  process.exit(1);
} else {
  console.log('✅ GOOGLE_GEMINI_API_KEY found (' + GEMINI_API_KEY.substring(0, 4) + '...)');
}
console.log('------------------------------------------------');

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const CATEGORIES = [
  'AI & Automation',
  'Creator Economy & Marketing',
  'SaaS & B2B Tools',
  'E-commerce & Retail',
  'Health, Wellness & Fitness',
  'FinTech & LegalTech',
  'Education & EdTech',
  'Real Estate & Construction',
  'Niche Marketplaces & Services',
  'Food & Beverage',
  'Gaming & Entertainment',
  'Climate & Sustainability',
  'Remote Work & Productivity',
  'Travel & Hospitality'
];

async function generateIdeasForCategory(category, count) {
  // Try available models found in diagnostic check
  // User has access to advanced/experimental models but not 1.5-flash
  const models = ['gemini-flash-latest', 'gemini-2.0-flash', 'gemini-2.0-flash-exp'];

  for (const modelName of models) {
    let retries = 3;
    while (retries > 0) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });

        const prompt = `Generate ${count} unique, profitable business ideas in the "${category}" category.

For each idea, provide:
1. Idea Name (concise, clear)
2. One-liner description (what it does, who it's for)
3. Subcategory (specific niche within ${category})
4. Estimated startup cost (choose from: $0-$500, $500-$2,000, $2,000-$10,000, $10,000+)
5. Difficulty (Beginner, Intermediate, or Advanced)
6. Brief "Why Now" (1-2 sentences on timing/opportunity)

Focus on:
- Realistic, actionable ideas (not sci-fi)
- Modern trends and technologies
- Underserved niches
- Solo founder or small team friendly
- Ideas that can generate revenue within 3-6 months

Format as JSON array like this:
[
  {
    "name": "AI-Powered Resume Builder",
    "oneLiner": "Help job seekers create ATS-friendly resumes using AI templates",
    "subcategory": "Career Tools",
    "startupCost": "$500-$2,000",
    "difficulty": "Intermediate",
    "whyNow": "Remote hiring is at all-time high. 75% of resumes are rejected by ATS systems before human review."
  }
]

Return ONLY the JSON array, no other text.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Extract JSON from response (sometimes it's wrapped in markdown)
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
          console.error(`Failed to extract JSON from response for ${category} using ${modelName}`);
          break; // Try next model
        }

        const ideas = JSON.parse(jsonMatch[0]);
        return ideas.map(idea => ({
          ...idea,
          category
        }));

      } catch (error) {
        if (error.message.includes('429') || error.message.includes('quota')) {
          console.log(`⏳ Rate limit hit for ${modelName}. Waiting 60s before retry... (${retries} retries left)`);
          await new Promise(resolve => setTimeout(resolve, 60000));
          retries--;
        } else {
          console.warn(`Warning: Failed with ${modelName}:`, error.message);
          break; // Try next model
        }
      }
    }
  }

  console.error(`Failed to generate ideas for ${category} with all available models.`);
  return [];
}

async function generateMoreIdeas(targetCount = 1000) {
  try {
    // Get current count
    const currentData = await sheets.spreadsheets.values.get({
      spreadsheetId: TARGET_SHEET_ID,
      range: 'Sheet1!A:A',
    });

    const currentCount = (currentData.data.values?.length || 1) - 1;
    console.log(`\n📊 Current ideas in library: ${currentCount}`);

    const needed = targetCount - currentCount;
    if (needed <= 0) {
      console.log(`✅ Already have ${currentCount} ideas! Target reached.`);
      return;
    }

    console.log(`🎯 Need to generate: ${needed} more ideas\n`);

    // Distribute ideas across categories
    const perCategory = Math.ceil(needed / CATEGORIES.length);
    console.log(`Generating ~${perCategory} ideas per category...\n`);

    // Helper to save batch
    const saveBatchToSheet = async (newIdeas, startIndex) => {
      if (newIdeas.length === 0) return;

      console.log(`   📝 Formatting ${newIdeas.length} ideas...`);

      const mappedData = newIdeas.map((idea, index) => {
        const ideaId = `idea-${String(startIndex + index + 1).padStart(4, '0')}`;

        let score = 7.5;
        if (idea.difficulty === 'Beginner') score = 8.0;
        if (idea.startupCost === '$0-$500') score += 0.5;

        return [
          ideaId,
          idea.name?.trim() || '',
          idea.category || 'Uncategorized',
          idea.subcategory?.trim() || '',
          score,
          '', // Market Size
          '', // Growth Rate
          idea.difficulty || 'Intermediate',
          '3-6 weeks',
          idea.startupCost || '$1,000-$5,000',
          idea.oneLiner?.trim() || '',
          idea.whyNow?.trim() || '',
          '', // Quick Insights
          '', // Locked Content
          new Date().toISOString(),
          'ai-generated',
          idea.oneLiner?.trim() || '',
          'TBD',
        ];
      });

      console.log(`   📤 Appending to sheet...`);
      await sheets.spreadsheets.values.append({
        spreadsheetId: TARGET_SHEET_ID,
        range: 'Sheet1!A:R',
        valueInputOption: 'RAW',
        requestBody: { values: mappedData },
      });
      console.log(`   💾 Saved!`);
    };

    let totalGenerated = 0;
    let currentIdIndex = currentCount;

    for (const category of CATEGORIES) {
      // Check if we still need more
      if (totalGenerated >= needed) break;

      console.log(`🤖 Generating ideas for: ${category}...`);
      const ideas = await generateIdeasForCategory(category, perCategory);

      if (ideas.length > 0) {
        await saveBatchToSheet(ideas, currentIdIndex);
        totalGenerated += ideas.length;
        currentIdIndex += ideas.length;
        console.log(`   ✅ Progress: ${totalGenerated}/${needed} new ideas saved.`);
      }

      // Rate limiting - wait 10 seconds between API calls
      if (totalGenerated < needed) {
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    }

    console.log(`\n🎉 Success! Added ${totalGenerated} new ideas.`);
    console.log(`\n💡 View them at:`);
    console.log(`   https://docs.google.com/spreadsheets/d/${TARGET_SHEET_ID}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Get target from command line or default to 1000
const target = parseInt(process.argv[2]) || 1000;
generateMoreIdeas(target);
