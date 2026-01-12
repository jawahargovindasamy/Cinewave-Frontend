import React from 'react';

const LoadingSpinner = ({ size = 'md', message = 'Loading...' }) => {
  const sizeStyles = {
    sm: { width: '30px', height: '30px' },
    md: { width: '40px', height: '40px' },
    lg: { width: '60px', height: '60px' },
  };

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center py-5"
      data-testid="loading-spinner"
      role="status"
      aria-live="polite"
    >
      <div
        className="spinner"
        style={sizeStyles[size]}
        aria-hidden="true"
      />
      <p className="text-white mt-3 mb-0" data-testid="loading-message">
        {message}
      </p>
      <span className="visually-hidden">
        Loading content, please wait...
      </span>
    </div>
  );
};

export default LoadingSpinner;
