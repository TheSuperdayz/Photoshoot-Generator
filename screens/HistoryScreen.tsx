
import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { GenerationHistoryItem, GenerationType } from '../types';
import { HistoryIcon } from '../components/icons/HistoryIcon';
import { SearchIcon } from '../components/icons/SearchIcon';
import { DownloadIcon } from '../components/icons/DownloadIcon';
import { ClipboardIcon } from '../components/icons/ClipboardIcon';
import { PencilIcon } from '../components/icons/PencilIcon';
import { TagIcon } from '../components/icons/TagIcon';
import { FolderIcon } from '../components/icons/FolderIcon';

interface HistoryScreenProps {
  history: GenerationHistoryItem[];
  onImageClick: (imageSrc: string) => void;
  onEditImage: (id: string, imageSrc: string) => void;
  onUpdateTags: (assetId: string, newTags: string[]) => void;
}

type FilterType = 'all' | GenerationType;

const typeLabels: { [key in GenerationType]: string } = {
  'photoshoot': 'Photoshoot',
  'mockup': 'Mockup',
  'image': 'Image',
  'idea': 'Idea',
  'copy': 'Copy',
  'edit': 'Edit',
  'pose': 'Pose',
  'group': 'Group',
  'video': 'Video',
  // FIX: Added missing key required by GenerationType
  'predictiveSimulation': 'Simulation',
};

