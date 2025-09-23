import React, { useState, useCallback, useRef } from 'react';
import type { ImageData, User, SimulationReport, HeatmapPoint } from '../types';
import { EnhancedPromptInput } from '../components/EnhancedPromptInput';
import { Alert } from '../components/Alert';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { TestTubeIcon } from '../components/icons/TestTubeIcon';
import { PhotoIcon } from '../components/icons/PhotoIcon';
import { CrownIcon } from '../components/icons/CrownIcon';
import { Tooltip } from '../components/Tooltip';

interface PredictiveSimulatorScreenProps {
  user: User;
  isLoading: boolean;
  error: string | null;
  simulationReport: SimulationReport | null;
  handleGenerate: (creatives: ImageData[], audience: string, channels: string) => void;
}

const UploaderSlot: React.FC<{
  imageData: ImageData | null;
  onImageUpload: (imageData: ImageData) => void;
  onImageRemove: () => void;
  index: number;
}> = ({ imageData, onImageUpload, onImageRemove, index }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onImageUpload({ base64: base64String, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => fileInputRef.current?.click();

  return (
    <div className="flex flex-col items-center">
      <label className="block text-sm font-medium text-gray-400 mb-2">Creative {index + 1}</label>
      <div
        className="relative w-full aspect-square bg-black/20 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center text-gray-400 hover:border-gray-400 transition-colors cursor-pointer overflow-hidden"
        onClick={handleClick}
      >
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" className="hidden" />
        {imageData ? (
          <>
            <img src={imageData.base64} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
            <button onClick={handleRemove} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black/80">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </>
        ) : (
          <div className="text-center p-1"><PhotoIcon className="w-8 h-8 mx-auto" /><p className="mt-1 text-xs">Upload</p></div>
        )}
      </div>
    </div>
  );
};

const HeatmapOverlay: React.FC<{ hotspots: HeatmapPoint[]; coldspots: HeatmapPoint[] }> = ({ hotspots, coldspots }) => (
    <div className="absolute inset-0 pointer-events-none">
        {hotspots.map((p, i) => (
            <Tooltip key={`hot-${i}`} content="High Attention Area">
                <div className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 bg-green-400/50 rounded-full animate-pulse" style={{ left: `${p.x}%`, top: `${p.y}%`, animationDelay: `${i * 100}ms` }}>
                    <div className="w-full h-full bg-green-400 rounded-full blur-md"></div>
                </div>
            </Tooltip>
        ))}
        {coldspots.map((p, i) => (
            <Tooltip key={`cold-${i}`} content="Low Attention/Distraction">
                 <div className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 bg-red-500/60 rounded-full" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
                     <div className="w-full h-full bg-red-500 rounded-full blur-sm"></div>
                 </div>
            </Tooltip>
        ))}
    </div>
);


export const PredictiveSimulatorScreen: React.FC<PredictiveSimulatorScreenProps> = (props) => {
  const [creatives, setCreatives] = useState<(ImageData | null)[]>(Array(4).fill(null));
  const [audience, setAudience] = useState('');
  const [channels, setChannels] = useState('');

  const validCreatives = creatives.filter((c): c is ImageData => c !== null);
  const canGenerate = validCreatives.length > 0 && !!audience.trim() && !!channels.trim() && !props.isLoading && props.user.credits > 0;

  const handleUpload = (index: number, imageData: ImageData) => {
    const newCreatives = [...creatives];
    newCreatives[index] = imageData;
    setCreatives(newCreatives);
  };

  const handleRemove = (index: number) => {
    const newCreatives = [...creatives];
    newCreatives[index] = null;
    setCreatives(newCreatives);
  };

  const handleSubmit = () => {
    if (canGenerate) {
      props.handleGenerate(validCreatives, audience, channels);
    }
  };

  return (
    <main className="flex-grow container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4 bg-slate-800/60 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 shadow-lg flex flex-col gap-6 h-fit sticky top-24">
        <h2 className="text-xl font-bold text-white">AI Media Lab</h2>
        
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Upload Creatives (1-4)</label>
            <div className="grid grid-cols-2 gap-3">
                {creatives.map((img, i) => (
                    <UploaderSlot key={i} index={i} imageData={img} onImageUpload={(data) => handleUpload(i, data)} onImageRemove={() => handleRemove(i)} />
                ))}
            </div>
        </div>

        <EnhancedPromptInput label="Target Audience Persona" value={audience} onChange={setAudience} placeholder="e.g., Gen Z in Jakarta, loves streetwear..." examplePrompts={['Millennials in Bandung who are eco-conscious.', 'Professional mothers aged 30-45.']} rows={2}/>
        <EnhancedPromptInput label="Target Channels" value={channels} onChange={setChannels} placeholder="e.g., TikTok, Instagram Reels..." examplePrompts={['LinkedIn, Facebook Ads', 'YouTube Shorts, Pinterest']} rows={2}/>

        {props.error && <Alert type="error" message={props.error} />}

        <button onClick={handleSubmit} disabled={!canGenerate} className="w-full font-bold py-3 px-4 rounded-lg text-white bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg btn-bounce">
          {props.isLoading ? 'Simulating...' : `🧪 Simulate Performance (1 Credit)`}
        </button>
      </div>

      <div className="lg:col-span-8">
        {props.isLoading ? (
          <div className="w-full h-[60vh] flex flex-col items-center justify-center bg-white/5 rounded-2xl"><LoadingSpinner /><p className="text-lg mt-4">Running simulations...</p></div>
        ) : !props.simulationReport ? (
          <div className="w-full h-[60vh] flex flex-col items-center justify-center bg-white/5 rounded-2xl border-2 border-dashed border-gray-700 text-center p-4">
            <TestTubeIcon className="w-16 h-16 text-gray-600 mx-auto" />
            <h3 className="mt-4 text-xl font-semibold text-gray-300">Your simulation results will appear here</h3>
            <p className="mt-1 text-gray-500">Upload your ad creatives and define your audience to predict their future performance.</p>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
             <div>
                <h2 className="text-2xl font-bold text-white mb-3">Simulation Summary</h2>
                <p className="text-slate-300 bg-black/20 p-4 rounded-lg border border-white/10">{props.simulationReport.summary}</p>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {props.simulationReport.results.map((result, index) => {
                    const creativeImage = validCreatives[index];
                    if (!creativeImage) return null;

                    return (
                        <div key={result.creativeId} className="bg-slate-800/80 backdrop-blur-lg border border-slate-700 rounded-xl p-5 space-y-4">
                            <div className="relative">
                                <img src={creativeImage.base64} alt={`Creative ${result.creativeId}`} className="rounded-lg w-full aspect-square object-cover" />
                                <HeatmapOverlay hotspots={result.heatmap.hotspots} coldspots={result.heatmap.coldspots} />
                                {result.isBestPerformer && (
                                    <div className="absolute top-2 left-2 flex items-center gap-2 bg-yellow-400/20 border border-yellow-500/30 text-yellow-300 font-bold px-3 py-1 rounded-full text-sm">
                                        <CrownIcon className="w-4 h-4" /> <span>Best Performer</span>
                                    </div>
                                )}
                            </div>
                            
                            <div>
                                <h4 className="font-semibold text-white mb-2">Heatmap Analysis</h4>
                                <p className="text-sm text-slate-300 italic">"{result.heatmap.insight}"</p>
                            </div>
                             <div>
                                <h4 className="font-semibold text-white mb-2">Performance Metrics</h4>
                                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                                    <div className="bg-black/20 p-2 rounded-md"><div className="text-xs text-slate-400">Virality</div><div className="font-bold text-lg">{result.predictions.viralityScore}/100</div></div>
                                    <div className="bg-black/20 p-2 rounded-md"><div className="text-xs text-slate-400">Conversion</div><div className="font-bold text-lg">{result.predictions.conversionLikelihood}</div></div>
                                    <div className="bg-black/20 p-2 rounded-md"><div className="text-xs text-slate-400">Est. CTR</div><div className="font-bold text-lg">{result.predictions.ctrEstimate}</div></div>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white mb-2">Channel Recommendation</h4>
                                <p className="text-sm text-slate-300">{result.channelRecommendation}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};