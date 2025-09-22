import React from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  if (!content) {
    return <>{children}</>;
  }

  return (
    <div className="relative group">
      {children}
      <div
        className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max max-w-xs
                   bg-gray-950/90 backdrop-blur-sm text-white text-xs rounded-md px-3 py-1.5
                   opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30"
        role="tooltip"
      >
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0
                        border-x-4 border-x-transparent
                        border-t-4 border-t-gray-950/90" />
      </div>
    </div>
  );
};
