import React from 'react';

export const ChatIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        className={className} 
        fill="none"
    >
        <defs>
            <linearGradient id="chatGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#22D3EE"/>
                <stop offset="100%" stopColor="#3B82F6"/>
            </linearGradient>
            <filter id="chatShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.2"/>
            </filter>
        </defs>
        <g filter="url(#chatShadow)">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C13.85 22 15.6 21.53 17.11 20.71L21.41 22.59C21.76 22.75 22.17 22.56 22.33 22.21C22.49 21.86 22.3 21.45 21.95 21.29L17.65 19.41C18.47 17.9 19 16.15 19 14.5C19 8.16 15.84 3.73 12 2Z" transform="scale(1, -1) translate(0, -24)" fill="url(#chatGrad)" />
            <path d="M22,12c0,5.52-4.48,10-10,10c-1.85,0-3.6-0.47-5.11-1.29L2.59,22.29C2.24,22.45,1.83,22.26,1.67,21.91c-0.16-0.35,0.03-0.76,0.38-0.92l4.3-1.88C5.53,17.6,5,15.85,5,14c0-6.34,3.16-10.77,7-12C17.52,2,22,6.48,22,12z" fill="url(#chatGrad)" />
            <circle cx="9" cy="13" r="1.2" fill="white" opacity="0.7"/>
            <circle cx="12.5" cy="13" r="1.2" fill="white" opacity="0.7"/>
            <circle cx="16" cy="13" r="1.2" fill="white" opacity="0.7"/>
        </g>
    </svg>
);