import React, { useState, useMemo, useRef } from 'react';
import type { GenerationHistoryItem, GenerationType } from '../types';
import { HistoryIcon } from '../components/icons/HistoryIcon';
import { SearchIcon } from '../components/icons/SearchIcon';
import { DownloadIcon } from '../components/icons/DownloadIcon';
import { ClipboardIcon } from '../components/icons/ClipboardIcon';

interface HistoryScreenProps {
  history: GenerationHistoryItem[];
}

type FilterType = 'all' | GenerationType;

const typeLabels: { [key in GenerationType]: string } = {
  'photoshoot': 'Photoshoot',
  'mockup': 'Mockup',
  'image': 'Image',
  'idea': 'Idea',
};

const FilterButton: React.FC<{ label: string, isActive: boolean, onClick: () => void }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 ${
            isActive
                ? 'bg-white text-gray-900 shadow-md'
                : 'bg-white/10 text-gray-200 hover:bg-white/20'
        }`}
    >
        {label}
    </button>
);

const HistoryCard: React.FC<{ item: GenerationHistoryItem; index: number }> = ({ item, index }) => {
    const [copied, setCopied] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

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
        if (item.type !== 'idea') return;
        const textToCopy = `Title: ${item.idea.title}\n\nDescription: ${item.idea.description}`;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    const creationDate = new Date(item.createdAt).toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric'
    });
    
    const animationStyle = {
      animationDelay: `${Math.min(index * 30, 500)}ms`,
      animationFillMode: 'backwards'
    };

    if (item.type === 'idea') {
        return (
            <div 
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-5 flex flex-col justify-between group animate-item-enter card-3d-tilt"
              style={animationStyle}
            >
                <div className="absolute inset-0 rounded-xl card-3d-glow" />
                <div style={{ transform: 'translateZ(20px)' }}>
                    <h3 className="text-md font-bold text-white mb-2">{item.idea.title}</h3>
                    <p className="text-gray-300 text-xs leading-relaxed line-clamp-4">{item.idea.description}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center" style={{ transform: 'translateZ(10px)' }}>
                    <span className="text-xs text-gray-400">{creationDate}</span>
                    <button onClick={handleCopy} className="bg-white/10 text-white p-2 rounded-full hover:bg-white/20 transition-colors" aria-label="Copy idea">
                        {copied ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        ) : (
                            <ClipboardIcon className="w-4 h-4" />
                        )}
                    </button>
                </div>
            </div>
        );
    }
    
    // Defensive check for corrupted image data in history
    if (!('src' in item) || typeof item.src !== 'string' || !item.src) {
        console.warn("Skipping rendering of corrupted history item:", item);
        return null;
    }


    return (
        <div 
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative group aspect-square bg-white/5 rounded-lg overflow-hidden shadow-lg animate-item-enter card-3d-tilt"
          style={animationStyle}
        >
            <img src={item.src} alt={item.prompt} className="w-full h-full object-cover" />
             <div className="absolute inset-0 rounded-lg card-3d-glow" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <p className="text-white text-xs font-medium line-clamp-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-100" style={{ transform: 'translateZ(20px)' }}>{item.prompt}</p>
                <div className="flex justify-between items-center mt-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-200" style={{ transform: 'translateZ(10px)' }}>
                    <span className="text-xs text-gray-300">{creationDate}</span>
                    <a href={item.src} download={`superdayz-${item.type}-${item.id}.png`} className="bg-white/20 text-white p-2 rounded-full hover:bg-white/30" aria-label="Download image">
                        <DownloadIcon className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </div>
    );
};

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ history }) => {
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredHistory = useMemo(() => {
        return history
            .filter(item => activeFilter === 'all' || item.type === activeFilter)
            .filter(item => {
                const term = searchTerm.toLowerCase();
                if (!term) return true;
                if (item.type === 'idea') {
                    return item.idea.title.toLowerCase().includes(term) || item.idea.description.toLowerCase().includes(term);
                }
                return item.prompt.toLowerCase().includes(term);
            });
    }, [history, activeFilter, searchTerm]);

    return (
        <main className="flex-grow container mx-auto p-4 md:p-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-white tracking-tight">Your Creative History</h1>
                <p className="mt-2 text-lg text-gray-400">Browse, search, and revisit all your generated content.</p>
            </div>

            {/* Controls */}
            <div className="sticky top-[70px] z-10 bg-black/50 backdrop-blur-lg py-4 mb-8 rounded-xl">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:max-w-xs">
                        <input
                            type="text"
                            placeholder="Search in history..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/20 border border-gray-600 rounded-full py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-400 focus:outline-none transition"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
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
            </div>

            {/* Gallery */}
            {filteredHistory.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredHistory.map((item, index) => <HistoryCard key={item.id} item={item} index={index} />)}
                </div>
            ) : (
                <div className="text-center py-16 bg-white/5 rounded-2xl border-2 border-dashed border-gray-700">
                    <HistoryIcon className="w-16 h-16 text-gray-600 mx-auto" />
                    <h3 className="mt-4 text-xl font-semibold text-gray-300">
                        {history.length > 0 ? 'No results found' : 'Your history is empty'}
                    </h3>
                    <p className="mt-1 text-gray-500">
                        {history.length > 0 ? 'Try adjusting your search or filters.' : 'Start creating something amazing to see it here!'}
                    </p>
                </div>
            )}
        </main>
    );
};