'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus } from 'lucide-react';

interface LoginProps {
  onSwitchToRegister: () => void;
}

export default function Login({ onSwitchToRegister }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(username, password);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-xl shadow-2xl p-8">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className="bg-purple-500 p-3 rounded-full">
            <LogIn size={32} className="text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
        <p className="text-gray-600 mt-2">Sign in to access your calculator</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-100 border border-red-500 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
            placeholder="Enter your username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 font-semibold disabled:bg-gray-400 flex items-center justify-center gap-2"
        >
          <LogIn size={20} />
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-purple-500 font-semibold hover:text-purple-600"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}