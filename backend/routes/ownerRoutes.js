const express = require('express');
const router = express.Router();
const { submitOwnerInfo } = require('../controllers/ownerController');

// POST /api/owners - Submit owner information
router.post('/', submitOwnerInfo);

module.exports = router;
