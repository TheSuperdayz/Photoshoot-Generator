import React from 'react';

export const VideoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={className}
        fill="none"
    >
        <defs>
            <linearGradient id="videoGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FB923C" />
                <stop offset="100%" stopColor="#F43F5E" />
            </linearGradient>
            <filter id="videoShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.2"/>
            </filter>
        </defs>
        <g filter="url(#videoShadow)">
            <path d="M17 10.5V7c0-1.105-.895-2-2-2H4c-1.105 0-2 .895-2 2v10c0 1.105.895 2 2 2h11c1.105 0 2-.895 2-2v-3.5l4 4v-11l-4 4z" fill="url(#videoGrad)" />
            <path d="M15 8c0-.552.448-1 1-1h1v2h-2V8z" fill="white" opacity="0.3" />
        </g>
    </svg>
);