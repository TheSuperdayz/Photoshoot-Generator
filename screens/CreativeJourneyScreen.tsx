import React, { useMemo } from 'react';
import type { User, GenerationHistoryItem } from '../types';
import { achievements, getXpForNextLevel, getCreativeTitle } from '../services/gamificationService';
import { Tooltip } from '../components/Tooltip';
import { LockIcon } from '../components/icons/LockIcon';

interface CreativeJourneyScreenProps {
  user: User;
  history: GenerationHistoryItem[]; // Pass history to re-check achievements dynamically if needed
}

const AchievementCard: React.FC<{
  achievement: typeof achievements[0];
  isUnlocked: boolean;
}> = ({ achievement, isUnlocked }) => {
  return (
    <div className={`bg-slate-800/80 backdrop-blur-lg border ${isUnlocked ? 'border-yellow-400/40' : 'border-slate-700'} rounded-xl p-5 flex items-center gap-5 transition-all duration-300 ${!isUnlocked && 'opacity-50'}`}>
      <div className={`w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 ${isUnlocked ? 'bg-gradient-to-br from-yellow-400/20 to-amber-500/20' : 'bg-slate-700/50'}`}>
        {isUnlocked ? achievement.icon : <LockIcon className="w-8 h-8 text-slate-500" />}
      </div>
      <div>
        <h3 className={`font-bold text-lg ${isUnlocked ? 'text-yellow-300' : 'text-slate-400'}`}>{achievement.name}</h3>
        <p className="text-slate-400 text-sm">{achievement.description}</p>
        {isUnlocked && <p className="text-xs font-bold text-sky-300 mt-1">+ {achievement.xpBonus} XP</p>}
      </div>
    </div>
  );
};


export const CreativeJourneyScreen: React.FC<CreativeJourneyScreenProps> = ({ user, history }) => {
  const { level, xp, achievements: unlockedAchievements } = user;
  const xpForNextLevel = getXpForNextLevel(level);
  const xpProgressPercent = Math.max(0, Math.min(100, (xp / xpForNextLevel) * 100));
  const creativeTitle = getCreativeTitle(level);
  
  const sortedAchievements = useMemo(() => {
    return [...achievements].sort((a, b) => {
        const aUnlocked = unlockedAchievements.includes(a.id);
        const bUnlocked = unlockedAchievements.includes(b.id);
        if (aUnlocked === bUnlocked) return 0; // Keep original order if both are same state
        return aUnlocked ? -1 : 1; // Unlocked ones first
    });
  }, [unlockedAchievements]);


  return (
    <main className="flex-grow container mx-auto p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Your Creative Journey</h1>
          <p className="mt-2 text-lg text-slate-400">Track your progress, earn rewards, and unlock achievements.</p>
        </div>

        {/* Progress Section */}
        <div className="bg-slate-800/60 backdrop-blur-2xl border border-slate-700 rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path className="text-slate-700" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-sky-400" strokeWidth="3" strokeDasharray={`${xpProgressPercent}, 100`} strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs text-slate-400">LVL</span>
                    <span className="text-3xl font-bold text-white">{level}</span>
                </div>
              </div>
              <div>
                 <h2 className="text-2xl font-bold text-white">{creativeTitle}</h2>
                 <p className="text-slate-300">This is your creative rank based on your level.</p>
              </div>
            </div>
            <div className="w-full md:w-auto text-center md:text-right">
                <p className="text-lg font-semibold text-white">{xp} / {xpForNextLevel} XP</p>
                <p className="text-sm text-slate-400">To next level</p>
            </div>
          </div>
        </div>
        
        {/* Achievements Gallery */}
        <div>
            <h2 className="text-3xl font-bold text-white mb-6">Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {sortedAchievements.map(ach => (
                    <Tooltip key={ach.id} content={unlockedAchievements.includes(ach.id) ? 'You have unlocked this achievement!' : `How to unlock: ${ach.description}`}>
                        <AchievementCard achievement={ach} isUnlocked={unlockedAchievements.includes(ach.id)} />
                    </Tooltip>
                ))}
            </div>
        </div>

      </div>
    </main>
  );
};
