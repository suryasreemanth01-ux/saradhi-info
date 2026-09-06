import React from 'react';
import './WelcomePage.css';

const WelcomePage = ({ onSelectProperty }) => {
  return (
    <div className="welcome-page">
      <div className="container">
        <div className="welcome-content">
          <div className="header-section">
            <h1 className="main-title" style={{ fontSize: '1.8rem', marginBottom: '10px' }}>
              WELCOME TO SARADHI NAGAR COLONY
            </h1>
            <h2 className="sub-title" style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
              Saradhi Info
            </h2>
            <p className="description" style={{ fontSize: '0.9rem', marginBottom: '20px' }}>
              Please provide your property and owner information. 
              All fields marked as required must be completed.
            </p>
          </div>

          <div className="property-selection">
            <h3 className="selection-title" style={{ fontSize: '1.3rem', marginBottom: '20px' }}>
              Select Your Property Type
            </h3>
            <div className="property-cards">
              <div 
                className="property-card independent"
                onClick={() => onSelectProperty('Independent House')}
              >
                <div className="card-icon" style={{ fontSize: '1.1rem' }}>House</div>
                <h3 style={{ fontSize: '1.1rem', margin: '10px 0' }}>Independent House</h3>
                <p style={{ fontSize: '0.85rem', marginBottom: '15px' }}>Single-family home with individual ownership</p>
                <button className="select-btn" style={{ fontSize: '0.85rem' }}>Select -&gt;</button>
              </div>

              <div 
                className="property-card apartment"
                onClick={() => onSelectProperty('Apartment')}
              >
                <div className="card-icon" style={{ fontSize: '1.1rem' }}>Apartment</div>
                <h3 style={{ fontSize: '1.1rem', margin: '10px 0' }}>Apartment</h3>
                <p style={{ fontSize: '0.85rem', marginBottom: '15px' }}>Multi-unit residential building</p>
                <button className="select-btn" style={{ fontSize: '0.85rem' }}>Select -&gt;</button>
              </div>
            </div>
          </div>

          <div className="info-footer">
            <p className="footer-text" style={{ fontSize: '0.8rem' }}>
              Your information is kept private and secure
            </p>
            <p className="footer-subtext" style={{ fontSize: '0.7rem' }}>
              Saradhi Nagar Colony ? Property Management System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
