import React, { useEffect } from 'react';
import '../css/ConfirmModal.css';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay" onClick={onCancel}>
      <div className="confirm-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-modal-header">
          <h3>{title || 'Confirmation Needed'}</h3>
        </div>
        <div className="confirm-modal-body">
          <p>{message || 'Are you sure you want to proceed?'}</p>
        </div>
        <div className="confirm-modal-actions">
          <button className="modal-btn btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="modal-btn btn-confirm" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
