
import React from 'react';

export const LogoCreatorIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        className={className} 
        fill="none"
    >
        <defs>
            <linearGradient id="logoPenBody" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <linearGradient id="logoPenNib" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4B5563" />
                <stop offset="100%" stopColor="#1F2937" />
            </linearGradient>
            <linearGradient id="logoShape" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#60A5FA" />
            </linearGradient>
            <filter id="logoShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.2"/>
            </filter>
        </defs>
        <g filter="url(#logoShadow)">
            {/* Pen */}
            <g transform="translate(10 2) rotate(45 12 12)">
                <path d="M14 1L3 12L8 17L19 6L14 1Z" fill="url(#logoPenBody)" />
                <path d="M3 12L8 17L6 19L1 14L3 12Z" fill="url(#logoPenNib)" />
            </g>
            {/* Shape */}
            <path d="M12 11C14.7614 11 17 13.2386 17 16C17 18.7614 14.7614 21 12 21C9.23858 21 7 18.7614 7 16C7 13.2386 9.23858 11 12 11Z" stroke="url(#logoShape)" strokeWidth="2.5" />
            <path d="M12 11V16" stroke="url(#logoShape)" strokeWidth="2.5" strokeLinecap="round" />
        </g>
    </svg>
);
