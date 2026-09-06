const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const ownerRoutes = require('./routes/ownerRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/owners', ownerRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Saradhi Info Backend is running' });
});

// Debug endpoint - check if Google token is set
app.get('/api/debug', (req, res) => {
  const token = process.env.GOOGLE_TOKEN;
  res.json({
    googleTokenSet: !!token,
    tokenLength: token ? token.length : 0,
    tokenPreview: token ? token.substring(0, 50) + '...' : 'null',
    nodeEnv: process.env.NODE_ENV || 'not set',
    timestamp: new Date().toISOString()
  });
});

// Serve static files from the React frontend in production
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../frontend/build');
  app.use(express.static(buildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong! Please try again.'
  });
});

// Start server
app.listen(PORT, () => {
  console.log('Saradhi Info Backend running on port ' + PORT);
  console.log('http://localhost:' + PORT);
});
