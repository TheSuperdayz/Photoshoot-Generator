import React, { useState, useEffect } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { CheckIcon } from './icons/CheckIcon';

interface GamificationToastProps {
    title: string;
    description: string;
    onClose: () => void;
}

export const GamificationToast: React.FC<GamificationToastProps> = ({ title, description, onClose }) => {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, 4500); // Auto-close after 4.5 seconds

        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 300); // Wait for animation
    };

    const isLevelUp = title.toLowerCase().includes('level up');

    return (
        <div 
            className={`fixed top-5 right-5 z-50 w-full max-w-sm p-4 bg-gray-950/80 backdrop-blur-2xl border border-white/10 rounded-xl shadow-lg flex items-start gap-4 ${isClosing ? 'animate-fadeOutUp' : 'animate-slideInDown'}`}
        >
            <div className="flex-shrink-0 pt-1">
                {isLevelUp ? <SparklesIcon className="w-8 h-8" /> : <CheckIcon className="w-8 h-8" />}
            </div>
            <div className="flex-grow">
                <p className="font-bold text-white">{title}</p>
                <p className="text-sm text-gray-300">
                    {description}
                </p>
            </div>
            <button onClick={handleClose} className="text-gray-500 hover:text-white text-2xl leading-none">&times;</button>
        </div>
    );
};