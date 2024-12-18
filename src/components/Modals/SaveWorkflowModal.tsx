import React, { useState } from 'react';
import { X } from 'lucide-react';

interface SaveWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  loading?: boolean;
}

const SaveWorkflowModal: React.FC<SaveWorkflowModalProps> = ({
  isOpen,
  onClose,
  onSave,
  loading = false
}) => {
  const [workflowName, setWorkflowName] = useState('');
  
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (workflowName.trim()) {
      onSave(workflowName.trim());
      setWorkflowName('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      
      <div 
        className="absolute inset-0 canvas-overlay"
        onClick={onClose}
      />
      
      
      <div className="relative m-auto w-full max-w-md bg-gray-900 rounded-xl border border-purple-500/20 shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Save Workflow</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Workflow Name
              </label>
              <input
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="w-full bg-gray-800/50 border border-purple-500/20 rounded-lg px-4 py-3
                  text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter a name for your workflow"
                required
                disabled={loading}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700
                  transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700
                  transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !workflowName.trim()}
              >
                {loading ? 'Saving...' : 'Save Workflow'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SaveWorkflowModal;