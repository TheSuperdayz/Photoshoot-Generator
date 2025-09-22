import React from 'react';

export const LandscapeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor"
    >
    <path d="M21,5H3C2.4,5,2,5.4,2,6v8c0,0.6,0.4,1,1,1h18c0.6,0,1-0.4,1-1V6C22,5.4,21.6,5,21,5z M20,13H4V7h16V13z" />
  </svg>
);
