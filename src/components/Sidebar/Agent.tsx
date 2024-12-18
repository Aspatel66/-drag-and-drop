import React from 'react';
import { useDrag } from '../../context/DragContext';

interface AgentProps {
  type: 'chat' | 'image' | 'audio';
  icon: string;
  label: string;
}

export const Agent: React.FC<AgentProps> = ({ type, icon, label }) => {
  const { startDrag } = useDrag();

  return (
    <div
      draggable
      onDragStart={() => startDrag(type)}
      className="flex items-center gap-3 p-4 mb-3 rounded-lg cursor-move
        bg-gradient-to-r from-purple-900/50 to-indigo-900/50
        hover:from-purple-800/60 hover:to-indigo-800/60
        border border-purple-500/20
        transform transition-all duration-200 hover:scale-105
        hover:shadow-lg hover:shadow-purple-500/10"
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-gray-200 font-medium">{label}</span>
    </div>
  );
};