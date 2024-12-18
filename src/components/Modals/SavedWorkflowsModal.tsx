import React, { useState, useEffect } from 'react';
import { X, PlayCircle, Trash2, Loader, FolderOpen } from 'lucide-react';
import api from '../../services/api';
// import { Edge, Node } from 'reactflow';

interface SavedWorkflowsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadWorkflow: (workflow: any) => void;
}

const SavedWorkflowsModal: React.FC<SavedWorkflowsModalProps> = ({
  isOpen,
  onClose,
  onLoadWorkflow
}) => {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchWorkflows();
    }
  }, [isOpen]);

  // const transformWorkflowToNodes = (workflow: any) => {
  //   if (!workflow?.agents) return { nodes: [], edges: [] };
  
  //   const nodes: Node[] = workflow.agents.map((agent: any) => ({
  //     id: agent.id,
  //     type: 'agent',
  //     position: agent.position || { x: 100, y: 100 },
  //     data: {
  //       type: agent.type,
  //       label: agent.name,
  //       name: agent.name,
  //       input: agent.input || '',
  //       description: agent.description || '',
  //       isInputConnected: false
  //     },
  //     sourcePosition: 'bottom',
  //     targetPosition: 'top',
  //   }));
  
  //   const edges: Edge[] = (workflow.connections || []).map((conn: any) => ({
  //     id: conn.id || `edge-${conn.source}-${conn.target}`,
  //     source: conn.source,
  //     target: conn.target,
  //     sourceHandle: `${conn.source}-source`, 
  //     targetHandle: `${conn.target}-target`,
  //     type: 'smoothstep',
  //     animated: true,
  //     style: { stroke: '#6366f1' }
  //   }));
  
  //   return { nodes, edges };
  // };

  const fetchWorkflows = async () => {
    try {
        setLoading(true);
        setError(null);
        const response = await api.getWorkflows();
        
        if (response && response.data) {
            const workflows = Array.isArray(response.data) 
            ? response.data 
            : response.data.data || [];
            setWorkflows(workflows);
        } 
        else {
            setError('Invalid response format from server');
            console.error('Invalid response format:', response);
        }
        } catch (err) {
            console.error('Error loading workflows:', err);
            setError(err instanceof Error ? err.message : 'Failed to load workflows');
        } finally {
            setLoading(false);
        }
    };

  const handleDeleteWorkflow = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this workflow?')) {
      try {
        await api.deleteWorkflow(id);
        fetchWorkflows();
      } catch (err) {
        console.error('Error deleting workflow:', err);
      }
    }
  };

  if (!isOpen) return null;




  return (
    <div className="fixed inset-0 z-50 flex">
     
      <div 
        className="absolute inset-0 canvas-overlay"
        onClick={onClose}
      />
      
      
      <div className="relative ml-auto w-[600px] h-full bg-gray-900 shadow-2xl slide-in-right">
       
        <div className="absolute top-0 left-0 right-0 px-6 py-4 bg-gray-900 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FolderOpen className="w-6 h-6 text-purple-500" />
            <h2 className="text-xl font-semibold text-white">Saved Workflows</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

       
        <div className="h-full pt-20 pb-6 px-6 overflow-y-auto modern-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-red-400 text-center py-8">{error}</div>
          ) : workflows.length === 0 ? (
            <div className="text-gray-400 text-center py-8">
              No saved workflows found
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {workflows.map((workflow) => (
                <div
                  key={workflow.id}
                  className="bg-gray-800/50 rounded-xl overflow-hidden transform transition-all duration-300
                    hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10 border border-purple-500/20
                    p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">
                        {workflow.name}
                      </h3>
                      <div className="text-sm text-gray-400 space-y-1">
                        <p>Created: {new Date(workflow.created_at).toLocaleDateString()}</p>
                        {workflow.updated_at && (
                          <p>Updated: {new Date(workflow.updated_at).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onLoadWorkflow(workflow)}
                        className="p-2 hover:bg-purple-600/20 rounded-lg transition-colors duration-300
                          text-purple-400 hover:text-purple-300 group flex items-center gap-2"
                        title="Load workflow"
                      >
                        <PlayCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Load</span>
                      </button>
                      <button
                        onClick={() => handleDeleteWorkflow(workflow.id)}
                        className="p-2 hover:bg-red-600/20 rounded-lg transition-colors duration-300
                          text-red-400 hover:text-red-300 group flex items-center gap-2"
                        title="Delete workflow"
                      >
                        <Trash2 className="w-5 h-5" />
                        <span className="text-sm font-medium">Delete</span>
                      </button>
                    </div>
                  </div>

                  
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {workflow.agents.map((agent: any, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs
                            font-medium bg-purple-900/50 text-purple-300 border border-purple-500/30"
                        >
                          {agent.type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedWorkflowsModal;