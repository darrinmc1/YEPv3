const { google } = require('googleapis');
require('dotenv').config({ path: '.env.local' });

const PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n');
const CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
const TARGET_SHEET_ID = process.env.GOOGLE_SHEET_ID_LIBRARY;

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: CLIENT_EMAIL,
    private_key: PRIVATE_KEY,
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Map AI ideas to library format
function mapAIIdeaToLibraryFormat(row, index, currentCount) {
  const [idea, category, howToGetStarted] = row;
  
  const ideaId = `idea-${String(currentCount + index + 1).padStart(4, '0')}`;
  
  // Score AI ideas highly since they're curated
  let score = 8.0; // default for AI ideas
  if (category?.toLowerCase().includes('saas') || category?.toLowerCase().includes('automation')) {
    score = 8.5;
  }
  
  // Estimate difficulty based on category
  let difficulty = 'Intermediate';
  if (category?.toLowerCase().includes('content') || category?.toLowerCase().includes('marketing')) {
    difficulty = 'Beginner';
  } else if (category?.toLowerCase().includes('development') || category?.toLowerCase().includes('engineering')) {
    difficulty = 'Advanced';
  }
  
  // Estimate startup cost for AI tools
  let startupCost = '$500 - $2,000';
  if (category?.toLowerCase().includes('content') || category?.toLowerCase().includes('freelance')) {
    startupCost = '$0 - $500';
  } else if (category?.toLowerCase().includes('saas') || category?.toLowerCase().includes('platform')) {
    startupCost = '$2,000 - $10,000';
  }
  
  return [
    ideaId,                                    // A: Idea ID
    idea?.trim() || '',                        // B: Idea Name
    'AI & Automation',                         // C: Category (all AI-focused)
    category?.trim() || 'AI Tools',            // D: Subcategory
    score,                                     // E: Score
    '',                                        // F: Market Size
    '+25%',                                    // G: Growth Rate (AI is growing fast)
    difficulty,                                // H: Difficulty
    '3-6 weeks',                              // I: Time to First Sale
    startupCost,                               // J: Startup Cost
    idea?.trim() || '',                        // K: One-liner (same as title for now)
    'AI is mainstream now. Tools that leverage AI are in high demand across all industries.', // L: Why Now
    '',                                        // M: Quick Insights (JSON)
    '',                                        // N: Locked Content (JSON)
    new Date().toISOString(),                  // O: Date Added
    'imported',                                // P: Status
    howToGetStarted?.trim() || '',            // Q: Full Description
    'Varies',                                  // R: Pricing Model
  ];
}

async function appendAIIdeas() {
  try {
    console.log('📥 Fetching AI ideas from source sheet...\n');
    
    // First, get current count from target sheet
    const currentData = await sheets.spreadsheets.values.get({
      spreadsheetId: TARGET_SHEET_ID,
      range: 'Sheet1!A:A',
    });
    
    const currentCount = (currentData.data.values?.length || 1) - 1; // -1 for header
    console.log(`Current ideas in library: ${currentCount}`);
    
    // Fetch AI ideas
    const source = await sheets.spreadsheets.values.get({
      spreadsheetId: '145m-dhI75b6TbUQIuEeDqE5EwHNlkcAkOumJU72eAJU',
      range: 'ideas!A:C',
    });
    
    const rows = source.data.values || [];
    console.log(`Found ${rows.length} rows in AI ideas sheet`);
    
    // Skip header row (Idea, Category, How to Get Started)
    const dataRows = rows.slice(1).filter(row => row[0]?.trim());
    
    console.log(`Processing ${dataRows.length} AI ideas...\n`);
    
    // Map to our format
    const mappedData = dataRows.map((row, index) => 
      mapAIIdeaToLibraryFormat(row, index, currentCount)
    );
    
    console.log(`✅ Mapped ${mappedData.length} AI ideas`);
    
    // Append to existing data (don't clear!)
    console.log('\n📤 Appending AI ideas to YEP_IdeasLibrary...\n');
    await sheets.spreadsheets.values.append({
      spreadsheetId: TARGET_SHEET_ID,
      range: 'Sheet1!A:R',
      valueInputOption: 'RAW',
      requestBody: {
        values: mappedData,
      },
    });
    
    const newTotal = currentCount + mappedData.length;
    
    console.log(`\n✅ Successfully appended ${mappedData.length} AI ideas!`);
    console.log(`\n📊 Summary:`);
    console.log(`   • Previous count: ${currentCount} ideas`);
    console.log(`   • Added: ${mappedData.length} AI ideas`);
    console.log(`   • New total: ${newTotal} ideas`);
    
    // Show category breakdown of AI ideas
    const categories = {};
    mappedData.forEach(row => {
      const cat = row[3]; // Subcategory column
      categories[cat] = (categories[cat] || 0) + 1;
    });
    
    console.log(`\n📑 AI Ideas by Subcategory:`);
    Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([cat, count]) => {
        console.log(`   • ${cat}: ${count} ideas`);
      });
    
    console.log(`\n💡 Next steps:`);
    console.log(`   1. View all ${newTotal} ideas at: https://docs.google.com/spreadsheets/d/${TARGET_SHEET_ID}`);
    console.log(`   2. Need ${1000 - newTotal} more to reach 1000!`);
    console.log(`   3. Run: node scripts/generate-more-ideas.js to use AI to create more ideas`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

appendAIIdeas();
