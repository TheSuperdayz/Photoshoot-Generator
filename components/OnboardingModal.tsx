import React, { useState } from 'react';
import type { User } from '../types';
import { Logo } from './Logo';
import { CameraIcon } from './icons/CameraIcon';
import { TshirtIcon } from './icons/TshirtIcon';
import { CreditIcon } from './icons/CreditIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { QuillIcon } from './icons/QuillIcon';
import { ImageIcon } from './icons/ImageIcon';

interface OnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User;
}

const StepIndicator: React.FC<{ count: number; current: number }> = ({ count, current }) => (
    <div className="flex justify-center gap-2">
        {Array.from({ length: count }).map((_, index) => (
            <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                    index + 1 === current ? 'w-6 bg-white' : 'w-2 bg-white/30'
                }`}
            />
        ))}
    </div>
);

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, user }) => {
    const [step, setStep] = useState(1);
    const [isClosing, setIsClosing] = useState(false);
    const totalSteps = 4;

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 300);
    };

    const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    if (!isOpen && !isClosing) return null;

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <Logo className="h-16 mx-auto mb-4" />
                        <h2 className="text-3xl font-bold text-white text-center">Welcome, {user.name}!</h2>
                        <p className="text-gray-300 text-center mt-4">Let's take a quick tour of your new creative toolkit.</p>
                    </>
                );
            case 2:
                return (
                    <>
                        <div className="flex justify-center gap-6 mb-6">
                            <CameraIcon className="w-16 h-16" />
                            <TshirtIcon className="w-16 h-16" />
                        </div>
                        <h2 className="text-2xl font-bold text-white text-center">AI Photoshoots & Mockups</h2>
                        <p className="text-gray-300 text-center mt-4">
                            Upload your product and model images to create stunning commercial photoshoots, or place your designs on realistic mockups in seconds.
                        </p>
                    </>
                );
            case 3:
                 return (
                    <>
                        <div className="flex justify-center gap-6 mb-6">
                            <ImageIcon className="w-12 h-12" />
                            <QuillIcon className="w-12 h-12" />
                            <LightbulbIcon className="w-12 h-12" />
                        </div>
                        <h2 className="text-2xl font-bold text-white text-center">Your Creative Suite</h2>
                        <p className="text-gray-300 text-center mt-4">
                            Generate unique images from text, get marketing copy written for you, and brainstorm creative ideas when you're feeling stuck.
                        </p>
                    </>
                );
            case 4:
                return (
                    <>
                         <div className="flex justify-center gap-6 mb-6">
                            <CreditIcon className="w-16 h-16" />
                        </div>
                        <h2 className="text-3xl font-bold text-white text-center">How Credits Work</h2>
                        <p className="text-gray-300 text-center mt-4">
                           Each AI generation costs 1 credit. You start with 5 free credits that refresh daily. Ready to start creating?
                        </p>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`} onClick={handleClose}>
            <div className={`bg-gray-950/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-xl w-full max-w-lg p-8 flex flex-col gap-8 ${isClosing ? 'animate-scale-out' : 'animate-scale-in'}`} onClick={(e) => e.stopPropagation()}>
                
                <div className="min-h-[200px] flex flex-col justify-center items-center">
                    {renderStepContent()}
                </div>

                <div className="flex flex-col gap-4">
                    <StepIndicator count={totalSteps} current={step} />
                    <div className="flex justify-between items-center">
                        <button onClick={handleClose} className="bg-transparent text-gray-400 hover:text-white font-semibold py-2 px-4 rounded-full text-sm">Skip</button>
                        <div className="flex gap-2">
                             {step > 1 && (
                                <button onClick={prevStep} className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-4 rounded-full text-sm">Back</button>
                            )}
                            {step < totalSteps ? (
                                <button onClick={nextStep} className="font-bold py-2 px-5 rounded-full text-gray-900 bg-white hover:bg-gray-200">Next</button>
                            ) : (
                                <button onClick={handleClose} className="font-bold py-2 px-5 rounded-full text-gray-900 bg-white hover:bg-gray-200">Let's Go!</button>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};