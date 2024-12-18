import { create } from 'zustand';
import api from '../services/api';

interface SettingsState {
  theme: 'dark' | 'light';
  primaryColor: string;
  gridSize: number;
  nodeSpacing: number;
  fontSize: 'small' | 'medium' | 'large';
  userName: string;
  userEmail: string;
  avatarUrl?: string;
  loading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  updateProfile: (name: string, email: string) => Promise<void>;
  updateAppearance: (appearanceSettings: {
    theme: 'dark' | 'light';
    primaryColor: string;
    gridSize: number;
    nodeSpacing: number;
    fontSize: 'small' | 'medium' | 'large';
  }) => Promise<void>;
  updateAvatar: (file: File) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: 'dark',
  primaryColor: '#6D28D9',
  gridSize: 20,
  nodeSpacing: 50,
  fontSize: 'medium',
  userName: '',
  userEmail: '',
  avatarUrl: undefined,
  loading: false,
  error: null,

  fetchSettings: async () => {
    try {
      set({ loading: true, error: null });
      const response = await api.getSettings();
      if (response.success) {
        const { data } = response;
        set({
          theme: data.theme,
          primaryColor: data.primary_color,
          gridSize: data.grid_size,
          nodeSpacing: data.node_spacing,
          fontSize: data.font_size,
          userName: data.name,
          userEmail: data.email,
          avatarUrl: data.avatar_url,
        });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch settings' });
    } finally {
      set({ loading: false });
    }
  },

  updateProfile: async (name: string, email: string) => {
    try {
      set({ loading: true, error: null });
      const response = await api.updateProfile({ name, email });
      if (response.success) {
        set({ userName: name, userEmail: email });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update profile' });
    } finally {
      set({ loading: false });
    }
  },

  updateAppearance: async (appearanceSettings) => {
    try {
      set({ loading: true, error: null });
      const response = await api.updateAppearance(appearanceSettings);
      if (response.success) {
        set({ ...appearanceSettings });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update appearance' });
    } finally {
      set({ loading: false });
    }
  },

  updateAvatar: async (file: File) => {
    try {
      set({ loading: true, error: null });
      const response = await api.uploadAvatar(file);
      if (response.success) {
        set({ avatarUrl: response.data.avatar_url });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update avatar' });
    } finally {
      set({ loading: false });
    }
  },
}));