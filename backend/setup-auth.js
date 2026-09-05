// Setup authentication for Google Sheets
const { addOwnerRecord } = require('./services/googleSheetsService');

async function setup() {
  console.log('?? Setting up Google Sheets Authentication...');
  console.log('-------------------------------------------');
  
  try {
    const testData = {
      propertyType: 'SYSTEM TEST',
      houseNumber: 'TEST-001',
      buildingName: '-',
      flatNumber: '-',
      ownerName: 'System Test User',
      ownerPhone: '9876543210'
    };
    
    console.log('?? Sending test record to Google Sheets...');
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
