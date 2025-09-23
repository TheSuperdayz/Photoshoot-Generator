import React from 'react';

// Components
import { GeneratedVideoGallery } from '../components/GeneratedVideoGallery';
import { EnhancedPromptInput } from '../components/EnhancedPromptInput';
import { ImageUploader } from '../components/ImageUploader';
import { Alert } from '../components/Alert';

// Types
import type { User, SessionVideo, ImageData } from '../types';

interface VideoGeneratorScreenProps {
    user: User;
    prompt: string;
    setPrompt: (prompt: string) => void;
    sourceImage: ImageData | null;
    setSourceImage: (image: ImageData | null) => void;
    generatedVideos: SessionVideo[];
    isLoading: boolean;
    loadingMessage: string;
    error: string | null;
    handleGenerate: () => void;
}

export const VideoGeneratorScreen: React.FC<VideoGeneratorScreenProps> = (props) => {
  const canGenerate = !!props.prompt.trim() && !props.isLoading && props.user && props.user.credits > 0;

  const getButtonText = () => {
    if (props.isLoading) return 'Generating...';
    if (props.user && props.user.credits <= 0) return 'Out of Credits';
    return '✨ Generate Video (5 Credits)'; // Video generation is more expensive
  };

  return (
      <main className="flex-grow container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Control Panel */}
        <div className="lg:col-span-4 bg-slate-800/60 backdrop-blur-2xl border border-slate-700 rounded-2xl p-6 shadow-lg flex flex-col gap-6 h-fit sticky top-24">
          <h2 className="text-xl font-bold text-white">AI Video Generator</h2>
          
          <EnhancedPromptInput
            label="Describe Your Video"
            value={props.prompt}
            onChange={props.setPrompt}
            placeholder="e.g., A majestic eagle soaring over a mountain range..."
            rows={4}
            examplePrompts={[
                'A neon hologram of a cat driving at top speed.',
                'A time-lapse of a flower blooming, hyperrealistic.',
                'A futuristic city with flying cars and holographic ads.',
                'An astronaut walking on a colorful, alien planet.',
            ]}
            tooltip="Describe the video you want to create. Be descriptive and imaginative."
          />

          <ImageUploader 
            label="Source Image (Optional)" 
            onImageUpload={props.setSourceImage} 
            tooltip="Provide an image to influence the style or subject of the video." 
          />
          
          {props.error && <Alert type="error" message={props.error} />}

          <button
            onClick={props.handleGenerate}
            disabled={!canGenerate}
            className="w-full font-bold py-3 px-4 rounded-lg text-white bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg btn-bounce"
          >
            {getButtonText()}
          </button>
          <p className="text-xs text-center text-slate-400">Note: Video generation can take several minutes to complete.</p>
        </div>

        {/* Video Gallery */}
        <div className="lg:col-span-8">
          <GeneratedVideoGallery 
            videos={props.generatedVideos} 
            isLoading={props.isLoading}
            loadingMessage={props.loadingMessage}
          />
        </div>
      </main>
  );
};