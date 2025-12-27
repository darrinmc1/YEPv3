require('dotenv').config({ path: '.env.local' });
const { google } = require('googleapis');

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

// Smart cost calculation based on industry, difficulty, and keywords
function calculateRealisticCost(idea) {
  const title = idea.title.toLowerCase();
  const industry = idea.industry.toLowerCase();
  const difficulty = idea.difficulty;
  
  // Physical products / inventory = higher cost
  const physicalKeywords = ['delivery', 'shipping', 'product', 'box', 'kit', 'merchandise', 'inventory'];
  const isPhysical = physicalKeywords.some(k => title.includes(k) || industry.includes(k));
  
  // Service / SaaS = lower cost
  const digitalKeywords = ['ai', 'app', 'saas', 'software', 'platform', 'automation', 'tool', 'api'];
  const isDigital = digitalKeywords.some(k => title.includes(k) || industry.includes(k));
  
  // Content / consulting = very low cost
  const serviceKeywords = ['consulting', 'coaching', 'course', 'newsletter', 'content', 'service'];
  const isService = serviceKeywords.some(k => title.includes(k) || industry.includes(k));
  
  // Calculate based on type and difficulty
  let min, max;
  
  if (isService) {
    // Consulting, coaching, content creation
    min = 0;
    max = difficulty === 'Beginner' ? 200 : difficulty === 'Intermediate' ? 500 : 1000;
  } else if (isDigital) {
    // Software, apps, SaaS
    min = difficulty === 'Beginner' ? 0 : 100;
    max = difficulty === 'Beginner' ? 500 : difficulty === 'Intermediate' ? 2000 : 5000;
  } else if (isPhysical) {
    // Physical products, delivery services
    min = difficulty === 'Beginner' ? 500 : 1000;
    max = difficulty === 'Beginner' ? 2000 : difficulty === 'Intermediate' ? 5000 : 10000;
  } else {
    // Default / mixed
    min = difficulty === 'Beginner' ? 0 : 500;
    max = difficulty === 'Beginner' ? 1000 : difficulty === 'Intermediate' ? 3000 : 7000;
  }
  
  // Format nicely
  if (min === 0 && max <= 100) return '$0 - $100';
  if (min === 0 && max <= 500) return '$0 - $500';
  if (min < 1000 && max < 1000) return `$${min} - $${max.toLocaleString()}`;
  
  // Round to nice numbers for display
  const roundedMax = Math.round(max / 1000) * 1000;
  return `$${min.toLocaleString()} - $${roundedMax.toLocaleString()}`;
}

async function recalculateAllCosts() {
  console.log('\n💰 Smart Startup Cost Recalculation\n');
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
      rowIndex: index + 2,
      id: row[0] || '',
      title: row[1] || '',
      industry: row[2] || '',
      difficulty: row[7] || 'Intermediate',
      currentCost: row[9] || 'TBD',
    }));
    
    console.log('💡 Calculating realistic costs based on:');
    console.log('   • Industry type (digital vs physical vs service)');
    console.log('   • Difficulty level');
    console.log('   • Business model keywords\n');
    
    // Calculate new costs
    let updates = [];
    let improved = 0;
    
    for (const idea of ideas) {
      const newCost = calculateRealisticCost(idea);
      
      updates.push({
        range: `Sheet1!J${idea.rowIndex}`,
        values: [[newCost]]
      });
      
      // Track how many changed
      if (newCost !== idea.currentCost) improved++;
    }
    
    console.log(`📊 Processed ${ideas.length} ideas, ${improved} will be updated\n`);
    
    // Show some examples
    console.log('📋 Sample recalculations:');
    ideas.slice(0, 15).forEach((idea, i) => {
      const newCost = updates[i].values[0][0];
      if (newCost !== idea.currentCost) {
        console.log(`   ${idea.title.substring(0, 45)}... | ${idea.currentCost} → ${newCost}`);
      }
    });
    
    console.log('\n📤 Updating costs in Google Sheets...');
    
    // Update all at once
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: sheetId,
      requestBody: {
        valueInputOption: 'RAW',
        data: updates
      }
    });
    
    console.log(`\n✅ Successfully updated ${updates.length} startup costs!\n`);
    
    // Stats
    const costRanges = {};
    updates.forEach(u => {
      const cost = u.values[0][0];
      costRanges[cost] = (costRanges[cost] || 0) + 1;
    });
    
    console.log('📊 Cost distribution:');
    Object.entries(costRanges)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([range, count]) => {
        console.log(`   ${range}: ${count} ideas`);
      });
    
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
