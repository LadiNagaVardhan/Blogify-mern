import React from 'react';
import '../css/Toast.css';

export default function Toast({ toast, removeToast }) {
  const { id, message, type } = toast;

  return (
    <div className={`toast-item ${type}`}>
      <div className="toast-icon">
        {type === 'success' ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        )}
      </div>
      <div className="toast-message">{message}</div>
      <button className="toast-close-btn" onClick={() => removeToast(id)} aria-label="Close Toast">
        &times;
      </button>
    </div>
  );
}
