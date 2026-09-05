// Setup authentication for Google Sheets
require('dotenv').config(); // Load environment variables from .env file
const { google } = require('googleapis');
const path = require('path');
const { addOwnerRecord } = require('./services/googleSheetsService');

// Set up Google Auth using credentials.json
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

async function getAuthClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, 'credentials.json'), // Looks for credentials.json in backend folder
    scopes: SCOPES,
  });
  return auth.getClient();
}

async function setup() {
  console.log('?? Setting up Google Sheets Authentication...');
  console.log('-------------------------------------------');
  
  try {
    // Authenticate first
    console.log('?? Authenticating with Google...');
    const authClient = await getAuthClient();
    console.log('? Authentication successful!');

    // Prepare test data
    const testData = {
      propertyType: 'SYSTEM TEST',
      houseNumber: 'TEST-001',
      buildingName: '-',
      flatNumber: '-',
      ownerName: 'System Test User',
      ownerPhone: '9876543210'
    };
    
    console.log('?? Sending test record to Google Sheets...');
    
    // Call your service (make sure your service is updated to accept authClient if needed)
    // If your googleSheetsService creates its own auth, you might need to pass the ID.
    const result = await addOwnerRecord(testData);
    
    if (result.success) {
      console.log('? Google Sheets setup successful!');
      console.log('?? Check your Google Sheet:');
      console.log('https://docs.google.com/spreadsheets/d/12AnlzD0fTmVLhXmiGfvQ1JkQxqJKNsnNOcIDlMF2mGM/');
    } else {
      console.log('? Setup failed:', result.message);
    }
  } catch (error) {
    console.error('? Setup error:', error.message);
  }
}

setup();
