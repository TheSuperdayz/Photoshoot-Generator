import React from 'react';
import type { User, GenerationHistoryItem } from '../types';

import { CameraIcon } from '../components/icons/CameraIcon';
import { TshirtIcon } from '../components/icons/TshirtIcon';
import { ImageIcon } from '../components/icons/ImageIcon';
import { LightbulbIcon } from '../components/icons/LightbulbIcon';
import { QuillIcon } from '../components/icons/QuillIcon';
import { SparklesIcon } from '../components/icons/SparklesIcon';

interface Achievement {
  id: string;
  name: string;
  description: string;
  xpBonus: number;
  icon: React.ReactNode;
  check: (user: User, history: GenerationHistoryItem[]) => boolean;
}

export const achievements: Achievement[] = [
  {
    id: 'first_step',
    name: 'Initiate Creator',
    description: 'Make your very first generation.',
    xpBonus: 25,
    icon: <SparklesIcon className="w-8 h-8" />,
    check: (user, history) => history.length >= 1,
  },
  {
    id: 'photoshoot_pro',
    name: 'Photoshoot Pro',
    description: 'Generate 10 photoshoot images.',
    xpBonus: 50,
    icon: <CameraIcon className="w-8 h-8" />,
    check: (user, history) => history.filter(h => h.type === 'photoshoot').length >= 10,
  },
  {
    id: 'mockup_master',
    name: 'Mockup Master',
    description: 'Generate 10 mockups.',
    xpBonus: 50,
    icon: <TshirtIcon className="w-8 h-8" />,
    check: (user, history) => history.filter(h => h.type === 'mockup').length >= 10,
  },
  {
    id: 'image_artisan',
    name: 'Image Artisan',
    description: 'Generate 10 AI images from prompts.',
    xpBonus: 50,
    icon: <ImageIcon className="w-8 h-8" />,
    check: (user, history) => history.filter(h => h.type === 'image').length >= 10,
  },
  {
    id: 'idea_factory',
    name: 'Idea Factory',
    description: 'Generate 25 creative ideas.',
    xpBonus: 75,
    icon: <LightbulbIcon className="w-8 h-8" />,
    check: (user, history) => history.filter(h => h.type === 'idea').length >= 25,
  },
  {
    id: 'wordsmith',
    name: 'Wordsmith',
    description: 'Generate 25 pieces of copy.',
    xpBonus: 75,
    icon: <QuillIcon className="w-8 h-8" />,
    // Note: Copywriting isn't stored in history, so we'll need another way or assume a proxy
    // For now, we'll check total generations as a proxy. A more robust solution would track copy generations.
    check: (user, history) => history.length >= 25, // Proxy check
  },
  {
    id: 'centurion',
    name: 'Centurion Creator',
    description: 'Reach a total of 100 generations.',
    xpBonus: 150,
    icon: <SparklesIcon className="w-8 h-8" />,
    check: (user, history) => history.length >= 100,
  },
];

/**
 * Calculates the total XP required to advance from the current level to the next.
 * @param currentLevel The user's current level.
 * @returns The amount of XP needed to reach the next level.
 */
export const getXpForNextLevel = (currentLevel: number): number => {
  // A simple escalating formula: 100, 200, 300, etc.
  return currentLevel * 100;
};

/**
 * Determines the user's creative title based on their level.
 * @param level The user's current level.
 * @returns A creative title string.
 */
export const getCreativeTitle = (level: number): string => {
  if (level < 2) return 'New Spark';
  if (level < 5) return 'Novice Creator';
  if (level < 10) return 'Budding Artist';
  if (level < 15) return 'Creative Tinkerer';
  if (level < 20) return 'Design Dabbler';
  if (level < 25) return 'Visual Virtuoso';
  if (level < 30) return 'Imagination Expert';
  return 'AI Maestro';
};
