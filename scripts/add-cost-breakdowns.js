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

// Generate cost breakdown based on idea characteristics
function generateCostBreakdown(idea) {
  const title = idea.title.toLowerCase();
  const industry = idea.industry.toLowerCase();
  const difficulty = idea.difficulty;
  const costRange = idea.startupCost;
  
  // Parse cost range
  const costs = costRange.match(/\d+/g) || ['0', '1000'];
  const minCost = parseInt(costs[0].replace(',', ''));
  const maxCost = parseInt(costs[1]?.replace(',', '') || costs[0].replace(',', ''));
  
  const breakdown = [];
  
  // 1. Tools & Software
  const isAI = title.includes('ai') || title.includes('automation');
  const isSaaS = title.includes('app') || title.includes('platform') || title.includes('saas');
  const isPhysical = title.includes('delivery') || title.includes('product') || title.includes('box');
  const isService = title.includes('consulting') || title.includes('coaching') || title.includes('course');
  
  if (isAI || isSaaS) {
    breakdown.push({
      category: 'AI Tools & APIs',
      items: [
        { name: 'OpenAI / Claude API credits', cost: '$20-100/mo', description: 'For AI functionality' },
        { name: 'No-code platform (Bubble, Webflow)', cost: '$25-50/mo', description: 'Build without coding' },
        { name: 'Database (Supabase, Firebase)', cost: '$0-25/mo', description: 'Store user data' }
      ]
    });
  } else if (isPhysical) {
    breakdown.push({
      category: 'Inventory & Logistics',
      items: [
        { name: 'Initial inventory', cost: `$${Math.floor(maxCost * 0.4)}-${Math.floor(maxCost * 0.6)}`, description: 'First batch of products' },
        { name: 'Packaging materials', cost: '$50-200', description: 'Boxes, labels, tape' },
        { name: 'Shipping account setup', cost: '$0', description: 'FedEx/UPS business account' }
      ]
    });
  } else if (isService) {
    breakdown.push({
      category: 'Business Setup',
      items: [
        { name: 'Website builder', cost: '$15-30/mo', description: 'Carrd, Webflow, or Wix' },
        { name: 'Scheduling software', cost: '$0-15/mo', description: 'Calendly or Cal.com' },
        { name: 'Payment processing', cost: '$0', description: 'Stripe (2.9% + 30¢ per transaction)' }
      ]
    });
  }
  
  // 2. Marketing & Launch
  const marketingBudget = Math.min(500, Math.floor(maxCost * 0.2));
  breakdown.push({
    category: 'Marketing & Launch',
    items: [
      { name: 'Domain name', cost: '$10-15/year', description: '.com domain registration' },
      { name: 'Landing page hosting', cost: '$0-10/mo', description: 'Vercel, Netlify (free tier)' },
      { name: 'Initial ad testing', cost: `$${Math.max(50, Math.floor(marketingBudget * 0.6))}-${marketingBudget}`, description: 'Facebook/Google ads to validate' },
      { name: 'Email marketing', cost: '$0-20/mo', description: 'ConvertKit or Mailchimp free tier' }
    ]
  });
  
  // 3. Legal & Admin
  if (maxCost > 500) {
    breakdown.push({
      category: 'Legal & Administrative',
      items: [
        { name: 'Business registration', cost: '$50-300', description: 'LLC or sole proprietorship' },
        { name: 'Terms & privacy pages', cost: '$0-50', description: 'Use templates or generate with AI' },
        { name: 'Business bank account', cost: '$0', description: 'Most banks offer free business checking' }
      ]
    });
  }
  
  // 4. Difficulty-specific costs
  if (difficulty === 'Advanced') {
    breakdown.push({
      category: 'Development & Technical',
      items: [
        { name: 'Developer freelancer', cost: '$500-2000', description: 'If you need custom features built' },
        { name: 'Premium integrations', cost: '$50-200/mo', description: 'Zapier, Make.com for automation' },
        { name: 'Testing & QA tools', cost: '$0-50/mo', description: 'Bug tracking, analytics' }
      ]
    });
  }
  
  // 5. Optional/Nice-to-have
  breakdown.push({
    category: 'Optional Enhancements',
    items: [
      { name: 'Logo & branding', cost: '$0-100', description: 'Canva (free) or Fiverr designer' },
      { name: 'Stock photos', cost: '$0-30', description: 'Unsplash (free) or paid stock' },
      { name: 'Business cards', cost: '$20-50', description: 'Vistaprint for networking' }
    ]
  });
  
  return breakdown;
}

// Format breakdown as text for storage
function formatBreakdownAsText(breakdown) {
  let text = '';
  breakdown.forEach(section => {
    text += `\n${section.category}:\n`;
    section.items.forEach(item => {
      text += `• ${item.name} (${item.cost}): ${item.description}\n`;
    });
  });
  return text.trim();
}

async function addCostBreakdowns() {
  console.log('\n💰 Generating Cost Breakdowns\n');
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
      startupCost: row[9] || '$500 - $2,000',
    }));
    
    console.log('💡 Generating detailed cost breakdowns...\n');
    
    // Check if column S exists (we'll add breakdowns there)
    // Column S = index 18 (A=0, B=1, ..., S=18)
    
    let updates = [];
    
    for (const idea of ideas) {
      const breakdown = generateCostBreakdown(idea);
      const breakdownText = formatBreakdownAsText(breakdown);
      
      updates.push({
        range: `Sheet1!S${idea.rowIndex}`,
        values: [[breakdownText]]
      });
    }
    
    console.log(`📊 Generated ${updates.length} cost breakdowns\n`);
    
    // Show example
    const example = ideas[24]; // AI Landing Page Generator
    const exampleBreakdown = generateCostBreakdown(example);
    console.log('📋 Example breakdown for:', example.title);
    console.log(formatBreakdownAsText(exampleBreakdown));
    console.log('\n');
    
    console.log('📤 Adding header and updating breakdowns in Google Sheets...\n');
    
    // First, add header to column S
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: 'Sheet1!S1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [['Cost Breakdown']]
      }
    });
    
    // Then update all breakdowns
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: sheetId,
      requestBody: {
        valueInputOption: 'RAW',
        data: updates
      }
    });
    
    console.log(`✅ Successfully added cost breakdowns to ${updates.length} ideas!\n`);
    console.log('✨ Breakdown complete!\n');
    console.log('These breakdowns will now appear in:\n');
    console.log('   • $9 Research Reports');
    console.log('   • $29 Implementation Plans');
    console.log('   • "What\'s Included" modals\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run it
addCostBreakdowns();
