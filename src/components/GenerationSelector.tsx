import React from 'react';
import { Image, Type, Video } from 'lucide-react';

interface GenerationSelectorProps {
  selectedMode: 'image-to-image' | 'text-to-image' | 'image-to-video';
  onModeSelect: (mode: 'image-to-image' | 'text-to-image' | 'image-to-video') => void;
}

export const GenerationSelector: React.FC<GenerationSelectorProps> = ({ selectedMode, onModeSelect }) => {
  const modes = [
    {
      id: 'image-to-image' as const,
      label: 'Image to Image',
      description: 'Transform existing images',
      icon: Image,
    },
    {
      id: 'text-to-image' as const,
      label: 'Text to Image',
      description: 'Generate from text prompts',
      icon: Type,
    },
    {
      id: 'image-to-video' as const,
      label: 'Image to Video',
      description: 'Create videos from images',
      icon: Video,
    },
  ];

  return (
    <div className="flex justify-center">
      <div className="flex space-x-4">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isSelected = selectedMode === mode.id;
          
          return (
            <button
              key={mode.id}
              onClick={() => onModeSelect(mode.id)}
              className={`group relative flex flex-col items-center p-6 rounded-xl border-2 transition-all duration-300 min-w-[160px] ${
                isSelected
                  ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                  : 'border-gray-700 bg-gray-900/50 hover:border-gray-600 hover:bg-gray-800/50'
              }`}
            >
              <div className={`p-3 rounded-lg mb-3 transition-colors duration-200 ${
                isSelected 
                  ? 'bg-blue-500/20 text-blue-400' 
                  : 'bg-gray-800 text-gray-400 group-hover:text-gray-300'
              }`}>
                <Icon size={24} />
              </div>
              
              <h3 className={`font-semibold text-sm mb-1 transition-colors duration-200 ${
                isSelected ? 'text-blue-400' : 'text-gray-300'
              }`}>
                {mode.label}
              </h3>
              
              <p className={`text-xs text-center transition-colors duration-200 ${
                isSelected ? 'text-blue-300/80' : 'text-gray-500'
              }`}>
                {mode.description}
              </p>

              {isSelected && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};