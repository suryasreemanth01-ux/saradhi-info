const excelService = require('../services/excelService');

// Validate Indian phone number (10 digits)
const validatePhoneNumber = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

// Validate required fields based on property type
const validateSubmission = (data) => {
  const errors = [];

  // Check property type
  if (!data.propertyType || !['Independent House', 'Apartment'].includes(data.propertyType)) {
    errors.push('Valid property type is required');
  }

  // Validate based on property type
  if (data.propertyType === 'Independent House') {
    if (!data.houseNumber || data.houseNumber.trim() === '') {
      errors.push('House number is required');
    }
  } else if (data.propertyType === 'Apartment') {
    if (!data.buildingName || data.buildingName.trim() === '') {
      errors.push('Building name is required');
    }
    if (!data.flatNumber || data.flatNumber.trim() === '') {
      errors.push('Flat number is required');
    }
  }

  // Validate owner name
  if (!data.ownerName || data.ownerName.trim() === '') {
    errors.push('Owner name is required');
  }

  // Validate phone number
  if (!data.ownerPhone || !validatePhoneNumber(data.ownerPhone)) {
    errors.push('Please enter a valid 10-digit Indian mobile number');
  }

  return errors;
};

// Controller function to handle submission
const submitOwnerInfo = async (req, res) => {
  try {
    const data = req.body;

    // Trim string fields
    if (data.ownerName) data.ownerName = data.ownerName.trim();
    if (data.houseNumber) data.houseNumber = data.houseNumber.trim();
    if (data.buildingName) data.buildingName = data.buildingName.trim();
    if (data.flatNumber) data.flatNumber = data.flatNumber.trim();
    if (data.ownerPhone) data.ownerPhone = data.ownerPhone.trim();

    // Validate data
    const validationErrors = validateSubmission(data);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Save to Excel
    const result = await excelService.addOwnerRecord(data);

    if (result.success) {
      return res.status(201).json({
        success: true,
        message: 'Information submitted successfully!'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: result.message || 'Failed to save information'
      });
    }
  } catch (error) {
    console.error('Error in submitOwnerInfo:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while submitting your information. Please try again.'
    });
  }
};

module.exports = {
  submitOwnerInfo
};
