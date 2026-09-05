import React from 'react';
import './WelcomePage.css';

const WelcomePage = ({ onSelectProperty }) => {
  return (
    <div className='welcome-page'>
      <div className='container'>
        <div className='welcome-content'>
          <div className='header-section'>
            <h1 className='main-title'>
              WELCOME TO SARADHI NAGAR COLONY 🏡
            </h1>
            <h2 className='sub-title'>Saradhi Info</h2>
            <p className='description'>
              Please provide your property and owner information. 
              All fields marked as required must be completed.
            </p>
          </div>

          <div className='property-selection'>
            <h3 className='selection-title'>Select Your Property Type</h3>
            <div className='property-cards'>
              <div 
                className='property-card independent'
                onClick={() => onSelectProperty('Independent House')}
              >
                <div className='card-icon'>🏠</div>
                <h3>Independent House</h3>
                <p>Single-family home with individual ownership</p>
                <button className='select-btn'>Select →</button>
              </div>

              <div 
                className='property-card apartment'
                onClick={() => onSelectProperty('Apartment')}
              >
                <div className='card-icon'>🏢</div>
                <h3>Apartment</h3>
                <p>Multi-unit residential building</p>
                <button className='select-btn'>Select →</button>
              </div>
            </div>
          </div>

          <div className='info-footer'>
            <p className='footer-text'>
              🔒 Your information is kept private and secure
            </p>
            <p className='footer-subtext'>
              Saradhi Nagar Colony • Property Management System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
