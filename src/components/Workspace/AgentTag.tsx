import React from 'react';
import { X } from 'lucide-react';

interface Agent {
  type: 'chat' | 'image' | 'audio';
  timestamp: number;
}

interface AgentTagProps {
  agent: Agent;
  isSelected: boolean;
  isChecked: boolean;
  onClick: () => void;
  onSelect: () => void;
  onDelete: () => void;
}

const agentIcons = {
  chat: '📄',
  image: '🖼️',
  audio: '🎵'
};

const agentLabels = {
  chat: 'Chat',
  image: 'Image',
  audio: 'Audio'
};

export const AgentTag: React.FC<AgentTagProps> = ({ 
  agent, 
  isSelected, 
  isChecked,
  onClick, 
  onSelect,
  onDelete 
}) => {
  return (
    <div
      className={`group flex items-center justify-between gap-2 p-2 rounded-md
        transition-all duration-200 hover:bg-purple-800/30
        ${isSelected ? 'bg-purple-800/40 border-purple-400/40' : 'bg-purple-900/30 border-purple-500/20'}
        border transform hover:scale-[1.02]`}
    >
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className="w-4 h-4 rounded border-gray-600 text-purple-500 
            focus:ring-purple-500 focus:ring-offset-0 focus:ring-offset-transparent
            bg-gray-800/50 cursor-pointer"
        />
        <div
          onClick={onClick}
          className="flex items-center gap-2 flex-1 cursor-pointer"
        >
          <span className="text-lg">{agentIcons[agent.type]}</span>
          <span className="text-sm text-gray-300">{agentLabels[agent.type]}</span>
        </div>
      </div>
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="opacity-1 group-hover:opacity-100 p-1 hover:bg-red-500/20 
          rounded transition-all duration-200 text-red-400 hover:text-red-300"
        title="Delete agent"
      >
        <X size={16} />
      </button>
    </div>
  );
};