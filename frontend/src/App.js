import React, { useState } from 'react';
import './App.css';
import WelcomePage from './components/WelcomePage';
import IndependentHouseForm from './components/IndependentHouseForm';
import ApartmentForm from './components/ApartmentForm';
import ReviewPage from './components/ReviewPage';
import SuccessPage from './components/SuccessPage';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

function App() {
  const [currentPage, setCurrentPage] = useState('welcome');
  const [propertyType, setPropertyType] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    setIsSubmitting(true);
    try {
      // Adding data to Firestore
      await addDoc(collection(db, 'properties'), {
        ...formData,
        timestamp: serverTimestamp()
      });
      
      // If successful, go to success page
      setCurrentPage('success');
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("There was an error submitting the form. Please try again.");
    } finally {
      setIsSubmitting(false);
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
          isSubmitting={isSubmitting}
        />
      )}
      {currentPage === 'success' && (
        <SuccessPage goBack={goBackToWelcome} />
      )}
    </div>
  );
}

export default App;
