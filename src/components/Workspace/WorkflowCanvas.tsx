import React, { useCallback, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Panel,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Connection,
  addEdge,
  OnEdgesChange,
  EdgeChange,
  ReactFlowProvider,
  useReactFlow,
  NodeChange,
  MarkerType,
  EdgeTypes,
  BaseEdge,
  EdgeProps,
  Position,
  getBezierPath,
} from 'reactflow';
import { FolderOpen, Play, Save, Trash } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';
import { AgentNode } from './AgentNode';
import api from '../../services/api';
import { ResponseSidebar } from '../Layout/ResponseSidebar';
import SavedWorkflowsModal from '../Modals/SavedWorkflowsModal';
import SaveWorkflowModal from '../Modals/SaveWorkflowModal';
import { validateConnection, showConnectionError } from '../../utils/connectionValidation';
import 'reactflow/dist/style.css';

const BezierEdge = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition: sourcePosition || Position.Bottom,
    targetX,
    targetY,
    targetPosition: targetPosition || Position.Top,
  });

  return (
    <BaseEdge
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        ...style,
        strokeWidth: 3,
        stroke: '#8b5cf6',
        strokeDasharray: '5, 10',
      }}
    />
  );
};


const nodeTypes = {
  agent: AgentNode,
};

const edgeTypes: EdgeTypes = {
  bezier: BezierEdge,  
};

