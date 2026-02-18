require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  console.log('\n📧 Testing Email Setup\n');
  console.log('================================================\n');
  
  console.log('From email:', process.env.RESEND_FROM_EMAIL);
  console.log('API Key:', process.env.RESEND_API_KEY?.substring(0, 10) + '...\n');
  
  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: 'darrinmc1@yahoo.com', // Send to yourself
      subject: 'Test Email from YourExitPlans',
      html: `
        <h1>Email Test Successful! ✅</h1>
        <p>This email was sent from: <strong>${process.env.RESEND_FROM_EMAIL}</strong></p>
        <p>If you're reading this, your email domain is working perfectly!</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          Sent via Resend at ${new Date().toLocaleString()}
        </p>
      `
    });
    
    console.log('✅ EMAIL SENT SUCCESSFULLY!\n');
    console.log('Email ID:', result.data?.id);
    console.log('\nCheck your inbox at: darrinmc1@yahoo.com\n');
    console.log('If you receive it, your email domain is fully working! 🎉\n');
    
  } catch (error) {
    console.error('❌ EMAIL FAILED\n');
    console.error('Error:', error.message);
    console.log('\n⚠️ This means your domain is NOT set up yet.\n');
    
    if (error.message.includes('domain') || error.message.includes('verify')) {
      console.log('NEXT STEPS:');
      console.log('1. Go to: https://resend.com/domains');
      console.log('2. Add yourexitplans.com');
      console.log('3. Add the DNS records to Cloudflare');
      console.log('4. Wait for verification (15 min - 24 hours)');
      console.log('5. Run this test again\n');
    }
  }
}

testEmail();
