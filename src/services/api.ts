import axios, { AxiosError } from 'axios';
import { WorkflowData, WorkflowResponse } from '../types';

const API_BASE_URL = 'https://x8hv3gj2-5000.inc1.devtunnels.ms/'
// 'http://localhost:5000/api';


interface UserProfile {
  name: string;
  email: string;
  avatar_url?: string;
}

interface AppearanceSettings {
  theme: 'dark' | 'light';
  primaryColor: string;
  gridSize: number;
  nodeSpacing: number;
  fontSize: 'small' | 'medium' | 'large';
}

interface PasswordUpdate {
  currentPassword: string;
  newPassword: string;
}


const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false
});


axiosInstance.interceptors.request.use((config) => {
  const sessionId = localStorage.getItem('sessionId');
  const userId = localStorage.getItem('userId');

  config.headers = config.headers || {};
  
  if (sessionId) {
    config.headers['X-Session-ID'] = sessionId;
  }
  if (userId) {
    config.headers['X-User-ID'] = userId;
  }
  
  return config;
});


const handleAxiosError = (error: AxiosError) => {
  if (error.response) {
    console.error('Server Error Data:', error.response.data);
    console.error('Server Error Status:', error.response.status);
    throw new Error(`Server error: ${error.message || error.message}`);
  } else if (error.request) {
    console.error('No Response Error:', error.request);
    throw new Error('No response from server. Please check if the server is running.');
  } else {
    console.error('Request Setup Error:', error.message);
    throw new Error('Failed to make request');
  }
};

const api = {
  saveWorkflow: async (workflowData: WorkflowData) => {
    try {
      console.log('Sending workflow data:', JSON.stringify(workflowData, null, 2));
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const response = await axiosInstance.post('/workflow', workflowData, {
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': userId
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error in saveWorkflow:', error);
      handleAxiosError(error as AxiosError);
    }
  },

  executeWorkflow: async (workflowData: WorkflowData): Promise<WorkflowResponse> => {
    try {
      console.log('Executing workflow:', workflowData);
      const response = await axiosInstance.post<WorkflowResponse>('/execute-workflow', workflowData);
      return response.data;
    } catch (error) {
      console.error('Error in executeWorkflow:', error);
      handleAxiosError(error as AxiosError);
      throw error;
    }
  },

  testConnection: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/test`);
      return response.data;
    } catch (error) {
      handleAxiosError(error as AxiosError);
    }
  },

  getWorkflows: async () => {
    try {
      const response = await axiosInstance.get('/workflow');
      const userId = localStorage.getItem('userId');

      if (!userId) {
        throw new Error('User not authenticated');
      }

      console.log('API getWorkflows response:', response);
      
      if (!response.data || (!Array.isArray(response.data.data) && !Array.isArray(response.data))) {
        throw new Error('Invalid response format from server');
      }
      
      return response;
    } catch (error) {
      console.error('GetWorkflows error:', error);
      handleAxiosError(error as AxiosError);
    }
  },

  deleteWorkflow: async (workflowId: string) => {
    try {
      const response = await axiosInstance.delete(`/workflow/${workflowId}`);
      return response.data;
    } catch (error) {
      handleAxiosError(error as AxiosError);
    }
  },

  loadWorkflow: async (workflowId: string) => {
    try {
      const response = await axiosInstance.get(`/workflow/${workflowId}`);
      return response.data;
    } catch (error) {
      handleAxiosError(error as AxiosError);
    }
  },

  getSettings: async () => {
    try {
      const response = await axiosInstance.get('/settings');
      return response.data;
    } catch (error) {
      handleAxiosError(error as AxiosError);
    }
  },

  updateProfile: async (profileData: UserProfile) => {
    try {
      const response = await axiosInstance.put('/settings/profile', profileData);
      return response.data;
    } catch (error) {
      handleAxiosError(error as AxiosError);
    }
  },

  updateAppearance: async (appearanceData: AppearanceSettings) => {
    try {
      const response = await axiosInstance.put('/settings/appearance', appearanceData);
      return response.data;
    } catch (error) {
      handleAxiosError(error as AxiosError);
    }
  },

  updatePassword: async (passwordData: PasswordUpdate) => {
    try {
      const response = await axiosInstance.put('/settings/password', passwordData);
      return response.data;
    } catch (error) {
      handleAxiosError(error as AxiosError);
    }
  },

  uploadAvatar: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await axiosInstance.post('/settings/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      handleAxiosError(error as AxiosError);
    }
  },
};

export default api;