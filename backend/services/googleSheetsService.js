const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

const SPREADSHEET_ID = '10oDFsERbXjWaQIswjAAvbMN-WTvQpDIZ53FPaP-YIIU';
const CREDENTIALS_PATH = path.join(__dirname, '../config/credentials.json');
const TOKEN_PATH = path.join(__dirname, '../config/token.json');

// Load OAuth2 client
const getAuthClient = async () => {
  try {
    if (!fs.existsSync(CREDENTIALS_PATH)) {
      console.error('? Credentials file not found at:', CREDENTIALS_PATH);
      throw new Error('Credentials file not found');
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
    const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]
    );

    // For Render: Use environment variable token if available
    if (process.env.GOOGLE_TOKEN) {
      try {
        const token = JSON.parse(process.env.GOOGLE_TOKEN);
        oAuth2Client.setCredentials(token);
        console.log('? Using token from environment variable');
        return oAuth2Client;
      } catch (e) {
        console.log('?? Could not parse GOOGLE_TOKEN env var');
      }
    }

    // For local: Use token.json file
    if (fs.existsSync(TOKEN_PATH)) {
      const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
      oAuth2Client.setCredentials(token);
      return oAuth2Client;
    }

    // If no token found, request new one
    const token = await getAccessToken(oAuth2Client);
    oAuth2Client.setCredentials(token);
    return oAuth2Client;
  } catch (error) {
    console.error('Error getting auth client:', error);
    throw error;
  }
};

// Get access token
const getAccessToken = (oAuth2Client) => {
  return new Promise((resolve, reject) => {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/spreadsheets'],
      prompt: 'consent'
    });
    
    console.log('=========================================');
    console.log('?? Google Sheets Authentication Required');
    console.log('=========================================');
    console.log('1. Open this URL in your browser:');
    console.log(authUrl);
    console.log('2. Log in with your Google account');
    console.log('3. Grant permission');
    console.log('4. Copy the code from the URL');
    console.log('=========================================');
    
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    
    rl.question('Paste the code here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) {
          console.error('Error getting token:', err);
          reject(err);
        }
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
        console.log('? Token saved successfully!');
        resolve(token);
      });
    });
  });
};

// Get Sheets client
const getSheetsClient = async () => {
  const auth = await getAuthClient();
  return google.sheets({ version: 'v4', auth });
};

// Add owner record
const addOwnerRecord = async (ownerData) => {
  try {
    const sheets = await getSheetsClient();
    
    const values = [[
      new Date().toISOString(),
      ownerData.propertyType,
      ownerData.houseNumber || '-',
      ownerData.buildingName || '-',
      ownerData.flatNumber || '-',
      ownerData.ownerName,
      ownerData.ownerPhone,
      new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    ]];
    
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A:H',
      valueInputOption: 'RAW',
      requestBody: { values },
    });
    
    console.log('? Record added to Google Sheets');
    return {
      success: true,
      message: 'Record added to Google Sheets'
    };
  } catch (error) {
    console.error('Error adding to Google Sheets:', error);
    return {
      success: false,
      message: 'Failed to add record to Google Sheets: ' + error.message
    };
  }
};

// Get all records
const getAllRecords = async () => {
  try {
    const sheets = await getSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A:H',
    });
    return response.data.values || [];
  } catch (error) {
    console.error('Error reading from Google Sheets:', error);
    return [];
  }
};

module.exports = {
  addOwnerRecord,
  getAllRecords
};
