import React from 'react';
import { useDrag } from '../../context/DragContext';

interface DropZoneProps {
  onDrop: (type: string) => void;
}

export const DropZone: React.FC<DropZoneProps> = ({ onDrop }) => {
  const { isOver, setIsOver, handleDrop } = useDrag();

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        handleDrop(onDrop);
        setIsOver(false);
      }}
      className={`flex-1 m-8 rounded-lg border-2 border-dashed
        ${isOver ? 'border-purple-400 bg-purple-900/20' : 'border-gray-600 bg-gray-900/20'}
        transition-all duration-300 flex items-center justify-center
        min-h-[400px]`}
    >
      <div className="text-center p-8">
        <p className="text-gray-400 text-lg">
          Drag and drop agents here
        </p>
        <div className="mt-4 animate-pulse">
          <span className="text-3xl">⬇️</span>
        </div>
      </div>
    </div>
  );
};