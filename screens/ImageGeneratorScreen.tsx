import React from 'react';

// Components
import { GeneratedImageGallery } from '../components/GeneratedImageGallery';
import { PresetSelector } from '../components/PresetSelector';
import { AspectRatioSelector } from '../components/AspectRatioSelector';
import { EnhancedPromptInput } from '../components/EnhancedPromptInput';
import { Tooltip } from '../components/Tooltip';

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
  const styleTooltips = {
    'Photorealistic': 'Generates images that look like real photos.',
    'Cinematic': 'Creates dramatic, movie-like scenes with rich lighting.',
    'Anime': 'Produces images in a Japanese animation style.',
    'Watercolor': 'Simulates the look of a watercolor painting.',
    'Digital Art': 'Creates a clean, modern digital illustration.',
    'Pixel Art': 'Generates retro, 8-bit style pixelated art.',
  };
  
  const aspectRatioTooltips = {
    '1:1': 'Generates a square image, ideal for profile pictures or Instagram posts.',
    '16:9': 'Generates a widescreen image, ideal for thumbnails or desktop wallpapers.',
    '9:16': 'Generates a vertical image, ideal for mobile wallpapers or Instagram stories.',
  };


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
          
          <EnhancedPromptInput
            label="Your Prompt"
            value={props.prompt}
            onChange={props.setPrompt}
            placeholder="e.g., A majestic lion wearing a crown, studio lighting..."
            rows={4}
            examplePrompts={[
                'A magical forest with glowing mushrooms and a crystal river.',
                'An astronaut riding a flamingo on the moon, pop art style.',
                'Hyperrealistic portrait of an old sailor with a weathered face.',
                'A futuristic cyberpunk city skyline at dusk.',
            ]}
            tooltip="Describe the image you want the AI to create. Be as specific as possible for best results."
          />

          <PresetSelector label="Style Preset" options={styleOptions} selectedOption={props.stylePreset} onSelect={props.setStylePreset} tooltips={styleTooltips} />
          
          <AspectRatioSelector selectedRatio={props.aspectRatio} onSelectRatio={props.setAspectRatio} tooltips={aspectRatioTooltips} />
          
           {brandKitIsSetup && (
            <Tooltip content="Infuses the generated image with your brand's color palette.">
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
            </Tooltip>
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
