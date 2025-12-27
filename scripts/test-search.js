require('dotenv').config({ path: '.env.local' });
const { google } = require('googleapis');

const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
const sheetId = process.env.GOOGLE_SHEET_ID_LIBRARY;

const auth = new google.auth.JWT({
  email: clientEmail,
  key: privateKey,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

async function testSearch() {
  try {
    console.log('\n🔍 Testing search with filters like explore-ideas...\n');
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Sheet1!A2:R', // Get all 18 columns
    });
    
    const rows = response.data.values || [];
    console.log(`📊 Total rows in database: ${rows.length}`);
    
    // Map to our structure
    let ideas = rows.map(row => ({
      id: row[0] || '',
      title: row[1] || '',
      industry: row[2] || '',
      subcategory: row[3] || '',
      score: parseFloat(row[4]) || 7.0,
      marketSize: row[5] || 'TBD',
      growthRate: row[6] || 'TBD',
      difficulty: row[7] || 'Intermediate',
      timeToFirstSale: row[8] || '4-8 weeks',
      startupCost: row[9] || 'TBD',
      oneLiner: row[10] || '',
      whyNow: row[11] || '',
      quickInsights: row[12] || '[]',
      lockedContent: row[13] || '[]',
      dateAdded: row[14] || '',
      status: row[15] || '',
      fullDescription: row[16] || '',
      pricingModel: row[17] || 'N/A',
    }));
    
    console.log(`\n✅ Mapped ${ideas.length} ideas`);
    console.log('\nFirst 3 ideas:');
    ideas.slice(0, 3).forEach((idea, i) => {
      console.log(`\n${i+1}. ${idea.title}`);
      console.log(`   Industry: ${idea.industry}`);
      console.log(`   Score: ${idea.score}`);
      console.log(`   Difficulty: ${idea.difficulty}`);
    });
    
    // Test search term filter
    const searchTerm = 'AI tool automation';
    console.log(`\n\n🔍 Testing search term: "${searchTerm}"`);
    
    const term = searchTerm.toLowerCase();
    const filtered = ideas.filter(idea =>
      idea.title.toLowerCase().includes(term) ||
      idea.oneLiner.toLowerCase().includes(term) ||
      idea.industry.toLowerCase().includes(term) ||
      idea.fullDescription.toLowerCase().includes(term)
    );
    
    console.log(`\n📊 Found ${filtered.length} matches for "${searchTerm}"`);
    
    if (filtered.length > 0) {
      console.log('\nMatched ideas:');
      filtered.slice(0, 5).forEach((idea, i) => {
        console.log(`${i+1}. ${idea.title} - ${idea.industry}`);
      });
    } else {
      console.log('\n❌ No matches found!');
      console.log('\nTrying partial search for just "AI":');
      
      const aiIdeas = ideas.filter(idea =>
        idea.title.toLowerCase().includes('ai') ||
        idea.industry.toLowerCase().includes('ai')
      );
      
      console.log(`Found ${aiIdeas.length} ideas with "AI"`);
      aiIdeas.slice(0, 5).forEach((idea, i) => {
        console.log(`${i+1}. ${idea.title} - ${idea.industry}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testSearch();
