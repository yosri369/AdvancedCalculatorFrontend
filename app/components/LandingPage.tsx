'use client';

import { Calculator, Grid3x3, TrendingUp, Box, CheckCircle, Zap, Shield, Cloud, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const features = [
    {
      icon: Calculator,
      title: 'Scientific Calculator',
      description: 'Advanced calculations with voice input support in multiple languages',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Grid3x3,
      title: 'Matrix Operations',
      description: 'Complete matrix algebra: multiplication, determinant, inverse, and more',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: CheckCircle,
      title: 'Equation Solver',
      description: 'Solve linear and quadratic equations with detailed step-by-step solutions',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Box,
      title: '3D Graphing',
      description: 'Visualize complex functions in stunning interactive 3D plots',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: TrendingUp,
      title: 'Statistics Analysis',
      description: 'Comprehensive statistical tools with beautiful data visualizations',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Zap,
      title: 'Real-time Results',
      description: 'Lightning-fast calculations powered by Spring Boot backend',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const highlights = [
    { icon: Shield, text: 'Secure & Private' },
    { icon: Cloud, text: 'Cloud Saved History' },
    { icon: Zap, text: 'Fast & Reliable' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-auto">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full shadow-2xl">
              <Calculator size={64} className="text-white" />
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Advanced Scientific
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Calculator Platform
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
            The ultimate mathematical toolkit for students, engineers, and professionals.
            Powerful calculations, beautiful visualizations, all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button
              onClick={onGetStarted}
              className="group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-2xl transform hover:scale-105 transition-all flex items-center gap-2"
            >
              Get Started Free
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Highlights */}
          <div className="flex flex-wrap justify-center gap-6 mt-12">
            {highlights.map((highlight, index) => {
              const Icon = highlight.icon;
              return (
                <div key={index} className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
                  <Icon size={20} className="text-purple-400" />
                  <span className="text-white font-semibold">{highlight.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Powerful Features at Your Fingertips
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/20 transition-all transform hover:scale-105 hover:shadow-2xl"
                >
                  <div className={`bg-gradient-to-r ${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/70">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Built with Modern Technology
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-xl">SB</span>
              </div>
              <p className="text-white font-semibold">Spring Boot</p>
              <p className="text-white/60 text-sm">Backend API</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-xl">Next</span>
              </div>
              <p className="text-white font-semibold">Next.js</p>
              <p className="text-white/60 text-sm">Frontend</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-xl">SQL</span>
              </div>
              <p className="text-white font-semibold">MySQL</p>
              <p className="text-white/60 text-sm">Database</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-xl">JWT</span>
              </div>
              <p className="text-white font-semibold">JWT Auth</p>
              <p className="text-white/60 text-sm">Security</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl p-12 border border-white/10">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Calculate?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Join now and unlock the full power of advanced mathematics
          </p>
          <button
            onClick={onGetStarted}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-4 rounded-full font-bold text-xl shadow-2xl transform hover:scale-105 transition-all"
          >
            Start Calculating Now
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-white/60">
          <p>Built with ❤️ using Spring Boot + Next.js</p>
        </div>
      </div>
    </div>
  );
}