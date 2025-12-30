'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserPlus, LogIn } from 'lucide-react';

interface RegisterProps {
  onSwitchToLogin: () => void;
}

export default function Register({ onSwitchToLogin }: RegisterProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await register(username, email, password);
      setSuccess('Account created successfully! You can now sign in.');
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-xl shadow-2xl p-8">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className="bg-green-500 p-3 rounded-full">
            <UserPlus size={32} className="text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
        <p className="text-gray-600 mt-2">Sign up to start calculating</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-100 border border-red-500 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-100 border border-green-500 rounded-lg text-green-700 text-sm">
            {success}
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
            minLength={3}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            placeholder="Choose a username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            placeholder="Enter your email"
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
            minLength={6}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            placeholder="Create a password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            placeholder="Confirm your password"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 font-semibold disabled:bg-gray-400 flex items-center justify-center gap-2"
        >
          <UserPlus size={20} />
          {isLoading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-green-500 font-semibold hover:text-green-600"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}