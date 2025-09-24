import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import type { Chat } from "@google/genai";

// Components
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CopywriterModal } from './components/CopywriterModal';
import { ReminderToast } from './components/ReminderToast';
import { OnboardingModal } from './components/OnboardingModal';
import { Alert } from './components/Alert';
import { ImageZoomModal } from './components/ImageZoomModal';
import { GamificationToast } from './components/GamificationToast';
import { ImageEditorModal } from './components/ImageEditorModal';

// Screens
import { LandingScreen } from './screens/LandingScreen';
import { LoginScreen } from './screens/LoginScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { MainAppScreen } from './screens/MainAppScreen';
import { MockupGeneratorScreen } from './screens/MockupGeneratorScreen';
import { ImageGeneratorScreen } from './screens/ImageGeneratorScreen';
import { AITalkScreen } from './screens/AITalkScreen';
import { IdeaGeneratorScreen } from './screens/IdeaGeneratorScreen';
import { CopywriterScreen } from './screens/CopywriterScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { ToDoScreen } from './screens/ToDoScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { BillingScreen } from './screens/BillingScreen';
import { CreativeJourneyScreen } from './screens/CreativeJourneyScreen';
import { PoseGeneratorScreen } from './screens/PoseGeneratorScreen';
import { GroupPhotoScreen } from './screens/GroupPhotoScreen';
import { VideoGeneratorScreen } from './screens/VideoGeneratorScreen';
import { TrendRadarScreen } from './screens/TrendRadarScreen';
import { StrategyAssistantScreen } from './screens/StrategyAssistantScreen';
import { PredictiveSimulatorScreen } from './screens/PredictiveSimulatorScreen';
import { LogoGeneratorScreen } from './screens/LogoGeneratorScreen';


// Services
import { generatePhotoshootImage, generateMockupImage, generateImageFromPrompt, generateCreativeIdeas, generateCopywritingContent, generatePosedImage, generateGroupPhoto, generateVideo, generateMarketingStrategy, generateTrendReport, generatePredictiveSimulation, generateLogo, generateTagsForImage } from './services/geminiService';
import { achievements, getXpForNextLevel } from './services/gamificationService';

// Types
import type { ImageData, User, Template, ChatMessage, CreativeIdea, CopywritingResult, GenerationHistoryItem, ToDoItem, AIModel, BrandKit, SubscriptionPlan, PaymentMethod, BillingHistoryItem, GeneratedImageItem, SessionImage, AppView, SessionVideo, MarketingStrategy, TrendReport, SimulationReport, PredictiveSimulationItem, Folder, Campaign } from './types';

const HISTORY_LIMIT = 50; // A reasonable limit for localStorage

/**
 * Adds a text watermark to a base64 encoded image.
 * @param base64Image The base64 string of the source image.
 * @param text The watermark text.
 * @returns A promise that resolves with the base64 string of the watermarked image.
 */
const addWatermark = (base64Image: string, text: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Could not get canvas context'));
      }

      ctx.drawImage(img, 0, 0);

      const fontSize = Math.max(14, Math.min(img.width / 45, img.height / 35));
      ctx.font = `bold ${fontSize}px Poppins`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 5;

      const padding = fontSize * 1.2;
      ctx.fillText(text, canvas.width - padding, canvas.height - padding);

      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    img.onerror = () => {
      reject(new Error('Failed to load image for watermarking.'));
    };
    img.src = base64Image;
  });
};

/**
 * Reads a Blob object and returns its base64 encoded string representation.
 * @param blob The Blob object to read.
 * @returns A promise that resolves with the base64 data URL.
 */
const readFileAsBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(blob);
    });
};


