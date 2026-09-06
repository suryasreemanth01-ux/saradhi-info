const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAME = 'Sheet1'; 
const KEYFILEPATH = path.join(__dirname, '..', 'credentials.json');
const TOKEN_PATH = path.join(__dirname, '..', 'token.json');

// 1. Load OAuth2 Client
function getOAuthClient() {
  const credentials = JSON.parse(fs.readFileSync(KEYFILEPATH));
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  return new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
}

// 2. Check if we have a saved token, if not, ask for it
async function authorize() {
  const oAuth2Client = getOAuthClient();

  // Check if we already saved the token from a previous run
  if (fs.existsSync(TOKEN_PATH)) {
    oAuth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH)));
    return oAuth2Client;
  }

  // If no token, generate the URL and ask for the code
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  console.log('=========================================');
  console.log('Authorize this app by visiting this URL:');
  console.log(authUrl);
  console.log('=========================================');

  // Use readline to ask for input in the terminal
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve, reject) => {
    readline.question('Paste the code from the URL here: ', (code) => {
      readline.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return reject(err);
        oAuth2Client.setCredentials(token);
        // Save the token for future use!
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
        console.log('✅ Token saved! You will not need to do this again.');
        resolve(oAuth2Client);
      });
    });
  });
}

// 3. Add data to the sheet
async function addOwnerRecord(data) {
  try {
    const authClient = await authorize();
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    const headers = [['Property Type', 'House Number', 'Building Name', 'Flat Number', 'Owner Name', 'Owner Phone']];
    const values = [[data.propertyType, data.houseNumber, data.buildingName, data.flatNumber, data.ownerName, data.ownerPhone]];

    // Check if headers exist
    const getResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:F1`,
    });

    if (!getResponse.data.values) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A1:F1`,
        valueInputOption: 'RAW',
        resource: { values: headers },
      });
      console.log('✅ Headers created.');
    }

    // Append data
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:F1`,
      valueInputOption: 'RAW',
      resource: { values: values },
    });

    console.log('✅ Data successfully written!');
    return { success: true, message: 'Data added successfully.' };

  } catch (error) {
    console.error('❌ Error:', error.message);
    return { success: false, message: error.message };
  }
}

module.exports = { addOwnerRecord };
