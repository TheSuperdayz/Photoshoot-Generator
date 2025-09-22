import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <div className={`flex flex-col items-start ${className}`}>
            <h1 className="text-white font-extrabold tracking-tighter text-3xl leading-none">
                SUPERDAYZ
            </h1>
            <p className="text-white/80 text-[0.5rem] tracking-[0.2em] font-medium -mt-px">AI NEXT-GENERATOR</p>
        </div>
    );
}