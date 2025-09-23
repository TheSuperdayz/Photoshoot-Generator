
import React from 'react';
import type { ImageData, User, SessionImage } from '../types';
import { MultiImageUploader } from '../components/MultiImageUploader';
import { GeneratedImageGallery } from '../components/GeneratedImageGallery';
import { EnhancedPromptInput } from '../components/EnhancedPromptInput';
import { Alert } from '../components/Alert';
import { WatermarkToggle } from '../components/WatermarkToggle';


interface GroupPhotoScreenProps {
    user: User;
    groupImages: (ImageData | null)[];
    setGroupImages: (images: (ImageData | null)[]) => void;
    backgroundPrompt: string;
    setBackgroundPrompt: (prompt: string) => void;
    arrangementPrompt: string;
    setArrangementPrompt: (prompt: string) => void;
    generatedImages: SessionImage[];
    isLoading: boolean;
    error: string | null;
    isWatermarkEnabled: boolean;
    setIsWatermarkEnabled: (enabled: boolean) => void;
    handleGenerate: () => void;
    onGenerateCopy: (imageSrc: string) => void;
    onImageClick: (imageSrc: string) => void;
    onEditImage: (id: string, imageSrc: string) => void;
}

export const GroupPhotoScreen: React.FC<GroupPhotoScreenProps> = (props) => {
  const validImagesCount = props.groupImages.filter(img => img !== null).length;
  const canGenerate = validImagesCount >= 2 && !!props.backgroundPrompt.trim() && !!props.arrangementPrompt.trim() && !props.isLoading && props.user.credits > 0;
  // FIX: Updated plan check from 'Pro' to 'Executive'
  const isProUser = props.user.subscription?.plan === 'Executive';

  const getButtonText = () => {
    if (props.isLoading) return 'Generating...';
    if (props.user.credits <= 0) return 'Out of Credits';
    return '✨ Generate Group Photo (1 Credit)';
  };

  return (
    <main className="flex-grow container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Control Panel */}
      <div className="lg:col-span-4 bg-slate-800/60 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 shadow-lg flex flex-col gap-6 h-fit sticky top-24">
        <h2 className="text-xl font-bold text-white">AI Group Photo Generator</h2>
        
        <MultiImageUploader
          label="Upload 2-5 People"
          images={props.groupImages}
          onImagesChange={props.setGroupImages}
          maxImages={5}
        />

        <EnhancedPromptInput
          label="Describe the Background/Scene"
          value={props.backgroundPrompt}
          onChange={props.setBackgroundPrompt}
          placeholder="e.g., At a sunny beach during sunset..."
          rows={3}
          examplePrompts={[
              'Inside a modern, minimalist office with large windows.',
              'In a cozy cabin with a fireplace during winter.',
              'On top of a mountain with a scenic view.',
              'At a formal event with elegant decorations.',
          ]}
          tooltip="Describe the environment where the group should be."
        />

        <EnhancedPromptInput
          label="Describe the Group Arrangement"
          value={props.arrangementPrompt}
          onChange={props.setArrangementPrompt}
          placeholder="e.g., Standing together and laughing..."
          rows={3}
          examplePrompts={[
              'Posing formally for a team photo, smiling at the camera.',
              'Sitting around a table, having a candid conversation.',
              'Walking towards the camera in a line.',
              'Group hug, looking very happy.',
          ]}
          tooltip="Describe how the people should be positioned and what they should be doing."
        />

        <WatermarkToggle 
          isEnabled={props.isWatermarkEnabled}
          setIsEnabled={props.setIsWatermarkEnabled}
          isDisabled={!isProUser}
          tooltipContent={isProUser ? 'Toggle watermark on or off for your final image.' : 'Upgrade to Pro to remove watermarks.'}
        />
        
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
        <GeneratedImageGallery 
          images={props.generatedImages} 
          isLoading={props.isLoading} 
          onGenerateCopy={props.onGenerateCopy} 
          onImageClick={props.onImageClick} 
          onEditImage={props.onEditImage} 
        />
      </div>
    </main>
  );
};