const FilterButton: React.FC<{ label: string, isActive: boolean, onClick: () => void }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 ${
            isActive
                ? 'bg-sky-500 text-white shadow-md'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
        }`}
    >
        {label}
    </button>
);

const HistoryCard: React.FC<{ 
  item: GenerationHistoryItem; 
  index: number; 
  onImageClick: (src: string) => void; 
  onEditImage: (id: string, src: string) => void;
  onUpdateTags: (assetId: string, newTags: string[]) => void;
}> = ({ item, index, onImageClick, onEditImage, onUpdateTags }) => {
    const [copied, setCopied] = useState(false);
    const [isEditingTags, setIsEditingTags] = useState(false);
    const [tagInput, setTagInput] = useState('');
    const tagInputRef = useRef<HTMLInputElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (isEditingTags && tagInputRef.current) {
            tagInputRef.current.focus();
        }
    }, [isEditingTags]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const { left, top, width, height } = cardRef.current.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        const rotateX = -1 * ((y - height / 2) / (height / 2)) * 7;
        const rotateY = ((x - width / 2) / (width / 2)) * 7;
        cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`;
        
        const glow = cardRef.current.querySelector('.card-3d-glow') as HTMLElement;
        if (glow) {
            glow.style.setProperty('--x', `${x}px`);
            glow.style.setProperty('--y', `${y}px`);
        }
    };

    const handleMouseLeave = () => {
        if (!cardRef.current) return;
        cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    };

    const handleCopy = () => {
        if (item.type !== 'idea' || !item.idea) return;
        const textToCopy = `Title: ${item.idea.title}\n\nDescription: ${item.idea.description}`;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            const newTags = [...(item.tags || []), tagInput.trim()];
            onUpdateTags(item.id, newTags);
            setTagInput('');
        }
    };
    
    const handleRemoveTag = (tagToRemove: string) => {
        const newTags = (item.tags || []).filter(t => t !== tagToRemove);
        onUpdateTags(item.id, newTags);
    };

    const creationDate = new Date(item.createdAt).toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric'
    });
    
    const animationStyle = {
      animationDelay: `${Math.min(index * 30, 500)}ms`,
      animationFillMode: 'backwards'
    };

    if (item.type === 'video') {
        return (
            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative group aspect-video bg-slate-800 rounded-lg overflow-hidden shadow-lg animate-item-enter card-3d-tilt"
                style={animationStyle}
            >
                <video src={item.src} loop muted playsInline className="w-full h-full object-cover" />
                <div className="absolute inset-0 rounded-lg card-3d-glow" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 pointer-events-none">
                    <p className="text-white text-xs font-medium line-clamp-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-100" style={{ transform: 'translateZ(20px)' }}>{item.prompt}</p>
                    <div className="flex justify-between items-center mt-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-200" style={{ transform: 'translateZ(10px)' }}>
                        <span className="text-xs text-slate-300">{creationDate}</span>
                        <a href={item.src} download={`superdayz-video-${item.id}.mp4`} className="bg-white/20 text-white p-2 rounded-full hover:bg-white/30 pointer-events-auto" aria-label="Download video" onClick={(e) => e.stopPropagation()}>
                            <DownloadIcon className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    if (item.type === 'idea') {
        // Safe-guard against malformed idea items
        if (!item.idea) return null;
        return (
            <div 
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="bg-slate-800/80 backdrop-blur-lg border border-slate-700 rounded-xl p-5 flex flex-col justify-between group animate-item-enter card-3d-tilt"
              style={animationStyle}
            >
                <div className="absolute inset-0 rounded-xl card-3d-glow" />
                <div style={{ transform: 'translateZ(20px)' }}>
                    <h3 className="text-md font-bold text-white mb-2">{item.idea.title}</h3>
                    <p className="text-slate-300 text-xs leading-relaxed line-clamp-4">{item.idea.description}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-600 flex justify-between items-center" style={{ transform: 'translateZ(10px)' }}>
                    <span className="text-xs text-slate-400">{creationDate}</span>
                    <button onClick={handleCopy} className="bg-slate-700/60 text-white p-2 rounded-full hover:bg-slate-600 transition-colors" aria-label="Copy idea">
                        {copied ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        ) : (
                            <ClipboardIcon className="w-4 w-4" />
                        )}
                    </button>
                </div>
            </div>
        );
    }
    
    if (!('src' in item) || typeof item.src !== 'string' || !item.src) {
        console.warn("Rendering placeholder for corrupted history item:", item);
        return (
            <div 
              className="relative group aspect-square bg-red-900/20 backdrop-blur-lg border border-red-500/30 rounded-lg overflow-hidden shadow-lg flex flex-col items-center justify-center text-center p-4 animate-item-enter"
              style={animationStyle}
            >
                <HistoryIcon className="w-10 h-10 text-red-400/50 mb-2" />
                <p className="text-xs text-red-300/80 font-semibold">Image Data Corrupted</p>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2" title={item.prompt || 'Prompt not available'}>
                    {item.prompt || 'Prompt not available'}
                </p>
                 <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/20">
                    <span className="text-xs text-slate-400">{creationDate}</span>
                </div>
            </div>
        );
    }


    return (
        <div 
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative group aspect-square bg-slate-800 rounded-lg overflow-hidden shadow-lg animate-item-enter card-3d-tilt"
          style={animationStyle}
        >
            <div className="cursor-zoom-in" onClick={() => onImageClick(item.src)}>
                <img src={item.src} alt={item.prompt} className="w-full h-full object-cover" />
                <div className="absolute inset-0 rounded-lg card-3d-glow" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            </div>
            
            {/* Overlay for actions and info */}
            <div className="absolute inset-0 p-3 flex flex-col justify-end pointer-events-none">
                 <div className="flex-grow min-h-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-xs font-medium line-clamp-3" style={{ transform: 'translateZ(20px)' }}>{item.prompt}</p>
                </div>

                <div className="flex flex-wrap gap-1 mb-2 pointer-events-auto">
                    {(item.tags || []).map(tag => (
                        <div key={tag} className="flex items-center gap-1 text-xs bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full">
                            <span>{tag}</span>
                            <button onClick={() => handleRemoveTag(tag)} className="hover:text-white">&times;</button>
                        </div>
                    ))}
                </div>
                 {isEditingTags && (
                    <input
                        ref={tagInputRef}
                        type="text"
                        value={tagInput}
                        onChange={e => setTagInput(e.target.value)}
                        onKeyDown={handleTagInputKeyDown}
                        onBlur={() => setIsEditingTags(false)}
                        placeholder="Add tag..."
                        className="w-full text-xs bg-slate-900 border border-slate-600 rounded-md p-1 my-1 pointer-events-auto"
                    />
                )}

                <div className="flex justify-between items-center pointer-events-auto">
                    <span className="text-xs text-slate-300">{creationDate}</span>
                    <div className="flex items-center gap-1.5">
                        <button onClick={(e) => { e.stopPropagation(); setIsEditingTags(true); }} className="bg-white/10 text-white p-2 rounded-full hover:bg-white/20" aria-label="Add Tags"> <TagIcon className="w-4 h-4" /> </button>
                        <button onClick={(e) => e.stopPropagation()} className="bg-white/10 text-white p-2 rounded-full hover:bg-white/20" aria-label="Move to folder"> <FolderIcon className="w-4 h-4" /> </button>
                        <button onClick={(e) => { e.stopPropagation(); onEditImage(item.id, item.src); }} className="bg-white/10 text-white p-2 rounded-full hover:bg-white/20" aria-label="Edit image"> <PencilIcon className="w-4 h-4" /> </button>
                        <a href={item.src} download={`superdayz-${item.type}-${item.id}.png`} className="bg-white/10 text-white p-2 rounded-full hover:bg-white/20" aria-label="Download image" onClick={(e) => e.stopPropagation()}> <DownloadIcon className="w-4 h-4" /> </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ history, onImageClick, onEditImage, onUpdateTags }) => {
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');
    const [searchTerm, setSearchTerm] = useState('');
    
    const allTags = useMemo(() => {
        const tagSet = new Set<string>();
        history.forEach(item => {
            item.tags?.forEach(tag => tagSet.add(tag));
        });
        return Array.from(tagSet);
    }, [history]);

    const filteredHistory = history
            .filter(item => {
                if (!item) return false; // Basic safety check for null/undefined items
                return activeFilter === 'all' || item.type === activeFilter;
            })
            .filter(item => {
                const term = searchTerm.toLowerCase();
                if (!term) return true;

                const hasTag = item.tags?.some(tag => tag.toLowerCase().includes(term));

                if (item.type === 'idea') {
                    return hasTag || item.idea?.title?.toLowerCase().includes(term) || item.idea?.description?.toLowerCase().includes(term);
                }
                return hasTag || ('prompt' in item && item.prompt?.toLowerCase().includes(term));
            });

    return (
        <main className="flex-grow container mx-auto p-4 md:p-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-white tracking-tight">Asset Hub</h1>
                <p className="mt-2 text-lg text-slate-400">Browse, search, and organize all your generated content.</p>
            </div>

            {/* Controls */}
            <div className="sticky top-[70px] z-10 bg-slate-900/50 backdrop-blur-lg py-4 mb-8 rounded-xl">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-4">
                    <div className="relative w-full md:max-w-xs">
                        <input
                            type="text"
                            placeholder="Search by prompt or tag..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-600 rounded-full py-2 pl-10 pr-4 text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:outline-none transition"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <SearchIcon className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                        <FilterButton label="All" isActive={activeFilter === 'all'} onClick={() => setActiveFilter('all')} />
                        {(Object.keys(typeLabels) as GenerationType[]).map(key => (
                            <FilterButton key={key} label={typeLabels[key]} isActive={activeFilter === key} onClick={() => setActiveFilter(key)} />
                        ))}
                    </div>
                </div>
                 {allTags.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 border-t border-slate-700 pt-4">
                        {allTags.map(tag => (
                            <button key={tag} onClick={() => setSearchTerm(tag)} className="text-xs bg-sky-500/10 text-sky-300 px-2 py-1 rounded-full hover:bg-sky-500/30">
                                #{tag}
                            </button>
                        ))}
                    </div>
                 )}
            </div>

            {/* Gallery */}
            {filteredHistory.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredHistory.map((item, index) => <HistoryCard key={item.id} item={item} index={index} onImageClick={onImageClick} onEditImage={onEditImage} onUpdateTags={onUpdateTags} />)}
                </div>
            ) : (
                <div className="text-center py-16 bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-700">
                    <HistoryIcon className="w-16 h-16 text-slate-600 mx-auto" />
                    <h3 className="mt-4 text-xl font-semibold text-slate-300">
                        {history.length > 0 ? 'No results found' : 'Your history is empty'}
                    </h3>
                    <p className="mt-1 text-slate-500">
                        {history.length > 0 ? 'Try adjusting your search or filters.' : 'Start creating something amazing to see it here!'}
                    </p>
                </div>
            )}
        </main>
    );
};
