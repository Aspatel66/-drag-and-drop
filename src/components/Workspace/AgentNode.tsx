import { memo, useState, useCallback, useEffect } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { 
  Brain, 
  Image, 
  Mic, 
  ChevronDown, 
  ChevronUp, 
  FileJson, 
  Workflow,
  Trash2
} from 'lucide-react';
import { YAMLPreview } from '../Modals/YAMLPreview';
import { MindmapView } from '../Mindmap/MindmapView';
import { useWorkflowStore } from '../../store/workflowStore';

interface AgentData {
  type: 'chat' | 'image' | 'audio';
  label: string;
  name: string;
  input: string;
  description: string;
  isInputConnected?: boolean;
  sourceNodeId?: string;
  speaker?: string;
}

interface AgentNodeProps {
  data: AgentData;
  id: string;
}

const icons = {
  chat: Brain,
  image: Image,
  audio: Mic,
};

export const AgentNode = memo(({ data, id }: AgentNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showYAML, setShowYAML] = useState(false);
  const [showMindmap, setShowMindmap] = useState(false);
  const updateNode = useWorkflowStore(state => state.updateNode);
  const { deleteElements } = useReactFlow();

  const Icon = icons[data.type];
  const handleWidth = 24;
  const handleHeight = 24;
  const topHandlePosition = {
    x: handleWidth - 7,
    y: handleHeight * 4.85
  };
  const bottomHandlePosition = {
    x: `calc(97.5% + ${handleHeight - 30}px)`,
    y: `calc(100% - ${handleHeight + 48}px)`,
  };

  const [formData, setFormData] = useState<AgentData>({
    type: data.type,
    label: data.label,
    name: data.name || '',
    input: data.input || '',
    description: data.description || '',
    isInputConnected: data.isInputConnected || false,
    sourceNodeId: data.sourceNodeId,
    speaker: data.speaker || 'mercury_jane@hopeful'
  });

  useEffect(() => {
    updateNode(id,formData);
  }, [id, formData, updateNode]);

  const handleInputChange = useCallback((field: keyof AgentData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleDelete = useCallback(() => {
    deleteElements({ nodes: [{ id }] });
  }, [deleteElements, id]);

  const audioVoiceOptions = [
    { value: "mercury_jane@hopeful", label: "Mercury Jane (Default)" },
    { value: "james_casual@hopeful", label: "James (Casual)" },
    { value: "sarah_professional@hopeful", label: "Sarah (Professional)" },
    { value: "michael_news@hopeful", label: "Michael (News)" },
    { value: "emma_storyteller@hopeful", label: "Emma (Storyteller)" }
  ];

  return (
    <>
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl border border-purple-600/20 min-w-[500px] transform transition-all duration-300 hover:scale-[1.02] hover:shadow-purple-500/20">
        <div className="p-10">

          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-4">
              <div className="p-1 bg-purple-600/10 rounded-full">
                <Icon size={40} className="text-purple-500" />
              </div>
              <label className="bg-transparent text-2xl font-bold text-white border-b-2 border-transparent focus:border-purple-500 transition-colors duration-300 outline-none">
                {formData.name}
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDelete}
                className="p-2 bg-red-800/20 rounded-full hover:bg-red-600/20 transition-colors group"
                title="Delete agent"
              >
                <Trash2 size={24} className="text-red-400 group-hover:text-red-300" />
              </button>
              <button
                onClick={() => setShowYAML(true)}
                className="p-2 bg-gray-800 rounded-full hover:bg-purple-600/20 transition-colors group"
              >
                <FileJson size={24} className="text-purple-400 group-hover:text-purple-300" />
              </button>
              <button
                onClick={() => setShowMindmap(true)}
                className="p-2 bg-gray-800 rounded-full hover:bg-purple-600/20 transition-colors group"
              >
                <Workflow size={24} className="text-purple-400 group-hover:text-purple-300" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 bg-gray-800 rounded-full hover:bg-purple-600/20 transition-colors group"
              >
                {isExpanded ? (
                  <ChevronUp size={24} className="text-purple-400 group-hover:text-purple-300" />
                ) : (
                  <ChevronDown size={24} className="text-purple-400 group-hover:text-purple-300" />
                )}
              </button>
            </div>
          </div>

          {isExpanded && (
            <div className="space-y-7 pt-5 border-t border-gray-700/30">

              <div className="space-y-3">
                <label className="block text-md font-bold text-gray-300 uppercase tracking-wider ml-2">
                  Input
                </label>
                {data.isInputConnected && (
                  <span className="float-right text-xs text-red-400">Connected</span>
                )}
                <Handle
                  type="target"
                  position={Position.Top}
                  id={`${id}-target`}
                  style={{
                    left: topHandlePosition.x,
                    top: topHandlePosition.y,
                    width: handleWidth,
                    height: handleHeight,
                  }}
                  className="absolute !bg-purple-600 rounded-full opacity-50 hover:opacity-100 hover:scale-125 transition-all duration-300"
                />
                <input
                  type="text"
                  value={formData.input}
                  onChange={(e) => !data.isInputConnected && handleInputChange('input', e.target.value)}
                  disabled={data.isInputConnected}
                  className={`w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-4
                    text-md placeholder-gray-500 focus:outline-none 
                    focus:ring-2 focus:ring-purple-500/50
                    ${data.isInputConnected ? 'opacity-50 cursor-not-allowed text-gray-400' : 'text-white'}`}
                  placeholder={data.isInputConnected 
                    ? "Input Is Connected To The Previous Agent's Output" 
                    : "Enter Input"}
                />
              </div>

              


              {(data.type === 'chat' || data.type === 'image') && (
                  <div className="space-y-3">
                    <label className="block text-md font-bold text-gray-300 uppercase tracking-wider ml-2">
                      Description (Agent's Task)
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-4
                        text-md text-white placeholder-gray-500 focus:outline-none 
                        focus:ring-2 focus:ring-purple-500/50 min-h-[100px]"
                      placeholder="Describe the task for this agent"
                    />
                  </div>
                )}


              {data.type === 'audio' && (
                <div className="space-y-3">
                  <label className="block text-md font-bold text-gray-300 uppercase tracking-wider ml-2">
                      Voice
                  </label>
                  <select
                    value={formData.speaker || 'mercury_jane@hopeful'}
                    onChange={(e) => handleInputChange('speaker', e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-2.5
                      text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {audioVoiceOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}


              <div className="space-y-2">
                <label className="pl-6 ml-80 block text-md font-bold text-gray-300 uppercase tracking-wider">
                  Output
                </label>
                <Handle
                  type="source"
                  position={Position.Bottom}
                  id={`${id}-source`}
                  style={{
                    left: bottomHandlePosition.x,
                    top: bottomHandlePosition.y,
                    width: handleWidth,
                    height: handleHeight,
                  }}
                  className="absolute !bg-purple-600 rounded-full opacity-50 hover:opacity-100 hover:scale-125 transition-all duration-300"
                />
              </div>

            </div>
          )}
        </div>
      </div>

      <YAMLPreview
        isOpen={showYAML}
        onClose={() => setShowYAML(false)}
        data={formData}
        id={id}
      />

      <MindmapView
        isOpen={showMindmap}
        onClose={() => setShowMindmap(false)}
        data={formData}
      />
    </>
  );
});

AgentNode.displayName = 'AgentNode';

export default AgentNode;