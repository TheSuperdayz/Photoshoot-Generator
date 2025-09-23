import React from 'react';

export const LockIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={className}
        fill="none"
        stroke="currentColor"
    >
        <defs>
            <linearGradient id="lockGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6B7280" />
                <stop offset="100%" stopColor="#4B5563" />
            </linearGradient>
        </defs>
        <rect x="4" y="10" width="16" height="12" rx="2" fill="url(#lockGrad)" />
        <path d="M7 10V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V10" stroke="url(#lockGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="16" r="1.5" fill="#9CA3AF" />
    </svg>
);