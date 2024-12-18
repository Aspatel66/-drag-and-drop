import { Node, Edge } from 'reactflow';


export interface Agent {
  id: string;
  type: 'chat' | 'image' | 'audio';
  name: string;
  input?: string;
  description?: string;
  isInputConnected?: boolean;
}

export interface Connection {
  id: string;
  source: string;
  target: string;
}

export interface WorkflowData {
  agents: Agent[];
  connections: Connection[];
  userId?: string;
  name?: string;
}

export interface WorkflowResponse {
  message: string;
  result: any;
}

export interface WorkflowState {
  selectedAgents: Set<string>;
  selectAgent: (id: string) => void;
  deselectAgent: (id: string) => void;
  clearSelectedAgents: () => void;
  updateAgent: (id: string, data: any) => void;
}


export interface LoadedWorkflow {
  nodes: Node[];
  edges: Edge[];
  id: string;
}


export interface SavedWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadWorkflow: (workflow: LoadedWorkflow) => void;
}


export interface SavedWorkflow {
  id: string;
  name: string;
  agents: Agent[];
  connections: Connection[];
  created_at: string;
  updated_at: string;
  userId: string;
}


