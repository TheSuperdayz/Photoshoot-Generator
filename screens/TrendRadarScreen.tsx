import React, { useState } from 'react';
import type { User, TrendReport, TrendItem, CrossPlatformTrend } from '../types';
import { ImageIcon } from '../components/icons/ImageIcon';
import { RadarIcon } from '../components/icons/RadarIcon';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Alert } from '../components/Alert';
import { LightbulbIcon } from '../components/icons/LightbulbIcon';
import { TrendingUpIcon } from '../components/icons/TrendingUpIcon';
import { ClockIcon } from '../components/icons/ClockIcon';
import { UsersIcon } from '../components/icons/UsersIcon';
import { ArrowRightIcon } from '../components/icons/ArrowRightIcon';


interface TrendRadarScreenProps {
  user: User;
  isLoading: boolean;
  error: string | null;
  trendReport: TrendReport | null;
  onGenerateReport: (country: string) => void;
  onUseTrend: (prompt: string) => void;
}

const countries = ['Indonesia', 'USA', 'Japan', 'Global'];

const TrendMetadataTag: React.FC<{ icon: React.ReactNode; label: string; value: string; }> = ({ icon, label, value }) => (
    <div className="flex items-center gap-2 bg-black/20 text-xs text-slate-300 px-2 py-1 rounded-md">
        <div className="w-4 h-4 text-slate-400">{icon}</div>
        <span className="font-semibold">{label}:</span>
        <span>{value}</span>
    </div>
);

const TrendReportSection: React.FC<{ title: string; items: TrendItem[] }> = ({ title, items }) => (
    <div>
        <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
        <div className="space-y-4">
            {items.map((item, index) => (
                <div key={index} className="bg-black/20 p-4 rounded-lg border border-white/10">
                    <h4 className="font-semibold text-sky-300">{item.title}</h4>
                    <p className="text-sm text-slate-300 mt-1 mb-3">{item.description}</p>
                    {item.audienceResonance && (
                        <blockquote className="text-sm text-purple-200 mt-1 mb-3 border-l-2 border-purple-400 pl-3 italic">
                           {item.audienceResonance}
                        </blockquote>
                    )}
                    <div className="flex flex-wrap gap-2">
                        <TrendMetadataTag icon={<TrendingUpIcon />} label="Velocity" value={item.velocity} />
                        <TrendMetadataTag icon={<ClockIcon />} label="Lifespan" value={item.lifespanPrediction} />
                        <TrendMetadataTag icon={<UsersIcon />} label="Audience" value={item.targetAudience} />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const CrossPlatformSection: React.FC<{ items: CrossPlatformTrend[] }> = ({ items }) => (
    <div>
        <h3 className="text-xl font-bold text-white mb-4">Cross-Platform Analysis</h3>
        <div className="space-y-4">
            {items.map((item, index) => (
                <div key={index} className="bg-black/20 p-4 rounded-lg border border-white/10">
                    <h4 className="font-semibold text-sky-300 mb-2">{item.trend}</h4>
                    <div className="flex items-center gap-2 text-sm font-medium mb-3">
                        <span className="bg-slate-700 px-2 py-0.5 rounded">{item.originPlatform}</span>
                        <ArrowRightIcon className="w-5 h-5 text-slate-500" />
                        <div className="flex flex-wrap gap-1">
                            {item.emergingOn.map(p => <span key={p} className="bg-slate-700 px-2 py-0.5 rounded">{p}</span>)}
                        </div>
                    </div>
                    <p className="text-sm text-slate-300 border-l-2 border-sky-500 pl-3">{item.insight}</p>
                </div>
            ))}
        </div>
    </div>
);


export const TrendRadarScreen: React.FC<TrendRadarScreenProps> = ({ user, isLoading, error, trendReport, onGenerateReport, onUseTrend }) => {
    const [selectedCountry, setSelectedCountry] = useState('Indonesia');
    
    const canGenerate = !isLoading && user && user.credits > 0;

    const getButtonText = () => {
        if (isLoading) return 'Analyzing...';
        if (user && user.credits <= 0) return 'Out of Credits';
        return '✨ Generate Report (1 Credit)';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onGenerateReport(selectedCountry);
    };

    return (
    <main className="flex-grow container mx-auto p-4 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-10">
            <RadarIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h1 className="text-4xl font-extrabold text-white tracking-tight">AI Trend Radar</h1>
            <p className="mt-4 text-lg text-slate-400">Your real-time creative pulse. Discover what's trending, for who, and for how long.</p>
        </div>

        {/* Controls */}
        <form onSubmit={handleSubmit} className="bg-slate-800/60 backdrop-blur-2xl border border-slate-700 rounded-2xl p-6 shadow-lg flex flex-col sm:flex-row items-center gap-4 mb-12">
            <div className="w-full sm:w-auto flex-grow">
                <label htmlFor="country-select" className="sr-only">Select Country</label>
                <select 
                    id="country-select"
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-sky-500 transition"
                >
                    {countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            <button
                type="submit"
                disabled={!canGenerate}
                className="w-full sm:w-auto font-bold py-3 px-6 rounded-lg text-white bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg btn-bounce flex-shrink-0"
            >
                {getButtonText()}
            </button>
        </form>

        {/* Results */}
        <div>
            {isLoading && (
                <div className="flex flex-col items-center justify-center text-center py-16">
                    <LoadingSpinner />
                    <p className="text-lg text-slate-400 mt-4">Analyzing latest trends in {selectedCountry}...</p>
                    <p className="text-sm text-slate-500">This may take a moment as we scan the web.</p>
                </div>
            )}
            
            {error && !isLoading && <Alert type="error" message={error} />}

            {!isLoading && !trendReport && !error && (
                <div className="text-center py-16 bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-700">
                   <h3 className="mt-4 text-xl font-semibold text-slate-300">Your trend report will appear here</h3>
                   <p className="mt-1 text-slate-500">Select a country and generate a report to begin.</p>
                </div>
            )}

            {trendReport && !isLoading && (
                <div className="space-y-8 animate-fade-in">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-3">Trend Summary for {selectedCountry}</h2>
                        <p className="text-slate-300 bg-black/20 p-4 rounded-lg border border-white/10">{trendReport.summary}</p>
                    </div>

                    <TrendReportSection title="Topical Trends" items={trendReport.topicalTrends} />
                    <TrendReportSection title="Visual & Audio Styles" items={trendReport.visualAudioStyles} />
                    <TrendReportSection title="Popular Formats" items={trendReport.popularFormats} />

                    {trendReport.crossPlatformTrends && trendReport.crossPlatformTrends.length > 0 && (
                        <CrossPlatformSection items={trendReport.crossPlatformTrends} />
                    )}
                    
                    <div className="bg-slate-800/80 backdrop-blur-lg border border-sky-500/30 rounded-xl p-6">
                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2"><LightbulbIcon className="w-5 h-5" /> AI Prompt Idea</h3>
                        <p className="text-slate-300 text-sm mb-4 bg-black/20 p-3 rounded-md italic">"{trendReport.examplePrompt}"</p>
                        <button
                          onClick={() => onUseTrend(trendReport.examplePrompt)}
                          className="w-full font-bold py-2 px-4 rounded-full text-white bg-sky-500 hover:bg-sky-400 shadow-md btn-bounce flex items-center justify-center gap-2"
                        >
                          <ImageIcon className="w-5 h-5" />
                          Generate with this trend
                        </button>
                    </div>

                </div>
            )}
        </div>

      </div>
    </main>
  );
};