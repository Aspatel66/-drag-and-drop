import React from 'react';
import { X } from 'lucide-react';

interface MindmapViewProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

export const MindmapView: React.FC<MindmapViewProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Mindmap View</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>
        <div className="p-6">
          <div className="bg-gray-900 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">{data.name}</h3>
            <div className="space-y-4">
              {Object.entries(data).map(([key, value]) => (
                key !== 'name' && (
                  <div key={key} className="flex items-start">
                    <div className="w-32 text-purple-400 font-medium">{key}:</div>
                    <div className="flex-1 text-gray-300">{String(value)}</div>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
