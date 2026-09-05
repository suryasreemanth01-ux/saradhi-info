import React, { useState } from 'react';
import './ApartmentForm.css';

const ApartmentForm = ({ formData, updateFormData, goToReview, goBack }) => {
  const [errors, setErrors] = useState({});

  const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.buildingName || formData.buildingName.trim() === '') {
      newErrors.buildingName = 'Building name is required';
    }

    if (!formData.flatNumber || formData.flatNumber.trim() === '') {
      newErrors.flatNumber = 'Flat number is required';
    }

    if (!formData.ownerName || formData.ownerName.trim() === '') {
      newErrors.ownerName = 'Owner name is required';
    }

    if (!formData.ownerPhone || formData.ownerPhone.trim() === '') {
      newErrors.ownerPhone = 'Phone number is required';
    } else if (!validatePhone(formData.ownerPhone)) {
      newErrors.ownerPhone = 'Please enter a valid 10-digit Indian mobile number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleContinue = () => {
    if (validateForm()) {
      goToReview();
    }
  };

  return (
    <div className='form-page'>
      <div className='container'>
        <div className='card'>
          <div className='form-header'>
            <h2 className='form-title'>Apartment Details 🏢</h2>
            <p className='form-subtitle'>Please fill in all required fields</p>
          </div>

          <div className='form-body'>
            <div className='form-group'>
              <label>
                Building Name <span className='required'>*</span>
              </label>
              <input
                type='text'
                name='buildingName'
                value={formData.buildingName}
                onChange={handleInputChange}
                placeholder='Name of the apartment building'
                className={errors.buildingName ? 'error' : ''}
              />
              {errors.buildingName && (
                <span className='error-message'>{errors.buildingName}</span>
              )}
            </div>

            <div className='form-group'>
              <label>
                Flat Number <span className='required'>*</span>
              </label>
              <input
                type='text'
                name='flatNumber'
                value={formData.flatNumber}
                onChange={handleInputChange}
                placeholder='e.g., 101, A-202, 3B'
                className={errors.flatNumber ? 'error' : ''}
              />
              {errors.flatNumber && (
                <span className='error-message'>{errors.flatNumber}</span>
              )}
            </div>

            <div className='form-group'>
              <label>
                Owner Name <span className='required'>*</span>
              </label>
              <input
                type='text'
                name='ownerName'
                value={formData.ownerName}
                onChange={handleInputChange}
                placeholder='Full name of the owner'
                className={errors.ownerName ? 'error' : ''}
              />
              {errors.ownerName && (
                <span className='error-message'>{errors.ownerName}</span>
              )}
            </div>

            <div className='form-group'>
              <label>
                Owner Phone Number <span className='required'>*</span>
              </label>
              <input
                type='tel'
                name='ownerPhone'
                value={formData.ownerPhone}
                onChange={handleInputChange}
                placeholder='10-digit mobile number'
                maxLength='10'
                className={errors.ownerPhone ? 'error' : ''}
              />
              {errors.ownerPhone && (
                <span className='error-message'>{errors.ownerPhone}</span>
              )}
            </div>

            <div className='button-group'>
              <button className='btn-secondary' onClick={goBack}>
                ← BACK
              </button>
              <button className='btn-primary' onClick={handleContinue}>
                REVIEW INFORMATION →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApartmentForm;
