import React from 'react';
import type { Template } from '../types';
import { Tooltip } from './Tooltip';

const templates: (Template & { tooltip: string })[] = [
  { id: 'tshirt', name: 'T-Shirt', src: 'https://images.unsplash.com/photo-1622470953784-05b38e03b036?q=80&w=800&auto-format&fit=crop', tooltip: 'A classic crewneck t-shirt.' },
  { id: 'phone', name: 'Phone', src: 'https://images.unsplash.com/photo-1604283818164-84d7f52a7810?q=80&w=800&auto-format&fit=crop', tooltip: 'A modern smartphone screen.' },
  { id: 'cup', name: 'Coffee Cup', src: 'https://images.unsplash.com/photo-1596701383389-322ab73082e6?q=80&w=800&auto-format&fit=crop', tooltip: 'A standard ceramic coffee mug.' },
  { id: 'tote', name: 'Tote Bag', src: 'https://images.unsplash.com/photo-1579065191937-2f3b8a5d3f7a?q=80&w=800&auto-format&fit=crop', tooltip: 'A simple canvas tote bag.' },
  { id: 'laptop', name: 'Laptop', src: 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?q=80&w=800&auto-format&fit=crop', tooltip: 'The screen of an open laptop.' },
  { id: 'billboard', name: 'Billboard', src: 'https://images.unsplash.com/photo-1521994138038-94b21401340f?q=80&w=800&auto-format&fit=crop', tooltip: 'A large outdoor billboard.' },
];

interface TemplateSelectorProps {
  selectedTemplate: Template | null;
  onSelect: (template: Template) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selectedTemplate, onSelect }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">Select a Template</label>
      <div className="grid grid-cols-3 gap-2">
        {templates.map((template) => (
          <Tooltip key={template.id} content={template.tooltip}>
            <button
              onClick={() => onSelect(template)}
              type="button"
              className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-200 focus:outline-none ring-offset-2 ring-offset-gray-900 focus:ring-2 ${
                selectedTemplate?.id === template.id
                  ? 'ring-2 ring-white'
                  : 'ring-1 ring-transparent hover:ring-gray-400'
              }`}
            >
              <img src={template.src} alt={template.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-2">
                <p className="text-white text-xs font-semibold">{template.name}</p>
              </div>
              {selectedTemplate?.id === template.id && (
                <div className="absolute inset-0 bg-white/20 flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};
