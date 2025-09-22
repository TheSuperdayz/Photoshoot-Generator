import React from 'react';

export const PortraitIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor"
    >
    <path d="M15,2H9C8.4,2,8,2.4,8,3v18c0,0.6,0.4,1,1,1h6c0.6,0,1-0.4,1-1V3C16,2.4,15.6,2,15,2z M14,20H10V4h4V20z"/>
  </svg>
);
