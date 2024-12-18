import { create } from 'zustand';
import { Node, Edge } from 'reactflow';

interface Agent {
  type: string;
  label: string;
  name: string;
  input: string;
  description: string;
}

interface WorkflowState {
  nodes: Map<string, Agent>;
  selectedAgents: Set<string>;
  flowNodes: Node[];
  flowEdges: Edge[];
  loadedWorkflowId: string | null;
  selectAgent: (id: string) => void;
  deselectAgent: (id: string) => void;
  clearSelectedAgents: () => void;
  updateNode: (id: string, data: Agent) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setLoadedWorkflow: (workflowId: string | null) => void;
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
  nodes: new Map(),
  selectedAgents: new Set(),
  flowNodes: [],
  flowEdges: [],
  loadedWorkflowId: null,
  
  selectAgent: (id) =>
    set((state) => ({
      selectedAgents: new Set(state.selectedAgents).add(id),
    })),
    
  deselectAgent: (id) =>
    set((state) => {
      const newSet = new Set(state.selectedAgents);
      newSet.delete(id);
      return { selectedAgents: newSet };
    }),
    
  clearSelectedAgents: () =>
    set(() => ({
      selectedAgents: new Set(),
    })),
    
  updateNode: (id: string, data: Agent) =>
    set((state) => {
      console.log('Updating node in store:', { id, data });
      const newNodes = new Map(state.nodes);
      newNodes.set(id, data);
      console.log('Updated store state:', {
        id,
        data,
        allNodes: Array.from(newNodes.entries())
      });
      return { nodes: newNodes };
    }),

  setNodes: (nodes: Node[]) =>
    set(() => ({
      flowNodes: nodes
    })),

  setEdges: (edges: Edge[]) =>
    set(() => ({
      flowEdges: edges
    })),

  setLoadedWorkflow: (workflowId: string | null) => set(() => ({
    loadedWorkflowId: workflowId
  }))
}));

export const { updateNode } = useWorkflowStore.getState();