const App: React.FC = () => {
  // View & Auth State
  const [view, setView] = useState<AppView>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isOnboardingVisible, setIsOnboardingVisible] = useState(false);
  
  // App State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [applyBrandKit, setApplyBrandKit] = useState<boolean>(false);
  const [isWatermarkEnabled, setIsWatermarkEnabled] = useState<boolean>(true);


  // Photoshoot Generator State
  const [productImage, setProductImage] = useState<ImageData | null>(null);
  const [modelImage, setModelImage] = useState<ImageData | null>(null);
  const [generatedPhotos, setGeneratedPhotos] = useState<SessionImage[]>([]);
  const [sceneStyle, setSceneStyle] = useState<string>('Fashion');
  const [modelPose, setModelPose] = useState<string>('Standing');
  const [lighting, setLighting] = useState<string>('Natural');
  const [customPrompt, setCustomPrompt] = useState<string>('');

  // Mockup Generator State
  const [designImage, setDesignImage] = useState<ImageData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [generatedMockups, setGeneratedMockups] = useState<SessionImage[]>([]);
  const [backgroundStyle, setBackgroundStyle] = useState<string>('Studio White');
  const [customBackground, setCustomBackground] = useState<string>('');
  
  // Image Generator State
  const [prompt, setPrompt] = useState<string>('');
  const [stylePreset, setStylePreset] = useState<string>('Photorealistic');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16'>('1:1');
  const [generatedImages, setGeneratedImages] = useState<SessionImage[]>([]);
  
  // Pose Generator State
  const [posedModelImage, setPosedModelImage] = useState<ImageData | null>(null);
  const [posePrompt, setPosePrompt] = useState<string>('');
  const [generatedPoses, setGeneratedPoses] = useState<SessionImage[]>([]);

  // Group Photo Generator State
  const [groupImages, setGroupImages] = useState<(ImageData | null)[]>(Array(5).fill(null));
  const [groupBackground, setGroupBackground] = useState<string>('');
  const [groupArrangement, setGroupArrangement] = useState<string>('');
  const [generatedGroupPhotos, setGeneratedGroupPhotos] = useState<SessionImage[]>([]);

  // Video Generator State
  const [videoPrompt, setVideoPrompt] = useState<string>('');
  const [videoSourceImage, setVideoSourceImage] = useState<ImageData | null>(null);
  const [generatedVideos, setGeneratedVideos] = useState<SessionVideo[]>([]);
  const [videoLoadingMessage, setVideoLoadingMessage] = useState<string>('Initializing video generation...');

  // Logo Generator State
  const [logoBrandName, setLogoBrandName] = useState('');
  const [logoSlogan, setLogoSlogan] = useState('');
  const [logoKeywords, setLogoKeywords] = useState('');
  const [logoColorPalette, setLogoColorPalette] = useState('');
  const [logoStyle, setLogoStyle] = useState('Minimalist');
  const [generatedLogos, setGeneratedLogos] = useState<SessionImage[]>([]);


  // AI Talk State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [selectedPersonality, setSelectedPersonality] = useState<string>('Chill Buddy');
  const [chatInstance, setChatInstance] = useState<Chat | null>(null);

  // Creative Idea Generator State
  const [ideaTopic, setIdeaTopic] = useState<string>('');
  const [ideaType, setIdeaType] = useState<string>('Photoshoot Concept');
  const [generatedIdeas, setGeneratedIdeas] = useState<CreativeIdea[]>([]);
  
  // Copywriter State
  const [copywritingTopic, setCopywritingTopic] = useState<string>('');
  const [copywritingType, setCopywritingType] = useState<string>('Social Media Caption');
  const [generatedCopy, setGeneratedCopy] = useState<CopywritingResult[]>([]);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [selectedImageForCopy, setSelectedImageForCopy] = useState<string | null>(null);
  const [generatedCopyInModal, setGeneratedCopyInModal] = useState<CopywritingResult[]>([]);
  const [isModalLoading, setIsModalLoading] = useState(false);

  // Strategy Assistant State
  const [generatedStrategy, setGeneratedStrategy] = useState<MarketingStrategy | null>(null);

  // Trend Radar State
  const [trendReport, setTrendReport] = useState<TrendReport | null>(null);
  const [latestTrendReport, setLatestTrendReport] = useState<TrendReport | null>(null);
  
  // Predictive Simulator State
  const [simulationReport, setSimulationReport] = useState<SimulationReport | null>(null);


  // History State
  const [generationHistory, setGenerationHistory] = useState<GenerationHistoryItem[]>([]);
  
  // To-Do State
  const [toDoList, setToDoList] = useState<ToDoItem[]>([]);
  const [reminderToast, setReminderToast] = useState<ToDoItem | null>(null);

  // Image Zoom Modal State
  const [zoomedImageSrc, setZoomedImageSrc] = useState<string | null>(null);
  
  // Image Editor Modal State
  const [editingImage, setEditingImage] = useState<{ id: string; src: string } | null>(null);

  // Gamification State
  const [gamificationToast, setGamificationToast] = useState<{ title: string; description: string } | null>(null);


  // Parallax background ref
  const auroraContainerRef = useRef<HTMLDivElement>(null);

  const personalitySystemInstructions: { [key: string]: string } = {
      'Chill Buddy': 'You are a chill, friendly buddy. Use casual language, slang, and be supportive and easy-going.',
      'Wise Mentor': 'You are a wise mentor. Provide insightful, thoughtful, and encouraging advice. Speak calmly and with authority.',
      'Sassy Bestie': 'You are a sassy best friend. Be witty, a little sarcastic, and give brutally honest but funny advice.',
      'Professional Coach': 'You are a professional coach. Be structured, goal-oriented, and provide actionable steps. Maintain a formal and motivational tone.',
  };

  const handleSelectPersonality = useCallback((personality: string) => {
      if (!process.env.API_KEY) {
        setError("API key is not configured.");
        return;
      }
      setSelectedPersonality(personality);
      setChatHistory([]); // Clear history when switching personality
      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const chat = ai.chats.create({
              model: 'gemini-2.5-flash',
              config: {
                  systemInstruction: personalitySystemInstructions[personality],
              },
          });
          setChatInstance(chat);
      } catch (err) {
          setError('Failed to initialize AI chat.');
          console.error(err);
      }
  }, []);

  // Initialize chat on first load
  useEffect(() => {
    handleSelectPersonality(selectedPersonality);
  }, [handleSelectPersonality, selectedPersonality]);

  // Parallax effect for dashboard background
  useEffect(() => {
    const handleScroll = () => {
      if (auroraContainerRef.current) {
        // The 0.4 multiplier creates the parallax effect by making the background scroll slower
        auroraContainerRef.current.style.transform = `translate(-50%, -50%) translateY(${window.scrollY * 0.4}px)`;
      }
    };
    
    const resetTransform = () => {
        if (auroraContainerRef.current) {
          auroraContainerRef.current.style.transform = `translate(-50%, -50%) translateY(0px)`;
        }
    };

    if (view === 'dashboard') {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleScroll);
        resetTransform(); // Reset on cleanup
      };
    } else {
      resetTransform(); // Ensure it's reset when not on dashboard
    }
  }, [view]);
  
  
  // --- Data Persistence ---
  // The following useEffect hooks centralize all localStorage writes.
  // Handler functions should only call state setters (e.g., setUser, setToDoList),
  // and these effects will automatically persist the new state.

  // Persist the entire `user` object and its related data whenever it changes.
  useEffect(() => {
    if (user?.email) {
        const users = JSON.parse(localStorage.getItem('superdayzUsers') || '{}');
        // Merge with existing data to prevent race conditions from overwriting other user properties.
        users[user.email] = { ...users[user.email], ...user };
        localStorage.setItem('superdayzUsers', JSON.stringify(users));

        // Persist specific parts of the user object to their own keys for organization.
        localStorage.setItem(`superdayzModels_${user.email}`, JSON.stringify(user.uploadedModels || []));
        localStorage.setItem(`superdayzBrandKit_${user.email}`, JSON.stringify(user.brandKit || { colorPalette: [] }));
        localStorage.setItem(`superdayzBillingHistory_${user.email}`, JSON.stringify(user.billingHistory || []));
        localStorage.setItem(`superdayzPaymentMethods_${user.email}`, JSON.stringify(user.paymentMethods || []));
        localStorage.setItem(`superdayzFolders_${user.email}`, JSON.stringify(user.folders || []));
        localStorage.setItem(`superdayzCampaigns_${user.email}`, JSON.stringify(user.campaigns || []));
    }
  }, [user]);

  // Persist generation history separately.
  useEffect(() => {
    if (user?.email) {
      try {
        localStorage.setItem(`superdayzHistory_${user.email}`, JSON.stringify(generationHistory));
      } catch (error) {
        console.error("Error saving history to localStorage:", error);
        setError("Your session history could not be saved, likely because browser storage is full. Older history items might be removed.");
      }
    }
  }, [generationHistory, user?.email]);
  
  // Persist To-Do list separately.
  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(`superdayzTodos_${user.email}`, JSON.stringify(toDoList));
    }
  }, [toDoList, user?.email]);
  // --- End Data Persistence ---
  
  // --- Gamification Toast Manager ---
  useEffect(() => {
    if (gamificationToast) {
        const timer = setTimeout(() => {
            setGamificationToast(null);
        }, 5000); // Show toast for 5 seconds
        return () => clearTimeout(timer);
    }
  }, [gamificationToast]);
  // --- End Gamification ---

  // --- Subscription-based Feature Control ---
  useEffect(() => {
      if (user) {
          // Pro users get watermarks disabled by default, but can enable them.
          // Free users always have watermarks on and cannot disable them.
          if (user.subscription?.plan === 'Executive') {
              setIsWatermarkEnabled(false);
          } else {
              setIsWatermarkEnabled(true);
          }
      }
  }, [user]);
  // --- End Subscription Control ---


  const checkAchievements = useCallback((updatedUser: User, updatedHistory: GenerationHistoryItem[]) => {
    const newAchievements: string[] = [];
    achievements.forEach(ach => {
      if (!updatedUser.achievements.includes(ach.id) && ach.check(updatedUser, updatedHistory)) {
        newAchievements.push(ach.id);
        setGamificationToast({ title: `Achievement Unlocked!`, description: `${ach.name} (+${ach.xpBonus} XP)` });
      }
    });
    return newAchievements;
  }, []);

  const grantXp = useCallback((amount: number, type?: 'generation' | 'login' | 'todo') => {
    setUser(currentUser => {
      if (!currentUser) return null;

      let updatedUser = { ...currentUser, xp: currentUser.xp + amount };
      const xpForNext = getXpForNextLevel(updatedUser.level);

      // Check for Level Up
      if (updatedUser.xp >= xpForNext) {
        const newLevel = updatedUser.level + 1;
        const creditReward = newLevel * 5;
        updatedUser = {
          ...updatedUser,
          level: newLevel,
          xp: updatedUser.xp - xpForNext, // Carry over excess XP
          credits: updatedUser.credits + creditReward,
        };
        setGamificationToast({ title: `Level Up! You've reached Level ${newLevel}`, description: `+${creditReward} Credits!` });
      }
      
      // Check for new achievements
      const newAchievements = checkAchievements(updatedUser, generationHistory);
      if (newAchievements.length > 0) {
        const totalXpBonus = newAchievements.reduce((sum, achId) => {
            const achievement = achievements.find(a => a.id === achId);
            return sum + (achievement?.xpBonus || 0);
        }, 0);

        updatedUser = {
          ...updatedUser,
          xp: updatedUser.xp + totalXpBonus,
          achievements: [...updatedUser.achievements, ...newAchievements],
        };

        // Re-check for level up in case achievement XP caused it
        const xpForNextAfterBonus = getXpForNextLevel(updatedUser.level);
         if (updatedUser.xp >= xpForNextAfterBonus) {
            const newLevel = updatedUser.level + 1;
            const creditReward = newLevel * 5;
            updatedUser = {
              ...updatedUser,
              level: newLevel,
              xp: updatedUser.xp - xpForNextAfterBonus,
              credits: updatedUser.credits + creditReward,
            };
            // The achievement toast will show first, then this one will appear after
            setTimeout(() => {
                 setGamificationToast({ title: `Level Up! You've reached Level ${newLevel}`, description: `+${creditReward} Credits!` });
            }, 1000);
        }
      }

      return updatedUser;
    });
  }, [generationHistory, checkAchievements]);

  const deductCredit = useCallback((amount = 1) => {
    setUser(prevUser => {
        if (!prevUser) return null;
        grantXp(5 * amount, 'generation'); // Grant 5 XP for every credit spent
        return { ...prevUser, credits: prevUser.credits - amount };
    });
  }, [grantXp]);

  const addItemsToHistory = useCallback((items: GenerationHistoryItem[]) => {
      if (items.length === 0) return;
      setGenerationHistory(prev => [...items, ...prev].slice(0, HISTORY_LIMIT));
  }, []);

  // Initial load effect
  useEffect(() => {
    const loggedInUserEmail = localStorage.getItem('superdayzLoggedInUser');
    if (loggedInUserEmail) {
      const users = JSON.parse(localStorage.getItem('superdayzUsers') || '{}');
      let userData: User = users[loggedInUserEmail];

      if (userData) {
        const today = new Date().toDateString();
        // Grant daily free credits if on Freemium plan
        if (userData.subscription?.plan === 'Freemium' && new Date(userData.lastLogin).toDateString() !== today) {
            userData.credits = Math.max(userData.credits, 5); // Reset to 5, but don't take away purchased credits.
        }
        
        // Load all user-specific data from localStorage
        userData.uploadedModels = JSON.parse(localStorage.getItem(`superdayzModels_${loggedInUserEmail}`) || '[]');
        userData.brandKit = JSON.parse(localStorage.getItem(`superdayzBrandKit_${loggedInUserEmail}`) || '{"colorPalette": []}');
        userData.billingHistory = JSON.parse(localStorage.getItem(`superdayzBillingHistory_${loggedInUserEmail}`) || '[]');
        userData.paymentMethods = JSON.parse(localStorage.getItem(`superdayzPaymentMethods_${loggedInUserEmail}`) || '[]');
        userData.folders = JSON.parse(localStorage.getItem(`superdayzFolders_${loggedInUserEmail}`) || '[]');
        userData.campaigns = JSON.parse(localStorage.getItem(`superdayzCampaigns_${loggedInUserEmail}`) || '[]');
        
        // Initialize subscription if it doesn't exist (for older accounts)
        if (!userData.subscription) {
            userData.subscription = { plan: 'Freemium', nextBillingDate: null, creditsPerMonth: 5 };
        }
        
        // Initialize gamification fields if they don't exist
        if (typeof userData.level !== 'number') userData.level = 1;
        if (typeof userData.xp !== 'number') userData.xp = 0;
        if (!Array.isArray(userData.achievements)) userData.achievements = [];
        if (!Array.isArray(userData.folders)) userData.folders = [];
        if (!Array.isArray(userData.campaigns)) userData.campaigns = [];


        const userHistory = JSON.parse(localStorage.getItem(`superdayzHistory_${loggedInUserEmail}`) || '[]');
        const userToDos = JSON.parse(localStorage.getItem(`superdayzTodos_${loggedInUserEmail}`) || '[]');

        // Check for daily login XP bonus
        if (new Date(userData.lastLogin).toDateString() !== today) {
            userData.lastLogin = new Date().toISOString();
            // We'll grant XP after setting the user state
        }
        
        setUser(userData);
        setGenerationHistory(userHistory);
        setToDoList(userToDos);
        
        setView('dashboard');
        
        if (!userData.hasCompletedOnboarding) {
            setIsOnboardingVisible(true);
        }
      }
    }
  }, []);
  
  // Effect to grant daily login bonus AFTER user is set
  useEffect(() => {
    if (user) {
        const today = new Date().toDateString();
        const lastLoginDate = new Date(user.lastLogin).toDateString();
        // Check if the login is "new" for today by comparing with a temporary flag
        if (lastLoginDate === today && !sessionStorage.getItem('dailyLoginGranted')) {
            grantXp(10, 'login');
            sessionStorage.setItem('dailyLoginGranted', 'true');
        }
    }
  }, [user, grantXp]);
  
  // --- Reminder System ---
  useEffect(() => {
    const checkReminders = () => {
      if (!user?.email) return;

      const shownRemindersKey = `superdayzShownReminders_${user.email}`;
      const shownReminders: string[] = JSON.parse(localStorage.getItem(shownRemindersKey) || '[]');
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const dueTask = toDoList.find(task => {
        if (task.isCompleted || !task.reminder || task.reminder === 'none' || shownReminders.includes(task.id)) {
          return false;
        }

        const dateParts = task.dueDate.split('-').map(Number);
        const dueDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        
        let remindDate = new Date(dueDate);

        if (task.reminder === '1-day-before') {
          remindDate.setDate(remindDate.getDate() - 1);
        } else if (task.reminder === '3-days-before') {
          remindDate.setDate(remindDate.getDate() - 3);
        }
        
        return remindDate.getTime() <= today.getTime();
      });

      if (dueTask && !reminderToast) {
        setReminderToast(dueTask);
        localStorage.setItem(shownRemindersKey, JSON.stringify([...shownReminders, dueTask.id]));
      }
    };

    const intervalId = setInterval(checkReminders, 30 * 1000);
    checkReminders(); // Initial check

    return () => clearInterval(intervalId);
  }, [toDoList, user, reminderToast]);

  useEffect(() => {
    if (reminderToast) {
      const timer = setTimeout(() => {
        setReminderToast(null);
      }, 8000); // Show for 8 seconds
      return () => clearTimeout(timer);
    }
  }, [reminderToast]);
  // --- End Reminder System ---


  const handleLogin = (email: string, pass: string) => {
    if (!navigator.onLine) {
      setAuthError("You appear to be offline. Please check your internet connection.");
      return;
    }
    const users = JSON.parse(localStorage.getItem('superdayzUsers') || '{}');
    if (users[email] && users[email].password === pass) {
        sessionStorage.removeItem('dailyLoginGranted'); // Allow login bonus check
        setAuthError(null);
        localStorage.setItem('superdayzLoggedInUser', email);
        let userData = users[email];

        const today = new Date().toDateString();
        // Initialize subscription if it doesn't exist
        if (!userData.subscription) {
            userData.subscription = { plan: 'Freemium', nextBillingDate: null, creditsPerMonth: 5 };
        }

        // Grant daily free credits if on Freemium plan
        if (userData.subscription.plan === 'Freemium' && new Date(userData.lastLogin).toDateString() !== today) {
            userData.credits = Math.max(userData.credits, 5);
        }

        // Initialize gamification fields if they don't exist
        if (typeof userData.level !== 'number') userData.level = 1;
        if (typeof userData.xp !== 'number') userData.xp = 0;
        if (!Array.isArray(userData.achievements)) userData.achievements = [];
        if (!Array.isArray(userData.folders)) userData.folders = [];
        if (!Array.isArray(userData.campaigns)) userData.campaigns = [];


        if (new Date(userData.lastLogin).toDateString() !== today) {
            userData.lastLogin = new Date().toISOString();
        }
        
        // Load all user-specific data
        userData.uploadedModels = JSON.parse(localStorage.getItem(`superdayzModels_${email}`) || '[]');
        userData.brandKit = JSON.parse(localStorage.getItem(`superdayzBrandKit_${email}`) || '{"colorPalette": []}');
        userData.billingHistory = JSON.parse(localStorage.getItem(`superdayzBillingHistory_${email}`) || '[]');
        userData.paymentMethods = JSON.parse(localStorage.getItem(`superdayzPaymentMethods_${email}`) || '[]');
        userData.folders = JSON.parse(localStorage.getItem(`superdayzFolders_${email}`) || '[]');
        userData.campaigns = JSON.parse(localStorage.getItem(`superdayzCampaigns_${email}`) || '[]');
        
        const userHistory = JSON.parse(localStorage.getItem(`superdayzHistory_${email}`) || '[]');
        const userToDos = JSON.parse(localStorage.getItem(`superdayzTodos_${email}`) || '[]');
        
        setUser(userData);
        setGenerationHistory(userHistory);
        setToDoList(userToDos);
        
        setView('dashboard');

        if (!userData.hasCompletedOnboarding) {
            setIsOnboardingVisible(true);
        }
    } else {
      setAuthError('Invalid email or password.');
    }
  };

  const handleRegister = (name: string, role: string, email: string, pass: string) => {
    if (!navigator.onLine) {
      setAuthError("You appear to be offline. Please check your internet connection.");
      return;
    }
    const users = JSON.parse(localStorage.getItem('superdayzUsers') || '{}');
     if (users[email]) {
        setAuthError('An account with this email already exists.');
        return;
     }
    const newUser: User = { 
        email, name, role, credits: 5, lastLogin: new Date().toISOString(), password: pass, profilePicture: '', 
        uploadedModels: [], 
        brandKit: { colorPalette: [] },
        subscription: { plan: 'Freemium', nextBillingDate: null, creditsPerMonth: 5 },
        paymentMethods: [],
        billingHistory: [],
        hasCompletedOnboarding: false,
        level: 1,
        xp: 0,
        achievements: [],
        folders: [],
        campaigns: [],
    };
    
    users[email] = newUser;
    localStorage.setItem('superdayzUsers', JSON.stringify(users));
    localStorage.setItem('superdayzLoggedInUser', email);
    sessionStorage.removeItem('dailyLoginGranted'); // Allow login bonus check

    // Initialize all storage for the new user
    localStorage.setItem(`superdayzHistory_${email}`, '[]');
    localStorage.setItem(`superdayzTodos_${email}`, '[]');
    localStorage.setItem(`superdayzModels_${email}`, '[]');
    localStorage.setItem(`superdayzBrandKit_${email}`, '{"colorPalette": []}');
    localStorage.setItem(`superdayzBillingHistory_${email}`, '[]');
    localStorage.setItem(`superdayzPaymentMethods_${email}`, '[]');
    localStorage.setItem(`superdayzFolders_${email}`, '[]');
    localStorage.setItem(`superdayzCampaigns_${email}`, '[]');


    setAuthError(null);
    setUser(newUser);
    setGenerationHistory([]);
    setToDoList([]);
    setView('dashboard');
    setIsOnboardingVisible(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('superdayzLoggedInUser');
    sessionStorage.removeItem('dailyLoginGranted');
    setUser(null);
    setGenerationHistory([]);
    setToDoList([]);
    setView('login');
  };

  const handleUpdateProfile = (name: string, role: string) => {
     setUser(prevUser => prevUser ? { ...prevUser, name, role } : null);
  }
  
  const handleUpdateProfilePicture = (base64Image: string) => {
    setUser(prevUser => prevUser ? { ...prevUser, profilePicture: base64Image } : null);
  };
  
  const handleCompleteOnboarding = () => {
    setUser(prevUser => prevUser ? { ...prevUser, hasCompletedOnboarding: true } : null);
    setIsOnboardingVisible(false);
  };

  const handleChangePassword = (currentPass: string, newPass: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (!user || user.password !== currentPass) {
            reject(new Error("Incorrect current password."));
            return;
        }
        setUser(prevUser => prevUser ? { ...prevUser, password: newPass } : null);
        resolve();
    });
  };

  const handleDeleteAccount = () => {
      if (!user) return;
      if (window.confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) {
          const users = JSON.parse(localStorage.getItem('superdayzUsers') || '{}');
          delete users[user.email];
          localStorage.setItem('superdayzUsers', JSON.stringify(users));
          // Remove all user-specific data
          localStorage.removeItem(`superdayzHistory_${user.email}`);
          localStorage.removeItem(`superdayzTodos_${user.email}`);
          localStorage.removeItem(`superdayzModels_${user.email}`);
          localStorage.removeItem(`superdayzBrandKit_${user.email}`);
          localStorage.removeItem(`superdayzBillingHistory_${user.email}`);
          localStorage.removeItem(`superdayzPaymentMethods_${user.email}`);
          localStorage.removeItem(`superdayzFolders_${user.email}`);
          localStorage.removeItem(`superdayzCampaigns_${user.email}`);
          handleLogout();
      }
  };

  const handleUpdateToDos = (updatedToDos: ToDoItem[]) => {
      // Check if a task was completed
      const newlyCompleted = updatedToDos.find(
          (t, i) => t.isCompleted && !toDoList[i]?.isCompleted
      );
      if (newlyCompleted) {
          grantXp(2, 'todo');
      }
      setToDoList(updatedToDos);
  };

  const handleUpdateAssetTags = (assetId: string, newTags: string[]) => {
    setGenerationHistory(prevHistory => 
        prevHistory.map(item => 
            item.id === assetId ? { ...item, tags: newTags } : item
        )
    );
  };

    const handleCreateFolder = (name: string) => {
        setUser(currentUser => {
            if (!currentUser) return null;
            const newFolder: Folder = { id: `folder_${Date.now()}`, name };
            return { ...currentUser, folders: [...(currentUser.folders || []), newFolder] };
        });
    };

    const handleMoveAssetToFolder = (assetId: string, folderId: string | null) => {
        setGenerationHistory(prev =>
            prev.map(item =>
                item.id === assetId ? { ...item, folderId: folderId === null ? undefined : folderId } : item
            )
        );
    };

    const handleAddCampaign = (name: string, goal: string) => {
        setUser(currentUser => {
            if (!currentUser) return null;
            const newCampaign: Campaign = {
                id: `campaign_${Date.now()}`,
                name,
                goal,
                createdAt: new Date().toISOString(),
            };
            return { ...currentUser, campaigns: [...(currentUser.campaigns || []), newCampaign] };
        });
    };

  const handleAddModel = (name: string, imageData: ImageData) => {
      const newModel: AIModel = {
          id: `model_${Date.now()}`,
          name,
          ...imageData,
          createdAt: new Date().toISOString(),
      };
      setUser(prevUser => prevUser ? { ...prevUser, uploadedModels: [...(prevUser.uploadedModels || []), newModel] } : null);
  };

  const handleUpdateModel = (id: string, newName: string) => {
      setUser(prevUser => {
          if (!prevUser) return null;
          const updatedModels = (prevUser.uploadedModels || []).map(model =>
              model.id === id ? { ...model, name: newName } : model
          );
          return { ...prevUser, uploadedModels: updatedModels };
      });
  };
  
  const handleDeleteModel = (id: string) => {
        setUser(prevUser => {
          if (!prevUser) return null;
          const updatedModels = (prevUser.uploadedModels || []).filter(model => model.id !== id);
          return { ...prevUser, uploadedModels: updatedModels };
      });
  };
  
  const handleUpdateBrandKit = (updatedBrandKit: BrandKit) => {
     setUser(prevUser => prevUser ? { ...prevUser, brandKit: updatedBrandKit } : null);
  };
  
  // --- Billing & Subscription Handlers ---
  const handleUpdateSubscription = (plan: 'Freemium' | 'Executive') => {
    if (!user) return;
    
    let newSubscription: SubscriptionPlan;
    let creditUpdate = user.credits;
    let billingHistoryUpdate: BillingHistoryItem | null = null;
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    if (plan === 'Executive') {
      newSubscription = { plan: 'Executive', creditsPerMonth: 500, nextBillingDate: nextMonth.toISOString() };
      creditUpdate += 500; // Add credits immediately on upgrade
      billingHistoryUpdate = { id: `sub_${Date.now()}`, date: new Date().toISOString(), description: "Superdayz Executive Subscription", amount: 29 };
    } else { // Downgrading to Freemium
      newSubscription = { plan: 'Freemium', creditsPerMonth: 5, nextBillingDate: null };
      // User keeps their purchased credits, but monthly grant stops.
      billingHistoryUpdate = { id: `sub_${Date.now()}`, date: new Date().toISOString(), description: "Plan changed to Freemium", amount: 0 };
    }
    
    setUser(prevUser => {
        if (!prevUser) return null;
        const updatedHistory = [...(prevUser.billingHistory || []), ...(billingHistoryUpdate ? [billingHistoryUpdate] : [])];
        return { ...prevUser, credits: creditUpdate, subscription: newSubscription, billingHistory: updatedHistory };
    });
  };

  const handleBuyCredits = (credits: number, cost: number) => {
      if (!user) return;
      const newHistoryItem: BillingHistoryItem = {
          id: `cred_${Date.now()}`,
          date: new Date().toISOString(),
          description: `Credit Pack (${credits} credits)`,
          amount: cost,
      };
      setUser(prevUser => {
          if (!prevUser) return null;
          return {
              ...prevUser,
              credits: prevUser.credits + credits,
              billingHistory: [...(prevUser.billingHistory || []), newHistoryItem]
          };
      });
  };
  
  const handleAddPaymentMethod = (newMethod: Omit<PaymentMethod, 'id'>) => {
    const paymentMethod: PaymentMethod = { ...newMethod, id: `pm_${Date.now()}` };
    setUser(prevUser => {
        if (!prevUser) return null;
        return {
            ...prevUser,
            paymentMethods: [...(prevUser.paymentMethods || []), paymentMethod]
        };
    });
  };
  
  const handleDeletePaymentMethod = (id: string) => {
     setUser(prevUser => {
        if (!prevUser) return null;
        return {
            ...prevUser,
            paymentMethods: (prevUser.paymentMethods || []).filter(pm => pm.id !== id)
        };
    });
  };
  // ------------------------------------

  const handleGeneratePhotoshoot = useCallback(async () => {
    if (!navigator.onLine) {
      setError("You appear to be offline. Please check your internet connection.");
      return;
    }
    if (!productImage || !modelImage || !user) {
      setError('Please upload a product image and a model image.');
      return;
    }
    if (user.credits <= 0) {
      setError('You are out of credits. Please get more to continue.');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    const constructedPrompt = `A commercial photoshoot image.
    - Style: ${sceneStyle}
    - Model's Pose: ${modelPose}
    - Lighting: ${lighting}
    - Additional Details: ${customPrompt || 'As determined by the creative director based on the style.'}
    
    The model should be holding, wearing, or interacting with the product naturally within this scene.`;

    try {
      const brandKitToApply = applyBrandKit ? user.brandKit : undefined;
      const rawImages = await generatePhotoshootImage(productImage, modelImage, constructedPrompt, user.role, brandKitToApply);
      
      const watermarkText = "created by heart @2025 - Ananda Agung Prasetyo";
      const finalImages = isWatermarkEnabled
        ? await Promise.all(rawImages.map(img => addWatermark(img, watermarkText)))
        : rawImages;
      
      const generationTimestamp = Date.now();
      const newSessionItems: SessionImage[] = [];
      const newHistoryItems: GenerationHistoryItem[] = [];

      for (const [index, imgSrc] of finalImages.entries()) {
        const itemId = `photoshoot_${generationTimestamp}_${index}`;
        newSessionItems.push({ id: itemId, src: imgSrc });

        let autoTags: string[] = [];
        try {
          autoTags = await generateTagsForImage({ base64: imgSrc, mimeType: 'image/jpeg' });
        } catch (tagError) {
          console.warn("Auto-tagging failed for a photoshoot image, proceeding without tags.", tagError);
        }

        newHistoryItems.push({
          id: itemId,
          type: 'photoshoot',
          createdAt: new Date().toISOString(),
          src: imgSrc,
          prompt: constructedPrompt,
          tags: autoTags,
        });
      }
      
      setGeneratedPhotos(prev => [...newSessionItems, ...prev]);
      addItemsToHistory(newHistoryItems);
      deductCredit();

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [productImage, modelImage, user, sceneStyle, modelPose, lighting, customPrompt, applyBrandKit, isWatermarkEnabled, deductCredit, addItemsToHistory]);


  const handleGenerateMockup = useCallback(async () => {
    if (!navigator.onLine) {
      setError("You appear to be offline. Please check your internet connection.");
      return;
    }
    if (!designImage || !selectedTemplate || !user) {
      setError('Please upload a design and select a template.');
      return;
    }
    if (user.credits <= 0) {
      setError('You are out of credits. Please get more to continue.');
      return;
    }
    
    setIsLoading(true);
    setError(null);

    const backgroundPrompt = backgroundStyle === 'Custom' ? customBackground : backgroundStyle;
    const historyPrompt = `Mockup on a '${selectedTemplate.name}' with background: ${backgroundPrompt}`;

    try {
      // Fetch the template image and convert it to base64
      const response = await fetch(selectedTemplate.src);
      const blob = await response.blob();
      const templateBase64 = await readFileAsBase64(blob);
      const templateImageData: ImageData = { base64: templateBase64, mimeType: blob.type };

      const brandKitToApply = applyBrandKit ? user.brandKit : undefined;
      const rawImages = await generateMockupImage(designImage, templateImageData, backgroundPrompt, brandKitToApply);

      const watermarkText = "created by heart @2025 - Ananda Agung Prasetyo";
      const finalImages = isWatermarkEnabled
          ? await Promise.all(rawImages.map(img => addWatermark(img, watermarkText)))
          : rawImages;
      
      const generationTimestamp = Date.now();
      const newSessionItems: SessionImage[] = [];
      const newHistoryItems: GenerationHistoryItem[] = [];

      for (const [index, imgSrc] of finalImages.entries()) {
          const itemId = `mockup_${generationTimestamp}_${index}`;
          newSessionItems.push({ id: itemId, src: imgSrc });
          
          let autoTags: string[] = [];
          try {
            autoTags = await generateTagsForImage({ base64: imgSrc, mimeType: 'image/jpeg' });
          } catch (tagError) {
            console.warn("Auto-tagging failed for a mockup image, proceeding without tags.", tagError);
          }

          newHistoryItems.push({
              id: itemId,
              type: 'mockup',
              createdAt: new Date().toISOString(),
              src: imgSrc,
              prompt: historyPrompt,
              tags: autoTags,
          });
      }

      setGeneratedMockups(prev => [...newSessionItems, ...prev]);
      addItemsToHistory(newHistoryItems);
      deductCredit();

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [designImage, selectedTemplate, user, backgroundStyle, customBackground, applyBrandKit, isWatermarkEnabled, deductCredit, addItemsToHistory]);

  const handleGenerateImage = useCallback(async () => {
    if (!navigator.onLine) {
      setError("You appear to be offline. Please check your internet connection.");
      return;
    }
    if (!prompt.trim() || !user) {
      setError('Please enter a prompt.');
      return;
    }
    if (user.credits <= 0) {
      setError('You are out of credits. Please get more to continue.');
      return;
    }

    setIsLoading(true);
    setError(null);
    const historyPrompt = `A ${stylePreset} image of: ${prompt}`;

    try {
      const brandKitToApply = applyBrandKit ? user.brandKit : undefined;
      const rawImage = await generateImageFromPrompt(prompt, stylePreset, aspectRatio, brandKitToApply);
      
      const watermarkText = "created by heart @2025 - Ananda Agung Prasetyo";
      const finalImage = isWatermarkEnabled
          ? await addWatermark(rawImage, watermarkText)
          : rawImage;

      const newItemId = `image_${Date.now()}`;
      
      const newItem: SessionImage = {
        id: newItemId,
        src: finalImage,
      };
      setGeneratedImages(prev => [newItem, ...prev]);

      let autoTags: string[] = [];
      try {
        autoTags = await generateTagsForImage({ base64: finalImage, mimeType: 'image/jpeg' });
      } catch (tagError) {
        console.warn("Auto-tagging failed for a generated image, proceeding without tags.", tagError);
      }

      const newHistoryItem: GenerationHistoryItem = {
        id: newItemId,
        type: 'image',
        createdAt: new Date().toISOString(),
        src: finalImage,
        prompt: historyPrompt,
        tags: autoTags,
      };
      addItemsToHistory([newHistoryItem]);

      deductCredit();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, user, stylePreset, aspectRatio, applyBrandKit, isWatermarkEnabled, deductCredit, addItemsToHistory]);
  
  const handleGeneratePose = useCallback(async () => {
    if (!navigator.onLine) {
      setError("You appear to be offline. Please check your internet connection.");
      return;
    }
    if (!posedModelImage || !posePrompt.trim() || !user) {
      setError('Please upload a model image and describe the new pose.');
      return;
    }
    if (user.credits <= 0) {
      setError('You are out of credits. Please get more to continue.');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const rawImages = await generatePosedImage(posedModelImage, posePrompt);
      const watermarkText = "created by heart @2025 - Ananda Agung Prasetyo";
      const finalImages = isWatermarkEnabled
        ? await Promise.all(rawImages.map(img => addWatermark(img, watermarkText)))
        : rawImages;

      const generationTimestamp = Date.now();
      const newSessionItems: SessionImage[] = [];
      const newHistoryItems: GenerationHistoryItem[] = [];

      for (const [index, imgSrc] of finalImages.entries()) {
        const itemId = `pose_${generationTimestamp}_${index}`;
        newSessionItems.push({ id: itemId, src: imgSrc });
        
        let autoTags: string[] = [];
        try {
          autoTags = await generateTagsForImage({ base64: imgSrc, mimeType: 'image/jpeg' });
        } catch (tagError) {
          console.warn("Auto-tagging failed for a pose image, proceeding without tags.", tagError);
        }

        newHistoryItems.push({
          id: itemId,
          type: 'pose',
          createdAt: new Date().toISOString(),
          src: imgSrc,
          prompt: `Changed pose to: ${posePrompt}`,
          tags: autoTags,
        });
      }
      
      setGeneratedPoses(prev => [...newSessionItems, ...prev]);
      addItemsToHistory(newHistoryItems);
      deductCredit();

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [posedModelImage, posePrompt, user, isWatermarkEnabled, deductCredit, addItemsToHistory]);
  
  const handleGenerateGroupPhoto = useCallback(async () => {
    const validImages = groupImages.filter((img): img is ImageData => img !== null);
    if (!navigator.onLine) {
      setError("You appear to be offline. Please check your internet connection.");
      return;
    }
    if (validImages.length < 2 || !groupBackground.trim() || !groupArrangement.trim() || !user) {
      setError('Please upload at least 2 people and describe the scene and arrangement.');
      return;
    }
    if (user.credits <= 0) {
      setError('You are out of credits. Please get more to continue.');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    const historyPrompt = `Group photo in scene: "${groupBackground}" with arrangement: "${groupArrangement}"`;

    try {
      const rawImages = await generateGroupPhoto(validImages, groupBackground, groupArrangement);
      const watermarkText = "created by heart @2025 - Ananda Agung Prasetyo";
      const finalImages = isWatermarkEnabled
          ? await Promise.all(rawImages.map(img => addWatermark(img, watermarkText)))
          : rawImages;
      
      const generationTimestamp = Date.now();
      const newSessionItems: SessionImage[] = [];
      const newHistoryItems: GenerationHistoryItem[] = [];

      for (const [index, imgSrc] of finalImages.entries()) {
        const itemId = `group_${generationTimestamp}_${index}`;
        newSessionItems.push({ id: itemId, src: imgSrc });
        
        let autoTags: string[] = [];
        try {
          autoTags = await generateTagsForImage({ base64: imgSrc, mimeType: 'image/jpeg' });
        } catch (tagError) {
          console.warn("Auto-tagging failed for a group photo, proceeding without tags.", tagError);
        }

        newHistoryItems.push({
          id: itemId,
          type: 'group',
          createdAt: new Date().toISOString(),
          src: imgSrc,
          prompt: historyPrompt,
          tags: autoTags,
        });
      }
      
      setGeneratedGroupPhotos(prev => [...newSessionItems, ...prev]);
      addItemsToHistory(newHistoryItems);
      deductCredit();

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [groupImages, groupBackground, groupArrangement, user, isWatermarkEnabled, deductCredit, addItemsToHistory]);

  const videoLoadingMessages = [
    "Warming up the video engine...",
    "Gathering creative photons...",
    "Directing the digital actors...",
    "Compositing video frames...",
    "Rendering the final cut...",
    "Polishing the pixels...",
    "This is taking longer than usual, but good things are worth the wait!",
    "Almost there, adding the final sparkle..."
  ];
 
  const handleGenerateVideo = useCallback(async () => {
     if (!navigator.onLine) {
       setError("You appear to be offline. Please check your internet connection.");
       return;
     }
     if (!videoPrompt.trim() || !user) {
       setError('Please enter a prompt.');
       return;
     }
     const creditCost = 5; // Video generation is more expensive
     if (user.credits < creditCost) {
       setError('You do not have enough credits for video generation.');
       return;
     }
 
     setIsLoading(true);
     setError(null);
 
     // Loading message cycling
     let messageIndex = 0;
     setVideoLoadingMessage(videoLoadingMessages[messageIndex]);
     const messageInterval = setInterval(() => {
       messageIndex = (messageIndex + 1) % videoLoadingMessages.length;
       setVideoLoadingMessage(videoLoadingMessages[messageIndex]);
     }, 8000); // Change message every 8 seconds
 
     try {
       const rawVideos = await generateVideo(videoPrompt, videoSourceImage ?? undefined);
       
       const generationTimestamp = Date.now();
       const newSessionItems: SessionVideo[] = [];
       const newHistoryItems: GenerationHistoryItem[] = [];
 
       rawVideos.forEach((videoSrc, index) => {
         const itemId = `video_${generationTimestamp}_${index}`;
         newSessionItems.push({ id: itemId, src: videoSrc });
         newHistoryItems.push({
           id: itemId,
           type: 'video',
           createdAt: new Date().toISOString(),
           src: videoSrc,
           prompt: videoPrompt,
           tags: [],
         });
       });
       
       setGeneratedVideos(prev => [...newSessionItems, ...prev]);
       addItemsToHistory(newHistoryItems);
       deductCredit(creditCost);
 
     } catch (err) {
       console.error(err);
       setError(err instanceof Error ? err.message : 'An unknown error occurred during video generation.');
     } finally {
       clearInterval(messageInterval);
       setIsLoading(false);
     }
  }, [videoPrompt, videoSourceImage, user, deductCredit, addItemsToHistory]);

  const handleGenerateLogo = useCallback(async () => {
    if (!navigator.onLine) {
      setError("You appear to be offline. Please check your internet connection.");
      return;
    }
    if (!logoBrandName.trim() || !logoKeywords.trim() || !user) {
      setError('Please provide a brand name and some keywords.');
      return;
    }
    if (user.credits <= 0) {
      setError('You are out of credits. Please get more to continue.');
      return;
    }
  
    setIsLoading(true);
    setError(null);
    const historyPrompt = `Logo for "${logoBrandName}". Style: ${logoStyle}. Keywords: ${logoKeywords}.`;
  
    try {
      const { images, rationaleText } = await generateLogo(logoBrandName, logoSlogan, logoKeywords, logoColorPalette, logoStyle);
      
      const parseRationales = (text: string): string[] => {
        if (!text) return [];
        return text.split('\n')
          .map(line => line.trim())
          .filter(Boolean)
          .map(line => line.replace(/^\d+\.\s*/, '').replace(/^(Rationale|Design Choice):\s*/i, '').trim());
      };
      
      const rationales = parseRationales(rationaleText);

      const generationTimestamp = Date.now();
      const newSessionItems: SessionImage[] = [];
      const newHistoryItems: GenerationHistoryItem[] = [];
  
      for (const [index, imgSrc] of images.entries()) {
        const itemId = `logo_${generationTimestamp}_${index}`;
        const rationale = rationales[index] || "A versatile design that captures your brand's essence.";
        
        newSessionItems.push({
          id: itemId,
          src: imgSrc,
          rationale: rationale,
        });

        let autoTags: string[] = [];
        try {
          autoTags = await generateTagsForImage({ base64: imgSrc, mimeType: 'image/jpeg' });
        } catch (tagError) {
          console.warn("Auto-tagging failed for a logo image, proceeding without tags.", tagError);
        }
        
        newHistoryItems.push({
          id: itemId,
          type: 'logo',
          createdAt: new Date().toISOString(),
          src: imgSrc,
          prompt: historyPrompt,
          tags: autoTags,
          rationale: rationale,
        });
      }
      
      setGeneratedLogos(prev => [...newSessionItems, ...prev]);
      addItemsToHistory(newHistoryItems);
      deductCredit();
  
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred while generating logos.');
    } finally {
      setIsLoading(false);
    }
  }, [logoBrandName, logoSlogan, logoKeywords, logoColorPalette, logoStyle, user, deductCredit, addItemsToHistory]);


  const handleSendMessage = useCallback(async (message: string) => {
      if (!navigator.onLine) {
        setError("You appear to be offline. Please check your internet connection.");
        return;
      }
      if (!chatInstance || isLoading || !message.trim()) return;
      if (user && user.credits <= 0) {
        setError('You are out of credits. Please get more to continue.');
        return;
      }

      setIsLoading(true);
      setError(null);

      const userMessage: ChatMessage = { role: 'user', text: message };
      setChatHistory(prev => [...prev, userMessage]);
      setCurrentMessage('');

      try {
          const stream = await chatInstance.sendMessageStream({ message });
          
          let modelResponse = '';
          setChatHistory(prev => [...prev, { role: 'model', text: '' }]);

          for await (const chunk of stream) {
              modelResponse += chunk.text;
              setChatHistory(prev => {
                  const newHistory = [...prev];
                  newHistory[newHistory.length - 1].text = modelResponse;
                  return newHistory;
              });
          }
           
          deductCredit();

      } catch (err) {
           console.error(err);
           const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during chat.';
           setError(errorMessage);
           setChatHistory(prev => {
             const newHistory = [...prev];
             const lastMessage = newHistory[newHistory.length - 1];
             // If the last message is the empty "thinking" placeholder, remove it
             if (lastMessage?.role === 'model' && lastMessage.text === '') {
                 newHistory.pop();
             }
             // Add the new error message
             return [...newHistory, { role: 'model', text: `Sorry, I ran into an error: ${errorMessage}` }];
           });
      } finally {
          setIsLoading(false);
      }
  }, [chatInstance, user, isLoading, deductCredit]);

  const handleGenerateIdeas = useCallback(async () => {
    if (!navigator.onLine) {
      setError("You appear to be offline. Please check your internet connection.");
      return;
    }
    if (!ideaTopic.trim() || !user) {
      setError('Please enter a topic to get ideas.');
      return;
    }
    if (user.credits <= 0) {
      setError('You are out of credits. Please get more to continue.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newIdeas = await generateCreativeIdeas(ideaTopic, ideaType);
      
      setGeneratedIdeas(prev => [...newIdeas, ...prev]);

      const generationTimestamp = Date.now();
      const newHistoryItems: GenerationHistoryItem[] = newIdeas.map((idea, index) => ({
        id: `idea_${generationTimestamp}_${index}`,
        type: 'idea',
        createdAt: new Date().toISOString(),
        idea: idea,
        prompt: `Topic: '${ideaTopic}' | Type: '${ideaType}'`,
        tags: [ideaType.toLowerCase().replace(' ', '-'), ideaTopic.toLowerCase().split(' ')[0]],
      }));
      addItemsToHistory(newHistoryItems);

      deductCredit();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred while generating ideas.');
    } finally {
      setIsLoading(false);
    }
  }, [ideaTopic, ideaType, user, deductCredit, addItemsToHistory]);

  const handleGenerateCopy = useCallback(async (topic: string, type: string, imageBase64?: string) => {
    if (!navigator.onLine) {
      throw new Error("You appear to be offline. Please check your internet connection.");
    }
    if (!topic.trim() || !user) {
      throw new Error('Please enter a topic.');
    }
    if (user.credits <= 0) {
      throw new Error('You are out of credits.');
    }
  
    const imageData = imageBase64 ? { base64: imageBase64, mimeType: 'image/jpeg' } : undefined;
  
    try {
      const newCopy = await generateCopywritingContent(topic, type, imageData);
      
      deductCredit();

      return newCopy;
    } catch (err) {
        console.error(err);
        throw err instanceof Error ? err : new Error('An unknown error occurred while generating copy.');
    }
  }, [user, deductCredit]);

  const handleGenerateStrategy = useCallback(async (goal: string, audience: string) => {
    if (!navigator.onLine) {
        setError("You appear to be offline. Please check your internet connection.");
        return;
    }
    if (!user || user.credits <= 0) {
        setError('You are out of credits. Please get more to continue.');
        return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedStrategy(null);
    try {
        const result = await generateMarketingStrategy(goal, audience);
        setGeneratedStrategy(result);
        deductCredit();
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred while generating the strategy.');
    } finally {
        setIsLoading(false);
    }
  }, [user, deductCredit]);

  const handleGenerateTrendReport = useCallback(async (country: string) => {
    if (!navigator.onLine) {
        setError("You appear to be offline. Please check your internet connection.");
        return;
    }
    if (!user || user.credits <= 0) {
        setError('You are out of credits. Please get more to continue.');
        return;
    }
    setIsLoading(true);
    setError(null);
    setTrendReport(null);
    try {
        const result = await generateTrendReport(country);
        setTrendReport(result);
        setLatestTrendReport(result);
        deductCredit();
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred while generating the trend report.');
    } finally {
        setIsLoading(false);
    }
  }, [user, deductCredit]);

  const handleGenerateSimulation = useCallback(async (creatives: ImageData[], audience: string, channels: string) => {
    if (!navigator.onLine) {
        setError("You appear to be offline. Please check your internet connection.");
        return;
    }
    if (!user || user.credits <= 0) {
        setError('You are out of credits. Please get more to continue.');
        return;
    }
    setIsLoading(true);
    setError(null);
    setSimulationReport(null);
    try {
        const result = await generatePredictiveSimulation(creatives, audience, channels);
        setSimulationReport(result);

        const newHistoryItem: PredictiveSimulationItem = {
            id: `sim_${Date.now()}`,
            type: 'predictiveSimulation',
            createdAt: new Date().toISOString(),
            report: result,
            creatives: creatives,
            prompt: `Audience: ${audience} | Channels: ${channels}`,
            tags: [],
        };
        addItemsToHistory([newHistoryItem]);

        deductCredit();
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred while generating the simulation.');
    } finally {
        setIsLoading(false);
    }
  }, [user, deductCredit, addItemsToHistory]);

  const handleOpenCopyModal = (imageSrc: string) => {
    setSelectedImageForCopy(imageSrc);
    setGeneratedCopyInModal([]);
    setIsCopyModalOpen(true);
  };

  const handleGenerateCopyForModal = useCallback(async (topic: string, type: string) => {
    if (!selectedImageForCopy) return;

    setIsModalLoading(true);
    setError(null);
    try {
      const results = await handleGenerateCopy(topic, type, selectedImageForCopy);
      setGeneratedCopyInModal(results);
    } catch(err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
        setIsModalLoading(false);
    }
  }, [selectedImageForCopy, handleGenerateCopy]);

  const handleZoomImage = (src: string) => {
    setZoomedImageSrc(src);
  };

  const handleOpenImageEditor = (id: string, src: string) => {
    setEditingImage({ id, src });
  };
  
  const handleSaveEditedImage = async (editedSrc: string) => {
    if (!editingImage) return;

    let autoTags: string[] = [];
    try {
      autoTags = await generateTagsForImage({ base64: editedSrc, mimeType: 'image/jpeg' });
    } catch (tagError) {
      console.warn("Auto-tagging failed for an edited image, proceeding without tags.", tagError);
    }

    const newHistoryItem: GeneratedImageItem = {
        id: `edit_${Date.now()}`,
        type: 'edit',
        createdAt: new Date().toISOString(),
        src: editedSrc,
        prompt: `Edited from original generation`,
        originalId: editingImage.id, // Link to original
        tags: autoTags,
    };
    addItemsToHistory([newHistoryItem]);
    setEditingImage(null);
  };

  const handleUseTrend = (trendPrompt: string) => {
    setPrompt(trendPrompt); // Pre-fill the prompt in the image generator
    setView('imageGenerator');
  };

  const renderContent = () => {
    switch (view) {
      case 'landing':
        return <LandingScreen onGetStarted={() => setView('login')} />;
      case 'login':
        return <LoginScreen onLogin={handleLogin} onSwitchToRegister={() => { setView('register'); setAuthError(null); }} error={authError} />;
      case 'register':
        return <RegisterScreen onRegister={handleRegister} onSwitchToLogin={() => { setView('login'); setAuthError(null); }} error={authError} />;
      default:
        if (user) {
          const handleNavigation = (v: AppView) => {
            setError(null);
            setView(v);
          };

          const imageTypes: GenerationHistoryItem['type'][] = ['photoshoot', 'mockup', 'image', 'edit', 'pose', 'group', 'logo'];
          const recentImageCreations = generationHistory
            .filter((item): item is GeneratedImageItem => imageTypes.includes(item.type) && 'src' in item && !!item.src)
            .slice(0, 6)
            .map(item => item.src);
            
          const incompleteTodos = toDoList.filter(t => !t.isCompleted).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());


          return (
            <div className="text-gray-200 flex flex-col flex-grow">
              <Header
                user={user}
                onLogout={handleLogout}
                activeView={view}
                onNavigate={handleNavigation}
              />
              <CopywriterModal
                  isOpen={isCopyModalOpen}
                  onClose={() => setIsCopyModalOpen(false)}
                  imageSrc={selectedImageForCopy}
                  user={user}
                  onGenerate={handleGenerateCopyForModal}
                  results={generatedCopyInModal}
                  isLoading={isModalLoading}
                  error={error}
              />
              {view === 'dashboard' && <DashboardScreen user={user} todos={incompleteTodos} campaigns={user.campaigns || []} latestTrendReport={latestTrendReport} recentCreations={recentImageCreations} onNavigate={handleNavigation} onImageClick={handleZoomImage} onAddCampaign={handleAddCampaign} />}
              {view === 'app' && (
                <MainAppScreen
                  user={user}
                  productImage={productImage}
                  setProductImage={setProductImage}
                  modelImage={modelImage}
                  setModelImage={setModelImage}
                  generatedImages={generatedPhotos}
                  isLoading={isLoading}
                  error={error}
                  sceneStyle={sceneStyle}
                  setSceneStyle={setSceneStyle}
                  modelPose={modelPose}
                  setModelPose={setModelPose}
                  lighting={lighting}
                  setLighting={setLighting}
                  customPrompt={customPrompt}
                  setCustomPrompt={setCustomPrompt}
                  applyBrandKit={applyBrandKit}
                  setApplyBrandKit={setApplyBrandKit}
                  isWatermarkEnabled={isWatermarkEnabled}
                  setIsWatermarkEnabled={setIsWatermarkEnabled}
                  handleGenerate={handleGeneratePhotoshoot}
                  onGenerateCopy={handleOpenCopyModal}
                  onImageClick={handleZoomImage}
                  onEditImage={handleOpenImageEditor}
                />
              )}
              {view === 'mockup' && (
                  <MockupGeneratorScreen
                    user={user}
                    designImage={designImage}
                    setDesignImage={setDesignImage}
                    selectedTemplate={selectedTemplate}
                    setSelectedTemplate={setSelectedTemplate}
                    generatedImages={generatedMockups}
                    isLoading={isLoading}
                    error={error}
                    backgroundStyle={backgroundStyle}
                    setBackgroundStyle={setBackgroundStyle}
                    customBackground={customBackground}
                    setCustomBackground={setCustomBackground}
                    applyBrandKit={applyBrandKit}
                    setApplyBrandKit={setApplyBrandKit}
                    isWatermarkEnabled={isWatermarkEnabled}
                    setIsWatermarkEnabled={setIsWatermarkEnabled}
                    handleGenerate={handleGenerateMockup}
                    onGenerateCopy={handleOpenCopyModal}
                    onImageClick={handleZoomImage}
                    onEditImage={handleOpenImageEditor}
                  />
              )}
               {view === 'imageGenerator' && (
                  <ImageGeneratorScreen
                    user={user}
                    prompt={prompt}
                    setPrompt={setPrompt}
                    stylePreset={stylePreset}
                    setStylePreset={setStylePreset}
                    aspectRatio={aspectRatio}
                    setAspectRatio={setAspectRatio}
                    generatedImages={generatedImages}
                    isLoading={isLoading}
                    error={error}
                    applyBrandKit={applyBrandKit}
                    setApplyBrandKit={setApplyBrandKit}
                    isWatermarkEnabled={isWatermarkEnabled}
                    setIsWatermarkEnabled={setIsWatermarkEnabled}
                    handleGenerate={handleGenerateImage}
                    onGenerateCopy={handleOpenCopyModal}
                    onImageClick={handleZoomImage}
                    onEditImage={handleOpenImageEditor}
                  />
              )}
               {view === 'logoGenerator' && (
                  <LogoGeneratorScreen
                    user={user}
                    brandName={logoBrandName}
                    setBrandName={setLogoBrandName}
                    slogan={logoSlogan}
                    setSlogan={setLogoSlogan}
                    keywords={logoKeywords}
                    setKeywords={setLogoKeywords}
                    colorPalette={logoColorPalette}
                    setColorPalette={setLogoColorPalette}
                    logoStyle={logoStyle}
                    setLogoStyle={setLogoStyle}
                    generatedLogos={generatedLogos}
                    isLoading={isLoading}
                    error={error}
                    handleGenerate={handleGenerateLogo}
                    onImageClick={handleZoomImage}
                  />
              )}
               {view === 'poseGenerator' && (
                  <PoseGeneratorScreen
                    user={user}
                    modelImage={posedModelImage}
                    setModelImage={setPosedModelImage}
                    posePrompt={posePrompt}
                    setPosePrompt={setPosePrompt}
                    generatedImages={generatedPoses}
                    isLoading={isLoading}
                    error={error}
                    isWatermarkEnabled={isWatermarkEnabled}
                    setIsWatermarkEnabled={setIsWatermarkEnabled}
                    handleGenerate={handleGeneratePose}
                    onGenerateCopy={handleOpenCopyModal}
                    onImageClick={handleZoomImage}
                    onEditImage={handleOpenImageEditor}
                  />
              )}
               {view === 'groupPhoto' && (
                  <GroupPhotoScreen
                    user={user}
                    groupImages={groupImages}
                    setGroupImages={setGroupImages}
                    backgroundPrompt={groupBackground}
                    setBackgroundPrompt={setGroupBackground}
                    arrangementPrompt={groupArrangement}
                    setArrangementPrompt={setGroupArrangement}
                    generatedImages={generatedGroupPhotos}
                    isLoading={isLoading}
                    error={error}
                    isWatermarkEnabled={isWatermarkEnabled}
                    setIsWatermarkEnabled={setIsWatermarkEnabled}
                    handleGenerate={handleGenerateGroupPhoto}
                    onGenerateCopy={handleOpenCopyModal}
                    onImageClick={handleZoomImage}
                    onEditImage={handleOpenImageEditor}
                  />
              )}
              {view === 'videoGenerator' && (
                  <VideoGeneratorScreen
                    user={user}
                    prompt={videoPrompt}
                    setPrompt={setVideoPrompt}
                    sourceImage={videoSourceImage}
                    setSourceImage={setVideoSourceImage}
                    generatedVideos={generatedVideos}
                    isLoading={isLoading}
                    loadingMessage={videoLoadingMessage}
                    error={error}
                    handleGenerate={handleGenerateVideo}
                  />
              )}
              {view === 'aiTalk' && (
                  <AITalkScreen
                    user={user}
                    isLoading={isLoading}
                    error={error}
                    chatHistory={chatHistory}
                    currentMessage={currentMessage}
                    setCurrentMessage={setCurrentMessage}
                    handleSendMessage={handleSendMessage}
                    selectedPersonality={selectedPersonality}
                    handleSelectPersonality={handleSelectPersonality}
                  />
              )}
              {view === 'creativeIdeas' && (
                  <IdeaGeneratorScreen
                    user={user}
                    topic={ideaTopic}
                    setTopic={setIdeaTopic}
                    ideaType={ideaType}
                    setIdeaType={setIdeaType}
                    generatedIdeas={generatedIdeas}
                    isLoading={isLoading}
                    error={error}
                    handleGenerate={handleGenerateIdeas}
                  />
              )}
              {view === 'copywriter' && (
                <CopywriterScreen
                  user={user}
                  topic={copywritingTopic}
                  setTopic={setCopywritingTopic}
                  copyType={copywritingType}
                  setCopyType={setCopywritingType}
                  generatedCopy={generatedCopy}
                  isLoading={isLoading}
                  error={error}
                  handleGenerate={async () => {
                    setIsLoading(true);
                    setError(null);
                    try {
                      const results = await handleGenerateCopy(copywritingTopic, copywritingType);
                      setGeneratedCopy(prev => [...results, ...prev]);
                    } catch (err) {
                      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                />
              )}
              {view === 'history' && (
                  <HistoryScreen 
                    history={generationHistory} 
                    folders={user.folders || []}
                    onImageClick={handleZoomImage} 
                    onEditImage={handleOpenImageEditor} 
                    onUpdateTags={handleUpdateAssetTags}
                    onAddFolder={handleCreateFolder}
                    onMoveAsset={handleMoveAssetToFolder}
                  />
              )}
              {view === 'todo' && (
                  <ToDoScreen todos={toDoList} onUpdateToDos={handleUpdateToDos} />
              )}
              {view === 'creativeJourney' && (
                  <CreativeJourneyScreen user={user} history={generationHistory} />
              )}
              {view === 'trendRadar' && (
                  <TrendRadarScreen
                    user={user}
                    isLoading={isLoading}
                    error={error}
                    trendReport={trendReport}
                    onGenerateReport={handleGenerateTrendReport}
                    onUseTrend={handleUseTrend}
                  />
              )}
              {view === 'strategyAssistant' && (
                  <StrategyAssistantScreen
                    user={user}
                    isLoading={isLoading}
                    error={error}
                    generatedStrategy={generatedStrategy}
                    handleGenerate={handleGenerateStrategy}
                  />
              )}
               {view === 'predictiveSimulator' && (
                  <PredictiveSimulatorScreen
                    user={user}
                    isLoading={isLoading}
                    error={error}
                    simulationReport={simulationReport}
                    handleGenerate={handleGenerateSimulation}
                  />
              )}
              {view === 'settings' && (
                  <SettingsScreen 
                    user={user}
                    onUpdateProfile={handleUpdateProfile}
                    onChangePassword={handleChangePassword}
                    onDeleteAccount={handleDeleteAccount}
                    onNavigate={handleNavigation}
                    onAddModel={handleAddModel}
                    onUpdateModel={handleUpdateModel}
                    onDeleteModel={handleDeleteModel}
                    onUpdateBrandKit={handleUpdateBrandKit}
                    onUpdateProfilePicture={handleUpdateProfilePicture}
                  />
              )}
              {view === 'billing' && (
                  <BillingScreen
                    user={user}
                    onUpdateSubscription={handleUpdateSubscription}
                    onBuyCredits={handleBuyCredits}
                    onAddPaymentMethod={handleAddPaymentMethod}
                    onDeletePaymentMethod={handleDeletePaymentMethod}
                    onNavigate={handleNavigation}
                  />
              )}
            </div>
          );
        }
        // Fallback to login if no user or view is matched
        return <LoginScreen onLogin={handleLogin} onSwitchToRegister={() => { setView('register'); setAuthError(null); }} error={authError} />;
    }
  }

  return (
    <div className="bg-slate-900 min-h-screen flex flex-col relative overflow-x-hidden" style={{ perspective: '2000px' }}>
      <div className="aurora-background" aria-hidden="true">
        <div
          ref={auroraContainerRef}
          className="aurora-container"
        >
          <div className="aurora-blob" style={{ background: 'linear-gradient(to right, #ef4444, #a855f7)', top: '10%', left: '20%', width: '40%', height: '40%', animation: 'aurora-1 60s cubic-bezier(0.6, 0.2, 0.4, 0.8) infinite' }} />
          <div className="aurora-blob" style={{ background: 'linear-gradient(to right, #eab308, #3b82f6)', top: '50%', left: '60%', width: '50%', height: '50%', animation: 'aurora-2 70s cubic-bezier(0.6, 0.2, 0.4, 0.8) infinite' }} />
          <div className="aurora-blob" style={{ background: 'linear-gradient(to right, #22d3ee, #f472b6)', top: '30%', left: '40%', width: '35%', height: '35%', animation: 'aurora-3 80s cubic-bezier(0.6, 0.2, 0.4, 0.8) infinite' }} />
        </div>
      </div>
      
      {isOnboardingVisible && user && (
        <OnboardingModal
            isOpen={isOnboardingVisible}
            onClose={handleCompleteOnboarding}
            user={user}
        />
      )}
      {user && reminderToast && <ReminderToast todo={reminderToast} onClose={() => setReminderToast(null)} />}
      
      {gamificationToast && (
          <GamificationToast
              title={gamificationToast.title}
              description={gamificationToast.description}
              onClose={() => setGamificationToast(null)}
          />
      )}

      <ImageZoomModal 
        isOpen={!!zoomedImageSrc}
        onClose={() => setZoomedImageSrc(null)}
        imageSrc={zoomedImageSrc}
      />

      <ImageEditorModal
        isOpen={!!editingImage}
        onClose={() => setEditingImage(null)}
        onSave={handleSaveEditedImage}
        imageSrc={editingImage?.src || null}
      />

      <div className="flex-grow flex flex-col z-10">
        <div key={view} className="flex-grow flex flex-col animate-slideInDown">
          {renderContent()}
        </div>
      </div>
      <Footer />
    </div>
  )
};

export default App;