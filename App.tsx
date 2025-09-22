

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import type { Chat } from "@google/genai";

// Components
import { Header } from './components/Header';
import { ProfileModal } from './components/ProfileModal';
import { Footer } from './components/Footer';
import { CopywriterModal } from './components/CopywriterModal';
import { ReminderToast } from './components/ReminderToast';
import { OnboardingModal } from './components/OnboardingModal';

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


// Services
import { generatePhotoshootImage, generateMockupImage, generateImageFromPrompt, generateCreativeIdeas, generateCopywritingContent } from './services/geminiService';

// Types
import type { ImageData, User, Template, ChatMessage, CreativeIdea, CopywritingResult, GenerationHistoryItem, ToDoItem, AIModel, BrandKit, SubscriptionPlan, PaymentMethod, BillingHistoryItem, GeneratedImageItem, SessionImage, AppView } from './types';

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
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isOnboardingVisible, setIsOnboardingVisible] = useState(false);
  
  // App State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [applyBrandKit, setApplyBrandKit] = useState<boolean>(false);

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


  // History State
  const [generationHistory, setGenerationHistory] = useState<GenerationHistoryItem[]>([]);
  
  // To-Do State
  const [toDoList, setToDoList] = useState<ToDoItem[]>([]);
  const [reminderToast, setReminderToast] = useState<ToDoItem | null>(null);

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
    }
  }, [user]);

  // Persist generation history separately.
  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(`superdayzHistory_${user.email}`, JSON.stringify(generationHistory));
    }
  }, [generationHistory, user?.email]);
  
  // Persist To-Do list separately.
  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(`superdayzTodos_${user.email}`, JSON.stringify(toDoList));
    }
  }, [toDoList, user?.email]);
  // --- End Data Persistence ---


  const deductCredit = useCallback(() => {
    setUser(prevUser => {
        if (!prevUser) return null;
        return { ...prevUser, credits: prevUser.credits - 1 };
    });
  }, []);

  const addItemsToHistory = useCallback((items: GenerationHistoryItem[]) => {
      if (items.length === 0) return;
      setGenerationHistory(prev => [...items, ...prev]);
  }, []);

  // Initial load effect
  useEffect(() => {
    const loggedInUserEmail = localStorage.getItem('superdayzLoggedInUser');
    if (loggedInUserEmail) {
      const users = JSON.parse(localStorage.getItem('superdayzUsers') || '{}');
      let userData: User = users[loggedInUserEmail];

      if (userData) {
        const today = new Date().toDateString();
        // Grant daily free credits if on Free plan
        if (userData.subscription?.plan === 'Free' && new Date(userData.lastLogin).toDateString() !== today) {
            userData.credits = Math.max(userData.credits, 5); // Reset to 5, but don't take away purchased credits.
            userData.lastLogin = new Date().toISOString();
        }
        
        // Load all user-specific data from localStorage
        userData.uploadedModels = JSON.parse(localStorage.getItem(`superdayzModels_${loggedInUserEmail}`) || '[]');
        userData.brandKit = JSON.parse(localStorage.getItem(`superdayzBrandKit_${loggedInUserEmail}`) || '{"colorPalette": []}');
        userData.billingHistory = JSON.parse(localStorage.getItem(`superdayzBillingHistory_${loggedInUserEmail}`) || '[]');
        userData.paymentMethods = JSON.parse(localStorage.getItem(`superdayzPaymentMethods_${loggedInUserEmail}`) || '[]');
        
        // Initialize subscription if it doesn't exist (for older accounts)
        if (!userData.subscription) {
            userData.subscription = { plan: 'Free', nextBillingDate: null, creditsPerMonth: 5 };
        }

        const userHistory = JSON.parse(localStorage.getItem(`superdayzHistory_${loggedInUserEmail}`) || '[]');
        const userToDos = JSON.parse(localStorage.getItem(`superdayzTodos_${loggedInUserEmail}`) || '[]');

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
    const users = JSON.parse(localStorage.getItem('superdayzUsers') || '{}');
    if (users[email] && users[email].password === pass) {
        setAuthError(null);
        localStorage.setItem('superdayzLoggedInUser', email);
        let userData = users[email];

        const today = new Date().toDateString();
        // Initialize subscription if it doesn't exist
        if (!userData.subscription) {
            userData.subscription = { plan: 'Free', nextBillingDate: null, creditsPerMonth: 5 };
        }

        // Grant daily free credits if on Free plan
        if (userData.subscription.plan === 'Free' && new Date(userData.lastLogin).toDateString() !== today) {
            userData.credits = Math.max(userData.credits, 5);
        }
        userData.lastLogin = new Date().toISOString();
        
        // Load all user-specific data
        userData.uploadedModels = JSON.parse(localStorage.getItem(`superdayzModels_${email}`) || '[]');
        userData.brandKit = JSON.parse(localStorage.getItem(`superdayzBrandKit_${email}`) || '{"colorPalette": []}');
        userData.billingHistory = JSON.parse(localStorage.getItem(`superdayzBillingHistory_${email}`) || '[]');
        userData.paymentMethods = JSON.parse(localStorage.getItem(`superdayzPaymentMethods_${email}`) || '[]');
        
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
    const users = JSON.parse(localStorage.getItem('superdayzUsers') || '{}');
     if (users[email]) {
        setAuthError('An account with this email already exists.');
        return;
     }
    const newUser: User = { 
        email, name, role, credits: 5, lastLogin: new Date().toISOString(), password: pass, profilePicture: '', 
        uploadedModels: [], 
        brandKit: { colorPalette: [] },
        subscription: { plan: 'Free', nextBillingDate: null, creditsPerMonth: 5 },
        paymentMethods: [],
        billingHistory: [],
        hasCompletedOnboarding: false,
    };
    
    users[email] = newUser;
    localStorage.setItem('superdayzUsers', JSON.stringify(users));
    localStorage.setItem('superdayzLoggedInUser', email);

    // Initialize all storage for the new user
    localStorage.setItem(`superdayzHistory_${email}`, '[]');
    localStorage.setItem(`superdayzTodos_${email}`, '[]');
    localStorage.setItem(`superdayzModels_${email}`, '[]');
    localStorage.setItem(`superdayzBrandKit_${email}`, '{"colorPalette": []}');
    localStorage.setItem(`superdayzBillingHistory_${email}`, '[]');
    localStorage.setItem(`superdayzPaymentMethods_${email}`, '[]');

    setAuthError(null);
    setUser(newUser);
    setGenerationHistory([]);
    setToDoList([]);
    setView('dashboard');
    setIsOnboardingVisible(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('superdayzLoggedInUser');
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
          handleLogout();
      }
  };

  const handleUpdateToDos = (updatedToDos: ToDoItem[]) => {
      // The state update will trigger the `useEffect` hook for persistence.
      setToDoList(updatedToDos);
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
  const handleUpdateSubscription = (plan: 'Free' | 'Pro') => {
    if (!user) return;
    
    let newSubscription: SubscriptionPlan;
    let creditUpdate = user.credits;
    let billingHistoryUpdate: BillingHistoryItem | null = null;
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    if (plan === 'Pro') {
      newSubscription = { plan: 'Pro', creditsPerMonth: 500, nextBillingDate: nextMonth.toISOString() };
      creditUpdate += 500; // Add credits immediately on upgrade
      billingHistoryUpdate = { id: `sub_${Date.now()}`, date: new Date().toISOString(), description: "Superdayz Pro Subscription", amount: 29 };
    } else { // Downgrading to Free
      newSubscription = { plan: 'Free', creditsPerMonth: 5, nextBillingDate: null };
      // User keeps their purchased credits, but monthly grant stops.
      billingHistoryUpdate = { id: `sub_${Date.now()}`, date: new Date().toISOString(), description: "Plan changed to Free", amount: 0 };
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
      const watermarkedImages = await Promise.all(
        rawImages.map(img => addWatermark(img, watermarkText))
      );
      
      const generationTimestamp = Date.now();
      const newSessionItems: SessionImage[] = [];
      const newHistoryItems: GenerationHistoryItem[] = [];

      watermarkedImages.forEach((imgSrc, index) => {
        const itemId = `photoshoot_${generationTimestamp}_${index}`;
        newSessionItems.push({ id: itemId, src: imgSrc });
        newHistoryItems.push({
          id: itemId,
          type: 'photoshoot',
          createdAt: new Date().toISOString(),
          src: imgSrc,
          prompt: constructedPrompt,
        });
      });
      
      setGeneratedPhotos(prev => [...newSessionItems, ...prev]);
      addItemsToHistory(newHistoryItems);
      deductCredit();

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [productImage, modelImage, user, sceneStyle, modelPose, lighting, customPrompt, applyBrandKit, deductCredit, addItemsToHistory]);


  const handleGenerateMockup = useCallback(async () => {
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
      const watermarkedImages = await Promise.all(
        rawImages.map(img => addWatermark(img, watermarkText))
      );
      
      const generationTimestamp = Date.now();
      const newSessionItems: SessionImage[] = [];
      const newHistoryItems: GenerationHistoryItem[] = [];

      watermarkedImages.forEach((imgSrc, index) => {
          const itemId = `mockup_${generationTimestamp}_${index}`;
          newSessionItems.push({ id: itemId, src: imgSrc });
          newHistoryItems.push({
              id: itemId,
              type: 'mockup',
              createdAt: new Date().toISOString(),
              src: imgSrc,
              prompt: historyPrompt,
          });
      });

      setGeneratedMockups(prev => [...newSessionItems, ...prev]);
      addItemsToHistory(newHistoryItems);
      deductCredit();

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [designImage, selectedTemplate, user, backgroundStyle, customBackground, applyBrandKit, deductCredit, addItemsToHistory]);

  const handleGenerateImage = useCallback(async () => {
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
      const watermarkedImage = await addWatermark(rawImage, watermarkText);
      
      const newItemId = `image_${Date.now()}`;
      
      const newItem: SessionImage = {
        id: newItemId,
        src: watermarkedImage,
      };
      setGeneratedImages(prev => [newItem, ...prev]);

      const newHistoryItem: GenerationHistoryItem = {
        id: newItemId,
        type: 'image',
        createdAt: new Date().toISOString(),
        src: watermarkedImage,
        prompt: historyPrompt,
      };
      addItemsToHistory([newHistoryItem]);

      deductCredit();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, user, stylePreset, aspectRatio, applyBrandKit, deductCredit, addItemsToHistory]);

  const handleSendMessage = useCallback(async (message: string) => {
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
    if (!topic.trim() || !user) {
      return Promise.reject(new Error('Please enter a topic.'));
    }
    if (user.credits <= 0) {
      return Promise.reject(new Error('You are out of credits.'));
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

          const recentImageCreations = generationHistory
            .filter((item): item is GeneratedImageItem => 'src' in item && !!item.src)
            .slice(0, 6)
            .map(item => item.src);

          return (
            <div className="text-gray-100 flex flex-col flex-grow">
              <Header
                user={user}
                onLogout={handleLogout}
                onNavigateToBilling={() => handleNavigation('billing')}
                onOpenProfile={() => setIsProfileModalOpen(true)}
                activeView={view}
                onNavigate={handleNavigation}
              />
              <ProfileModal
                isOpen={isProfileModalOpen}
                user={user}
                onClose={() => setIsProfileModalOpen(false)}
                onUpdateProfilePicture={handleUpdateProfilePicture}
                onNavigate={(v) => {
                    handleNavigation(v);
                    setIsProfileModalOpen(false);
                }}
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
              {view === 'dashboard' && <DashboardScreen user={user} recentCreations={recentImageCreations} onNavigate={handleNavigation} />}
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
                  handleGenerate={handleGeneratePhotoshoot}
                  onGenerateCopy={handleOpenCopyModal}
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
                    handleGenerate={handleGenerateMockup}
                    onGenerateCopy={handleOpenCopyModal}
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
                    handleGenerate={handleGenerateImage}
                    onGenerateCopy={handleOpenCopyModal}
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
                  <HistoryScreen history={generationHistory} />
              )}
              {view === 'todo' && (
                  <ToDoScreen todos={toDoList} onUpdateToDos={handleUpdateToDos} />
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
    <div className="bg-black min-h-screen flex flex-col relative overflow-x-hidden" style={{ perspective: '2000px' }}>
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

      <div className="flex-grow flex flex-col z-10">
        {renderContent()}
      </div>
      <Footer />
    </div>
  )
};

export default App;