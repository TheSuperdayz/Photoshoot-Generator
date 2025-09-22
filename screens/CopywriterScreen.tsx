import React, { useRef } from 'react';

// Components
import { PresetSelector } from '../components/PresetSelector';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { QuillIcon } from '../components/icons/QuillIcon';
import { ClipboardIcon } from '../components/icons/ClipboardIcon';

// Types
import type { User, CopywritingResult } from '../types';

interface CopywriterScreenProps {
    user: User;
    topic: string;
    setTopic: (topic: string) => void;
    copyType: string;
    setCopyType: (type: string) => void;
    generatedCopy: CopywritingResult[];
    isLoading: boolean;
    error: string | null;
    handleGenerate: () => void;
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
          className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-xl p-6 relative group transition-transform duration-100 card-3d-tilt"
        >
            <div className="absolute inset-0 rounded-xl card-3d-glow" />
            <div style={{ transform: 'translateZ(20px)' }}>
                <h3 className="text-lg font-bold text-white mb-2">{result.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{result.content}</p>
            </div>
            <button
                onClick={handleCopy}
                className="absolute top-4 right-4 bg-white/10 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Copy content"
                style={{ transform: 'translateZ(30px)' }}
            >
                {copied ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                ) : (
                    <ClipboardIcon className="w-5 h-5" />
                )}
            </button>
        </div>
    );
};


export const CopywriterScreen: React.FC<CopywriterScreenProps> = (props) => {
    const copyTypeOptions = ['Social Media Caption', 'Product Description', 'Ad Headline'];

    const canGenerate = !!props.topic.trim() && !props.isLoading && props.user && props.user.credits > 0;

    const getButtonText = () => {
        if (props.isLoading) return 'Generating...';
        if (props.user && props.user.credits <= 0) return 'Out of Credits';
        return '✨ Generate Copy (1 Credit)';
    };

    return (
        <main className="flex-grow container mx-auto p-4 md:p-8">
            <div className="w-full max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">AI Copywriting Assistant</h1>
                    <p className="mt-4 text-lg text-gray-400">Generate compelling marketing copy in seconds. From social media captions to ad headlines, let AI do the writing.</p>
                </div>

                {/* Control Panel */}
                <div className="bg-black/30 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col gap-6 mb-12">
                    <div>
                        <label htmlFor="topic" className="block text-sm font-medium text-gray-300 mb-2">Your Topic or Product</label>
                        <textarea
                            id="topic"
                            rows={3}
                            className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition duration-200 placeholder-gray-400"
                            placeholder="e.g., A new line of sustainable sneakers for urban explorers..."
                            value={props.topic}
                            onChange={(e) => props.setTopic(e.target.value)}
                        />
                    </div>

                    <PresetSelector label="What kind of copy do you need?" options={copyTypeOptions} selectedOption={props.copyType} onSelect={props.setCopyType} />

                    <button
                        onClick={props.handleGenerate}
                        disabled={!canGenerate}
                        className="w-full font-bold py-3 px-4 rounded-lg text-gray-900 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg btn-bounce"
                    >
                        {getButtonText()}
                    </button>
                    {props.error && <p className="text-red-400 text-sm -mt-2 text-center">{props.error}</p>}
                </div>

                {/* Copy Results */}
                <div>
                    {props.isLoading && props.generatedCopy.length === 0 && (
                        <div className="flex flex-col items-center justify-center text-center py-16">
                            <LoadingSpinner />
                            <p className="text-lg text-gray-400 mt-4">Writing in progress...</p>
                            <p className="text-sm text-gray-500">Our AI copywriter is crafting the perfect words for you!</p>
                        </div>
                    )}

                    {!props.isLoading && props.generatedCopy.length === 0 && (
                        <div className="text-center py-16 bg-white/5 rounded-2xl border-2 border-dashed border-gray-700">
                           <QuillIcon className="w-16 h-16 text-gray-600 mx-auto" />
                           <h3 className="mt-4 text-xl font-semibold text-gray-300">Your generated copy will appear here</h3>
                           <p className="mt-1 text-gray-500">Fill out the form above to get started.</p>
                        </div>
                    )}

                    {props.generatedCopy.length > 0 && (
                        <div className="grid grid-cols-1 gap-6">
                            {props.isLoading && (
                                <div className="bg-white/10 rounded-xl p-6 flex items-center justify-center text-gray-300">
                                   <LoadingSpinner />
                                   <span className="ml-4">Generating more copy...</span>
                                </div>
                            )}
                            {props.generatedCopy.map((result, index) => (
                                <CopyResultCard key={index} result={result} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};