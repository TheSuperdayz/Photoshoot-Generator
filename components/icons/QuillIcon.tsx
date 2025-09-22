import React from 'react';

export const QuillIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        className={className} 
        fill="none"
    >
        <defs>
            <linearGradient id="quillFeather" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F0ABFC"/>
                <stop offset="100%" stopColor="#A855F7"/>
            </linearGradient>
            <linearGradient id="quillNib" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FBBF24"/>
                <stop offset="100%" stopColor="#F59E0B"/>
            </linearGradient>
            <filter id="quillShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.2"/>
            </filter>
        </defs>
        <g transform="rotate(20 12 12)" filter="url(#quillShadow)">
            <path d="M13.2,3.4C10.1,5.2,5.3,11,4.2,14.3c-0.4,1.3,0.8,2.5,2.1,2.1c3.3-1.1,9.1-5.9,10.9-9C18.6,4.5,15.1,2,13.2,3.4z M10.1,13.9c-0.4,0.4-1,0.4-1.4,0s-0.4-1,0-1.4c0.4-0.4,1-0.4,1.4,0S10.5,13.5,10.1,13.9z" fill="url(#quillFeather)"/>
            <path d="M19.3,5.1l-2.1,2.1c-0.6,0.6-1.5,0.6-2.1,0c-0.6-0.6-0.6-1.5,0-2.1l2.1-2.1c0.6-0.6,1.5-0.6,2.1,0C19.9,3.5,19.9,4.5,19.3,5.1z" fill="url(#quillNib)"/>
        </g>
    </svg>
);
