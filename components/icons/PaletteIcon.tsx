import React from 'react';

export const PaletteIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={className}
        fill="none"
    >
        <defs>
            <linearGradient id="paletteBase" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#A16207" />
                <stop offset="100%" stopColor="#854D0E" />
            </linearGradient>
            <filter id="paletteShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.2"/>
            </filter>
        </defs>
        <g filter="url(#paletteShadow)">
            <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C16.643 22 20.4079 19.123 21.6217 14.9734C19.6648 15.341 17.6045 14.4862 16.5113 12.8901C15.4181 11.294 15.4181 9.20597 16.5113 7.60991C17.6045 6.01385 19.6648 5.15903 21.6217 5.52661C20.4079 3.37701 18.643 2 16 2C14.7951 2 13.673 2.37038 12.7217 3.01637C12.4803 2.99912 12.2408 2.9903 12 3C11.956 2.67895 11.9765 2.34105 12 2Z" fill="url(#paletteBase)"/>
            <circle cx="15.5" cy="7.5" r="2" fill="#EF4444" />
            <circle cx="8" cy="7" r="2.5" fill="#3B82F6" />
            <circle cx="8.5" cy="15.5" r="2.2" fill="#FBBF24" />
            <circle cx="15" cy="15" r="1.8" fill="#4ADE80" />
            <circle cx="12" cy="12" r="1.5" fill="white" opacity="0.8" />
        </g>
    </svg>
);
