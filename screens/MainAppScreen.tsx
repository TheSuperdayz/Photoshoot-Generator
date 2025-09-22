import React from 'react';

// Components
import { ImageUploader } from '../components/ImageUploader';
import { GeneratedImageGallery } from '../components/GeneratedImageGallery';
import { PresetSelector } from '../components/PresetSelector';

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
    handleGenerate: () => void;
    onGenerateCopy: (imageSrc: string) => void;
}

export const MainAppScreen: React.FC<MainAppScreenProps> = (props) => {
  // Constants for presets
  const sceneOptions = ['Fashion', 'Corporate', 'Wedding', 'Casual', 'Futuristic'];
  const poseOptions = ['Standing', 'Sitting', 'Close-up', 'Action', 'Candid'];
  const lightingOptions = ['Natural', 'Softbox', 'Dramatic', 'Neon', 'Golden Hour'];

  const canGenerate = !!props.productImage && !!props.modelImage && !props.isLoading && props.user && props.user.credits > 0;
  const brandKitIsSetup = props.user.brandKit && (props.user.brandKit.logo || props.user.brandKit.colorPalette.length > 0 || props.user.brandKit.brandFont);


  const getButtonText = () => {
    if (props.isLoading) return 'Generating...';
    if (props.user && props.user.credits <= 0) return 'Out of Credits';
    return '✨ Generate Photo (1 Credit)';
  };

  return (
      <main className="flex-grow container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Control Panel */}
        <div className="lg:col-span-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col gap-6 h-fit sticky top-24">
          <h2 className="text-xl font-bold text-white">Create Your Photoshoot</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <ImageUploader label="Product Image" onImageUpload={props.setProductImage} />
            <ImageUploader label="Model Image" onImageUpload={props.setModelImage} />
          </div>

          <PresetSelector label="Scene Style" options={sceneOptions} selectedOption={props.sceneStyle} onSelect={props.setSceneStyle} />
          <PresetSelector label="Model Pose" options={poseOptions} selectedOption={props.modelPose} onSelect={props.setModelPose} />
          <PresetSelector label="Lighting" options={lightingOptions} selectedOption={props.lighting} onSelect={props.setLighting} />

          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">Additional Details</label>
            <textarea
              id="prompt"
              rows={3}
              className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition duration-200 placeholder-gray-400"
              placeholder="e.g., holding a coffee cup, in a city at night..."
              value={props.customPrompt}
              onChange={(e) => props.setCustomPrompt(e.target.value)}
            />
          </div>
          
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