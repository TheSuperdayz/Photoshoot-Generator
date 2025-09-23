import React from 'react';

export const GroupIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        className={className} 
        fill="none"
    >
        <defs>
            <linearGradient id="groupGrad1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F472B6" />
                <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <linearGradient id="groupGrad2" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#A78BFA" />
                <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            <linearGradient id="groupGrad3" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <filter id="groupShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.2"/>
            </filter>
        </defs>
        <g filter="url(#groupShadow)">
            {/* Person 2 (Middle) */}
            <circle cx="12" cy="6" r="3" fill="url(#groupGrad2)" />
            <path d="M12 9C9.79086 9 8 10.7909 8 13V19H16V13C16 10.7909 14.2091 9 12 9Z" fill="url(#groupGrad2)" />

            {/* Person 1 (Left) */}
            <circle cx="6" cy="8" r="2.5" fill="url(#groupGrad1)" opacity="0.9" />
            <path d="M6 10.5C4.34315 10.5 3 11.8431 3 13.5V19H9V13.5C9 11.8431 7.65685 10.5 6 10.5Z" fill="url(#groupGrad1)" opacity="0.9" />

            {/* Person 3 (Right) */}
            <circle cx="18" cy="8" r="2.5" fill="url(#groupGrad3)" opacity="0.9" />
            <path d="M18 10.5C16.3431 10.5 15 11.8431 15 13.5V19H21V13.5C21 11.8431 19.6569 10.5 18 10.5Z" fill="url(#groupGrad3)" opacity="0.9" />
        </g>
    </svg>
);