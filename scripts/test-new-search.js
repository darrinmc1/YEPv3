require('dotenv').config({ path: '.env.local' });

// Import the search function
const { searchIdeas } = require('../lib/services/google-sheets.ts');

async function testNewSearch() {
  console.log('\n🔍 Testing IMPROVED search function...\n');
  
  const testTerms = [
    'AI tool automation',
    'pet industry',
    'food business',
    'real estate',
    'saas platform'
  ];
  
  for (const term of testTerms) {
    console.log(`\n📊 Searching for: "${term}"`);
    const results = await searchIdeas({
      searchTerm: term,
      industry: 'any',
      difficulty: 'any',
      budget: 'any'
    });
    
    console.log(`✅ Found ${results.length} matches`);
    if (results.length > 0) {
      console.log('Top 3:');
      results.slice(0, 3).forEach((idea, i) => {
        console.log(`  ${i+1}. ${idea.title} (${idea.industry})`);
      });
    }
  }
}

testNewSearch().catch(console.error);
