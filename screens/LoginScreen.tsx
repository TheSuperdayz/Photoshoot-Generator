import React, { useState, useRef } from 'react';
import { Logo } from '../components/Logo';

interface LoginScreenProps {
  onLogin: (email: string, pass: string) => void;
  onSwitchToRegister: () => void;
  error: string | null;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onSwitchToRegister, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const panelRef = useRef<HTMLFormElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLFormElement>) => {
    if (!panelRef.current) return;

    if (isInputFocused) {
      panelRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
      return;
    }

    const { left, top, width, height } = panelRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const rotateX = -1 * ((y - height / 2) / (height / 2)) * 6;
    const rotateY = ((x - width / 2) / (width / 2)) * 6;
    panelRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    panelRef.current.style.setProperty('--x', `${x}px`);
    panelRef.current.style.setProperty('--y', `${y}px`);
  };

  const handleMouseLeave = () => {
    if (!panelRef.current) return;
    panelRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
  };

  const handleFocus = () => setIsInputFocused(true);
  const handleBlur = () => setIsInputFocused(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 flex flex-col items-center">
          <Logo className="h-16 mb-4"/>
          <p className="text-gray-400 mt-2">Log in to continue your creative journey.</p>
        </div>
        
        <form 
          ref={panelRef}
          onSubmit={handleSubmit}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative bg-black/30 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-2xl px-8 pt-6 pb-8 mb-4 card-3d-tilt"
        >
          <div className="absolute inset-0 rounded-2xl card-3d-glow" />
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition duration-200 placeholder-gray-500"
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition duration-200 placeholder-gray-500"
              id="password"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              required
            />
          </div>
          
          {error && <p className="text-red-400 text-xs italic mb-4 text-center">{error}</p>}

          <div className="flex items-center justify-between">
            <button
              className="w-full font-bold py-3 px-4 rounded-lg text-gray-900 bg-gradient-to-r from-gray-200 to-white hover:from-gray-300 hover:to-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
              type="submit"
            >
              Sign In
            </button>
          </div>
        </form>
        <p className="text-center text-gray-500 text-sm">
          Don't have an account?{' '}
          <button onClick={onSwitchToRegister} className="font-bold text-gray-300 hover:text-white">
            Register
          </button>
        </p>
      </div>
    </div>
  );
};