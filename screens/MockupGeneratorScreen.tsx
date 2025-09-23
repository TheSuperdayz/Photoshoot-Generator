
import React from 'react';

// Components
import { ImageUploader } from '../components/ImageUploader';
import { GeneratedImageGallery } from '../components/GeneratedImageGallery';
import { PresetSelector } from '../components/PresetSelector';
import { TemplateSelector } from '../components/TemplateSelector';
import { EnhancedPromptInput } from '../components/EnhancedPromptInput';
import { Tooltip } from '../components/Tooltip';
import { Alert } from '../components/Alert';
import { MockupPreview } from '../components/MockupPreview';
import { WatermarkToggle } from '../components/WatermarkToggle';


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
    isWatermarkEnabled: boolean;
    setIsWatermarkEnabled: (enabled: boolean) => void;
    handleGenerate: () => void;
    onGenerateCopy: (imageSrc: string) => void;
    onImageClick: (imageSrc: string) => void;
    onEditImage: (id: string, imageSrc: string) => void;
}

export const MockupGeneratorScreen: React.FC<MockupGeneratorScreenProps> = (props) => {
  const backgroundOptions = ['Studio White', 'Urban Street', 'Office Desk', 'Minimalist', 'Nature', 'Custom'];
  const backgroundTooltips = {
    'Studio White': 'A clean, professional studio with white background.',
    'Urban Street': 'A gritty, realistic city street environment.',
    'Office Desk': 'A modern office setting with desk accessories.',
    'Minimalist': 'A simple, uncluttered, and aesthetically clean background.',
    'Nature': 'An outdoor scene with natural elements like plants or landscapes.',
    'Custom': 'Describe your own unique background scene below.',
  };

  const canGenerate = !!props.designImage && !!props.selectedTemplate && !props.isLoading && props.user && props.user.credits > 0;
  const brandKitIsSetup = props.user.brandKit && (props.user.brandKit.logo || props.user.brandKit.colorPalette.length > 0 || props.user.brandKit.brandFont);
  // FIX: Updated plan check from 'Pro' to 'Executive'
  const isProUser = props.user.subscription?.plan === 'Executive';


  const getButtonText = () => {
    if (props.isLoading) return 'Generating...';
    if (props.user && props.user.credits <= 0) return 'Out of Credits';
    return '✨ Generate Mockup (1 Credit)';
  };

  return (
      <main className="flex-grow container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Control Panel */}
        <div className="lg:col-span-4 bg-slate-800/60 backdrop-blur-2xl border border-slate-700 rounded-2xl p-6 shadow-lg flex flex-col gap-6 h-fit sticky top-24">
          <h2 className="text-xl font-bold text-white">AI Mockup Generator</h2>
          
          <div className="grid grid-cols-1 gap-4">
             <ImageUploader label="Upload Your Design" onImageUpload={props.setDesignImage} tooltip="Upload the design, logo, or artwork you want to place on a mockup." />
          </div>

          <TemplateSelector
            selectedTemplate={props.selectedTemplate}
            onSelect={props.setSelectedTemplate}
          />
          
          <PresetSelector label="Background Style" options={backgroundOptions} selectedOption={props.backgroundStyle} onSelect={props.setBackgroundStyle} tooltips={backgroundTooltips} />

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
                tooltip="Describe the exact background scene you want for your mockup."
            />
          )}
          
          <div className="flex flex-col gap-3">
             {brandKitIsSetup && (
                <Tooltip content="Automatically apply your brand colors and font style to the background scene.">
                  <div className="flex items-center justify-between bg-black/20 p-3 rounded-lg border border-white/5">
                      <label htmlFor="apply-brand-kit" className="text-sm font-medium text-slate-200 cursor-pointer">
                        Apply Brand Kit
                      </label>
                      <button
                        id="apply-brand-kit"
                        role="switch"
                        aria-checked={props.applyBrandKit}
                        onClick={() => props.setApplyBrandKit(!props.applyBrandKit)}
                        className={`${
                          props.applyBrandKit ? 'bg-sky-500' : 'bg-slate-600'
                        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800`}
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
             <WatermarkToggle 
                isEnabled={props.isWatermarkEnabled}
                setIsEnabled={props.setIsWatermarkEnabled}
                isDisabled={!isProUser}
                tooltipContent={isProUser ? 'Toggle watermark on or off for your final image.' : 'Upgrade to Pro to remove watermarks.'}
              />
          </div>

          {props.error && <Alert type="error" message={props.error} />}

          <button
            onClick={props.handleGenerate}
            disabled={!canGenerate}
            className="w-full font-bold py-3 px-4 rounded-lg text-white bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg btn-bounce"
          >
            {getButtonText()}
          </button>

        </div>

        {/* Image Gallery / Preview */}
        <div className="lg:col-span-8">
          {props.designImage && props.selectedTemplate && props.generatedImages.length === 0 && !props.isLoading ? (
            <MockupPreview designImage={props.designImage} template={props.selectedTemplate} />
          ) : (
            <GeneratedImageGallery images={props.generatedImages} isLoading={props.isLoading} onGenerateCopy={props.onGenerateCopy} onImageClick={props.onImageClick} onEditImage={props.onEditImage} />
          )}
        </div>
      </main>
  );
};
