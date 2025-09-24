

import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { GenerationHistoryItem, GenerationType, Folder } from '../types';
import { HistoryIcon } from '../components/icons/HistoryIcon';
import { SearchIcon } from '../components/icons/SearchIcon';
import { DownloadIcon } from '../components/icons/DownloadIcon';
import { ClipboardIcon } from '../components/icons/ClipboardIcon';
import { PencilIcon } from '../components/icons/PencilIcon';
import { TagIcon } from '../components/icons/TagIcon';
import { FolderIcon } from '../components/icons/FolderIcon';
import { PlusIcon } from '../components/icons/PlusIcon';

interface HistoryScreenProps {
  history: GenerationHistoryItem[];
  folders: Folder[];
  onImageClick: (imageSrc: string) => void;
  onEditImage: (id: string, imageSrc: string) => void;
  onUpdateTags: (assetId: string, newTags: string[]) => void;
  onAddFolder: (name: string) => void;
  onMoveAsset: (assetId: string, folderId: string | null) => void;
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
  'predictiveSimulation': 'Simulation',
  'logo': 'Logo',
};

const MoveToFolderModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    folders: Folder[];
    onMove: (folderId: string | null) => void;
}> = ({ isOpen, onClose, folders, onMove }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold mb-4">Move to...</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    <button onClick={() => onMove(null)} className="w-full text-left p-2 rounded hover:bg-white/10">Remove from Folder</button>
                    {folders.map(folder => (
                        <button key={folder.id} onClick={() => onMove(folder.id)} className="w-full text-left p-2 rounded hover:bg-white/10">
                            {folder.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};


const HistoryCard: React.FC<{ 
  item: GenerationHistoryItem; 
  index: number; 
  folders: Folder[];
  onImageClick: (src: string) => void; 
  onEditImage: (id: string, src: string) => void;
  onUpdateTags: (assetId: string, newTags: string[]) => void;
  onMoveAsset: (assetId: string, folderId: string | null) => void;
}> = ({ item, index, folders, onImageClick, onEditImage, onUpdateTags, onMoveAsset }) => {
    const [copied, setCopied] = useState(false);
    const [isEditingTags, setIsEditingTags] = useState(false);
    const [tagInput, setTagInput] = useState('');
    const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
    const tagInputRef = useRef<HTMLInputElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (isEditingTags && tagInputRef.current) {
            tagInputRef.current.focus();
        }
    }, [isEditingTags]);

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

    const handleMove = (folderId: string | null) => {
        onMoveAsset(item.id, folderId);
        setIsMoveModalOpen(false);
    };

    const creationDate = new Date(item.createdAt).toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric'
    });
    
    const animationStyle = {
      animationDelay: `${Math.min(index * 30, 500)}ms`,
      animationFillMode: 'backwards'
    };

    if (item.type === 'video' || item.type === 'idea' || !('src' in item)) {
        // Simplified view for non-image assets for brevity, but could be expanded
        return (
             <div className="bg-slate-800/80 backdrop-blur-lg border border-slate-700 rounded-xl p-5 flex flex-col justify-between group animate-item-enter" style={animationStyle}>
                <div>
                     <span className="text-xs font-semibold bg-white/10 px-2 py-1 rounded-full text-slate-300">{typeLabels[item.type]}</span>
                     <p className="text-slate-300 text-sm leading-relaxed line-clamp-4 mt-3">{item.type === 'idea' ? item.idea.title : item.prompt}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-600 flex justify-between items-center">
                    <span className="text-xs text-slate-400">{creationDate}</span>
                </div>
             </div>
        )
    }

    return (
        <>
        <MoveToFolderModal isOpen={isMoveModalOpen} onClose={() => setIsMoveModalOpen(false)} folders={folders} onMove={handleMove} />
        <div 
          ref={cardRef}
          className="relative group aspect-square bg-slate-800 rounded-lg overflow-hidden shadow-lg animate-item-enter"
          style={animationStyle}
        >
            <div className="cursor-zoom-in" onClick={() => onImageClick(item.src)}>
                <img src={item.src} alt={item.prompt} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            </div>
            
            <div className="absolute inset-0 p-3 flex flex-col justify-end pointer-events-none">
                 <div className="flex-grow min-h-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-xs font-medium line-clamp-3">{item.prompt}</p>
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
                        <button onClick={(e) => { e.stopPropagation(); setIsMoveModalOpen(true); }} className="bg-white/10 text-white p-2 rounded-full hover:bg-white/20" aria-label="Move to folder"> <FolderIcon className="w-4 h-4" /> </button>
                        <button onClick={(e) => { e.stopPropagation(); onEditImage(item.id, item.src); }} className="bg-white/10 text-white p-2 rounded-full hover:bg-white/20" aria-label="Edit image"> <PencilIcon className="w-4 h-4" /> </button>
                        <a href={item.src} download={`superdayz-${item.type}-${item.id}.png`} className="bg-white/10 text-white p-2 rounded-full hover:bg-white/20" aria-label="Download image" onClick={(e) => e.stopPropagation()}> <DownloadIcon className="w-4 h-4" /> </a>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ history, folders, onImageClick, onEditImage, onUpdateTags, onAddFolder, onMoveAsset }) => {
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

    const filteredHistory = useMemo(() => history
            .filter(item => selectedFolderId === null || item.folderId === selectedFolderId)
            .filter(item => activeFilter === 'all' || item.type === activeFilter)
            .filter(item => {
                const term = searchTerm.toLowerCase();
                if (!term) return true;
                const hasTag = item.tags?.some(tag => tag.toLowerCase().includes(term));
                if (item.type === 'idea') {
                    return hasTag || item.idea?.title?.toLowerCase().includes(term) || item.idea?.description?.toLowerCase().includes(term);
                }
                return hasTag || ('prompt' in item && item.prompt?.toLowerCase().includes(term));
            }), [history, selectedFolderId, activeFilter, searchTerm]);
    
    const handleAddFolder = () => {
        const name = prompt("Enter new folder name:");
        if (name && name.trim()) {
            onAddFolder(name.trim());
        }
    };

    return (
        <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full md:w-64 flex-shrink-0 bg-slate-800/60 backdrop-blur-xl border border-slate-700 rounded-2xl p-4 h-fit sticky top-24">
                <h2 className="text-lg font-bold mb-4">Folders</h2>
                <nav className="space-y-1 mb-4">
                    <button onClick={() => setSelectedFolderId(null)} className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${selectedFolderId === null ? 'bg-white/10 text-white' : 'hover:bg-white/5'}`}>All Assets</button>
                    {folders.map(folder => (
                        <button key={folder.id} onClick={() => setSelectedFolderId(folder.id)} className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${selectedFolderId === folder.id ? 'bg-white/10 text-white' : 'hover:bg-white/5'}`}>
                            {folder.name}
                        </button>
                    ))}
                </nav>
                <button onClick={handleAddFolder} className="w-full flex items-center justify-center gap-2 text-sm font-semibold bg-white/10 hover:bg-white/20 py-2 rounded-lg">
                    <PlusIcon className="w-4 h-4"/> New Folder
                </button>
            </aside>

            {/* Main Content */}
            <div className="flex-grow">
                <div className="text-center md:text-left mb-8">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">Asset Hub</h1>
                    <p className="mt-2 text-lg text-slate-400">Browse, search, and organize all your generated content.</p>
                </div>

                <div className="sticky top-[70px] z-10 bg-slate-900/50 backdrop-blur-lg py-4 mb-8 rounded-xl space-y-4">
                    <div className="relative w-full">
                        <input type="text" placeholder="Search by prompt or tag..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded-full py-2 pl-10 pr-4" />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><SearchIcon className="w-5 h-5" /></div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                        <button onClick={() => setActiveFilter('all')} className={`px-3 py-1.5 text-sm font-semibold rounded-full ${activeFilter === 'all' ? 'bg-sky-500 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}>All</button>
                        {(Object.keys(typeLabels) as GenerationType[]).map(key => (
                            <button key={key} onClick={() => setActiveFilter(key)} className={`px-3 py-1.5 text-sm font-semibold rounded-full ${activeFilter === key ? 'bg-sky-500 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}>{typeLabels[key]}</button>
                        ))}
                    </div>
                </div>

                {filteredHistory.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredHistory.map((item, index) => <HistoryCard key={item.id} item={item} index={index} folders={folders} onImageClick={onImageClick} onEditImage={onEditImage} onUpdateTags={onUpdateTags} onMoveAsset={onMoveAsset}/>)}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-700">
                        <HistoryIcon className="w-16 h-16 text-slate-600 mx-auto" />
                        <h3 className="mt-4 text-xl font-semibold text-slate-300">{history.length > 0 ? 'No results found' : 'Your history is empty'}</h3>
                        <p className="mt-1 text-slate-500">{history.length > 0 ? 'Try adjusting your search or filters.' : 'Start creating something amazing!'}</p>
                    </div>
                )}
            </div>
        </main>
    );
};