import React, { createContext, useContext, useState } from 'react';

interface DragContextType {
  draggedType: string | null;
  isOver: boolean;
  startDrag: (type: string) => void;
  setIsOver: (value: boolean) => void;
  handleDrop: (onDrop: (type: string) => void) => void;
}

const DragContext = createContext<DragContextType | undefined>(undefined);

export const DragProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [draggedType, setDraggedType] = useState<string | null>(null);
  const [isOver, setIsOver] = useState(false);

  const startDrag = (type: string) => {
    setDraggedType(type);
  };

  const handleDrop = (onDrop: (type: string) => void) => {
    if (draggedType) {
      onDrop(draggedType);
    }
    setDraggedType(null);
  };

  return (
    <DragContext.Provider value={{
      draggedType,
      isOver,
      startDrag,
      setIsOver,
      handleDrop,
    }}>
      {children}
    </DragContext.Provider>
  );
};

export const useDrag = () => {
  const context = useContext(DragContext);
  if (!context) {
    throw new Error('useDrag must be used within a DragProvider');
  }
  return context;
};