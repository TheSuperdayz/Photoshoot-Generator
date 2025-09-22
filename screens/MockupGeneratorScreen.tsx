import React from 'react';

// Components
import { ImageUploader } from '../components/ImageUploader';
import { GeneratedImageGallery } from '../components/GeneratedImageGallery';
import { PresetSelector } from '../components/PresetSelector';
import { TemplateSelector } from '../components/TemplateSelector';
import { EnhancedPromptInput } from '../components/EnhancedPromptInput';

// Types
import type { ImageData, User, Template, SessionImage } from '../types';

interface MockupGeneratorScreenProps {
    user: User;
    designImage: ImageData | null;
    setDesignImage: (image: ImageData | null) => void;
    selectedTemplate: Template | null;
    setSelectedTemplate: (template: Template | null) => void;
    generatedImages: SessionImage[];
    isLoading: boolean;
    error: string | null;
    backgroundStyle: string;
    setBackgroundStyle: (style: string) => void;
    customBackground: string;
    setCustomBackground: (prompt: string) => void;
    applyBrandKit: boolean;
    setApplyBrandKit: (apply: boolean) => void;
    handleGenerate: () => void;
    onGenerateCopy: (imageSrc: string) => void;
}

export const MockupGeneratorScreen: React.FC<MockupGeneratorScreenProps> = (props) => {
  const backgroundOptions = ['Studio White', 'Urban Street', 'Office Desk', 'Minimalist', 'Nature', 'Custom'];

  const canGenerate = !!props.designImage && !!props.selectedTemplate && !props.isLoading && props.user && props.user.credits > 0;
  const brandKitIsSetup = props.user.brandKit && (props.user.brandKit.logo || props.user.brandKit.colorPalette.length > 0 || props.user.brandKit.brandFont);


  const getButtonText = () => {
    if (props.isLoading) return 'Generating...';
    if (props.user && props.user.credits <= 0) return 'Out of Credits';
    return '✨ Generate Mockup (1 Credit)';
  };

  return (
      <main className="flex-grow container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Control Panel */}
        <div className="lg:col-span-4 bg-black/30 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col gap-6 h-fit sticky top-24">
          <h2 className="text-xl font-bold text-white">AI Mockup Generator</h2>
          
          <div className="grid grid-cols-1 gap-4">
             <ImageUploader label="Upload Your Design" onImageUpload={props.setDesignImage} />
          </div>

          <TemplateSelector
            selectedTemplate={props.selectedTemplate}
            onSelect={props.setSelectedTemplate}
          />
          
          <PresetSelector label="Background Style" options={backgroundOptions} selectedOption={props.backgroundStyle} onSelect={props.setBackgroundStyle} />

          {props.backgroundStyle === 'Custom' && (
            <EnhancedPromptInput
                label="Custom Background Prompt"
                value={props.customBackground}
                onChange={props.setCustomBackground}
                placeholder="e.g., on a wooden table next to a steaming coffee..."
                rows={2}
                examplePrompts={[
                    'On a clean marble countertop with kitchen utensils.',
                    'Floating in a surreal, abstract, colorful space.',
                    'On a rustic wooden picnic table in a sunny park.',
                    'Held by a person on a busy city street.',
                ]}
            />
          )}
          
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
