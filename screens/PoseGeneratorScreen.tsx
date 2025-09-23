
import React from 'react';
import type { ImageData, User, SessionImage } from '../types';
import { ImageUploader } from '../components/ImageUploader';
import { GeneratedImageGallery } from '../components/GeneratedImageGallery';
import { EnhancedPromptInput } from '../components/EnhancedPromptInput';
import { Alert } from '../components/Alert';
import { WatermarkToggle } from '../components/WatermarkToggle';


interface PoseGeneratorScreenProps {
    user: User;
    modelImage: ImageData | null;
    setModelImage: (image: ImageData | null) => void;
    posePrompt: string;
    setPosePrompt: (prompt: string) => void;
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

export const PoseGeneratorScreen: React.FC<PoseGeneratorScreenProps> = (props) => {
  const canGenerate = !!props.modelImage && !!props.posePrompt.trim() && !props.isLoading && props.user.credits > 0;
  // FIX: Updated plan check from 'Pro' to 'Executive'
  const isProUser = props.user.subscription?.plan === 'Executive';

  const getButtonText = () => {
    if (props.isLoading) return 'Generating...';
    if (props.user.credits <= 0) return 'Out of Credits';
    return '✨ Generate New Pose (1 Credit)';
  };

  return (
    <main className="flex-grow container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Control Panel */}
      <div className="lg:col-span-4 bg-slate-800/60 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 shadow-lg flex flex-col gap-6 h-fit sticky top-24">
        <h2 className="text-xl font-bold text-white">AI Pose Generator</h2>
        
        <ImageUploader 
          label="Upload Model Image" 
          onImageUpload={props.setModelImage} 
          tooltip="Upload a clear, full or half-body shot of the person whose pose you want to change." 
        />

        <EnhancedPromptInput
          label="Describe the New Pose"
          value={props.posePrompt}
          onChange={props.setPosePrompt}
          placeholder="e.g., Sitting on a stool, looking over their shoulder..."
          rows={4}
          examplePrompts={[
              'A confident power pose with hands on hips.',
              'Leaning against a wall casually with one leg crossed.',
              'Jumping in the air with excitement.',
              'Sitting on the floor, hugging their knees.',
              'A dramatic, artistic dance pose.',
          ]}
          tooltip="Be descriptive about the pose you want. The AI will keep the person, clothes, and background the same."
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
