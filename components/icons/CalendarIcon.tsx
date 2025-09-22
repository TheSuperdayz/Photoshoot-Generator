import React from 'react';

export const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={className}
        fill="none"
    >
        <defs>
            <linearGradient id="calendarGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F472B6" />
                <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
            <filter id="calendarShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0.5" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.2"/>
            </filter>
        </defs>
        <g filter="url(#calendarShadow)">
            <rect x="3" y="5" width="18" height="16" rx="3" fill="url(#calendarGrad)" />
            <rect x="3" y="8" width="18" height="4" fill="black" opacity="0.1" />
            <circle cx="8" cy="6" r="1.5" fill="white" opacity="0.3" />
            <circle cx="16" cy="6" r="1.5" fill="white" opacity="0.3" />
            <rect x="7" y="12" width="4" height="2" rx="1" fill="white" opacity="0.5" />
            <rect x="13" y="12" width="4" height="2" rx="1" fill="white" opacity="0.5" />
            <rect x="7" y="15" width="10" height="2" rx="1" fill="white" opacity="0.5" />
        </g>
    </svg>
);
