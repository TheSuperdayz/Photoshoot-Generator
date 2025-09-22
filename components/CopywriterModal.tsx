import React, { useState, useRef } from 'react';
import type { User, CopywritingResult } from '../types';
import { PresetSelector } from './PresetSelector';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { LoadingSpinner } from './LoadingSpinner';

interface CopywriterModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageSrc: string | null;
    user: User;
    onGenerate: (topic: string, type: string) => Promise<void>;
    results: CopywritingResult[];
    isLoading: boolean;
    error: string | null;
}

const CopyResultCard: React.FC<{ result: CopywritingResult }> = ({ result }) => {
    const [copied, setCopied] = React.useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const { left, top, width, height } = cardRef.current.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        const rotateX = -1 * ((y - height / 2) / (height / 2)) * 5;
        const rotateY = ((x - width / 2) / (width / 2)) * 5;
        cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        
        const glow = cardRef.current.querySelector('.card-3d-glow') as HTMLElement;
        if (glow) {
            glow.style.setProperty('--x', `${x}px`);
            glow.style.setProperty('--y', `${y}px`);
        }
    };

    const handleMouseLeave = () => {
        if (!cardRef.current) return;
        cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(result.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div 
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-4 relative group card-3d-tilt transition-transform duration-100"
        >
            <div className="absolute inset-0 rounded-lg card-3d-glow" />
            <div style={{ transform: 'translateZ(15px)' }}>
              <h3 className="text-md font-bold text-white mb-2">{result.title}</h3>
              <p className="text-gray-300 text-xs leading-relaxed whitespace-pre-wrap">{result.content}</p>
            </div>
            <button onClick={handleCopy} className="absolute top-2 right-2 bg-white/10 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Copy content" style={{ transform: 'translateZ(20px)' }}>
                {copied ? <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> : <ClipboardIcon className="w-4 h-4" />}
            </button>
        </div>
    );
};

export const CopywriterModal: React.FC<CopywriterModalProps> = ({ isOpen, onClose, imageSrc, user, onGenerate, results, isLoading, error }) => {
    const [topic, setTopic] = useState('');
    const [copyType, setCopyType] = useState('Social Media Caption');
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 200);
    };

    if (!isOpen && !isClosing) return null;

    const copyTypeOptions = ['Social Media Caption', 'Product Description', 'Ad Headline'];
    const canGenerate = !!topic.trim() && !isLoading && user && user.credits > 0;
    
    const handleGenerateClick = () => {
        onGenerate(topic, copyType);
    };

    const getButtonText = () => {
        if (isLoading) return 'Generating...';
        if (user && user.credits <= 0) return 'Out of Credits';
        return '✨ Generate Copy (1 Credit)';
    };

    return (
        <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`} onClick={handleClose}>
            <div className={`bg-gray-950/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col ${isClosing ? 'animate-scale-out' : 'animate-scale-in'}`} onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                    <h2 className="text-2xl font-bold text-white">AI Copywriter</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-white">&times;</button>
                </div>
                
                <div className="flex-grow p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Controls */}
                    <div className="flex flex-col gap-6">
                        {imageSrc && (
                            <div className="aspect-square w-full bg-black/20 rounded-lg overflow-hidden border border-gray-600">
                                <img src={imageSrc} alt="Context for copywriting" className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div>
                            <label htmlFor="modal-topic" className="block text-sm font-medium text-gray-300 mb-2">Topic/Product Name</label>
                            <input
                                id="modal-topic"
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g., 'Urban Explorer Sneakers'"
                                className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-gray-400 placeholder-gray-500"
                            />
                        </div>
                        <PresetSelector label="Copy Type" options={copyTypeOptions} selectedOption={copyType} onSelect={setCopyType} />
                        
                        <button onClick={handleGenerateClick} disabled={!canGenerate} className="w-full font-bold py-3 px-4 rounded-lg text-gray-900 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed btn-bounce">
                            {getButtonText()}
                        </button>
                         {error && <p className="text-red-400 text-sm -mt-2 text-center">{error}</p>}
                    </div>

                    {/* Results */}
                    <div className="space-y-4">
                        {isLoading && results.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <LoadingSpinner />
                                <p className="text-md text-gray-400 mt-4">Crafting copy...</p>
                            </div>
                        )}
                        {!isLoading && results.length === 0 && (
                             <div className="text-center py-16 h-full flex flex-col justify-center items-center bg-white/5 rounded-2xl border-2 border-dashed border-gray-700">
                               <h3 className="mt-4 text-lg font-semibold text-gray-300">Generated copy will appear here</h3>
                               <p className="mt-1 text-gray-500 text-sm">Enter a topic and generate.</p>
                            </div>
                        )}
                        {results.map((result, index) => (
                            <CopyResultCard key={index} result={result} />
                        ))}
                         {isLoading && results.length > 0 && (
                            <div className="bg-white/5 rounded-lg p-4 flex items-center justify-center text-gray-300">
                                <LoadingSpinner />
                                <span className="ml-4 text-sm">Generating more...</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};