export const WorkflowCanvas: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { updateNode } = useWorkflowStore();
  const [error, setError] = useState<string | null>(null);
  const [isResponseOpen, setResponseOpen] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isWorkflowsModalOpen, setWorkflowsModalOpen] = useState(false);
  const [isSaveModalOpen, setSaveModalOpen] = useState(false);
  const { fitView } = useReactFlow();


  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    onNodesChange(changes);
  }, [onNodesChange]);


  const handleEdgesChange: OnEdgesChange = useCallback((changes: EdgeChange[]) => {
    changes.forEach(change => {
      if (change.type === 'remove') {
        const targetNode = nodes.find(node => {
          return edges.some(edge => 
            edge.id === change.id && edge.target === node.id
          );
        });

        if (targetNode) {
          const updatedData = {
            ...targetNode.data,
            isInputConnected: false,
            sourceNodeId: undefined,
            input: '',
          };

          setNodes(nds =>
            nds.map(node =>
              node.id === targetNode.id
                ? { ...node, data: updatedData }
                : node
            )
          );
          updateNode(targetNode.id, updatedData);
        }
      }
    });

    onEdgesChange(changes);
  }, [nodes, edges, setNodes, updateNode, onEdgesChange]);



  const getNodeOutput = (nodeId: string): string => {
    if (executionResult && executionResult.outputs) {
      const output = executionResult.outputs.find(
        (output: any) => output.agent.toLowerCase().includes(nodeId.toLowerCase())
      );
      if (output) {
        if (output.output_type === 'text') {
          return output.output;
        }
        return '';
      }
    }
    return '';
  };



  const onConnect = useCallback((params: Connection) => {
    if (!params.source || !params.target) return;

    const sourceNode = nodes.find(n => n.id === params.source);
    const targetNode = nodes.find(n => n.id === params.target);

    if (!sourceNode || !targetNode) return;

    const validation = validateConnection(
      sourceNode.data.type,
      targetNode.data.type
    );

    if (!validation.isValid) {
      showConnectionError(validation.message);
      return;
    }

    const edge: Edge = {
      id: `edge-${params.source}-${params.target}`,
      source: params.source,
      target: params.target,
      animated: true,
      style: {
        strokeWidth: 3,
        stroke: '#8b5cf6',
        strokeDasharray: '5, 10',
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#8b5cf6',
      },
    };

    setEdges((eds) => addEdge(edge, eds));
    


    const sourceOutput = getNodeOutput(params.source);
   
    const updatedData = {
      ...targetNode.data,
      isInputConnected: true,
      sourceNodeId: params.source,
      input: sourceOutput
    };

    setNodes(nds =>
      nds.map(node =>
        node.id === params.target
          ? { ...node, data: updatedData }
          : node
      )
    );
    updateNode(params.target, updatedData);

  }, [nodes, setNodes, setEdges, updateNode]);



  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      const reactFlowBounds = document.querySelector('.react-flow')?.getBoundingClientRect();
      const position = reactFlowBounds 
        ? {
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
          }
        : { x: event.clientX - 200, y: event.clientY - 40 };

      const newNode = {
        id: `${type}-${Date.now()}`,
        type: 'agent',
        position,
        data: {
          type,
          label: `${type.charAt(0).toUpperCase() + type.slice(1)} Agent`,
          name: `${type.charAt(0).toUpperCase() + type.slice(1)} Agent`,
          input: '',
          description: '',
          isInputConnected: false,
          sourceNodeId: null
        },
      };

      setNodes((nds) => nds.concat(newNode));
      updateNode(newNode.id, newNode.data);
    },
    [setNodes, updateNode]
  );



  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  


  const handleRunWorkflow = async () => {
    try {
      setLoading(true);
      setError(null);
      setExecutionResult(null);
      setResponseOpen(true);

      const connections = edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target
      }));

      const workflowData = {
        agents: nodes.map(node => {
          const nodeData = useWorkflowStore.getState().nodes.get(node.id) || node.data;
          const isTarget = connections.some(conn => conn.target === node.id);
          const sourceNode = isTarget 
            ? connections.find(conn => conn.target === node.id)?.source 
            : undefined;

          return {
            id: node.id,
            type: nodeData.type,
            name: nodeData.name,
            input: nodeData.input || '',
            description: nodeData.description || '',
            speaker: nodeData.speaker || 'mercury_jane@hopeful',
            isConnected: isTarget,
            sourceNodeId: sourceNode
          };
        }),
        connections
      };

      const response = await api.executeWorkflow(workflowData);
      setExecutionResult(response);


      edges.forEach(edge => {
        const targetNode = nodes.find(n => n.id === edge.target);
        const sourceOutput = getNodeOutput(edge.source);
        
        if (targetNode && sourceOutput) {
          const updatedData = {
            ...targetNode.data,
            input: sourceOutput
          };
          updateNode(targetNode.id, updatedData);
        }
      });

    } catch (err) {
      console.error('Error executing workflow:', err);
      setExecutionError(err instanceof Error ? err.message : 'Failed to execute workflow');
    } finally {
      setLoading(false);
    }
  };



  const handleSaveWorkflow = async (workflowName: string) => {
    try {
      setLoading(true);
      setError(null);

      const nodesData = useWorkflowStore.getState().nodes;
      const workflowData = {
        name: workflowName,
        agents: nodes.map(node => {
          const nodeData = nodesData.get(node.id) || node.data;
          return {
            id: node.id,
            type: nodeData.type,
            name: nodeData.name,
            input: nodeData.input || '',
            description: nodeData.description || '',
            speaker: nodeData.speaker || 'mercury_jane@hopeful',
            position: node.position
          };
        }),
        connections: edges.map(edge => ({
          id: edge.id,
          source: edge.source,
          target: edge.target
        })),
        executionResults: executionResult?.outputs || []
      };

      await api.saveWorkflow(workflowData);
      setSaveModalOpen(false);
    } catch (err) {
      console.error('Error saving workflow:', err);
      setError(err instanceof Error ? err.message : 'Failed to save workflow');
    } finally {
      setLoading(false);
    }
  };




  const handleLoadWorkflow = useCallback((workflow: any) => {
    try {
      setNodes([]);
      setEdges([]);
      const transformedNodes: Node[] = workflow.agents.map((agent: any) => ({
        id: agent.id,
        type: 'agent',
        position: agent.position || { x: Math.random() * 500, y: Math.random() * 300 },
        data: {
          type: agent.type,
          label: agent.name,
          name: agent.name,
          input: agent.input || '',
          description: agent.description || '',
          speaker: agent.speaker || 'mercury_jane@hopeful',
          isInputConnected: false
        }
      }));

      const transformedEdges: Edge[] = workflow.connections.map((conn: any) => ({
        id: conn.id,
        source: conn.source,
        target: conn.target,
        animated: true,
        style: {
          strokeWidth: 3,
          stroke: '#8b5cf6',
          strokeDasharray: '5, 10',
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#8b5cf6',
        },
      }));

      setNodes(transformedNodes);
      setEdges(transformedEdges);

      transformedNodes.forEach(node => {
        updateNode(node.id, node.data);
      });

      if (workflow.executionResults && workflow.executionResults.length > 0) {
        setExecutionResult({
          success: true,
          outputs: workflow.executionResults
        });
        setResponseOpen(true);
      }

      fitView({ padding: 0.2 });
      setWorkflowsModalOpen(false);

    } catch (err) {
      console.error('Error loading workflow:', err);
      setError(err instanceof Error ? err.message : 'Failed to load workflow');
    }
  }, [setNodes, setEdges, updateNode, fitView]);

  const handleClearCanvas = () => {
      setNodes([]);
      setEdges([]);
      setError(null);
      setExecutionResult(null);
      setExecutionError(null);
  };

  return (
    <div className="flex-1 h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes} 
        defaultEdgeOptions={{
          animated: true,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#8b5cf6',
          },
          style: {
            strokeWidth: 3,
            stroke: '#8b5cf6',
            strokeDasharray: '5, 10',
          },
        }}
        fitView
      >
        <Background />
        <Controls position="bottom-right" className="flex" />
        
        <Panel position="top-right" className="space-x-2 flex">
          <button
            onClick={() => setWorkflowsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-md
              bg-purple-600/20 hover:bg-purple-600/30 text-purple-400
              transition-all duration-200"
          >
            <FolderOpen size={20} />
            My Workflows
          </button>

          <button 
            onClick={handleRunWorkflow}
            disabled={loading || nodes.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-md
              bg-green-600/20 hover:bg-green-600/30 text-green-400
              transition-all duration-200 disabled:opacity-50"
          >
            <Play size={20} />
            {loading ? 'Running...' : 'Run Workflow'}
          </button>

          <button 
            onClick={() => setSaveModalOpen(true)}
            disabled={loading || nodes.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-md
              bg-purple-600/20 hover:bg-purple-600/30 text-purple-400
              transition-all duration-200 disabled:opacity-50"
          >
            <Save size={20} />
            Save Workflow
          </button>

          <button
            onClick={handleClearCanvas}
            disabled={loading || nodes.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-md
              bg-red-600/20 hover:bg-red-600/30 text-red-400
              transition-all duration-200 disabled:opacity-50"
          >
            <Trash size={20} />
            Clear Canvas
          </button>
        </Panel>
      </ReactFlow>

      <SavedWorkflowsModal
        isOpen={isWorkflowsModalOpen}
        onClose={() => setWorkflowsModalOpen(false)}
        onLoadWorkflow={handleLoadWorkflow}
      />

      <SaveWorkflowModal
        isOpen={isSaveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        onSave={handleSaveWorkflow}
        loading={loading}
      />

      <ResponseSidebar
        isOpen={isResponseOpen}
        onClose={() => setResponseOpen(false)}
        loading={loading}
        result={executionResult}
        error={executionError}
      />

      {error && (
        <div className="absolute bottom-4 right-4 bg-red-500/10 text-red-400 px-4 py-2 rounded-lg
          border border-red-500/20 shadow-lg animate-fadeIn"
        >
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-3 hover:text-red-300 transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center 
          justify-center z-50"
        >
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-purple-500/20
            animate-pulse"
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent
                rounded-full animate-spin"
              />
              <span className="text-purple-400 font-medium">
                Processing Workflow...
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const WorkflowCanvasWrapper: React.FC = () => (
  <ReactFlowProvider>
    <WorkflowCanvas />
  </ReactFlowProvider>
);

export default WorkflowCanvasWrapper;