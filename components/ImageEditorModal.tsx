import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CheckIcon } from './icons/CheckIcon';

interface ImageEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (base64Image: string) => void;
  imageSrc: string | null;
}

interface FilterState {
  brightness: number;
  contrast: number;
  saturate: number;
  grayscale: number;
  sepia: number;
}

const INITIAL_FILTERS: FilterState = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  grayscale: 0,
  sepia: 0,
};

export const ImageEditorModal: React.FC<ImageEditorModalProps> = ({ isOpen, onClose, onSave, imageSrc }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const applyFilters = useCallback(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.filter = `
      brightness(${filters.brightness}%) 
      contrast(${filters.contrast}%) 
      saturate(${filters.saturate}%) 
      grayscale(${filters.grayscale}%)
      sepia(${filters.sepia}%)
    `;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  }, [filters]);

  useEffect(() => {
    if (isOpen && imageSrc) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        imageRef.current = img;
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = img.width;
          canvas.height = img.height;
          // Apply filters only after image is loaded and canvas is sized
          applyFilters();
        }
      };
      img.src = imageSrc;
    } else {
      setFilters(INITIAL_FILTERS);
    }
  }, [isOpen, imageSrc, applyFilters]);

  useEffect(() => {
    if (isOpen) {
      applyFilters();
    }
  }, [filters, isOpen, applyFilters]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);
  
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };
  
  const handleSave = () => {
    const canvas = canvasRef.current;
    if (canvas) {
        onSave(canvas.toDataURL('image/jpeg', 0.9));
        handleClose();
    }
  };
  
  const handleFilterChange = (filterName: keyof FilterState, value: number) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };
  
  const applyPreset = (preset: 'grayscale' | 'sepia' | 'reset') => {
    if (preset === 'reset') {
        setFilters(INITIAL_FILTERS);
    } else {
        setFilters({
            ...INITIAL_FILTERS,
            [preset]: 100
        });
    }
  };

  if (!isOpen && !isClosing) return null;
  if (!imageSrc) return null;

  const Slider: React.FC<{ label: string; value: number; onChange: (val: number) => void; min?: number; max?: number; }> = ({ label, value, onChange, min = 0, max = 200 }) => (
    <div className="flex flex-col">
        <div className="flex justify-between items-center text-sm">
            <label className="font-medium text-slate-300">{label}</label>
            <span className="text-slate-400">{value}</span>
        </div>
        <input type="range" min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
    </div>
  );

  return (
    <div className={`fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-8 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`} onClick={handleClose}>
        <div className={`w-full max-w-6xl h-full max-h-[90vh] flex flex-col md:flex-row gap-8 ${isClosing ? 'animate-scale-out' : 'animate-scale-in'}`} onClick={e => e.stopPropagation()}>
            {/* Image Preview */}
            <div className="flex-grow flex items-center justify-center bg-black/30 rounded-lg overflow-hidden p-2">
                <canvas ref={canvasRef} className="max-w-full max-h-full object-contain" />
            </div>

            {/* Controls Panel */}
            <div className="w-full md:w-80 flex-shrink-0 bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-lg p-6 flex flex-col">
                <h2 className="text-2xl font-bold text-white mb-6">Image Editor</h2>
                <div className="space-y-6 flex-grow overflow-y-auto pr-2">
                    <Slider label="Brightness" value={filters.brightness} onChange={v => handleFilterChange('brightness', v)} />
                    <Slider label="Contrast" value={filters.contrast} onChange={v => handleFilterChange('contrast', v)} />
                    <Slider label="Saturation" value={filters.saturate} onChange={v => handleFilterChange('saturate', v)} />
                    
                    <div>
                        <label className="block font-medium text-slate-300 text-sm mb-2">Filters</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => applyPreset('grayscale')} className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-3 rounded-lg text-sm transition-colors">Grayscale</button>
                            <button onClick={() => applyPreset('sepia')} className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-3 rounded-lg text-sm transition-colors">Sepia</button>
                        </div>
                        <button onClick={() => applyPreset('reset')} className="w-full mt-2 bg-white/5 hover:bg-white/10 text-white font-semibold py-2 px-3 rounded-lg text-sm transition-colors">Reset All</button>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10 flex flex-col gap-3">
                    <button onClick={handleSave} className="w-full flex items-center justify-center gap-2 font-bold py-3 px-4 rounded-lg text-gray-900 bg-white hover:bg-gray-200 transition-colors btn-bounce">
                        <CheckIcon className="w-5 h-5" />
                        Save as New Copy
                    </button>
                    <button onClick={handleClose} className="w-full font-semibold py-2 px-4 rounded-lg text-white bg-transparent hover:bg-white/10 transition-colors">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};