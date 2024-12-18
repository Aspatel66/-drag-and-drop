import React from 'react';
import { X, Loader } from 'lucide-react';
import { Mic, Volume2, Download } from 'lucide-react';

interface Output {
  agent: string;
  task: string;
  output: string;
  output_type: 'text' | 'image' | 'audio';
  image_data?: string;
  audio_url?: string;
  timestamp: number;
}

interface WorkflowResult {
  success: boolean;
  outputs: Output[];
}

interface ResponseSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  result: WorkflowResult | null;
  error: string | null;
}

export const ResponseSidebar: React.FC<ResponseSidebarProps> = ({
  isOpen,
  onClose,
  loading,
  result
}) => {
  return (
    <div
      className={`fixed right-0 top-0 h-screen bg-gray-900/95 border-l border-purple-500/20
        transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0 w-[520px]' : 'translate-x-full w-0'}
        z-50`}
    >
      <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
        <h2 className="text-xl font-bold text-white">Response</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="p-4 h-[calc(100vh-70px)] overflow-y-auto">
        {loading && (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <Loader className="w-8 h-8 text-purple-500 animate-spin" />
            <p className="text-gray-400">Processing...</p>
          </div>
        )}

        {result?.success && result.outputs && (
          <div className="space-y-6">
            {result.outputs.map((output, index) => (
              <div 
                key={index} 
                className="bg-gray-800/50 rounded-lg p-4 transform transition-all duration-500 
                  animate-fadeIn delay-200"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-purple-500/20 text-purple-400 text-sm font-medium px-2 py-1 rounded">
                    Step {index + 1}
                  </div>
                  <div className="text-purple-400 font-medium">
                    {output.agent}
                  </div>
                </div>
      
                {output.output_type === 'text' && (
                  <div className="bg-gray-900/50 rounded-lg p-4 font-mono text-sm text-gray-300 whitespace-pre-wrap">
                    {output.output}
                  </div>
                )}
        
                {output.output_type === 'image' && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-400 mb-2">Generated Image:</p>
                    {output.image_data ? (
                      <div className="relative group">
                        <img
                          src={output.image_data}
                          alt="Generated thumbnail"
                          className="w-full rounded-lg border border-purple-500/20 
                            transition-transform duration-200 group-hover:scale-[1.02]"
                        />
                        <a 
                          href={output.output}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute bottom-2 right-2 bg-gray-900/80 text-purple-400
                            px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100
                            transition-opacity duration-200"
                        >
                          Open Full Size
                        </a>
                      </div>
                    ) : (
                      <a 
                        href={output.output}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300"
                      >
                        View Generated Image
                      </a>
                    )}
                  </div>
                )}


                {output.output_type === 'audio' && (
                  <div className="mt-4 space-y-2">
                    <div className="bg-gradient-to-r from-gray-900/50 to-purple-900/20 backdrop-blur-sm 
                      rounded-xl p-6 border border-purple-500/10 transform transition-all duration-300 
                      hover:border-purple-500/20 hover:shadow-lg hover:shadow-purple-500/5"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-500/10 rounded-lg">
                            <Mic className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <h3 className="text-gray-200 font-medium">AI Generated Voice</h3>
                          </div>
                        </div>
                      </div>

                      {output.output ? (
                        <div className="space-y-4">
                          <div className="relative group">
                            <audio
                              id={`audio-${output.timestamp}`}
                              src={output.output}
                              className="hidden"
                              onError={(e) => {
                                console.error('Audio playback error:', e);
                                const target = e.target as HTMLAudioElement;
                                target.insertAdjacentHTML('afterend', 
                                  '<div class="text-red-400 text-sm mt-2">Error playing audio. Please try again.</div>'
                                );
                              }}
                            />
                            
                            <div className="flex items-center gap-4 relative z-10">
                              <button
                                onClick={(e) => {
                                  const audio = document.getElementById(`audio-${output.timestamp}`) as HTMLAudioElement;
                                  if (audio) {
                                    if (audio.paused) {
                                      audio.play();
                                      (e.target as HTMLElement).innerHTML = `
                                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                          <rect x="6" y="4" width="4" height="16" rx="1" />
                                          <rect x="14" y="4" width="4" height="16" rx="1" />
                                        </svg>
                                      `;
                                    } else {
                                      audio.pause();
                                      (e.target as HTMLElement).innerHTML = `
                                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                          <polygon points="5 3 19 12 5 21" />
                                        </svg>
                                      `;
                                    }
                                  }
                                }}
                                className="p-3 bg-purple-500 rounded-full text-white hover:bg-purple-600 
                                  transition-all duration-200 group-hover:shadow-lg group-hover:shadow-purple-500/20"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <polygon points="5 3 19 12 5 21" />
                                </svg>
                              </button>


                              <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden group-hover:h-3 transition-all duration-200">
                                <div
                                  className="h-full bg-gradient-to-r from-purple-500 to-purple-600 w-0 
                                    rounded-full relative"
                                  id={`progress-${output.timestamp}`}
                                >
                                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2
                                    w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100
                                    transition-opacity duration-200 cursor-pointer"
                                  ></div>
                                </div>
                              </div>

                              <div className="text-sm text-gray-400 min-w-[4rem] text-right">
                                <span id={`time-${output.timestamp}`}>0:00</span>
                              </div>
                            </div>
                          </div>


                          <div className="flex justify-between items-center pt-2">
                            <div className="flex items-center gap-4">

                              <div className="flex items-center gap-2">
                                <Volume2 className="w-4 h-4 text-gray-400" />
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  defaultValue="100"
                                  className="w-20 h-1 bg-gray-700 rounded-full appearance-none 
                                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 
                                    [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full 
                                    [&::-webkit-slider-thumb]:bg-purple-500 cursor-pointer"
                                  onChange={(e) => {
                                    const audio = document.getElementById(`audio-${output.timestamp}`) as HTMLAudioElement;
                                    if (audio) {
                                      audio.volume = parseInt(e.target.value) / 100;
                                    }
                                  }}
                                />
                              </div>
                            </div>


                            <a
                              href={output.output}
                              download
                              className="flex items-center gap-2 px-3 pr-4 py-1.5 bg-green-800 rounded-lg
                                text-sm text-white hover:bg-white hover:text-black transition-colors duration-200"
                            >
                              <Download className="w-4 h-4" />
                              <span>Download</span>
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className="text-red-400 text-sm bg-red-500/10 rounded-lg p-4">
                          No audio URL provided. Please try regenerating the audio.
                        </div>
                      )}
                    </div>
                  </div>
                )}



              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};