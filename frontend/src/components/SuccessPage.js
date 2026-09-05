import React from 'react';
import './SuccessPage.css';

const SuccessPage = ({ goBack }) => {
  return (
    <div className='success-page'>
      <div className='container'>
        <div className='card success-card'>
          <div className='success-icon'>🎉</div>
          <h1 className='success-title'>THANKS FOR YOUR INFORMATION 🙏😊</h1>
          <p className='success-message'>
            Your information has been successfully submitted.
          </p>
          <p className='success-submessage'>
            Thank you for helping us maintain the Saradhi Nagar Colony records. 🏡
          </p>
          <button className='btn-primary' onClick={goBack}>
            ← BACK TO HOME
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
