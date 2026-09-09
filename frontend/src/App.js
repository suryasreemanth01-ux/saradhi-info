import React, { useState } from 'react';
import './App.css';
import WelcomePage from './components/WelcomePage';
import IndependentHouseForm from './components/IndependentHouseForm';
import ApartmentForm from './components/ApartmentForm';
import ReviewPage from './components/ReviewPage';
import SuccessPage from './components/SuccessPage';
import AdminDashboard from './components/AdminDashboard';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

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
    console.log('=== SUBMIT FORM CALLED ===');
    console.log('Form data:', formData);
    
    setIsSubmitting(true);
    
    try {
      const dataToSave = {
        propertyType: formData.propertyType,
        houseNumber: formData.houseNumber || '',
        buildingName: formData.buildingName || '',
        flatNumber: formData.flatNumber || '',
        ownerName: formData.ownerName,
        ownerPhone: formData.ownerPhone,
        timestamp: new Date().toISOString()
      };

      console.log('Saving to Firestore:', dataToSave);
      
      const docRef = await addDoc(collection(db, 'owners'), dataToSave);
      console.log('✅ Document written with ID:', docRef.id);
      
      setIsSubmitting(false);
      setCurrentPage('success');
      
    } catch (error) {
      console.error('❌ Firestore Error:', error);
      setIsSubmitting(false);
      alert('❌ Unable to submit your information. Please try again.\n\nError: ' + error.message);
    }
  };

  const editForm = () => {
    if (propertyType === 'Independent House') {
      setCurrentPage('independentHouseForm');
    } else {
      setCurrentPage('apartmentForm');
    }
  };

  // Admin route - accessible at /admin
  if (currentPage === 'admin') {
    return <AdminDashboard />;
  }

  return (
    <div className="App">
      {/* Add admin link in header or footer */}
      <div style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 1000 }}>
        <button 
          onClick={() => setCurrentPage('admin')}
          style={{
            background: '#2e7d32',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            fontSize: '20px',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}
          title="Admin Dashboard"
        >
          🛠️
        </button>
      </div>

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
