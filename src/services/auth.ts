import axios from 'axios';

const API_URL = 'https://x8hv3gj2-5000.inc1.devtunnels.ms/api/auth';

const authAxios = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: false
  });


export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  session?: {
    id: string;
    userId: string;
  };
}

export const authService = {
  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    try {
      const response = await authAxios.post('/register', {
        email,
        password,
        name
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data.message || 'Registration failed');
      }
      throw error;
    }
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await authAxios.post('/login', {
        email,
        password
      });
      
      if (response.data.success && response.data.session) {
        localStorage.setItem('sessionId', response.data.session.id);
        localStorage.setItem('userId', response.data.session.userId);
        authAxios.defaults.headers.common['X-Session-ID'] = response.data.session.id;
        authAxios.defaults.headers.common['X-User-ID'] = response.data.session.userId;
      }
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data.message || 'Login failed');
      }
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      const sessionId = localStorage.getItem('sessionId');
      if (sessionId) {
        await authAxios.post('/logout', {}, {
          headers: {
            'X-Session-ID': sessionId
          }
        });
        localStorage.removeItem('sessionId');
        localStorage.removeItem('userId');
        delete authAxios.defaults.headers.common['X-Session-ID'];
        delete authAxios.defaults.headers.common['X-User-ID'];
      }
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('sessionId') && !!localStorage.getItem('userId');
  }
};

export default authService;
