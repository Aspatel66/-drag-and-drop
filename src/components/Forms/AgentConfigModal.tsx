import React from 'react';
import { X } from 'lucide-react';

interface AgentConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

export const AgentConfigModal: React.FC<AgentConfigModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-800 p-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Configure Agent</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              defaultValue={initialData?.name}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5
                text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              placeholder="Enter agent name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Output
            </label>
          </div>
          
        </form>
      </div>
    </div>
  );
};