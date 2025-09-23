import React, { useState } from 'react';

import { LoadingSpinner } from '../components/LoadingSpinner';
import { EnhancedPromptInput } from '../components/EnhancedPromptInput';
import { Alert } from '../components/Alert';
import { StrategyIcon } from '../components/icons/StrategyIcon';
import { LightbulbIcon } from '../components/icons/LightbulbIcon';
import type { User, MarketingStrategy, StrategyRecommendation } from '../types';

interface StrategyAssistantScreenProps {
    user: User;
    isLoading: boolean;
    error: string | null;
    generatedStrategy: MarketingStrategy | null;
    handleGenerate: (goal: string, audience: string) => void;
}

const StrategyResultCard: React.FC<{ recommendation: StrategyRecommendation }> = ({ recommendation }) => {
    return (
        <div className="bg-slate-800/80 backdrop-blur-lg border border-slate-700 rounded-xl p-6 animate-item-enter">
            <div className="flex items-center gap-4 mb-3">
                <span className="text-sm font-semibold bg-white/10 px-3 py-1 rounded-full">{recommendation.channel}</span>
                <h3 className="text-lg font-bold text-white">{recommendation.format}</h3>
            </div>
            <p className="text-slate-300 text-sm mb-4 border-l-2 border-sky-500 pl-3">{recommendation.reasoning}</p>
            <div>
                <h4 className="text-sm font-semibold text-slate-400 mb-2 flex items-center gap-2"><LightbulbIcon className="w-4 h-4" /> Content Ideas:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-300 pl-2">
                    {recommendation.contentIdeas.map((idea, index) => (
                        <li key={index}>{idea}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export const StrategyAssistantScreen: React.FC<StrategyAssistantScreenProps> = (props) => {
    const [goal, setGoal] = useState('');
    const [audience, setAudience] = useState('');
    
    const canGenerate = !!goal.trim() && !!audience.trim() && !props.isLoading && props.user && props.user.credits > 0;

    const getButtonText = () => {
        if (props.isLoading) return 'Generating...';
        if (props.user && props.user.credits <= 0) return 'Out of Credits';
        return '✨ Generate Strategy (1 Credit)';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (canGenerate) {
            props.handleGenerate(goal, audience);
        }
    };

    return (
        <main className="flex-grow container mx-auto p-4 md:p-8">
            <div className="w-full max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">AI Strategy Assistant</h1>
                    <p className="mt-4 text-lg text-slate-400">Turn your goals into an actionable content plan. Let your AI co-pilot guide your marketing efforts.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-slate-800/60 backdrop-blur-2xl border border-slate-700 rounded-2xl p-6 shadow-lg flex flex-col gap-6 mb-12">
                    <EnhancedPromptInput
                        label="Campaign Goal"
                        value={goal}
                        onChange={setGoal}
                        placeholder="e.g., Increase brand awareness for a new product launch..."
                        rows={2}
                        examplePrompts={[
                            'Drive conversions for our summer flash sale.',
                            'Build a community around our sustainable fashion brand.',
                            'Establish thought leadership in the B2B SaaS space.',
                        ]}
                        tooltip="What is the primary objective of your campaign?"
                    />

                    <EnhancedPromptInput
                        label="Target Audience"
                        value={audience}
                        onChange={setAudience}
                        placeholder="e.g., Gen Z fashion enthusiasts in Jakarta..."
                        rows={2}
                        examplePrompts={[
                            'Tech-savvy small business owners in North America.',
                            'Eco-conscious millennials who love outdoor activities.',
                            'Working parents looking for convenient meal solutions.',
                        ]}
                        tooltip="Who are you trying to reach with this campaign?"
                    />
                    
                    {props.error && <Alert type="error" message={props.error} />}

                    <button
                        type="submit"
                        disabled={!canGenerate}
                        className="w-full font-bold py-3 px-4 rounded-lg text-white bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg btn-bounce"
                    >
                        {getButtonText()}
                    </button>
                </form>

                <div>
                    {props.isLoading && (
                        <div className="flex flex-col items-center justify-center text-center py-16">
                            <LoadingSpinner />
                            <p className="text-lg text-slate-400 mt-4">Strategizing in progress...</p>
                            <p className="text-sm text-slate-500">Our AI strategist is analyzing the best path forward.</p>
                        </div>
                    )}

                    {!props.isLoading && !props.generatedStrategy && (
                        <div className="text-center py-16 bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-700">
                           <StrategyIcon className="w-16 h-16 text-slate-600 mx-auto" />
                           <h3 className="mt-4 text-xl font-semibold text-slate-300">Your strategic plan will appear here</h3>
                           <p className="mt-1 text-slate-500">Define your goal and audience to get started.</p>
                        </div>
                    )}

                    {props.generatedStrategy && (
                        <div className="space-y-8 animate-fade-in">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-3">Strategy Summary</h2>
                                <p className="text-slate-300 bg-black/20 p-4 rounded-lg border border-white/10">{props.generatedStrategy.summary}</p>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-4">Channel Recommendations</h2>
                                <div className="grid grid-cols-1 gap-6">
                                    {props.generatedStrategy.recommendations.map((rec, index) => (
                                        <StrategyResultCard key={index} recommendation={rec} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};
