export type AgentType = 'chat' | 'image' | 'audio';

export interface NodeData {
    type: AgentType;
    label: string;
    name: string;
    input?: string;
    description?: string;
  }
  
  export interface ValidationResult {
    isValid: boolean;
    message: string;
  }
  
  export const validateConnection = (
    sourceNodeType: AgentType
  ): ValidationResult => {
    if (sourceNodeType === 'chat') {
      return {
        isValid: true,
        message: ''
      };
    }
  
    if (sourceNodeType === 'image') {
      return {
        isValid: false,
        message: 'Image agent outputs cannot be connected to other agents'
      };
    }
  
    if (sourceNodeType === 'audio') {
      return {
        isValid: false,
        message: 'Audio agent outputs cannot be connected to other agents'
      };
    }
  
    return {
      isValid: false,
      message: 'Invalid connection'
    };
  };
  
  export const showConnectionError = (message: string) => {
    const notification = document.createElement('div');
    notification.className = `
      fixed bottom-4 right-4 bg-red-500/10 text-red-400 
      px-4 py-2 rounded-lg z-50 animate-fadeIn
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
  
    setTimeout(() => {
      notification.classList.add('opacity-0', 'transition-opacity');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };