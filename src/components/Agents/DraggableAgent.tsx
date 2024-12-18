import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DraggableAgentProps {
  type: string;
  icon: LucideIcon;
  label: string;
}

export const DraggableAgent: React.FC<DraggableAgentProps> = ({
  type,
  icon: Icon,
  label,
}) => {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('application/reactflow', type);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      className="flex items-center gap-3 p-4 rounded-lg cursor-move
        bg-gradient-to-r from-purple-900/50 to-indigo-900/50
        hover:from-purple-800/60 hover:to-indigo-800/60
        border border-purple-500/20
        transform transition-all duration-200 hover:scale-105
        hover:shadow-lg hover:shadow-purple-500/10"
    >
      <Icon size={20} className="text-purple-400" />
      <span className="text-gray-200 font-medium">{label}</span>
    </div>
  );
};