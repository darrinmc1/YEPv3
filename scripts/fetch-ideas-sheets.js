const { google } = require('googleapis');
require('dotenv').config({ path: '.env.local' });

// Service account credentials from .env.local
const PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n');
const CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: CLIENT_EMAIL,
    private_key: PRIVATE_KEY,
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });

async function fetchIdeas() {
  try {
    // First spreadsheet - Idea Database
    console.log('Fetching first spreadsheet (Idea Database)...');
    const response1 = await sheets.spreadsheets.values.get({
      spreadsheetId: '1lVLSEC9e4g80fqVH1P9A4feOD3HfrBAFV6VEGJA-lFc',
      range: 'ideas!A:Z',
    });
    
    console.log('First spreadsheet headers:');
    console.log(response1.data.values[0]);
    console.log('\nFirst 3 rows:');
    console.log(JSON.stringify(response1.data.values.slice(0, 4), null, 2));
    console.log(`\nTotal rows: ${response1.data.values.length}`);
    
    // Second spreadsheet - 200+ Ways to Make Money with AI
    console.log('\n\n=================================\nFetching second spreadsheet (200+ Ways to Make Money with AI)...');
    const response2 = await sheets.spreadsheets.values.get({
      spreadsheetId: '145m-dhI75b6TbUQIuEeDqE5EwHNlkcAkOumJU72eAJU',
      range: 'ideas!A:Z',
    });
    
    console.log('Second spreadsheet headers:');
    console.log(response2.data.values[0]);
    console.log('\nFirst 3 rows:');
    console.log(JSON.stringify(response2.data.values.slice(0, 4), null, 2));
    console.log(`\nTotal rows: ${response2.data.values.length}`);
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

fetchIdeas();
