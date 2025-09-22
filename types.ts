export interface ImageData {
  base64: string;
  mimeType: string;
}

export interface SessionImage {
  id: string;
  src: string;
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
  plan: 'Free' | 'Pro';
  nextBillingDate: string | null;
  creditsPerMonth: number;
}

export interface PaymentMethod {
  id: string;
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

export type GenerationType = 'photoshoot' | 'mockup' | 'image' | 'idea';

export interface GeneratedImageItem {
  id: string;
  type: 'photoshoot' | 'mockup' | 'image';
  createdAt: string;
  src: string;
  prompt: string;
}

export interface GeneratedIdeaItem {
  id: string;
  type: 'idea';
  createdAt: string;
  idea: CreativeIdea;
  prompt: string;
}

export type GenerationHistoryItem = GeneratedImageItem | GeneratedIdeaItem;