'use client';

import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Calculator from './components/Calculator';
import MatrixCalculator from './components/MatrixCalculator';
import EquationSolver from './components/EquationSolver';
import Graph3D from './components/Graph3D';
import StatisticsCalculator from './components/StatisticsCalculator';
import Login from './components/Login';
import Register from './components/Register';
import { Calculator as CalcIcon, Grid3x3, CheckCircle, Box, TrendingUp, LogOut, User } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('calculator');
  const [showLogin, setShowLogin] = useState(true);
  const { user, logout, isAuthenticated, isLoading } = useAuth();

  const tabs = [
    { id: 'calculator', name: 'Calculator', icon: CalcIcon },
    { id: 'matrix', name: 'Matrix', icon: Grid3x3 },
    { id: 'equations', name: 'Equations', icon: CheckCircle },
    { id: '3d', name: '3D Graph', icon: Box },
    { id: 'statistics', name: 'Statistics', icon: TrendingUp },
  ];

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <main className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </main>
    );
  }

  // Show login/register if not authenticated
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-2">
              Advanced Scientific Calculator
            </h1>
            <p className="text-white/80 text-lg">
              Sign in to access powerful mathematical tools
            </p>
          </div>
          
          {showLogin ? (
            <div className="flex justify-center">
              <Login onSwitchToRegister={() => setShowLogin(false)} />
            </div>
          ) : (
            <div className="flex justify-center">
              <Register onSwitchToLogin={() => setShowLogin(true)} />
            </div>
          )}
        </div>
      </main>
    );
  }

  // Show calculator interface if authenticated
  return (
    <main className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      <div className="h-full flex flex-col p-4 max-w-7xl mx-auto">
        {/* Header with User Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-white mb-1">
              Advanced Scientific Calculator
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg">
              <User size={20} className="text-white" />
              <span className="text-white font-semibold">{user?.username}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white font-semibold transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-1 mb-4">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-purple-600 shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon size={18} />
                  <span className="hidden sm:inline">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'calculator' && <Calculator />}
          {activeTab === 'matrix' && <MatrixCalculator />}
          {activeTab === 'equations' && <EquationSolver />}
          {activeTab === '3d' && <Graph3D />}
          {activeTab === 'statistics' && <StatisticsCalculator />}
        </div>
      </div>
    </main>
  );
}