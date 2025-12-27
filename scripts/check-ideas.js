require('dotenv').config({ path: '.env.local' });
const { google } = require('googleapis');

const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
const sheetId = process.env.GOOGLE_SHEET_ID_LIBRARY;

console.log('Sheet ID:', sheetId);
console.log('Client Email:', clientEmail?.substring(0, 20) + '...');

const auth = new google.auth.JWT({
  email: clientEmail,
  key: privateKey,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

async function checkDatabase() {
  try {
    console.log('\nChecking YEP_IdeasLibrary...\n');
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Sheet1!A2:C', // Get ALL rows of ID, Name, Category
    });
    
    const rows = response.data.values || [];
    console.log(`✅ Found ${rows.length} ideas in database`);
    
    if (rows.length > 0) {
      console.log('\nFirst 10 ideas:');
      rows.slice(0, 10).forEach((row, i) => {
        console.log(`${i+1}. [${row[0]}] ${row[1]} - ${row[2]}`);
      });
    } else {
      console.log('❌ No ideas found! Database might be empty.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkDatabase();
