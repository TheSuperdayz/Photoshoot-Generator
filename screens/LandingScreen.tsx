import React, { useRef } from 'react';
import { Logo } from '../components/Logo';

interface LandingScreenProps {
  onGetStarted: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onGetStarted }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const rotateX = -1 * ((y - height / 2) / (height / 2)) * 5; // Less rotation
    const rotateY = ((x - width / 2) / (width / 2)) * 5;
    cardRef.current.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    cardRef.current.style.setProperty('--x', `${x}px`);
    cardRef.current.style.setProperty('--y', `${y}px`);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1200px) rotateX(0) rotateY(0)';
  };

  return (
    <div className="relative flex-grow w-full flex items-center justify-center p-4">
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative z-10 w-full max-w-2xl bg-black/30 backdrop-blur-2xl rounded-3xl p-8 md:p-12 text-center border border-white/10 shadow-2xl flex flex-col items-center card-3d-tilt"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute inset-0 rounded-3xl card-3d-glow" />
        <div style={{ transform: 'translateZ(40px)' }}>
          <Logo className="h-20 mb-6"/>
        </div>
        <p className="text-gray-300 text-lg md:text-xl max-w-xl mx-auto mb-8" style={{ transform: 'translateZ(30px)' }}>
            Create stunning, AI-powered commercial photoshoots in seconds. Your vision, realized instantly.
        </p>
        <button 
          onClick={onGetStarted}
          className="font-bold py-3 px-8 rounded-full text-gray-900 bg-gradient-to-r from-gray-200 to-white hover:from-gray-300 hover:to-gray-100 transition-all duration-300 shadow-lg text-lg btn-bounce"
          style={{ transform: 'translateZ(20px)' }}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};