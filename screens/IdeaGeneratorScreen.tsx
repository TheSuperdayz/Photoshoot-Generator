import React, { useRef } from 'react';

// Components
import { PresetSelector } from '../components/PresetSelector';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { LightbulbIcon } from '../components/icons/LightbulbIcon';
import { ClipboardIcon } from '../components/icons/ClipboardIcon';
import { EnhancedPromptInput } from '../components/EnhancedPromptInput';

// Types
import type { User, CreativeIdea } from '../types';

interface IdeaGeneratorScreenProps {
    user: User;
    topic: string;
    setTopic: (topic: string) => void;
    ideaType: string;
    setIdeaType: (type: string) => void;
    generatedIdeas: CreativeIdea[];
    isLoading: boolean;
    error: string | null;
    handleGenerate: () => void;
}

const IdeaCard: React.FC<{ idea: CreativeIdea }> = ({ idea }) => {
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
        const textToCopy = `Title: ${idea.title}\n\nDescription: ${idea.description}`;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div 
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-xl p-6 relative group transition-transform duration-100 ease-linear card-3d-tilt"
        >
            <div className="absolute inset-0 rounded-xl card-3d-glow" />
            <div style={{ transform: 'translateZ(20px)' }}>
                <h3 className="text-lg font-bold text-white mb-2">{idea.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{idea.description}</p>
            </div>
            <button
                onClick={handleCopy}
                className="absolute top-4 right-4 bg-white/10 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Copy idea"
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


export const IdeaGeneratorScreen: React.FC<IdeaGeneratorScreenProps> = (props) => {
    const ideaTypeOptions = ['Photoshoot Concept', 'Mockup Scene', 'Image Prompt'];
    const ideaTypeTooltips = {
      'Photoshoot Concept': 'Generates creative direction and themes for a full photoshoot.',
      'Mockup Scene': 'Describes interesting backgrounds and settings for your mockups.',
      'Image Prompt': 'Creates detailed text prompts for the AI Image Generator tool.',
    };

    const canGenerate = !!props.topic.trim() && !props.isLoading && props.user && props.user.credits > 0;

    const getButtonText = () => {
        if (props.isLoading) return 'Generating...';
        if (props.user && props.user.credits <= 0) return 'Out of Credits';
        return '✨ Generate Ideas (1 Credit)';
    };

    return (
        <main className="flex-grow container mx-auto p-4 md:p-8">
            <div className="w-full max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">Unlock Your Next Big Idea</h1>
                    <p className="mt-4 text-lg text-gray-400">Describe your product, brand, or a vague thought, and let our AI creative director brainstorm for you.</p>
                </div>

                {/* Control Panel */}
                <div className="bg-black/30 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col gap-6 mb-12">
                    <EnhancedPromptInput
                        label="Your Topic or Product"
                        value={props.topic}
                        onChange={props.setTopic}
                        placeholder="e.g., A new line of sustainable sneakers for urban explorers..."
                        examplePrompts={[
                            'A luxury watch brand that uses recycled materials.',
                            'A coffee shop that has a vintage, cozy, bookish theme.',
                            'A new mobile app for connecting local gardeners.',
                            'A winter collection of handmade woolen scarves.',
                        ]}
                        tooltip="Enter a keyword, product name, or a brief description of what you need ideas for."
                    />

                    <PresetSelector label="What kind of ideas do you need?" options={ideaTypeOptions} selectedOption={props.ideaType} onSelect={props.setIdeaType} tooltips={ideaTypeTooltips} />

                    <button
                        onClick={props.handleGenerate}
                        disabled={!canGenerate}
                        className="w-full font-bold py-3 px-4 rounded-lg text-gray-900 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg btn-bounce"
                    >
                        {getButtonText()}
                    </button>
                    {props.error && <p className="text-red-400 text-sm -mt-2 text-center">{props.error}</p>}
                </div>

                {/* Ideas Gallery */}
                <div>
                    {props.isLoading && props.generatedIdeas.length === 0 && (
                        <div className="flex flex-col items-center justify-center text-center py-16">
                            <LoadingSpinner />
                            <p className="text-lg text-gray-400 mt-4">Brainstorming in progress...</p>
                            <p className="text-sm text-gray-500">Our AI creative director is brewing up some fresh ideas!</p>
                        </div>
                    )}

                    {!props.isLoading && props.generatedIdeas.length === 0 && (
                        <div className="text-center py-16 bg-white/5 rounded-2xl border-2 border-dashed border-gray-700">
                           <LightbulbIcon className="w-16 h-16 text-gray-600 mx-auto" />
                           <h3 className="mt-4 text-xl font-semibold text-gray-300">Your brilliant ideas will appear here</h3>
                           <p className="mt-1 text-gray-500">Fill out the form above to get started.</p>
                        </div>
                    )}

                    {props.generatedIdeas.length > 0 && (
                        <div className="grid grid-cols-1 gap-6">
                            {props.isLoading && (
                                <div className="bg-white/10 rounded-xl p-6 flex items-center justify-center text-gray-300">
                                   <LoadingSpinner />
                                   <span className="ml-4">Generating more ideas...</span>
                                </div>
                            )}
                            {props.generatedIdeas.map((idea, index) => (
                                <IdeaCard key={index} idea={idea} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};
