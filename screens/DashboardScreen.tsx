

import React from 'react';
import type { User, AppView, ToDoItem, Campaign, TrendReport } from '../types';
import { CameraIcon } from '../components/icons/CameraIcon';
import { ImageIcon } from '../components/icons/ImageIcon';
import { DownloadIcon } from '../components/icons/DownloadIcon';
import { RadarIcon } from '../components/icons/RadarIcon';
import { PlusIcon } from '../components/icons/PlusIcon';
import { CalendarIcon } from '../components/icons/CalendarIcon';
import { BellIcon } from '../components/icons/BellIcon';
import { Tooltip } from '../components/Tooltip';
import { TshirtIcon } from '../components/icons/TshirtIcon';
import { LogoCreatorIcon } from '../components/icons/LogoCreatorIcon';
import { PoseIcon } from '../components/icons/PoseIcon';
import { GroupIcon } from '../components/icons/GroupIcon';
import { VideoIcon } from '../components/icons/VideoIcon';
import { ChatIcon } from '../components/icons/ChatIcon';
import { LightbulbIcon } from '../components/icons/LightbulbIcon';
import { QuillIcon } from '../components/icons/QuillIcon';


interface DashboardScreenProps {
  user: User;
  todos: ToDoItem[];
  campaigns: Campaign[];
  latestTrendReport: TrendReport | null;
  recentCreations: string[];
  onNavigate: (view: AppView) => void;
  onImageClick: (imageSrc: string) => void;
  onAddCampaign: (name: string, goal: string) => void;
}

const getRelativeDateString = (dueDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateParts = dueDate.split('-').map(Number);
    const due = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;
    if (diffDays === -1) return 'Yesterday';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `in ${diffDays} days`;
};

const WhatsNextWidget: React.FC<{ todos: ToDoItem[]; onNavigate: (view: AppView) => void }> = ({ todos, onNavigate }) => (
    <div className="lg:col-span-2 bg-slate-800/60 backdrop-blur-md border border-slate-700 p-6 rounded-2xl flex flex-col">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><CalendarIcon className="w-6 h-6" /> What's Next?</h2>
        <div className="flex-grow space-y-3">
            {todos.length > 0 ? (
                todos.slice(0, 3).map(todo => (
                    <div key={todo.id} className="bg-black/20 p-3 rounded-lg flex justify-between items-center">
                        <span className="font-medium text-sm">{todo.title}</span>
                        <div className="flex items-center gap-2 text-xs font-semibold bg-slate-700 text-slate-300 px-2 py-1 rounded-full">
                           <BellIcon className="w-3 h-3"/> <span>{getRelativeDateString(todo.dueDate)}</span>
                        </div>
                    </div>
                ))
            ) : (
                <div className="h-full flex items-center justify-center text-center text-slate-400">
                    <p>No upcoming tasks. <br/>Ready for the next big idea!</p>
                </div>
            )}
        </div>
        <button onClick={() => onNavigate('todo')} className="mt-4 w-full text-center text-sm font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 py-2 rounded-lg transition-colors">
            View Full Calendar
        </button>
    </div>
);

const CampaignsWidget: React.FC<{ campaigns: Campaign[]; onAddCampaign: (name: string, goal: string) => void; }> = ({ campaigns, onAddCampaign }) => {
    const handleAdd = () => {
        const name = prompt("Enter new campaign name:");
        if (name) {
            const goal = prompt("What is the main goal for this campaign?");
            if (goal) {
                onAddCampaign(name, goal);
            }
        }
    };
    return (
        <div className="lg:col-span-1 bg-slate-800/60 backdrop-blur-md border border-slate-700 p-6 rounded-2xl flex flex-col">
            <h2 className="text-xl font-bold text-white mb-4">Campaign Hub</h2>
            <div className="flex-grow space-y-2">
                {campaigns.slice(-3).reverse().map(c => (
                     <div key={c.id} className="bg-black/20 p-3 rounded-lg">
                        <p className="font-semibold text-sm truncate">{c.name}</p>
                        <p className="text-xs text-slate-400 truncate">{c.goal}</p>
                    </div>
                ))}
            </div>
            <button onClick={handleAdd} className="mt-4 w-full flex items-center justify-center gap-2 text-sm font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 py-2 rounded-lg transition-colors">
                <PlusIcon className="w-4 h-4" /> New Campaign
            </button>
        </div>
    );
};

