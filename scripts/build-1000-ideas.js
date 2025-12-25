const { execSync } = require('child_process');

console.log('🚀 Building 1000+ Ideas Library\n');
console.log('='.repeat(50));

async function buildLibrary() {
  try {
    // Step 1: Append AI ideas
    console.log('\n📥 STEP 1: Importing 200+ AI Ideas...\n');
    execSync('node scripts/append-ai-ideas.js', { stdio: 'inherit' });
    
    // Step 2: Generate more ideas to reach 1000
    console.log('\n\n🤖 STEP 2: Generating ideas with AI to reach 1000...\n');
    execSync('node scripts/generate-more-ideas.js 1000', { stdio: 'inherit' });
    
    console.log('\n\n🎉 ALL DONE! You now have 1000+ business ideas in your library!');
    
  } catch (error) {
    console.error('\n❌ Error during build:', error.message);
    process.exit(1);
  }
}

buildLibrary();
