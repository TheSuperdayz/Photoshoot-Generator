import React from 'react';

// Components
import { GeneratedImageGallery } from '../components/GeneratedImageGallery';
import { PresetSelector } from '../components/PresetSelector';
import { AspectRatioSelector } from '../components/AspectRatioSelector';

// Types
import type { User, SessionImage } from '../types';

interface ImageGeneratorScreenProps {
    user: User;
    prompt: string;
    setPrompt: (prompt: string) => void;
    stylePreset: string;
    setStylePreset: (style: string) => void;
    aspectRatio: '1:1' | '16:9' | '9:16';
    setAspectRatio: (ratio: '1:1' | '16:9' | '9:16') => void;
    generatedImages: SessionImage[];
    isLoading: boolean;
    error: string | null;
    applyBrandKit: boolean;
    setApplyBrandKit: (apply: boolean) => void;
    handleGenerate: () => void;
    onGenerateCopy: (imageSrc: string) => void;
}

export const ImageGeneratorScreen: React.FC<ImageGeneratorScreenProps> = (props) => {
  const styleOptions = ['Photorealistic', 'Cinematic', 'Anime', 'Watercolor', 'Digital Art', 'Pixel Art'];

  const canGenerate = !!props.prompt.trim() && !props.isLoading && props.user && props.user.credits > 0;
  const brandKitIsSetup = props.user.brandKit && (props.user.brandKit.logo || props.user.brandKit.colorPalette.length > 0 || props.user.brandKit.brandFont);


  const getButtonText = () => {
    if (props.isLoading) return 'Generating...';
    if (props.user && props.user.credits <= 0) return 'Out of Credits';
    return '✨ Generate Image (1 Credit)';
  };

  return (
      <main className="flex-grow container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Control Panel */}
        <div className="lg:col-span-4 bg-black/30 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col gap-6 h-fit sticky top-24">
          <h2 className="text-xl font-bold text-white">AI Image Generator</h2>
          
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">Your Prompt</label>
            <textarea
              id="prompt"
              rows={4}
              className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition duration-200 placeholder-gray-400"
              placeholder="e.g., A majestic lion wearing a crown, studio lighting..."
              value={props.prompt}
              onChange={(e) => props.setPrompt(e.target.value)}
            />
          </div>

          <PresetSelector label="Style Preset" options={styleOptions} selectedOption={props.stylePreset} onSelect={props.setStylePreset} />
          
          <AspectRatioSelector selectedRatio={props.aspectRatio} onSelectRatio={props.setAspectRatio} />
          
           {brandKitIsSetup && (
             <div className="flex items-center justify-between bg-black/20 p-3 rounded-lg border border-white/5">
                <label htmlFor="apply-brand-kit" className="text-sm font-medium text-gray-200 cursor-pointer">
                  Apply Brand Kit
                </label>
                <button
                  id="apply-brand-kit"
                  role="switch"
                  aria-checked={props.applyBrandKit}
                  onClick={() => props.setApplyBrandKit(!props.applyBrandKit)}
                  className={`${
                    props.applyBrandKit ? 'bg-gray-300' : 'bg-gray-600'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-900`}
                >
                  <span
                    className={`${
                      props.applyBrandKit ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </button>
            </div>
          )}

          <button
            onClick={props.handleGenerate}
            disabled={!canGenerate}
            className="w-full font-bold py-3 px-4 rounded-lg text-gray-900 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg btn-bounce"
          >
            {getButtonText()}
          </button>

          {props.error && <p className="text-red-400 text-sm mt-2 text-center">{props.error}</p>}
        </div>

        {/* Image Gallery */}
        <div className="lg:col-span-8">
          <GeneratedImageGallery images={props.generatedImages} isLoading={props.isLoading} onGenerateCopy={props.onGenerateCopy} />
        </div>
      </main>
  );
};