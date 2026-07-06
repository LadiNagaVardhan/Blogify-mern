import React from 'react';
import '../css/ErrorMessage.css';

const ErrorMessage = ({ message }) => {
  return (
    <div className="error-message-container">
      <div className="error-message-icon">⚠️</div>
      <div className="error-message-text">{message || 'Something went wrong. Please try again.'}</div>
    </div>
  );
};

export default ErrorMessage;
