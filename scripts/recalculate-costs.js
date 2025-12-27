require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { google } = require('googleapis');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

// Initialize Google Sheets
const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
const sheetId = process.env.GOOGLE_SHEET_ID_LIBRARY;

const auth = new google.auth.JWT({
  email: clientEmail,
  key: privateKey,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Analyze idea and generate realistic startup cost
async function analyzeStartupCost(idea) {
  const prompt = `You are a startup cost analyst. Analyze this business idea and provide a realistic startup cost range.

Business Idea: ${idea.title}
Description: ${idea.oneLiner}
Industry: ${idea.industry}
Difficulty: ${idea.difficulty}
Time to First Sale: ${idea.timeToFirstSale}

Consider:
- Software/tools needed
- No-code vs custom development
- Marketing budget
- Initial inventory (if applicable)
- Legal/admin costs

Provide ONLY a cost range in this exact format: $X - $Y
Examples: $0 - $100, $500 - $2,000, $5,000 - $20,000

Be realistic. Most online businesses can start for under $500. Only suggest higher costs if truly necessary.

Cost range:`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();
    
    // Extract cost range (e.g., "$500 - $2,000")
    const costMatch = response.match(/\$[\d,]+ - \$[\d,]+/);
    if (costMatch) {
      return costMatch[0];
    }
    
    // Fallback based on difficulty
    const fallbacks = {
      'Beginner': '$0 - $500',
      'Intermediate': '$500 - $2,000',
      'Advanced': '$2,000 - $10,000'
    };
    return fallbacks[idea.difficulty] || '$500 - $2,000';
    
  } catch (error) {
    console.error(`❌ AI error for "${idea.title}":`, error.message);
    
    // Return fallback based on difficulty
    const fallbacks = {
      'Beginner': '$0 - $500',
      'Intermediate': '$500 - $2,000',
      'Advanced': '$2,000 - $10,000'
    };
    return fallbacks[idea.difficulty] || '$500 - $2,000';
  }
}

async function recalculateAllCosts() {
  console.log('\n🤖 AI-Powered Startup Cost Recalculation\n');
  console.log('================================================\n');
  
  try {
    // Step 1: Fetch all ideas
    console.log('📥 Fetching all ideas from database...');
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Sheet1!A2:R',
    });
    
    const rows = response.data.values || [];
    console.log(`✅ Found ${rows.length} ideas\n`);
    
    // Map to idea objects
    const ideas = rows.map((row, index) => ({
      rowIndex: index + 2, // +2 because row 1 is header, arrays are 0-indexed
      id: row[0] || '',
      title: row[1] || '',
      industry: row[2] || '',
      subcategory: row[3] || '',
      score: row[4] || '',
      marketSize: row[5] || '',
      growthRate: row[6] || '',
      difficulty: row[7] || 'Intermediate',
      timeToFirstSale: row[8] || '4-8 weeks',
      currentCost: row[9] || 'TBD',
      oneLiner: row[10] || '',
    }));
    
    console.log('🤖 Starting AI analysis...\n');
    console.log('This will take a few minutes. Processing in batches to respect rate limits.\n');
    
    // Process in batches of 10 with delays
    const batchSize = 10;
    const delayBetweenBatches = 2000; // 2 seconds
    const delayBetweenCalls = 200; // 200ms between individual calls
    
    let updates = [];
    let processedCount = 0;
    
    for (let i = 0; i < ideas.length; i += batchSize) {
      const batch = ideas.slice(i, i + batchSize);
      console.log(`📊 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(ideas.length / batchSize)} (ideas ${i + 1}-${Math.min(i + batchSize, ideas.length)})...`);
      
      for (const idea of batch) {
        const newCost = await analyzeStartupCost(idea);
        
        updates.push({
          range: `Sheet1!J${idea.rowIndex}`,
          values: [[newCost]]
        });
        
        processedCount++;
        
        // Show progress every 50 ideas
        if (processedCount % 50 === 0) {
          console.log(`   ✅ Processed ${processedCount}/${ideas.length} ideas...`);
        }
        
        // Small delay between API calls
        await new Promise(resolve => setTimeout(resolve, delayBetweenCalls));
      }
      
      // Delay between batches
      if (i + batchSize < ideas.length) {
        await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
      }
    }
    
    console.log(`\n✅ AI analysis complete! Processed ${processedCount} ideas\n`);
    
    // Step 2: Update all costs in one batch
    console.log('📤 Updating costs in Google Sheets...');
    
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: sheetId,
      requestBody: {
        valueInputOption: 'RAW',
        data: updates
      }
    });
    
    console.log(`✅ Successfully updated ${updates.length} startup costs!\n`);
    
    // Show some examples
    console.log('📊 Sample updates:');
    const samples = ideas.slice(0, 10).map((idea, i) => {
      const newCost = updates[i].values[0][0];
      return `   ${idea.title.substring(0, 50)}... | ${idea.currentCost} → ${newCost}`;
    });
    
    console.log(samples.join('\n'));
    
    console.log('\n✨ Recalculation complete!\n');
    console.log('Changes are now live in your database.');
    console.log('Refresh your explore-ideas page to see updated costs.\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run it
recalculateAllCosts();
