


export interface ImageData {
  base64: string;
  mimeType: string;
}

export interface SessionImage {
  id: string;
  src: string;
  rationale?: string;
  isParent?: boolean;
  // FIX: Add prompt and tags to SessionImage to align with history items.
  prompt?: string;
  tags?: string[];
}

export interface SessionVideo {
  id: string;
  src: string; // This will be a blob URL
}

export interface AIModel {
  id: string;
  name: string;
  base64: string;
  mimeType: string;
  createdAt: string;
}

export interface BrandKit {
  logo?: ImageData;
  colorPalette: string[];
  brandFont?: string;
}

export interface SubscriptionPlan {
  // FIX: Changed plan types to match application logic
  plan: 'Freemium' | 'Executive';
  nextBillingDate: string | null;
  creditsPerMonth: number;
}

export interface PaymentMethod {
  id:string;
  cardType: 'Visa' | 'Mastercard' | 'Amex';
  last4: string;
  expiryDate: string; // MM/YY
}

export interface BillingHistoryItem {
  id: string;
  date: string;
  description: string;
  amount: number; // in USD
}

export interface Folder {
  id: string;
  name: string;
}

export interface Campaign {
  id: string;
  name: string;
  goal: string;
  createdAt: string;
}

export interface User {
  email: string;
  name: string;
  role: string;
  credits: number;
  lastLogin: string;
  password?: string; // Added for password management
  profilePicture?: string; // Added for user profile picture (base64)
  uploadedModels?: AIModel[]; // Added for model management
  brandKit?: BrandKit; // Added for brand kit management
  subscription?: SubscriptionPlan;
  paymentMethods?: PaymentMethod[];
  billingHistory?: BillingHistoryItem[];
  hasCompletedOnboarding?: boolean;
  // Gamification fields
  level: number;
  xp: number;
  achievements: string[]; // Array of achievement IDs
  // Organization fields
  folders?: Folder[];
  campaigns?: Campaign[];
}

export interface Template {
  id: string;
  name: string;
  src: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface CreativeIdea {
  title: string;
  description: string;
}

export interface CopywritingResult {
  title:string;
  content: string;
}

export interface ToDoItem {
  id: string;
  title: string;
  description?: string;
  dueDate: string; // YYYY-MM-DD format
  isCompleted: boolean;
  reminder?: 'none' | 'on-due-date' | '1-day-before' | '3-days-before';
}

// --- Predictive Simulator Types ---
export interface HeatmapPoint {
    x: number; // percentage
    y: number; // percentage
}

export interface MetricPredictions {
    viralityScore: number; // e.g., 85
    conversionLikelihood: 'Low' | 'Medium' | 'High';
    ctrEstimate: string; // e.g., "1.5% - 2.5%"
}

export interface SimulationResult {
    creativeId: number; // 1 to 4
    isBestPerformer: boolean;
    predictions: MetricPredictions;
    channelRecommendation: string;
    heatmap: {
        hotspots: HeatmapPoint[];
        coldspots: HeatmapPoint[];
        insight: string;
    };
}

export interface SimulationReport {
    summary: string;
    results: SimulationResult[];
}
// --- End Predictive Simulator Types ---


export type GenerationType = 'photoshoot' | 'mockup' | 'image' | 'idea' | 'copy' | 'edit' | 'pose' | 'group' | 'video' | 'predictiveSimulation' | 'logo';

interface BaseHistoryItem {
    folderId?: string;
    campaignId?: string;
}

export interface GeneratedImageItem extends BaseHistoryItem {
  id: string;
  type: 'photoshoot' | 'mockup' | 'image' | 'edit' | 'pose' | 'group' | 'logo';
  createdAt: string;
  src: string;
  prompt: string;
  originalId?: string;
  tags?: string[];
  rationale?: string;
}

export interface GeneratedIdeaItem extends BaseHistoryItem {
  id: string;
  type: 'idea';
  createdAt: string;
  idea: CreativeIdea;
  prompt: string;
  tags?: string[];
}

export interface GeneratedVideoItem extends BaseHistoryItem {
  id: string;
  type: 'video';
  createdAt: string;
  src: string; // This will be a blob URL
  prompt: string;
  tags?: string[];
}

export interface PredictiveSimulationItem extends BaseHistoryItem {
    id: string;
    type: 'predictiveSimulation';
    createdAt: string;
    report: SimulationReport;
    creatives: ImageData[];
    prompt: string; // Storing audience and channels here
    tags?: string[];
}

export type GenerationHistoryItem = GeneratedImageItem | GeneratedIdeaItem | GeneratedVideoItem | PredictiveSimulationItem;

export interface TrendItem {
  title: string;
  description: string;
  velocity: 'Rising Fast' | 'Growing Steadily' | 'Peaking' | 'Fading Slowly' | 'Stable';
  lifespanPrediction: string; // e.g., "Short-term (1-2 weeks)", "Long-wave (2 months+)"
  targetAudience: string; // e.g., "Gen Z, Fashion enthusiasts", "Millennials, Professionals"
  audienceResonance: string;
}

export interface CrossPlatformTrend {
    trend: string;
    originPlatform: string;
    emergingOn: string[]; // e.g., ["Instagram Reels", "YouTube Shorts"]
    insight: string;
}

export interface TrendReport {
  summary: string;
  topicalTrends: TrendItem[];
  visualAudioStyles: TrendItem[];
  popularFormats: TrendItem[];
  crossPlatformTrends: CrossPlatformTrend[];
  examplePrompt: string;
}


export interface StrategyRecommendation {
    channel: 'TikTok' | 'Instagram' | 'YouTube' | 'LinkedIn' | 'Facebook' | 'X (Twitter)';
    format: string;
    reasoning: string;
    contentIdeas: string[];
}

export interface MarketingStrategy {
    summary: string;
    recommendations: StrategyRecommendation[];
}


export type AppView = 'landing' | 'login' | 'register' | 'dashboard' | 'app' | 'mockup' | 'imageGenerator' | 'aiTalk' | 'creativeIdeas' | 'copywriter' | 'history' | 'todo' | 'settings' | 'billing' | 'creativeJourney' | 'poseGenerator' | 'groupPhoto' | 'videoGenerator' | 'trendRadar' | 'strategyAssistant' | 'predictiveSimulator' | 'logoGenerator';
