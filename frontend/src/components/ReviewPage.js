import React from 'react';
import './ReviewPage.css';

const ReviewPage = ({ formData, submitForm, editForm, goBack, isSubmitting }) => {
  const isIndependent = formData.propertyType === 'Independent House';

  return (
    <div className="review-page">
      <div className="container">
        <div className="card">
          <div className="review-header">
            <h2 className="review-title">Review Your Information 🔍</h2>
            <p className="review-subtitle">Please verify your details before submitting</p>
          </div>

          <div className="review-content">
            <div className="review-card">
              <div className="review-item">
                <span className="review-label">Property Type:</span>
                <span className="review-value">{formData.propertyType}</span>
              </div>

              {isIndependent ? (
                <>
                  <div className="review-item">
                    <span className="review-label">House Number:</span>
                    <span className="review-value">{formData.houseNumber}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="review-item">
                    <span className="review-label">Building Name:</span>
                    <span className="review-value">{formData.buildingName}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Flat Number:</span>
                    <span className="review-value">{formData.flatNumber}</span>
                  </div>
                </>
              )}

              <div className="review-item">
                <span className="review-label">Owner Name:</span>
                <span className="review-value">{formData.ownerName}</span>
              </div>

              <div className="review-item">
                <span className="review-label">Owner Phone:</span>
                <span className="review-value">{formData.ownerPhone}</span>
              </div>
            </div>

            <div className="review-actions">
              <div className="button-group">
                <button className="btn-secondary" onClick={goBack} disabled={isSubmitting}>
                  ← BACK TO HOME
                </button>
                <button className="btn-secondary" onClick={editForm} disabled={isSubmitting}>
                  ✏️ EDIT
                </button>
                <button className="btn-success" onClick={submitForm} disabled={isSubmitting}>
                  {isSubmitting ? '⏳ Submitting...' : '✅ SUBMIT INFORMATION'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;

