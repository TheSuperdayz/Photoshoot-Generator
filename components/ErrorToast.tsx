
import React, { useState } from 'react';
import { ErrorIcon } from './icons/ErrorIcon';

interface ErrorToastProps {
    message: string;
    onClose: () => void;
}

export const ErrorToast: React.FC<ErrorToastProps> = ({ message, onClose }) => {
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 300); // Wait for animation
    };

    return (
        <div 
            className={`fixed top-5 right-5 z-50 w-full max-w-sm p-4 bg-red-900/80 backdrop-blur-2xl border border-red-500/50 rounded-xl shadow-lg flex items-start gap-4 ${isClosing ? 'animate-fadeOutUp' : 'animate-slideInDown'}`}
        >
            <div className="flex-shrink-0 pt-1">
                <ErrorIcon className="w-6 h-6" />
            </div>
            <div className="flex-grow">
                <p className="font-bold text-white">An Error Occurred</p>
                <p className="text-sm text-red-200">
                    {message}
                </p>
            </div>
            <button onClick={handleClose} className="text-red-300 hover:text-white text-2xl leading-none">&times;</button>
        </div>
    );
};
