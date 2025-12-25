const { google } = require('googleapis');
require('dotenv').config({ path: '.env.local' });

const PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n');
const CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
const TARGET_SHEET_ID = process.env.GOOGLE_SHEET_ID_LIBRARY; // YEP_IdeasLibrary

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: CLIENT_EMAIL,
    private_key: PRIVATE_KEY,
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Map source columns to target format
function mapIdeaToLibraryFormat(row, index) {
  // Source structure:
  // A: Business Idea
  // B: [empty]
  // C: Full Description
  // D: Date
  // E: Main Category
  // F: Subcategory
  // G: Stated Revenue/Pricing
  // H: Calculated ARR
  // I: One-liner
  // J: One-liner (duplicate)
  
  const [
    businessIdea,      // A
    _empty,           // B
    fullDescription,  // C
    date,             // D
    mainCategory,     // E
    subcategory,      // F
    statedRevenue,    // G
    calculatedARR,    // H
    oneLiner          // I
  ] = row;
  
  // Generate a unique ID
  const ideaId = `idea-${String(index + 1).padStart(4, '0')}`;
  
  // Calculate a score based on revenue/pricing
  let score = 7.0; // default
  if (statedRevenue && statedRevenue !== 'N/A' && statedRevenue.includes('$')) {
    const revenue = statedRevenue.toLowerCase();
    if (revenue.includes('month')) {
      const amount = parseFloat(statedRevenue.replace(/[^0-9.]/g, ''));
      if (amount > 500) score = 8.5;
      else if (amount > 100) score = 8.0;
      else if (amount > 50) score = 7.5;
    } else if (revenue.includes('year') || revenue.includes('semester')) {
      score = 8.0;
    }
  }
  
  // Estimate difficulty based on category
  let difficulty = 'Intermediate';
  const catLower = (mainCategory || '').toLowerCase();
  if (catLower.includes('ai') || catLower.includes('automation')) {
    difficulty = 'Advanced';
  } else if (catLower.includes('e-commerce') || catLower.includes('service')) {
    difficulty = 'Beginner';
  }
  
  // Estimate startup cost based on pricing
  let startupCost = '$1,000 - $5,000';
  if (statedRevenue && statedRevenue !== 'N/A' && statedRevenue.includes('$')) {
    const amount = parseFloat(statedRevenue.replace(/[^0-9.]/g, ''));
    if (amount < 30) startupCost = '$0 - $500';
    else if (amount < 100) startupCost = '$500 - $2,000';
    else startupCost = '$2,000 - $10,000';
  }
  
  return [
    ideaId,                                           // A: Idea ID
    businessIdea?.trim() || '',                       // B: Idea Name
    mainCategory?.trim() || 'Uncategorized',          // C: Category
    subcategory?.trim() || '',                        // D: Subcategory
    score,                                            // E: Score
    '',                                               // F: Market Size (to be filled)
    '',                                               // G: Growth Rate (to be filled)
    difficulty,                                       // H: Difficulty
    '4-8 weeks',                                      // I: Time to First Sale
    startupCost,                                      // J: Startup Cost
    oneLiner?.trim() || businessIdea?.trim() || '',   // K: One-liner
    '',                                               // L: Why Now (to be filled)
    '',                                               // M: Quick Insights (JSON array)
    '',                                               // N: Locked Content (JSON array)
    date?.trim() || new Date().toISOString(),         // O: Date Added
    'imported',                                       // P: Status
    fullDescription?.trim() || '',                    // Q: Full Description
    statedRevenue?.trim() || 'N/A',                   // R: Pricing Model
  ];
}

async function importIdeas() {
  try {
    console.log('📥 Fetching ideas from source sheet...\n');
    
    // Fetch from source
    const source = await sheets.spreadsheets.values.get({
      spreadsheetId: '1lVLSEC9e4g80fqVH1P9A4feOD3HfrBAFV6VEGJA-lFc',
      range: 'ideas!A:J',
    });
    
    const rows = source.data.values || [];
    console.log(`Found ${rows.length} total rows`);
    
    // Filter out empty rows
    const dataRows = rows.filter(row => row[0]?.trim());
    
    console.log(`Processing ${dataRows.length} ideas...\n`);
    
    // Map to our format
    const mappedData = dataRows.map((row, index) => mapIdeaToLibraryFormat(row, index));
    
    console.log(`✅ Mapped ${mappedData.length} ideas`);
    
    // Prepare for import with headers
    const headers = [
      'Idea ID',
      'Idea Name', 
      'Category',
      'Subcategory',
      'Score',
      'Market Size',
      'Growth Rate',
      'Difficulty',
      'Time to First Sale',
      'Startup Cost',
      'One-liner',
      'Why Now',
      'Quick Insights (JSON)',
      'Locked Content (JSON)',
      'Date Added',
      'Status',
      'Full Description',
      'Pricing Model'
    ];
    
    const dataToImport = [headers, ...mappedData];
    
    // Clear existing data in YEP_IdeasLibrary
    console.log('\n🗑️  Clearing existing data in YEP_IdeasLibrary...');
    await sheets.spreadsheets.values.clear({
      spreadsheetId: TARGET_SHEET_ID,
      range: 'Sheet1!A:R',
    });
    
    // Import new data
    console.log('📤 Importing to YEP_IdeasLibrary...\n');
    await sheets.spreadsheets.values.update({
      spreadsheetId: TARGET_SHEET_ID,
      range: 'Sheet1!A1',
      valueInputOption: 'RAW',
      resource: {
        values: dataToImport,
      },
    });
    
    console.log(`\n✅ Successfully imported ${mappedData.length} ideas!\n`);
    console.log(`📊 Summary:`);
    console.log(`   • Source: Idea Database`);
    console.log(`   • Target: YEP_IdeasLibrary (${TARGET_SHEET_ID})`);
    console.log(`   • Ideas imported: ${mappedData.length}`);
    
    // Show category breakdown
    const categories = {};
    const difficulties = {};
    
    mappedData.forEach(row => {
      const cat = row[2]; // Category column
      const diff = row[7]; // Difficulty column
      categories[cat] = (categories[cat] || 0) + 1;
      difficulties[diff] = (difficulties[diff] || 0) + 1;
    });
    
    console.log(`\n📑 By Category:`);
    Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([cat, count]) => {
        console.log(`   • ${cat}: ${count} ideas`);
      });
    
    console.log(`\n🎯 By Difficulty:`);
    Object.entries(difficulties)
      .sort((a, b) => b[1] - a[1])
      .forEach(([diff, count]) => {
        console.log(`   • ${diff}: ${count} ideas`);
      });
    
    console.log(`\n💡 Next steps:`);
    console.log(`   1. View your ideas at: https://docs.google.com/spreadsheets/d/${TARGET_SHEET_ID}`);
    console.log(`   2. Update explore-ideas page to pull from real database`);
    console.log(`   3. Optionally enhance ideas with AI (Why Now, Quick Insights, etc.)`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

importIdeas();
