import React from 'react';
import { AdSlotProps } from '../types';

export const AdPlaceholder: React.FC<AdSlotProps> = ({ format = 'auto', className = '' }) => {
  // In a real production environment, this would be the <ins> tag provided by AdSense.
  // For this codebase, we provide a styled placeholder that mimics an ad slot.
  // AdSense policy requires clearly labeling ads if they blend in too much, though standard display ads are usually obvious.
  
  return (
    <div className={`w-full my-8 flex flex-col items-center justify-center ${className}`}>
      <div className="text-xs text-gray-400 uppercase tracking-widest mb-2">Advertisement</div>
      <div 
        className={`bg-gray-100 border border-gray-200 rounded-md flex items-center justify-center text-gray-400
          ${format === 'rectangle' ? 'w-[300px] h-[250px]' : 'w-full max-w-4xl h-[100px]'}
        `}
      >
        <span className="font-mono text-sm">AdSpace ({format})</span>
      </div>
    </div>
  );
};