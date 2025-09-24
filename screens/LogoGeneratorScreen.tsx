

import React from 'react';

// Components
import { PresetSelector } from '../components/PresetSelector';
import { EnhancedPromptInput } from '../components/EnhancedPromptInput';
import { Alert } from '../components/Alert';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { LogoCreatorIcon } from '../components/icons/LogoCreatorIcon';
import { DownloadIcon } from '../components/icons/DownloadIcon';
import { SparklesIcon } from '../components/icons/SparklesIcon';

// Types
import type { User, SessionImage } from '../types';

interface LogoGeneratorScreenProps {
    user: User;
    brandName: string;
    setBrandName: (name: string) => void;
    slogan: string;
    setSlogan: (slogan: string) => void;
    keywords: string;
    setKeywords: (keywords: string) => void;
    colorPalette: string;
    setColorPalette: (colors: string) => void;
    logoStyle: string;
    setLogoStyle: (style: string) => void;
    generatedLogos: SessionImage[];
    isLoading: boolean;
    error: string | null;
    handleGenerate: () => void;
    onImageClick: (imageSrc: string) => void;
    onGenerateVariations: (logo: SessionImage) => void;
}

export const LogoGeneratorScreen: React.FC<LogoGeneratorScreenProps> = (props) => {
  const styleOptions = ['Minimalist', 'Modern', 'Geometric', 'Abstract', 'Vintage', 'Mascot'];
  const styleTooltips = {
    'Minimalist': 'Clean lines, simple shapes, and a limited color palette.',
    'Modern': 'Sleek, current, and often uses sans-serif fonts.',
    'Geometric': 'Uses geometric shapes like circles, squares, and triangles.',
    'Abstract': 'A conceptual symbol that represents the brand.',
    'Vintage': 'Retro or classic look, often with ornate details.',
    'Mascot': 'A character or illustrated figure that represents the brand.',
  };

  const canGenerate = !!props.brandName.trim() && !!props.keywords.trim() && !props.isLoading && props.user.credits > 0;

  const getButtonText = () => {
    if (props.isLoading) return 'Generating...';
    if (props.user && props.user.credits <= 0) return 'Out of Credits';
    return '✨ Generate Logos (1 Credit)';
  };

  return (
    <main className="flex-grow container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Control Panel */}
      <div className="lg:col-span-4 bg-slate-800/60 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 shadow-lg flex flex-col gap-6 h-fit sticky top-24">
        <h2 className="text-xl font-bold text-white">AI Logo Generator</h2>
        
        <EnhancedPromptInput
          label="Brand Name"
          value={props.brandName}
          onChange={props.setBrandName}
          placeholder="e.g., Superdayz"
          rows={1}
          examplePrompts={[]}
          tooltip="The name of your brand or company."
        />
        <EnhancedPromptInput
          label="Slogan (Optional)"
          value={props.slogan}
          onChange={props.setSlogan}
          placeholder="e.g., AI Next-Generator"
          rows={1}
          examplePrompts={[]}
          tooltip="A short tagline for your brand."
        />
        <EnhancedPromptInput
          label="Core Keywords"
          value={props.keywords}
          onChange={props.setKeywords}
          placeholder="e.g., technology, creative, futuristic, simple"
          rows={2}
          examplePrompts={['minimal, eco-friendly, natural', 'bold, powerful, athletic']}
          tooltip="Describe your brand's essence in a few words."
        />
        <EnhancedPromptInput
          label="Color Palette"
          value={props.colorPalette}
          onChange={props.setColorPalette}
          placeholder="e.g., blue, white, silver"
          rows={1}
          examplePrompts={['warm earth tones', 'vibrant neon colors']}
          tooltip="Describe the colors you want in your logo."
        />

        <PresetSelector label="Logo Style" options={styleOptions} selectedOption={props.logoStyle} onSelect={props.setLogoStyle} tooltips={styleTooltips} />
        
        {props.error && <Alert type="error" message={props.error} />}

        <button
          onClick={props.handleGenerate}
          disabled={!canGenerate}
          className="w-full font-bold py-3 px-4 rounded-lg text-white bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg btn-bounce"
        >
          {getButtonText()}
        </button>
      </div>

      {/* Logo Gallery */}
      <div className="lg:col-span-8">
        {props.isLoading && props.generatedLogos.length === 0 ? (
          <div className="w-full h-[60vh] flex flex-col items-center justify-center bg-white/5 rounded-2xl"><LoadingSpinner /><p className="text-lg mt-4">Generating...</p></div>
        ) : !props.isLoading && props.generatedLogos.length === 0 ? (
          <div className="w-full h-[60vh] flex flex-col items-center justify-center bg-white/5 rounded-2xl border-2 border-dashed border-gray-700 text-center p-4">
            <LogoCreatorIcon className="w-16 h-16 text-gray-600 mx-auto" />
            <h3 className="mt-4 text-xl font-semibold text-gray-300">Your logo concepts will appear here</h3>
            <p className="mt-1 text-gray-500">Fill in your brand details to generate logos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {props.generatedLogos.slice(0, 4).map((logo, index) => (
              <div 
                key={logo.id} 
                className={`flex flex-col animate-item-enter transition-all duration-300 ${logo.isParent ? 'ring-4 ring-sky-400 rounded-2xl p-1' : ''}`}
                style={{ animationDelay: `${Math.min(index * 50, 500)}ms`, animationFillMode: 'backwards' }}
              >
                <div 
                  className="relative group aspect-square bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
                >
                  <div className="w-full h-full cursor-zoom-in" onClick={() => props.onImageClick(logo.src)}>
                    <img src={logo.src} alt={`Generated logo ${index + 1}`} className="w-full h-full object-contain p-4" />
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 pointer-events-none">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        props.onGenerateVariations(logo);
                      }}
                      className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white font-semibold py-2 px-3 rounded-full hover:bg-white/30 transition-colors pointer-events-auto"
                      title="Generate Variations"
                    >
                      <SparklesIcon className="w-5 h-5" />
                    </button>
                    <a
                      href={logo.src}
                      download={`superdayz-logo-${logo.id}.jpg`}
                      className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white font-semibold py-2 px-3 rounded-full hover:bg-white/30 transition-colors pointer-events-auto"
                      title="Download Logo"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DownloadIcon className="w-5 h-5" />
                    </a>
                  </div>
                </div>
                {logo.rationale && (
                  <div className="mt-4 bg-slate-800/50 p-4 rounded-md text-center border border-slate-700">
                    <p className="text-sm text-slate-300 italic">"{logo.rationale}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};