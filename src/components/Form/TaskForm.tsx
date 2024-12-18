import React from 'react';

interface Agent {
  type: 'chat' | 'image' | 'audio';
  timestamp: number;
}

interface TaskFormProps {
  agent: Agent;
  onSubmit: () => void;
  onCancel: () => void;
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

export const TaskForm: React.FC<TaskFormProps> = ({ agent, onSubmit }) => {
  return (
    <div className="animate-fadeIn w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">{agentIcons[agent.type]}</span>
        <h2 className="text-xl font-semibold text-gray-200">{agentLabels[agent.type]} Agent</h2>
      </div>

      <form onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }} className="space-y-6 bg-gray-800/30 p-6 rounded-lg border border-purple-500/20">
        <div>
          <label className="block text-gray-300 mb-2">Task Name</label>
          <input
            type="text"
            className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg
              p-3 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent
              transition-all duration-200"
            placeholder="Enter task name..."
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Output</label>
        </div>

      </form>
    </div>
  );
};