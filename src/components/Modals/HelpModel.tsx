import React from 'react';
import { 
  X, 
  HelpCircle, 
  GripHorizontal, 
  Plus, 
  Play, 
  Save,
  Info,
  MousePointer,
  Move,
  Settings2
} from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center modern-scrollbar">
      <div className="bg-gray-900 rounded-lg w-full pl-5 max-w-4xl max-h-[90vh] overflow-hidden">

        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-purple-500" />
            <h2 className="text-2xl font-semibold text-white">Help Guide</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>


        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)] space-y-8 ">
        
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Info className="w-5 h-5 text-purple-500" />
              <h3 className="text-xl font-semibold text-white">Getting Started</h3>
            </div>
            <div className="space-y-4 text-gray-300 bg-gray-800 rounded-lg p-5">
              <p>
                Welcome to the Multi-Agent Workflow Builder! This tool helps you create
                and manage workflows using different types of AI agents. Here's how to get started:
              </p>
              <ul className="space-y-2">
                <li><span className="text-purple-400 p-4">•</span>Drag agents from the sidebar onto the canvas</li>
                <li><span className="text-purple-400 p-4">•</span>Configure each agent by clicking on it</li>
                <li><span className="text-purple-400 p-4">•</span>Connect agents by dragging from one handle to another</li>
                <li><span className="text-purple-400 p-4">•</span>Save your workflow or run it directly</li>
              </ul>
            </div>
          </section>

 
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Settings2 className="w-5 h-5 text-purple-500" />
              <h3 className="text-xl font-semibold text-white">Available Agents</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold text-purple-400 mb-2">Chat Agent</h4>
                <p className="text-gray-300">
                  Process text inputs and generate human-like responses. Perfect for
                  conversations, text analysis, and content generation.
                </p>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold text-purple-400 mb-2">Image Agent</h4>
                <p className="text-gray-300">
                  Handle image-related tasks such as generation, analysis, and
                  manipulation based on text prompts.
                </p>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold text-purple-400 mb-2">Audio Agent</h4>
                <p className="text-gray-300">
                  Work with audio inputs and outputs, including speech recognition,
                  transcription, and audio processing.
                </p>
              </div>
            </div>
          </section>


          <section>
            <div className="flex items-center gap-3 mb-4">
              <MousePointer className="w-5 h-5 text-purple-500" />
              <h3 className="text-xl font-semibold text-white">Key Features</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-gray-800 rounded-lg">
                <GripHorizontal className="w-5 h-5 text-purple-400 mt-1" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Drag & Drop Interface</h4>
                  <p className="text-gray-300">
                    Easily build workflows by dragging agents onto the canvas and
                    connecting them together.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-800 rounded-lg">
                <Plus className="w-5 h-5 text-purple-400 mt-1" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Agent Configuration</h4>
                  <p className="text-gray-300">
                    Configure each agent with custom inputs, goals, and settings to
                    create your perfect workflow.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-800 rounded-lg">
                <Play className="w-5 h-5 text-purple-400 mt-1" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Run Workflows</h4>
                  <p className="text-gray-300">
                    Execute your workflows and see results in real-time. Chain multiple
                    agents together for complex operations.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-800 rounded-lg">
                <Save className="w-5 h-5 text-purple-400 mt-1" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Save & Load</h4>
                  <p className="text-gray-300">
                    Save your workflows and load them later. Share workflows with
                    your team or use them as templates.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Move className="w-5 h-5 text-purple-500" />
              <h3 className="text-xl font-semibold text-white">Tips & Tricks</h3>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  Double-click an agent to quickly open its configuration
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  Use the mouse wheel to zoom in/out of the canvas
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  Hold spacebar and drag to pan around the canvas
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  Press Delete or Backspace to remove selected agents
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  Connect agents by dragging from the output handle to another agent's input handle
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;