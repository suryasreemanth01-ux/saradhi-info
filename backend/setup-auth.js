require('dotenv').config();
const { addOwnerRecord } = require('./services/googleSheetsService');

async function setup() {
  console.log('🚀 Starting Authentication & Test...');
  
  try {
    const testData = {
      propertyType: 'SYSTEM TEST',
      houseNumber: 'TEST-001',
      buildingName: '-',
      flatNumber: '-',
      ownerName: 'System Test User',
      ownerPhone: '9876543210'
    };
    
    console.log('📝 Sending test record to Google Sheets...');
    const result = await addOwnerRecord(testData);
    
    if (result.success) {
      console.log('✅ Setup successful! Check your sheet now.');
    } else {
      console.log('❌ Setup failed:', result.message);
    }
  } catch (error) {
    console.error('❌ Big Error:', error.message);
  }
}

setup();
