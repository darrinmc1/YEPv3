const { google } = require('googleapis');
require('dotenv').config({ path: '.env.local' });

// Service account credentials
const PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n');
const CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
const LIBRARY_SHEET_ID = process.env.GOOGLE_SHEET_ID_LIBRARY;

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: CLIENT_EMAIL,
    private_key: PRIVATE_KEY,
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Map external data to our schema
function mapToLibrarySchema(row, headers, source) {
  // Find indexes for common columns
  const getVal = (colName) => {
    const index = headers.findIndex(h => 
      h?.toLowerCase().includes(colName.toLowerCase())
    );
    return index >= 0 ? row[index] : '';
  };

  return [
    new Date().toISOString(), // timestamp
    getVal('name') || getVal('title') || getVal('idea') || '',
    getVal('description') || getVal('oneliner') || getVal('summary') || '',
    getVal('industry') || getVal('category') || getVal('niche') || 'General',
    getVal('score') || Math.floor(Math.random() * 30) + 70, // Random 70-100 if no score
    getVal('market') || getVal('marketsize') || 'Unknown',
    getVal('growth') || '+15%',
    getVal('difficulty') || 'Intermediate',
    getVal('time') || getVal('timeframe') || '4-8 weeks',
    getVal('cost') || getVal('startup') || getVal('budget') || '$500-$2,000',
    getVal('why') || getVal('whynow') || getVal('opportunity') || 'Market opportunity identified',
    '[]', // insights (empty for now)
    '[]', // lockedContent (empty for now)
    source, // source
    '', // researchData (empty for now)
    'active', // status
    '' // notes
  ];
}

async function importIdeas() {
  try {
    console.log('Starting import process...\n');

    // Fetch both spreadsheets
    console.log('Fetching spreadsheet 1...');
    const sheet1 = await sheets.spreadsheets.values.get({
      spreadsheetId: '18kDx_i4spgjSYN_elsI3Cs-MCLbltJIsZCRiJ5Nnvfw',
      range: 'A:Z',
    });

    console.log('Fetching spreadsheet 2...');
    const sheet2 = await sheets.spreadsheets.values.get({
      spreadsheetId: '145m-dhI75b6TbUQIuEeDqE5EwHNlkcAkOumJU72eAJU',
      range: 'A:Z',
    });

    const data1 = sheet1.data.values || [];
    const data2 = sheet2.data.values || [];

    console.log(`\nSheet 1: ${data1.length} rows`);
    console.log(`Sheet 2: ${data2.length} rows`);
    console.log(`\nSheet 1 headers:`, data1[0]);
    console.log(`Sheet 2 headers:`, data2[0]);

    // Map to library schema
    const headers1 = data1[0] || [];
    const headers2 = data2[0] || [];

    const mappedIdeas1 = data1.slice(1, 11).map(row => 
      mapToLibrarySchema(row, headers1, 'Import-Sheet1')
    );

    const mappedIdeas2 = data2.slice(1, 11).map(row => 
      mapToLibrarySchema(row, headers2, 'Import-Sheet2')
    );

    console.log(`\n\nSample mapped idea from Sheet 1:`);
    console.log(mappedIdeas1[0]);

    console.log(`\n\nSample mapped idea from Sheet 2:`);
    console.log(mappedIdeas2[0]);

    // Append to library
    console.log(`\n\nAppending ${mappedIdeas1.length + mappedIdeas2.length} ideas to library...`);
    
    const allIdeas = [...mappedIdeas1, ...mappedIdeas2];
    
    await sheets.spreadsheets.values.append({
      spreadsheetId: LIBRARY_SHEET_ID,
      range: 'Sheet1!A:Q',
      valueInputOption: 'RAW',
      requestBody: {
        values: allIdeas,
      },
    });

    console.log(`✅ Successfully imported ${allIdeas.length} ideas!`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

importIdeas();
