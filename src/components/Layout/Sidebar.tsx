import React, { useState } from 'react';
import { Brain, Image, Mic, Settings, HelpCircle, LogOut } from 'lucide-react';
import { DraggableAgent } from '../Agents/DraggableAgent';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth';
import SavedWorkflowsModal from '../Modals/SavedWorkflowsModal';
import { useWorkflowStore } from '../../store/workflowStore';
import SettingsModal from '../Modals/SettingsModal';
import HelpModal from '../Modals/HelpModel';


const agents = [
  { type: 'chat', icon: Brain, label: 'Chat Agent' },
  { type: 'image', icon: Image, label: 'Image Agent' },
  { type: 'audio', icon: Mic, label: 'Audio Agent' },
];

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [isWorkflowsModalOpen, setWorkflowsModalOpen] = useState(false);
  const { setNodes, setEdges } = useWorkflowStore();
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isHelpOpen, setHelpOpen] = useState(false);



  const handleLogout = async () => {
    try {
      localStorage.clear();
      await authService.logout();
      navigate('/auth', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/auth', { replace: true });
    }
  };


  

  const handleLoadWorkflow = (transformedData: any) => {
    try {
      if (!transformedData.nodes || !transformedData.edges) {
        console.error('Invalid transformed data structure:', transformedData);
        return;
      }

      setNodes(transformedData.nodes);
      setEdges(transformedData.edges);
      setWorkflowsModalOpen(false);
    } catch (error) {
      console.error('Error in handleLoadWorkflow:', error);
    }
  };
  



  return (
    <div className="w-64 h-full border-r border-purple-500/20 flex flex-col">
      <div className="p-5 pl-12 border-b border-purple-500/20">
        <h1 className="text-xl font-bold text-white">Available Agents</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="text-sm font-semibold text-gray-400 mb-4">Agents</h2>
        <div className="space-y-2">
          {agents.map((agent) => (
            <DraggableAgent key={agent.type} {...agent} />
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-purple-500/20">
        <nav className="space-y-2">
          <button 
            onClick={() => setSettingsOpen(true)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg
              text-gray-400 hover:text-white hover:bg-purple-500/20 transition-all"
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
          <button 
            onClick={() => setHelpOpen(true)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg
              text-gray-400 hover:text-white hover:bg-purple-500/20 transition-all"
          >
            <HelpCircle size={20} />
            <span>Help</span>
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg
              text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </nav>
      </div>

      <SavedWorkflowsModal
        isOpen={isWorkflowsModalOpen}
        onClose={() => setWorkflowsModalOpen(false)}
        onLoadWorkflow={handleLoadWorkflow}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setHelpOpen(false)}
      />
    </div>
  );
};