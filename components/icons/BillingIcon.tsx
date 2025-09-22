import React from 'react';

export const BillingIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={className}
        fill="none"
    >
        <defs>
            <linearGradient id="billingGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#A855F7" />
                <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
            <linearGradient id="billingShine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="white" stopOpacity="0.5" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
        </defs>
        <g transform="rotate(-10 12 12)">
            <rect x="2" y="6" width="20" height="13" rx="2" fill="url(#billingGrad)" />
            <rect x="2" y="9" width="20" height="3" fill="black" opacity="0.2" />
            <rect x="4" y="14" width="6" height="2" rx="1" fill="white" opacity="0.6" />
            <rect x="14" y="14" width="4" height="2" rx="1" fill="white" opacity="0.3" />
            <rect x="2" y="6" width="20" height="13" rx="2" fill="url(#billingShine)" />
        </g>
    </svg>
);
