/**
 * Test Full Purchase Flow
 * 
 * ⚠️  BEFORE RUNNING: 
 * 1. Make sure dev server is running: npm run dev
 * 2. Get a real Idea ID from your Google Sheet
 * 3. Update the ideaId below (line 29)
 * 
 * Google Sheet: https://docs.google.com/spreadsheets/d/1aKxrwa9pAL6qhltvqd1eJERFZsxqWlHWQg2e9Gj3QZ8
 * Look at Column A for ID values (could be "1", "2", "AI_001", etc.)
 */

async function testPurchaseFlow() {
  console.log('🧪 Testing Full Purchase Flow\n')
  console.log('='.repeat(60))
  
  const testCases = [
    {
      name: 'Research Report ($9)',
      payload: {
        email: 'darrinmc1@yahoo.com',
        productType: 'research',
        price: 9,
        ideaId: '1' // ⚠️  CHANGE THIS to a real ID from your Google Sheet!
      }
    },
    
    // Uncomment to test other product types after first test works:
    
    // {
    //   name: 'Implementation Plan ($29)',
    //   payload: {
    //     email: 'darrinmc1@yahoo.com',
    //     productType: 'implementation',
    //     price: 29,
    //     ideaId: '1' // ⚠️  CHANGE THIS
    //   }
    // },
    
    // {
    //   name: '7 Ideas Bundle ($49)',
    //   payload: {
    //     email: 'darrinmc1@yahoo.com',
    //     productType: 'idea-bundle',
    //     price: 49,
    //     ideaIds: ['1', '2', '3', '4', '5', '6', '7'] // ⚠️  CHANGE THESE
    //   }
    // }
  ]

  for (const testCase of testCases) {
    console.log(`\n📦 Test: ${testCase.name}`)
    console.log('-'.repeat(60))
    
    try {
      console.log('Sending request...')
      const response = await fetch('http://localhost:3000/api/process-purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCase.payload)
      })

      const result = await response.json()

      if (response.ok) {
        console.log('✅ SUCCESS!')
        console.log('\nResponse:')
        console.log(JSON.stringify(result, null, 2))
        console.log('\n📧 Check your email: darrinmc1@yahoo.com')
        console.log('📊 Check Purchases Sheet: https://docs.google.com/spreadsheets/d/1Dk0s8NBEUU9QaNLwhNjDAn9nPwudPkZDft5vZmr3QXs')
      } else {
        console.log('❌ FAILED!')
        console.log('\nError Response:')
        console.log(JSON.stringify(result, null, 2))
        
        if (result.details && result.details.includes('not found')) {
          console.log('\n💡 TIP: Update ideaId on line 29 with a real ID from your Google Sheet')
          console.log('   Sheet: https://docs.google.com/spreadsheets/d/1aKxrwa9pAL6qhltvqd1eJERFZsxqWlHWQg2e9Gj3QZ8')
        }
      }

    } catch (error) {
      console.log('❌ REQUEST FAILED!')
      console.error('Error:', error.message)
      
      if (error.message.includes('ECONNREFUSED')) {
        console.log('\n💡 TIP: Make sure your dev server is running:')
        console.log('   Run: npm run dev')
      }
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('\n📋 What to Verify:')
  console.log('  [ ] Email received at darrinmc1@yahoo.com')
  console.log('  [ ] PDF attached to email')
  console.log('  [ ] Purchase recorded in Google Sheets')
  console.log('  [ ] Delivery Status shows "sent"')
  console.log('\n💡 See QUICK_START_TESTING.md for more testing options\n')
}

// Check if server is likely running
console.log('⚠️  CHECKLIST BEFORE RUNNING:')
console.log('  [ ] Dev server running? (npm run dev)')
console.log('  [ ] Updated ideaId on line 29?')
console.log('  [ ] Have internet connection?\n')

console.log('Starting test in 2 seconds...\n')

setTimeout(() => {
  testPurchaseFlow()
}, 2000)
