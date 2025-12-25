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
        continue; // Try next model
      }

      const ideas = JSON.parse(jsonMatch[0]);
      return ideas.map(idea => ({
        ...idea,
        category
      }));

    } catch (error) {
      console.warn(`Warning: Failed with ${modelName}:`, error.message);
      continue; // Try next model
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

    let allNewIdeas = [];

    for (const category of CATEGORIES) {
      console.log(`🤖 Generating ideas for: ${category}...`);
      const ideas = await generateIdeasForCategory(category, perCategory);
      allNewIdeas = allNewIdeas.concat(ideas);
      console.log(`   ✅ Generated ${ideas.length} ideas`);

      // Rate limiting - wait 2 seconds between API calls
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Stop if we have enough
      if (allNewIdeas.length >= needed) {
        break;
      }
    }

    // Trim to exact count needed
    allNewIdeas = allNewIdeas.slice(0, needed);

    console.log(`\n✅ Generated ${allNewIdeas.length} total new ideas`);
    console.log(`\n📝 Formatting for database...\n`);

    // Format for database
    const mappedData = allNewIdeas.map((idea, index) => {
      const ideaId = `idea-${String(currentCount + index + 1).padStart(4, '0')}`;

      // Parse difficulty
      const difficulty = idea.difficulty || 'Intermediate';

      // Parse score based on viability
      let score = 7.5;
      if (difficulty === 'Beginner') score = 8.0;
      if (idea.startupCost === '$0-$500') score += 0.5;

      return [
        ideaId,
        idea.name?.trim() || '',
        idea.category || 'Uncategorized',
        idea.subcategory?.trim() || '',
        score,
        '',  // Market Size (TBD)
        '',  // Growth Rate (TBD)
        difficulty,
        '3-6 weeks',
        idea.startupCost || '$1,000-$5,000',
        idea.oneLiner?.trim() || '',
        idea.whyNow?.trim() || '',
        '',  // Quick Insights (JSON)
        '',  // Locked Content (JSON)
        new Date().toISOString(),
        'ai-generated',
        idea.oneLiner?.trim() || '',  // Full Description
        'TBD',  // Pricing Model
      ];
    });

    console.log(`📤 Appending ${mappedData.length} ideas to database...\n`);

    // Append in batches of 50 to avoid timeout
    const batchSize = 50;
    for (let i = 0; i < mappedData.length; i += batchSize) {
      const batch = mappedData.slice(i, i + batchSize);

      await sheets.spreadsheets.values.append({
        spreadsheetId: TARGET_SHEET_ID,
        range: 'Sheet1!A:R',
        valueInputOption: 'RAW',
        requestBody: {
          values: batch,
        },
      });

      console.log(`   ✅ Appended batch ${Math.floor(i / batchSize) + 1} (${batch.length} ideas)`);
    }

    const finalCount = currentCount + mappedData.length;

    console.log(`\n🎉 Success! Library Stats:`);
    console.log(`   • Previous: ${currentCount} ideas`);
    console.log(`   • Added: ${mappedData.length} ideas`);
    console.log(`   • Total: ${finalCount} ideas`);

    // Category breakdown
    const catBreakdown = {};
    mappedData.forEach(row => {
      const cat = row[2];
      catBreakdown[cat] = (catBreakdown[cat] || 0) + 1;
    });

    console.log(`\n📑 New Ideas by Category:`);
    Object.entries(catBreakdown)
      .sort((a, b) => b[1] - a[1])
      .forEach(([cat, count]) => {
        console.log(`   • ${cat}: ${count} ideas`);
      });

    console.log(`\n💡 View all ${finalCount} ideas at:`);
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
