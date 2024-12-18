import React from 'react';
import { Agent } from './Agent';

export const Sidebar: React.FC = () => {
  return (
    <div className="w-64 h-full bg-gray-900/50 border-r border-purple-500/20 p-4">
      <h2 className="text-gray-200 font-semibold mb-6 px-2">Agents</h2>
      <Agent type="chat" icon="📄" label="Chat" />
      <Agent type="image" icon="🖼️" label="Image" />
      <Agent type="audio" icon="🎵" label="Audio" />
    </div>
  );
};