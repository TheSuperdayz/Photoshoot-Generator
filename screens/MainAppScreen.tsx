
import React from 'react';

// Components
import { ImageUploader } from '../components/ImageUploader';
import { GeneratedImageGallery } from '../components/GeneratedImageGallery';
import { PresetSelector } from '../components/PresetSelector';
import { EnhancedPromptInput } from '../components/EnhancedPromptInput';
import { Tooltip } from '../components/Tooltip';
import { Alert } from '../components/Alert';
import { WatermarkToggle } from '../components/WatermarkToggle';


// Types
import type { ImageData, User, SessionImage } from '../types';

interface MainAppScreenProps {
    user: User;
    productImage: ImageData | null;
    setProductImage: (image: ImageData | null) => void;
    modelImage: ImageData | null;
    setModelImage: (image: ImageData | null) => void;
    generatedImages: SessionImage[];
    isLoading: boolean;
    error: string | null;
    sceneStyle: string;
    setSceneStyle: (style: string) => void;
    modelPose: string;
    setModelPose: (pose: string) => void;
    lighting: string;
    setLighting: (lighting: string) => void;
    customPrompt: string;
    setCustomPrompt: (prompt: string) => void;
    applyBrandKit: boolean;
    setApplyBrandKit: (apply: boolean) => void;
    isWatermarkEnabled: boolean;
    setIsWatermarkEnabled: (enabled: boolean) => void;
    handleGenerate: () => void;
    onGenerateCopy: (imageSrc: string) => void;
    onImageClick: (imageSrc: string) => void;
    onEditImage: (id: string, imageSrc: string) => void;
}

export const MainAppScreen: React.FC<MainAppScreenProps> = (props) => {
  // Constants for presets
  const sceneOptions = ['Fashion', 'Corporate', 'Wedding', 'Casual', 'Futuristic'];
  const poseOptions = ['Standing', 'Sitting', 'Close-up', 'Action', 'Candid'];
  const lightingOptions = ['Natural', 'Softbox', 'Dramatic', 'Neon', 'Golden Hour'];
  
  const sceneTooltips = {
    'Fashion': 'Creates a high-fashion, editorial look.',
    'Corporate': 'Generates a clean, professional, business-like setting.',
    'Wedding': 'Produces elegant and romantic wedding-themed scenes.',
    'Casual': 'Creates relaxed, everyday, lifestyle environments.',
    'Futuristic': 'Generates sci-fi, cyberpunk, or futuristic aesthetics.',
  };
  const poseTooltips = {
      'Standing': 'Model will be in a standing pose.',
      'Sitting': 'Model will be in a sitting pose.',
      'Close-up': 'Focuses on the model\'s face and upper body.',
      'Action': 'Generates dynamic, in-motion poses.',
      'Candid': 'Creates natural, unposed, in-the-moment shots.',
  };
  const lightingTooltips = {
      'Natural': 'Simulates sunlight or ambient daylight.',
      'Softbox': 'Creates soft, diffused lighting typical of a photo studio.',
      'Dramatic': 'Uses high-contrast lighting for a moody effect.',
      'Neon': 'Incorporates vibrant neon lights into the scene.',
      'Golden Hour': 'Simulates the warm, soft light of sunrise or sunset.',
  };

  const canGenerate = !!props.productImage && !!props.modelImage && !props.isLoading && props.user && props.user.credits > 0;
  const brandKitIsSetup = props.user.brandKit && (props.user.brandKit.logo || props.user.brandKit.colorPalette.length > 0 || props.user.brandKit.brandFont);
  // FIX: Updated plan check from 'Pro' to 'Executive'
  const isProUser = props.user.subscription?.plan === 'Executive';

  const getButtonText = () => {
    if (props.isLoading) return 'Generating...';
    if (props.user && props.user.credits <= 0) return 'Out of Credits';
    return '✨ Generate Photo (1 Credit)';
  };

  return (
      <main className="flex-grow container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Control Panel */}
        <div className="lg:col-span-4 bg-slate-800/60 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 shadow-lg flex flex-col gap-6 h-fit sticky top-24">
          <h2 className="text-xl font-bold text-white">Create Your Photoshoot</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <ImageUploader label="Product Image" onImageUpload={props.setProductImage} tooltip="Upload the image of the product you want to feature." />
            <ImageUploader label="Model Image" onImageUpload={props.setModelImage} tooltip="Upload the image of the model you want to feature." />
          </div>

          <PresetSelector label="Scene Style" options={sceneOptions} selectedOption={props.sceneStyle} onSelect={props.setSceneStyle} tooltips={sceneTooltips} />
          <PresetSelector label="Model Pose" options={poseOptions} selectedOption={props.modelPose} onSelect={props.setModelPose} tooltips={poseTooltips} />
          <PresetSelector label="Lighting" options={lightingOptions} selectedOption={props.lighting} onSelect={props.setLighting} tooltips={lightingTooltips} />

          <EnhancedPromptInput
            label="Additional Details"
            value={props.customPrompt}
            onChange={props.setCustomPrompt}
            placeholder="e.g., holding a coffee cup, in a city at night..."
            examplePrompts={[
                'In a bustling city at night, surrounded by neon lights.',
                'Laughing and looking away from the camera.',
                'Wearing a stylish trench coat and holding an umbrella in the rain.',
                'Sitting at a minimalist cafe, sunlight streaming in.',
            ]}
            tooltip="Provide extra details to guide the AI, like specific actions, background elements, or mood."
          />
          
          <div className="flex flex-col gap-3">
             {brandKitIsSetup && (
                <Tooltip content="Automatically apply your saved logo, brand colors, and font style to the generated image.">
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

        {/* Image Gallery */}
        <div className="lg:col-span-8">
          <GeneratedImageGallery images={props.generatedImages} isLoading={props.isLoading} onGenerateCopy={props.onGenerateCopy} onImageClick={props.onImageClick} onEditImage={props.onEditImage} />
        </div>
      </main>
  );
};
