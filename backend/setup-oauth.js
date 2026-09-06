const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

const CREDENTIALS_PATH = path.join(__dirname, 'config/credentials.json');
const TOKEN_PATH = path.join(__dirname, 'config/token.json');

// Load credentials
const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;

const oAuth2Client = new google.auth.OAuth2(
  client_id, client_secret, redirect_uris[0]
);

// Generate auth URL
const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/spreadsheets'],
  prompt: 'consent'
});

console.log('=============================================');
console.log('?? GOOGLE SHEETS AUTHENTICATION');
console.log('=============================================');
console.log('');
console.log('Step 1: Copy this URL and paste it in your browser:');
console.log('');
console.log(authUrl);
console.log('');
console.log('Step 2: Log in with your Google account');
console.log('');
console.log('Step 3: Click "Allow" to grant permission');
console.log('');
console.log('Step 4: After allowing, you will be redirected to a page');
console.log('    The URL will look like:');
console.log('    http://localhost/?code=4/0AY0e-g7Kxabc123...&scope=...');
console.log('');
console.log('Step 5: Copy ONLY the code after "code="');
console.log('    Example: 4/0AY0e-g7Kxabc123...');
console.log('    (Do NOT copy the full URL, just the code)');
console.log('=============================================');
console.log('');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Paste the authorization code here: ', (code) => {
  rl.close();
  oAuth2Client.getToken(code, (err, token) => {
    if (err) {
      console.error('? Error getting token:', err.message);
      return;
    }
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
    console.log('? Token saved successfully!');
    console.log('? Setup complete! Your app is now connected to Google Sheets.');
  });
});
