import React, { useRef, useState } from 'react';
import type { User, AppView } from '../types';
import { UserIcon } from './icons/UserIcon';
import { PencilIcon } from './icons/PencilIcon';
import { CogIcon } from './icons/CogIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { BillingIcon } from './icons/BillingIcon';

interface ProfileModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onUpdateProfilePicture: (base64Image: string) => void;
  onNavigate: (view: AppView) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ user, isOpen, onClose, onUpdateProfilePicture, onNavigate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
        setIsClosing(false);
        onClose();
    }, 200);
  };
  
  if (!isOpen && !isClosing) return null;

  const handlePictureClick = () => {
      fileInputRef.current?.click();
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const base64String = reader.result as string;
              onUpdateProfilePicture(base64String);
          };
          reader.readAsDataURL(file);
      }
  };

  return (
    <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`} onClick={handleClose}>
      <div className={`bg-gray-950/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-xl w-full max-w-sm p-8 text-center ${isClosing ? 'animate-scale-out' : 'animate-scale-in'}`} onClick={(e) => e.stopPropagation()}>
        
        <div className="relative w-24 h-24 mx-auto mb-4 group">
            <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-gray-600">
                {user.profilePicture ? (
                    <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <UserIcon className="w-12 h-12 text-gray-400" />
                )}
            </div>
            <button onClick={handlePictureClick} className="absolute inset-0 w-full h-full rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Change profile picture">
                <PencilIcon className="w-6 h-6 text-white"/>
            </button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
            />
        </div>
        
        <h2 className="text-2xl font-bold text-white">{user.name}</h2>
        <p className="text-gray-400 mb-6">{user.role}</p>
        
        <div className="space-y-3">
             <button onClick={() => onNavigate('todo')} className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
              <CalendarIcon className="w-5 h-5" />
              <span>View Task Calendar</span>
            </button>
             <button onClick={() => onNavigate('billing')} className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
              <BillingIcon className="w-5 h-5" />
              <span>Billing & Subscription</span>
            </button>
            <button onClick={() => onNavigate('settings')} className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                <CogIcon className="w-5 h-5" />
                <span>Account Settings</span>
            </button>
        </div>

      </div>
    </div>
  );
};
