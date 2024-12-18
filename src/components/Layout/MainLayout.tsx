import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { WorkflowCanvas } from '../Workspace/WorkflowCanvas';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { ReactFlowProvider } from 'reactflow'; 

export const MainLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={{ backgroundColor: 'rgba(21, 21, 21, 0.7)' }} className="min-h-screen text-white relative overflow-hidden">
      <div style={{ backgroundColor: 'rgba(21, 21, 21, 0.7)' }} className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
        from-purple-900/20 via-gray-900 to-gray-900 animate-gradient">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjRkZGIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjQiIGN5PSI0IiByPSIxIi8+PC9nPjwvc3ZnPg==')]
          opacity-20"></div>
      </div>

      <div className="relative z-10 flex h-screen">
        <div className={`transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'w-64' : 'w-0'
        } overflow-hidden`}>
          <Sidebar />
        </div>

        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="absolute left-0 top-4 z-50 p-2 bg-gray-800 rounded-r-lg 
            hover:bg-gray-700 transition-all duration-200 border-r border-t border-b border-purple-500/20
            group"
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="w-5 h-5 text-gray-400 group-hover:text-white" />
          ) : (
            <PanelLeftOpen className="w-5 h-5 text-gray-400 group-hover:text-white" />
          )}
        </button>

        <div className="flex-1 h-full">
          <ReactFlowProvider>
            <WorkflowCanvas />
          </ReactFlowProvider>
        </div>
      </div>
    </div>
  );
};