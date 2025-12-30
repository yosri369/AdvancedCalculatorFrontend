'use client';

import { useState } from 'react';
import { calculatorApi, CalculationResponse } from '../services/calculatorApi';
import { Mic, MicOff, TrendingUp } from 'lucide-react';
import GraphPlotter from './GraphPlotter';

export default function Calculator() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState<CalculationResponse | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState('en-US');
  const [showGraph, setShowGraph] = useState(false);

  const SpeechRecognition = typeof window !== 'undefined' && 
    (window.SpeechRecognition || (window as any).webkitSpeechRecognition);

  const handleCalculate = async () => {
    if (!expression.trim()) return;

    try {
      const response = await calculatorApi.calculate({ expression, language });
      setResult(response);
    } catch (error) {
      console.error('Calculation error:', error);
      setResult({
        expression,
        result: 0,
        success: false,
        error: 'Failed to connect to calculator service'
      });
    }
  };

  const startVoiceRecognition = () => {
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      let mathExpression = transcript.toLowerCase()
        .replace(/plus/g, '+')
        .replace(/minus/g, '-')
        .replace(/times/g, '*')
        .replace(/multiplied by/g, '*')
        .replace(/divided by/g, '/')
        .replace(/over/g, '/')
        .replace(/squared/g, '^2')
        .replace(/cubed/g, '^3')
        .replace(/pi/g, 'π')
        .replace(/\s+/g, '');

      setExpression(mathExpression);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const addToExpression = (value: string) => {
    setExpression(expression + value);
  };

  const clearExpression = () => {
    setExpression('');
    setResult(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCalculate();
  };

  const buttons = [
    ['7', '8', '9', '/', 'sin'],
    ['4', '5', '6', '*', 'cos'],
    ['1', '2', '3', '-', 'tan'],
    ['0', '.', '=', '+', 'sqrt'],
    ['(', ')', '^', 'π', 'log']
  ];

  return (
    <div className="h-full flex gap-4">
      {/* Left Panel - Calculator */}
      <div className="flex-1 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl p-4 flex flex-col overflow-hidden">
        {/* Display */}
        <div className="mb-3">
          <input
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter expression..."
            className="w-full p-3 text-xl border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
          />
        </div>

        {/* Controls */}
        <div className="flex gap-2 mb-3">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="en-US">🇺🇸 English</option>
            <option value="fr-FR">🇫🇷 Français</option>
            <option value="es-ES">🇪🇸 Español</option>
            <option value="de-DE">🇩🇪 Deutsch</option>
            <option value="ar-SA">🇸🇦 العربية</option>
          </select>
          
          <button
            onClick={startVoiceRecognition}
            disabled={isListening}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              isListening
                ? 'bg-red-500 text-white'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          <button
            onClick={() => setShowGraph(!showGraph)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
          >
            <TrendingUp size={18} />
          </button>
        </div>

        {/* Calculator Buttons */}
        <div className="grid grid-cols-5 gap-2 mb-3">
          {buttons.map((row, rowIndex) => (
            row.map((btn, btnIndex) => (
              <button
                key={`${rowIndex}-${btnIndex}`}
                onClick={() => {
                  if (btn === '=') {
                    handleCalculate();
                  } else {
                    addToExpression(btn);
                  }
                }}
                className={`p-3 text-lg font-semibold rounded-lg transition-all ${
                  btn === '='
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-100 hover:bg-gray-200 active:scale-95'
                }`}
              >
                {btn}
              </button>
            ))
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={handleCalculate}
            className="flex-1 bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 font-semibold"
          >
            Calculate
          </button>
          <button
            onClick={clearExpression}
            className="flex-1 bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 font-semibold"
          >
            Clear
          </button>
        </div>

        {/* Result Display */}
        {result && (
          <div className={`p-3 rounded-lg ${
            result.success ? 'bg-green-100 border-2 border-green-500' : 'bg-red-100 border-2 border-red-500'
          }`}>
            {result.success ? (
              <div>
                <p className="text-gray-600 text-sm">Result:</p>
                <p className="text-2xl font-bold text-gray-900">{result.result}</p>
              </div>
            ) : (
              <div>
                <p className="text-red-700 font-semibold text-sm">Error:</p>
                <p className="text-red-600 text-sm">{result.error}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Panel - Graph */}
      {showGraph && (
        <div className="w-96 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl p-4 overflow-auto">
          <GraphPlotter />
        </div>
      )}
    </div>
  );
}