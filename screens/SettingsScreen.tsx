import React, { useState, useEffect, useRef } from 'react';
import type { User, ImageData, AIModel, BrandKit, AppView } from '../types';
import { PencilIcon } from '../components/icons/PencilIcon';
import { TrashIcon } from '../components/icons/TrashIcon';
import { PaletteIcon } from '../components/icons/PaletteIcon';
import { BillingIcon } from '../components/icons/BillingIcon';
import { Tooltip } from '../components/Tooltip';

interface SettingsScreenProps {
  user: User;
  onUpdateProfile: (name: string, role: string) => void;
  onChangePassword: (currentPass: string, newPass: string) => Promise<void>;
  onDeleteAccount: () => void;
  onNavigate: (view: AppView) => void;
  onAddModel: (name: string, imageData: ImageData) => void;
  onUpdateModel: (id: string, newName: string) => void;
  onDeleteModel: (id: string) => void;
  onUpdateBrandKit: (brandKit: BrandKit) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ user, onUpdateProfile, onChangePassword, onDeleteAccount, onNavigate, onAddModel, onUpdateModel, onDeleteModel, onUpdateBrandKit }) => {
  // Profile state
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Model Management state
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Brand Kit state
  const [brandKit, setBrandKit] = useState<BrandKit>(user.brandKit || { colorPalette: [] });
  const [newColor, setNewColor] = useState('#FFFFFF');
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(user.name);
    setRole(user.role);
    setBrandKit(user.brandKit || { colorPalette: [] });
  }, [user]);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(name, role);
    setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
    setTimeout(() => setProfileMessage(null), 3000);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    try {
        await onChangePassword(currentPassword, newPassword);
        setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    } catch (error) {
        setPasswordMessage({ type: 'error', text: (error as Error).message });
    } finally {
        setTimeout(() => setPasswordMessage(null), 4000);
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const modelName = window.prompt('Enter a name for this model:', 'New Model');
      if (modelName && modelName.trim()) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          onAddModel(modelName.trim(), { base64: base64String, mimeType: file.type });
        };
        reader.readAsDataURL(file);
      }
    }
    // Reset file input
    if(fileInputRef.current) fileInputRef.current.value = "";
  };
  
  const handleRenameModel = (id: string, currentName: string) => {
    const newName = window.prompt('Enter the new name for the model:', currentName);
    if (newName && newName.trim() && newName.trim() !== currentName) {
      onUpdateModel(id, newName.trim());
    }
  };

  const handleDeleteModel = (id: string) => {
    if (window.confirm('Are you sure you want to delete this model? This action cannot be undone.')) {
      onDeleteModel(id);
    }
  };

  // --- Brand Kit Handlers ---
  const handleBrandKitChange = (updatedKit: Partial<BrandKit>) => {
      const newBrandKit = { ...brandKit, ...updatedKit };
      setBrandKit(newBrandKit);
      onUpdateBrandKit(newBrandKit);
  };

  const handleLogoUploadClick = () => {
      logoInputRef.current?.click();
  };

  const handleLogoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const base64String = reader.result as string;
              handleBrandKitChange({ logo: { base64: base64String, mimeType: file.type } });
          };
          reader.readAsDataURL(file);
      }
      if (logoInputRef.current) logoInputRef.current.value = "";
  };

  const handleRemoveLogo = () => {
      const { logo, ...rest } = brandKit;
      const newBrandKit = { ...rest, logo: undefined };
      setBrandKit(newBrandKit);
      onUpdateBrandKit(newBrandKit);
  };

  const handleAddColor = () => {
      if (newColor && !brandKit.colorPalette.includes(newColor)) {
          handleBrandKitChange({ colorPalette: [...brandKit.colorPalette, newColor] });
      }
  };

  const handleRemoveColor = (colorToRemove: string) => {
      handleBrandKitChange({ colorPalette: brandKit.colorPalette.filter(c => c !== colorToRemove) });
  };


  const formInputStyle = "w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition duration-200 placeholder-gray-500";
  const formLabelStyle = "block text-gray-300 text-sm font-bold mb-2";

  return (
    <main className="flex-grow container mx-auto p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Settings</h1>
            <button onClick={() => onNavigate('dashboard')} className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-4 rounded-full transition-colors">
              &larr; Back to Dashboard
            </button>
        </div>

        {/* Profile Information Section */}
        <div className="bg-black/30 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <Tooltip content="This is your display name throughout the application.">
                <label className={formLabelStyle} htmlFor="profile-name">Full Name</label>
              </Tooltip>
              <input id="profile-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className={formInputStyle} />
            </div>
            <div>
              <Tooltip content="Your role (e.g., 'Photographer', 'Brand Manager') helps the AI tailor its suggestions for you.">
                <label className={formLabelStyle} htmlFor="profile-role">Your Role</label>
              </Tooltip>
              <input id="profile-role" type="text" value={role} onChange={(e) => setRole(e.target.value)} required className={formInputStyle} />
            </div>
            <div className="flex justify-end items-center gap-4 pt-2">
                 {profileMessage && <p className={`text-sm ${profileMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>{profileMessage.text}</p>}
                <button type="submit" className="font-bold py-2 px-5 rounded-full text-gray-900 bg-white hover:bg-gray-200 transition-colors">Save Profile</button>
            </div>
          </form>
        </div>
        
        {/* Billing Section */}
        <div className="bg-black/30 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3"><BillingIcon className="w-6 h-6"/>Billing & Subscription</h2>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
              <p className="text-gray-300 mb-4 sm:mb-0">Manage your plan, payment methods, and view your billing history.</p>
              <button onClick={() => onNavigate('billing')} className="font-bold py-2 px-5 rounded-full text-gray-900 bg-white hover:bg-gray-200 transition-colors">
                Manage Billing
              </button>
            </div>
        </div>

        {/* Brand Kit Management Section */}
        <div className="bg-black/30 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3"><PaletteIcon className="w-6 h-6" /> Brand Kit Management</h2>
          <div className="space-y-6">
              {/* Logo Uploader */}
              <div>
                  <Tooltip content="Upload your brand's logo. The AI will try to incorporate it subtly in some generations.">
                    <label className={formLabelStyle}>Brand Logo</label>
                  </Tooltip>
                  <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-black/20 rounded-lg border border-gray-600 flex items-center justify-center overflow-hidden">
                          {brandKit.logo ? (
                              <img src={brandKit.logo.base64} alt="Brand Logo" className="w-full h-full object-contain p-1" />
                          ) : (
                              <span className="text-xs text-gray-400">No Logo</span>
                          )}
                      </div>
                      <div className="flex flex-col gap-2">
                          <button type="button" onClick={handleLogoUploadClick} className="font-semibold py-2 px-4 rounded-full text-sm text-gray-900 bg-white/80 hover:bg-white transition-colors">Upload Logo</button>
                          <input type="file" ref={logoInputRef} onChange={handleLogoFileChange} accept="image/png, image/jpeg, image/webp" className="hidden" />
                          {brandKit.logo && (
                              <button type="button" onClick={handleRemoveLogo} className="font-semibold py-2 px-4 rounded-full text-sm text-white bg-white/10 hover:bg-white/20 transition-colors">Remove</button>
                          )}
                      </div>
                  </div>
              </div>
              {/* Color Palette */}
              <div>
                  <Tooltip content="Define your brand's primary colors. The AI will use these to influence the color scheme of generated images.">
                    <label className={formLabelStyle}>Color Palette</label>
                  </Tooltip>
                  <div className="flex items-center gap-3 mb-3">
                      <input type="color" value={newColor} onChange={e => setNewColor(e.target.value)} className="w-10 h-10 p-0 border-none cursor-pointer bg-transparent appearance-none" />
                      <input type="text" value={newColor} onChange={e => setNewColor(e.target.value)} className={`${formInputStyle} w-32`} />
                      <button type="button" onClick={handleAddColor} className="font-bold py-2 px-4 rounded-full text-gray-900 bg-white hover:bg-gray-200 transition-colors">Add Color</button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                      {brandKit.colorPalette.map(color => (
                          <div key={color} className="relative group">
                              <div className="w-12 h-12 rounded-lg border-2 border-gray-600" style={{ backgroundColor: color }}></div>
                              <button onClick={() => handleRemoveColor(color)} className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                                  <TrashIcon className="w-5 h-5 text-white" />
                              </button>
                          </div>
                      ))}
                      {brandKit.colorPalette.length === 0 && <p className="text-sm text-gray-400">No colors added yet.</p>}
                  </div>
              </div>
              {/* Brand Font */}
              <div>
                  <Tooltip content="Specify your brand's font style. The AI will try to match this style if any text is generated.">
                    <label className={formLabelStyle} htmlFor="brand-font">Brand Font</label>
                  </Tooltip>
                  <input id="brand-font" type="text" value={brandKit.brandFont || ''} onChange={(e) => handleBrandKitChange({ brandFont: e.target.value })} placeholder="e.g., Poppins, Helvetica" className={formInputStyle} />
              </div>
          </div>
        </div>

        {/* Change Password Section */}
        <div className="bg-black/30 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Change Password</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className={formLabelStyle} htmlFor="current-pass">Current Password</label>
              <input id="current-pass" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required className={formInputStyle} />
            </div>
            <div>
              <label className={formLabelStyle} htmlFor="new-pass">New Password</label>
              <input id="new-pass" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className={formInputStyle} />
            </div>
            <div>
              <label className={formLabelStyle} htmlFor="confirm-pass">Confirm New Password</label>
              <input id="confirm-pass" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className={formInputStyle} />
            </div>
             <div className="flex justify-end items-center gap-4 pt-2">
                 {passwordMessage && <p className={`text-sm ${passwordMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>{passwordMessage.text}</p>}
                <button type="submit" className="font-bold py-2 px-5 rounded-full text-gray-900 bg-white hover:bg-gray-200 transition-colors">Change Password</button>
            </div>
          </form>
        </div>

        {/* Model Management Section */}
        <div className="bg-black/30 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
             <Tooltip content="Upload images of recurring models or characters to easily use them in photoshoots.">
              <h2 className="text-2xl font-bold text-white">Model Management</h2>
            </Tooltip>
            <button onClick={handleUploadClick} className="font-bold py-2 px-5 rounded-full text-gray-900 bg-white hover:bg-gray-200 transition-colors">
              Upload New Model
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" className="hidden" />
          </div>
          <div className="space-y-3">
            {(user.uploadedModels && user.uploadedModels.length > 0) ? (
              user.uploadedModels.map(model => (
                <div key={model.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-4">
                    <img src={model.base64} alt={model.name} className="w-12 h-12 rounded-md object-cover bg-gray-700" />
                    <div>
                      <p className="font-semibold text-white">{model.name}</p>
                      <p className="text-xs text-gray-400">Uploaded on {new Date(model.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleRenameModel(model.id, model.name)} className="p-2 rounded-md bg-white/10 hover:bg-white/20 text-gray-300 transition-colors" aria-label="Rename model">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteModel(model.id)} className="p-2 rounded-md bg-red-500/20 hover:bg-red-500/40 text-red-300 transition-colors" aria-label="Delete model">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 py-4">You haven't uploaded any models yet.</p>
            )}
          </div>
        </div>
        
         {/* Danger Zone */}
        <div className="bg-red-900/20 backdrop-blur-2xl border border-red-500/30 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-red-300 mb-4">Danger Zone</h2>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <p className="font-semibold text-white">Delete this account</p>
              <p className="text-sm text-red-300/80">Once you delete your account, there is no going back. Please be certain.</p>
            </div>
            <button onClick={onDeleteAccount} className="mt-4 md:mt-0 font-bold py-2 px-5 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors">
                Delete Account
            </button>
          </div>
        </div>

      </div>
    </main>
  );
};
