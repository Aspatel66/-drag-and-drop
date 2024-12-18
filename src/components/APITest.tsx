import React, { useState } from 'react';
import api from '../services/api';

export const APITest: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const testConnection = async () => {
    try {
      setStatus('loading');
      const response = await api.testConnection();
      setStatus('success');
      setMessage(response?.message || 'Connection successful');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Connection failed');
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={testConnection}
        disabled={status === 'loading'}
        className={`px-4 py-2 rounded-lg transition-colors ${
          status === 'loading'
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-purple-600 hover:bg-purple-700'
        } text-white`}
      >
        {status === 'loading' ? 'Testing...' : 'Test API Connection'}
      </button>

      {message && (
        <div
          className={`mt-4 p-4 rounded-lg ${
            status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};