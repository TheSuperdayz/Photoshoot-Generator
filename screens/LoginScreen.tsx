import React, { useState, useRef } from 'react';
import { Logo } from '../components/Logo';
import { Alert } from '../components/Alert';

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
          className="relative bg-slate-800/60 backdrop-blur-2xl border border-slate-700 shadow-2xl rounded-2xl px-8 pt-6 pb-8 mb-4 card-3d-tilt"
        >
          <div className="absolute inset-0 rounded-2xl card-3d-glow" />
          <div className="mb-4">
            <label className="block text-slate-300 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200 placeholder-slate-400"
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
            <label className="block text-slate-300 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200 placeholder-slate-400"
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
          
          {error && <div className="mb-4"><Alert type="error" message={error} /></div>}

          <div className="flex items-center justify-between">
            <button
              className="w-full font-bold py-3 px-4 rounded-lg text-white bg-sky-500 hover:bg-sky-400 transition-all duration-300 shadow-lg btn-bounce"
              type="submit"
            >
              Sign In
            </button>
          </div>
        </form>
        <p className="text-center text-slate-400 text-sm">
          Don't have an account?{' '}
          <button onClick={onSwitchToRegister} className="font-bold text-slate-200 hover:text-white">
            Register
          </button>
        </p>
      </div>
    </div>
  );
};