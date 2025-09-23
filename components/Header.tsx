
import React, { useState, useRef, useEffect } from 'react';
import { CreditIcon } from './icons/CreditIcon';
import { UserIcon } from './icons/UserIcon';
import { Logo } from './Logo';
import type { User, AppView } from '../types';
import { CrownIcon } from './icons/CrownIcon';
import { getXpForNextLevel } from '../services/gamificationService';
import { Tooltip } from './Tooltip';

interface HeaderProps {
  user: User | null;
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  onLogout: () => void;
}

const NavItem: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({ label, isActive, onClick }) => (
    <button 
        onClick={onClick}
        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            isActive ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`}
    >
        {label}
    </button>
);


export const Header: React.FC<HeaderProps> = ({ user, activeView, onNavigate, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  if (!user) return null;

  // FIX: Updated plan check from 'Pro' to 'Executive'
  const isPro = user.subscription?.plan === 'Executive';
  const xpForNext = getXpForNextLevel(user.level);
  const xpProgressPercent = (user.xp / xpForNext) * 100;

  return (
    <header className="bg-black/30 backdrop-blur-lg sticky top-0 z-20 border-b border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
             <button onClick={() => onNavigate('dashboard')} className="flex-shrink-0">
                <Logo />
            </button>
            <nav className="hidden md:flex items-center gap-2 ml-10">
                <NavItem label="Dashboard" isActive={activeView === 'dashboard'} onClick={() => onNavigate('dashboard')} />
                <NavItem label="Asset Hub" isActive={activeView === 'history'} onClick={() => onNavigate('history')} />
                <NavItem label="Task Calendar" isActive={activeView === 'todo'} onClick={() => onNavigate('todo')} />
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="hidden sm:flex items-center gap-3">
              <Tooltip content={`Level ${user.level} | ${user.xp} / ${xpForNext} XP`}>
                <button onClick={() => onNavigate('creativeJourney')} className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white/90">Lvl {user.level}</span>
                  <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-sky-400 transition-all duration-500"
                        style={{ width: `${xpProgressPercent}%` }}
                      ></div>
                  </div>
                </button>
              </Tooltip>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                <CreditIcon className="w-4 h-4 text-gray-400" />
                <span className="font-semibold text-white">{user.credits}</span>
              </div>
            </div>
            <div className="relative" ref={dropdownRef}>
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="relative flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold p-1.5 rounded-full transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                    {user.profilePicture ? (
                        <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <UserIcon className="w-5 h-5 text-gray-300" />
                    )}
                  </div>
                  {isPro && (
                    <div className="absolute -top-1 -right-1 bg-gradient-to-br from-yellow-300 to-amber-500 p-0.5 rounded-full shadow-md border-2 border-slate-900">
                        <CrownIcon className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-gray-950/70 backdrop-blur-xl border border-white/10 rounded-md shadow-lg py-1 z-20">
                    <div className="px-4 py-2 border-b border-white/10">
                        <p className="text-sm font-semibold text-white truncate" title={user.name}>{user.name}</p>
                        <p className="text-xs text-gray-400 truncate" title={user.email}>{user.email}</p>
                          <span className={`mt-1 inline-block text-xs font-bold px-2 py-0.5 rounded-full ${isPro ? 'bg-purple-500/50 text-purple-300' : 'bg-gray-500/50 text-gray-300'}`}>
                          {isPro ? 'Executive Member' : 'Freemium'}
                        </span>
                    </div>
                     <button onClick={() => { onNavigate('creativeJourney'); setDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10">
                      Creative Journey
                    </button>
                    <button onClick={() => { onNavigate('settings'); setDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10">
                      Settings
                    </button>
                    <button onClick={() => { onNavigate('billing'); setDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10">
                      Billing
                    </button>
                    <div className="my-1 h-px bg-white/10"></div>
                    <button onClick={() => { onLogout(); setDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10">
                      Logout
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
