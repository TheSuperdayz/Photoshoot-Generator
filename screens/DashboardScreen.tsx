import React, { useRef } from 'react';
import type { User, AppView } from '../types';
import { CameraIcon } from '../components/icons/CameraIcon';
import { TshirtIcon } from '../components/icons/TshirtIcon';
import { ImageIcon } from '../components/icons/ImageIcon';
import { ChatIcon } from '../components/icons/ChatIcon';
import { LightbulbIcon } from '../components/icons/LightbulbIcon';
import { QuillIcon } from '../components/icons/QuillIcon';


interface DashboardScreenProps {
  user: User;
  recentCreations: string[];
  onNavigate: (view: AppView) => void;
}

const curatedImages = [
  { 
    id: 1, 
    src: 'https://images.unsplash.com/photo-1599329994901-accd5ebbb0ec?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
    alt: 'Two female models in tracksuits in an urban setting.',
    prompt: 'Streetwear fashion shoot, two models in an urban brick warehouse, moody lighting, full body shot.',
    span: 'col-span-1 sm:col-span-1'
  },
  { 
    id: 2, 
    src: 'https://images.unsplash.com/photo-1600361675600-7eea39b41f3b?q=80&w=1003&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
    alt: 'Female model wearing sportswear on a sunny beach.',
    prompt: 'Summer lifestyle photoshoot, male model on a sunny beach, relaxed pose, vibrant colors.',
    span: 'col-span-1'
  },
  { 
    id: 3, 
    src: 'https://images.unsplash.com/photo-1633450802884-35b041181007?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
    alt: 'High-fashion model with a white handbag.',
    prompt: 'High-fashion portrait, editorial style, model with pixie cut holding a white designer handbag.',
    span: 'col-span-1'
  },
  { 
    id: 4, 
    src: 'https://images.unsplash.com/photo-1642453208368-7c09aa272829?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
    alt: 'Female model in a dynamic pose on a chair in a studio.',
    prompt: 'Avant-garde fashion, male model in a dynamic pose on a chair, studio shot with stark white background.',
    span: 'col-span-3 sm:col-span-3'
  },
  { 
    id: 5, 
    src: 'https://images.unsplash.com/photo-1721618878163-5b9387ead23b?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Female model for a luxury brand reclining on a sofa.',
    prompt: 'Luxury brand campaign, opulent gold interior, model reclining on a vintage sofa in a lavish room.',
    span: 'col-span-1 sm:col-span-2'
  },
   { 
    id: 6, 
    src: 'https://images.unsplash.com/photo-1535292862972-e61ccf5b7e61?q=80&w=994&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
    alt: 'Hands holding up classic sneakers against a blue sky.',
    prompt: 'Product-focused shot, dynamic group of hands holding up classic sneakers against a clean sky.',
    span: 'col-span-1'
  },
];


const ToolCard: React.FC<{ icon: React.ReactNode; title: string; onClick?: () => void; disabled?: boolean }> = ({ icon, title, onClick, disabled }) => {
  const cardRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!cardRef.current || disabled) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const rotateX = -1 * ((y - height / 2) / (height / 2)) * 8;
    const rotateY = ((x - width / 2) / (width / 2)) * 8;
    
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    
    const glow = cardRef.current.querySelector('.card-3d-glow') as HTMLElement;
    if (glow) {
      glow.style.setProperty('--x', `${x}px`);
      glow.style.setProperty('--y', `${y}px`);
    }
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
  };

  return (
    <button
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled}
      className={`relative bg-slate-800/60 backdrop-blur-md border border-slate-700 p-6 rounded-xl flex flex-col items-center justify-center text-center transform-gpu card-3d-tilt ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <div className="absolute inset-0 rounded-xl card-3d-glow" />
      <div className="text-slate-300 mb-3" style={{ transform: 'translateZ(20px)' }}>{icon}</div>
      <h3 className="font-semibold text-white" style={{ transform: 'translateZ(10px)' }}>{title}</h3>
    </button>
  );
};


const CuratedImageCard: React.FC<{ image: typeof curatedImages[0] }> = ({ image }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const { left, top, width, height } = cardRef.current.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        const rotateX = -1 * ((y - height / 2) / (height / 2)) * 6;
        const rotateY = ((x - width / 2) / (width / 2)) * 6;
        cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;

        const glow = cardRef.current.querySelector('.card-3d-glow') as HTMLElement;
        if (glow) {
            glow.style.setProperty('--x', `${x}px`);
            glow.style.setProperty('--y', `${y}px`);
        }
    };

    const handleMouseLeave = () => {
        if (!cardRef.current) return;
        cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`rounded-lg overflow-hidden group relative shadow-lg card-3d-tilt ${image.span}`}
        >
            <img 
                src={image.src} 
                alt={image.alt}
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 rounded-lg card-3d-glow" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 md:p-6">
                <p className="text-white text-sm font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-100" style={{ transform: 'translateZ(20px)' }}>{image.prompt}</p>
            </div>
        </div>
    );
};

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ user, recentCreations, onNavigate }) => {
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-white">What would you like to create today?</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 mb-16">
        <ToolCard icon={<LightbulbIcon className="w-8 h-8" />} title="AI Idea Gen" onClick={() => onNavigate('creativeIdeas')} />
        <ToolCard icon={<QuillIcon className="w-8 h-8" />} title="AI Copywriter" onClick={() => onNavigate('copywriter')} />
        <ToolCard icon={<ImageIcon className="w-8 h-8" />} title="AI Image Gen" onClick={() => onNavigate('imageGenerator')} />
        <ToolCard icon={<CameraIcon className="w-8 h-8" />} title="AI Photoshoot" onClick={() => onNavigate('app')} />
        <ToolCard icon={<TshirtIcon className="w-8 h-8" />} title="AI Mockups" onClick={() => onNavigate('mockup')} />
        <ToolCard icon={<ChatIcon className="w-8 h-8" />} title="Talk with AI" onClick={() => onNavigate('aiTalk')} />
      </div>

      {recentCreations.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Recent creations</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recentCreations.slice(0, 6).map((image, index) => (
              <div key={index} className="aspect-square bg-slate-800 rounded-lg overflow-hidden">
                <img src={image} alt={`Recent creation ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Curated collections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
          {curatedImages.map((image) => (
            <CuratedImageCard key={image.id} image={image} />
          ))}
        </div>
      </div>
    </main>
  );
};