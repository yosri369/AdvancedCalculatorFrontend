'use client';

import { useState } from 'react';
import { calculatorApi, EquationResponse } from '../services/calculatorApi';

export default function EquationSolver() {
  const [equation, setEquation] = useState('');
  const [equationType, setEquationType] = useState('linear');
  const [result, setResult] = useState<EquationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSolve = async () => {
    if (!equation.trim()) return;

    setIsLoading(true);
    try {
      const response = await calculatorApi.solveEquation({
        equation,
        type: equationType
      });
      setResult(response);
    } catch (error) {
      console.error('Equation solving error:', error);
      setResult({
        solutions: [],
        success: false,
        error: 'Failed to solve equation',
        explanation: ''
      });
    } finally {
      setIsLoading(false);
    }
  };

  const examples = {
    linear: ['2x + 5 = 11', '3x - 7 = 8', '-4x + 12 = 0'],
    quadratic: ['x^2 - 5x + 6 = 0', '2x^2 + 3x - 2 = 0', 'x^2 - 4 = 0']
  };

  return (
    <div className="h-full bg-white/95 backdrop-blur-md rounded-xl shadow-2xl p-6 overflow-auto">
      <h2 className="text-2xl font-bold mb-4">Equation Solver</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Equation Type</label>
        <select
          value={equationType}
          onChange={(e) => setEquationType(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
        >
          <option value="linear">Linear (ax + b = c)</option>
          <option value="quadratic">Quadratic (ax² + bx + c = 0)</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Enter Equation</label>
        <input
          type="text"
          value={equation}
          onChange={(e) => setEquation(e.target.value)}
          placeholder={equationType === 'linear' ? 'e.g., 2x + 5 = 11' : 'e.g., x^2 - 5x + 6 = 0'}
          className="w-full p-3 text-lg border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
        />
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Examples:</p>
        <div className="flex flex-wrap gap-2">
          {examples[equationType as keyof typeof examples].map((example, index) => (
            <button
              key={index}
              onClick={() => setEquation(example)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSolve}
        disabled={isLoading}
        className="w-full bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 font-semibold disabled:bg-gray-400 mb-4"
      >
        {isLoading ? 'Solving...' : 'Solve Equation'}
      </button>

      {result && (
        <div className={`p-4 rounded-lg ${
          result.success ? 'bg-green-100 border-2 border-green-500' : 'bg-red-100 border-2 border-red-500'
        }`}>
          {result.success ? (
            <div>
              <h3 className="font-semibold text-lg mb-3">Solution:</h3>
              
              {result.solutions.length > 0 && (
                <div className="mb-4">
                  {result.solutions.map((solution, index) => (
                    <div key={index} className="text-2xl font-bold text-gray-900 mb-2">
                      x{result.solutions.length > 1 ? `₁` : ''} = {solution.toFixed(4)}
                    </div>
                  ))}
                  {result.solutions.length === 2 && (
                    <div className="text-2xl font-bold text-gray-900">
                      x₂ = {result.solutions[1].toFixed(4)}
                    </div>
                  )}
                </div>
              )}

              {result.explanation && (
                <div className="p-3 bg-white rounded border border-green-300">
                  <pre className="text-sm text-gray-600 whitespace-pre-wrap font-mono">
                    {result.explanation}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div>
              <p className="text-red-700 font-semibold">Error:</p>
              <p className="text-red-600">{result.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}