const TrendsWidget: React.FC<{ report: TrendReport | null; onNavigate: (view: AppView) => void }> = ({ report, onNavigate }) => (
    <div className="lg:col-span-1 bg-slate-800/60 backdrop-blur-md border border-slate-700 p-6 rounded-2xl flex flex-col">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><RadarIcon className="w-6 h-6" /> Trending Now</h2>
        <div className="flex-grow">
            {report ? (
                <div>
                    <p className="text-sm text-slate-300 line-clamp-4">{report.summary}</p>
                    <p className="mt-2 text-xs text-sky-300 font-semibold">{report.topicalTrends[0]?.title}</p>
                </div>
            ) : (
                <p className="text-slate-400 text-sm">No trend report generated yet. Visit the AI Trend Radar to get the latest insights.</p>
            )}
        </div>
        <button onClick={() => onNavigate('trendRadar')} className="mt-4 w-full text-center text-sm font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 py-2 rounded-lg transition-colors">
            Go to Trend Radar
        </button>
    </div>
);

const QuickActionButton: React.FC<{
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}> = ({ onClick, icon, label }) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center gap-2 bg-black/20 hover:bg-black/40 p-4 rounded-lg transition-colors text-center">
        {icon}
        <span className="font-semibold text-sm">{label}</span>
    </button>
);


const QuickActionsWidget: React.FC<{ onNavigate: (view: AppView) => void }> = ({ onNavigate }) => (
    <div className="lg:col-span-4 bg-slate-800/60 backdrop-blur-md border border-slate-700 p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
             <QuickActionButton
                onClick={() => onNavigate('app')}
                icon={<CameraIcon className="w-8 h-8" />}
                label="AI Photoshoot"
             />
             <QuickActionButton
                onClick={() => onNavigate('imageGenerator')}
                icon={<ImageIcon className="w-8 h-8" />}
                label="AI Image Gen"
             />
             <QuickActionButton
                onClick={() => onNavigate('mockup')}
                icon={<TshirtIcon className="w-8 h-8" />}
                label="AI Mockup"
             />
             <QuickActionButton
                onClick={() => onNavigate('logoGenerator')}
                icon={<LogoCreatorIcon className="w-8 h-8" />}
                label="AI Logo Gen"
             />
             <QuickActionButton
                onClick={() => onNavigate('poseGenerator')}
                icon={<PoseIcon className="w-8 h-8" />}
                label="AI Pose Gen"
             />
             <QuickActionButton
                onClick={() => onNavigate('groupPhoto')}
                icon={<GroupIcon className="w-8 h-8" />}
                label="AI Group Photo"
             />
             <QuickActionButton
                onClick={() => onNavigate('videoGenerator')}
                icon={<VideoIcon className="w-8 h-8" />}
                label="AI Video Gen"
             />
              <QuickActionButton
                onClick={() => onNavigate('creativeIdeas')}
                icon={<LightbulbIcon className="w-8 h-8" />}
                label="Creative Ideas"
             />
             <QuickActionButton
                onClick={() => onNavigate('copywriter')}
                icon={<QuillIcon className="w-8 h-8" />}
                label="Copywriter"
             />
             <QuickActionButton
                onClick={() => onNavigate('aiTalk')}
                icon={<ChatIcon className="w-8 h-8" />}
                label="AI Talk"
             />
        </div>
    </div>
);


const RecentAssetsWidget: React.FC<{ creations: string[]; onImageClick: (src: string) => void }> = ({ creations, onImageClick }) => (
    <div className="lg:col-span-4 bg-slate-800/60 backdrop-blur-md border border-slate-700 p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-white mb-4">Recent Assets</h2>
        {creations.length > 0 ? (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {creations.map((image, index) => (
                    <div key={index} className="relative group aspect-square bg-slate-800 rounded-lg overflow-hidden cursor-pointer" onClick={() => onImageClick(image)}>
                        <img src={image} alt={`Recent creation ${index + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <a href={image} download={`creation-${Date.now()}.png`} className="p-2 bg-white/20 rounded-full" onClick={(e) => e.stopPropagation()}>
                                <DownloadIcon className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <p className="text-slate-400 text-sm text-center py-8">Your first creations will appear here.</p>
        )}
    </div>
);


export const DashboardScreen: React.FC<DashboardScreenProps> = ({ user, todos, campaigns, latestTrendReport, recentCreations, onNavigate, onImageClick, onAddCampaign }) => {
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Mission Control</h1>
            <p className="text-slate-400 mt-1">Welcome back, {user.name}. Here's your creative overview.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <WhatsNextWidget todos={todos} onNavigate={onNavigate} />
            <CampaignsWidget campaigns={campaigns} onAddCampaign={onAddCampaign} />
            <TrendsWidget report={latestTrendReport} onNavigate={onNavigate} />
            <QuickActionsWidget onNavigate={onNavigate} />
            <RecentAssetsWidget creations={recentCreations} onImageClick={onImageClick} />
        </div>
    </main>
  );
};