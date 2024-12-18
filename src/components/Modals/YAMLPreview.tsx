import React from 'react';
import { X } from 'lucide-react';
import yaml from 'js-yaml';

interface YAMLPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  id: string;
}

export const YAMLPreview: React.FC<YAMLPreviewProps> = ({ isOpen, onClose, data, id }) => {
  if (!isOpen) return null;

  const yamlData = yaml.dump({
    id,
    ...data,
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">YAML Preview</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>
        <pre className="p-6 text-gray-300 whitespace-pre-wrap font-mono text-sm">
          {yamlData}
        </pre>
      </div>
    </div>
  );
};