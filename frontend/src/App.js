import React, { useState } from 'react';
import './App.css';
import WelcomePage from './components/WelcomePage';
import IndependentHouseForm from './components/IndependentHouseForm';
import ApartmentForm from './components/ApartmentForm';
import ReviewPage from './components/ReviewPage';
import SuccessPage from './components/SuccessPage';

function App() {
  const [currentPage, setCurrentPage] = useState('welcome');
  const [propertyType, setPropertyType] = useState(null);
  const [formData, setFormData] = useState({
    propertyType: '',
    houseNumber: '',
    buildingName: '',
    flatNumber: '',
    ownerName: '',
    ownerPhone: ''
  });

  const selectPropertyType = (type) => {
    setPropertyType(type);
    setFormData({
      ...formData,
      propertyType: type
    });
    setCurrentPage(type === 'Independent House' ? 'independentHouseForm' : 'apartmentForm');
  };

  const updateFormData = (data) => {
    setFormData({ ...formData, ...data });
  };

  const goToReview = () => {
    setCurrentPage('review');
  };

  const goBackToWelcome = () => {
    setCurrentPage('welcome');
    setPropertyType(null);
    setFormData({
      propertyType: '',
      houseNumber: '',
      buildingName: '',
      flatNumber: '',
      ownerName: '',
      ownerPhone: ''
    });
  };

  const submitForm = async () => {
    console.log('=== SUBMIT FORM CALLED ===');
    console.log('Form data:', formData);
    console.log('API endpoint:', '/api/owners');
    
    try {
      const response = await fetch('/api/owners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      
      const result = await response.json();
      console.log('Response data:', result);

      if (result.success) {
        setCurrentPage('success');
      } else {
        const errorMsg = result.message || 'Unknown error occurred';
        console.error('Submission failed:', result);
        alert('? Submission Failed: ' + errorMsg);
      }
    } catch (error) {
      console.error('? Error submitting form:', error);
      alert('? Error: ' + error.message + '\n\nCheck console for details.');
    }
  };

  const editForm = () => {
    if (propertyType === 'Independent House') {
      setCurrentPage('independentHouseForm');
    } else {
      setCurrentPage('apartmentForm');
    }
  };

  return (
    <div className="App">
      {currentPage === 'welcome' && (
        <WelcomePage onSelectProperty={selectPropertyType} />
      )}
      {currentPage === 'independentHouseForm' && (
        <IndependentHouseForm
          formData={formData}
          updateFormData={updateFormData}
          goToReview={goToReview}
          goBack={goBackToWelcome}
        />
      )}
      {currentPage === 'apartmentForm' && (
        <ApartmentForm
          formData={formData}
          updateFormData={updateFormData}
          goToReview={goToReview}
          goBack={goBackToWelcome}
        />
      )}
      {currentPage === 'review' && (
        <ReviewPage
          formData={formData}
          submitForm={submitForm}
          editForm={editForm}
          goBack={goBackToWelcome}
        />
      )}
      {currentPage === 'success' && (
        <SuccessPage goBack={goBackToWelcome} />
      )}
    </div>
  );
}

export default App;
