const { google } = require('googleapis');
require('dotenv').config({ path: '.env.local' });

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

async function analyzeStructure() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: '1lVLSEC9e4g80fqVH1P9A4feOD3HfrBAFV6VEGJA-lFc',
      range: 'ideas!A1:P10',
    });
    
    console.log('First 10 rows to analyze structure:\n');
    response.data.values.forEach((row, index) => {
      console.log(`Row ${index + 1}:`);
      row.forEach((cell, colIndex) => {
        console.log(`  Col ${String.fromCharCode(65 + colIndex)}: ${cell ? cell.substring(0, 80) : '[empty]'}`);
      });
      console.log('---');
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

analyzeStructure();
