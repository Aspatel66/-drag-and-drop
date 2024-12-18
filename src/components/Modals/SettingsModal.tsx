import React, { useState } from 'react';
import { X, User, Paintbrush, Bell, Clock, Key } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'profile' | 'appearance' | 'notifications' | 'timezone' | 'api';

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface AppearanceSettings {
  theme: 'dark' | 'light';
  primaryColor: string;
  gridSize: number;
  nodeSpacing: number;
  fontSize: 'small' | 'medium' | 'large';
}





const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const {updateProfile,updateAppearance} = useSettingsStore();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [appearance, setAppearance] = useState<AppearanceSettings>({
    theme: 'dark',
    primaryColor: '#6D28D9',
    gridSize: 20,
    nodeSpacing: 50,
    fontSize: 'medium'
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(userProfile.name, userProfile.email);
  };

  const handleAppearanceUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateAppearance(appearance);
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-gray-900 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-100px)]">
          <div className="w-64 border-r border-gray-800 p-4">
            <nav className="space-y-2">
              {[
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'appearance', label: 'Appearance', icon: Paintbrush },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'timezone', label: 'Timezone & Language', icon: Clock },
                { id: 'api', label: 'API Keys', icon: Key }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as TabType)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left
                    transition-colors ${
                      activeTab === id
                        ? 'bg-purple-600/20 text-purple-400'
                        : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                    }`}
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <h3 className="text-xl font-semibold text-white mb-6">Profile Settings</h3>
                

                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center">
                    {userProfile.avatar ? (
                      <img
                        
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User size={32} className="text-gray-600" />
                    )}
                  </div>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg bg-purple-600/20 text-purple-400
                      hover:bg-purple-600/30 transition-colors"
                  >
                    Change Avatar
                  </button>
                </div>


                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={userProfile.name}
                      onChange={(e) =>
                        setUserProfile({ ...userProfile, name: e.target.value })
                      }
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5
                        text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={userProfile.email}
                      onChange={(e) =>
                        setUserProfile({ ...userProfile, email: e.target.value })
                      }
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5
                        text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-800">
                  <h4 className="text-lg font-medium text-white mb-4">Change Password</h4>
                  <div className="space-y-4">
                    <input
                      type="password"
                      placeholder="Current Password"
                      value={userProfile.currentPassword}
                      onChange={(e) =>
                        setUserProfile({ ...userProfile, currentPassword: e.target.value })
                      }
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5
                        text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      value={userProfile.newPassword}
                      onChange={(e) =>
                        setUserProfile({ ...userProfile, newPassword: e.target.value })
                      }
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5
                        text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      value={userProfile.confirmPassword}
                      onChange={(e) =>
                        setUserProfile({ ...userProfile, confirmPassword: e.target.value })
                      }
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5
                        text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium
                    py-2.5 px-4 rounded-lg transition-colors mt-6"
                >
                  Save Profile Changes
                </button>
              </form>
            )}

            {activeTab === 'appearance' && (
              <form onSubmit={handleAppearanceUpdate} className="space-y-6">
                <h3 className="text-xl font-semibold text-white mb-6">Appearance Settings</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Theme
                  </label>
                  <div className="flex gap-4">
                    {['dark', 'light'].map((theme) => (
                      <button
                        key={theme}
                        type="button"
                        onClick={() =>
                          setAppearance({ ...appearance, theme: theme as 'dark' | 'light' })
                        }
                        className={`px-4 py-2 rounded-lg border ${
                          appearance.theme === theme
                            ? 'bg-purple-600/20 border-purple-500 text-purple-400'
                            : 'bg-gray-800/50 border-gray-700 text-gray-400'
                        }`}
                      >
                        {theme.charAt(0).toUpperCase() + theme.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Primary Color
                  </label>
                  <input
                    type="color"
                    value={appearance.primaryColor}
                    onChange={(e) =>
                      setAppearance({ ...appearance, primaryColor: e.target.value })
                    }
                    className="h-10 w-20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Grid Size
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={appearance.gridSize}
                    onChange={(e) =>
                      setAppearance({ ...appearance, gridSize: Number(e.target.value) })
                    }
                    className="w-full"
                  />
                  <span className="text-gray-400 text-sm">{appearance.gridSize}px</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Node Spacing
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={appearance.nodeSpacing}
                    onChange={(e) =>
                      setAppearance({ ...appearance, nodeSpacing: Number(e.target.value) })
                    }
                    className="w-full"
                  />
                  <span className="text-gray-400 text-sm">{appearance.nodeSpacing}px</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Font Size
                  </label>
                  <div className="flex gap-4">
                    {['small', 'medium', 'large'].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() =>
                          setAppearance({
                            ...appearance,
                            fontSize: size as 'small' | 'medium' | 'large'
                          })
                        }
                        className={`px-4 py-2 rounded-lg border ${
                          appearance.fontSize === size
                            ? 'bg-purple-600/20 border-purple-500 text-purple-400'
                            : 'bg-gray-800/50 border-gray-700 text-gray-400'
                        }`}
                      >
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium
                    py-2.5 px-4 rounded-lg transition-colors mt-6"
                >
                  Save Appearance Settings
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;