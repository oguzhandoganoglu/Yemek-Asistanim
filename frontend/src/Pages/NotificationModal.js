// NotificationModal.js
import React from 'react';
import { FaTimes } from 'react-icons/fa'; // Import close icon from react-icons

const NotificationModal = ({ message, showModal, handleClose }) => {
  if (!showModal) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '70px',
      right: '20px',
      backgroundColor: '#1f2937d0',
      padding: '10px',
      borderRadius: '5px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
      zIndex: 1000, // Ensure it's above other elements
    }}>
      {message}
      <button onClick={handleClose} style={{ marginLeft: '10px', cursor: 'pointer' }}><FaTimes /></button>
    </div>
  );
};

export default NotificationModal;