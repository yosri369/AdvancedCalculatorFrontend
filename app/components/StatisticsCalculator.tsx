'use client';

import { useState } from 'react';
import { calculatorApi, StatisticsResponse } from '../services/calculatorApi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Upload, X } from 'lucide-react';

export default function StatisticsCalculator() {
  const [dataInput, setDataInput] = useState('');
  const [result, setResult] = useState<StatisticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCalculate = async () => {
    if (!dataInput.trim()) return;

    setIsLoading(true);
    try {
      // Parse comma-separated numbers
      const numbers = dataInput
        .split(',')
        .map(s => s.trim())
        .filter(s => s !== '')
        .map(s => parseFloat(s))
        .filter(n => !isNaN(n));

      if (numbers.length === 0) {
        alert('Please enter valid numbers');
        setIsLoading(false);
        return;
      }

      const response = await calculatorApi.calculateStatistics({ data: numbers });
      setResult(response);
    } catch (error) {
      console.error('Statistics calculation error:', error);
      setResult({
        mean: 0,
        median: 0,
        mode: null,
        standardDeviation: 0,
        variance: 0,
        min: 0,
        max: 0,
        range: 0,
        sum: 0,
        count: 0,
        q1: 0,
        q3: 0,
        histogram: { labels: [], frequencies: [] },
        success: false,
        error: 'Failed to calculate statistics'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadExample = () => {
    setDataInput('12, 15, 18, 20, 22, 25, 28, 30, 32, 35, 38, 40, 42, 45, 48');
  };

  const clearData = () => {
    setDataInput('');
    setResult(null);
  };

  const generateRandomData = () => {
    const count = 20;
    const data = Array.from({ length: count }, () => Math.floor(Math.random() * 100));
    setDataInput(data.join(', '));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      // Parse CSV - assume numbers separated by comma or newline
      const numbers = text
        .split(/[\n,]/)
        .map(s => s.trim())
        .filter(s => s !== '')
        .map(s => parseFloat(s))
        .filter(n => !isNaN(n));
      
      setDataInput(numbers.join(', '));
    };
    reader.readAsText(file);
  };

  const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="h-full flex gap-4">
      {/* Left Panel - Input */}
      <div className="w-96 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl p-4 flex flex-col overflow-auto">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="text-purple-500" />
          Statistics
        </h2>

        {/* Data Input */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter Data (comma-separated)
          </label>
          <textarea
            value={dataInput}
            onChange={(e) => setDataInput(e.target.value)}
            placeholder="e.g., 10, 20, 30, 40, 50"
            rows={6}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter numbers separated by commas
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={loadExample}
            className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
          >
            Example
          </button>
          <button
            onClick={generateRandomData}
            className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
          >
            Random
          </button>
          <button
            onClick={clearData}
            className="px-3 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-sm flex items-center gap-1"
          >
            <X size={16} />
            Clear
          </button>
        </div>

        {/* File Upload */}
        <div className="mb-3">
          <label className="block w-full cursor-pointer">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 hover:border-purple-500 transition-colors">
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Upload size={20} />
                <span className="text-sm">Upload CSV file</span>
              </div>
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </label>
        </div>

        {/* Calculate Button */}
        <button
          onClick={handleCalculate}
          disabled={isLoading}
          className="w-full bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 font-semibold disabled:bg-gray-400 mb-4"
        >
          {isLoading ? 'Calculating...' : 'Calculate Statistics'}
        </button>

        {/* Basic Statistics */}
        {result && result.success && (
          <div className="bg-purple-50 rounded-lg p-4 overflow-auto">
            <h3 className="font-bold text-lg mb-3">Summary Statistics</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Count:</span>
                <span className="font-semibold">{result.count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sum:</span>
                <span className="font-semibold">{result.sum.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mean:</span>
                <span className="font-semibold">{result.mean.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Median:</span>
                <span className="font-semibold">{result.median.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mode:</span>
                <span className="font-semibold">{result.mode ? result.mode.toFixed(2) : 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Std Dev:</span>
                <span className="font-semibold">{result.standardDeviation.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Variance:</span>
                <span className="font-semibold">{result.variance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Min:</span>
                <span className="font-semibold">{result.min.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Max:</span>
                <span className="font-semibold">{result.max.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Range:</span>
                <span className="font-semibold">{result.range.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Q1 (25%):</span>
                <span className="font-semibold">{result.q1.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Q3 (75%):</span>
                <span className="font-semibold">{result.q3.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">IQR:</span>
                <span className="font-semibold">{(result.q3 - result.q1).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {result && !result.success && (
          <div className="p-3 bg-red-100 border-2 border-red-500 rounded-lg">
            <p className="text-red-700 font-semibold text-sm">Error:</p>
            <p className="text-red-600 text-sm">{result.error}</p>
          </div>
        )}
      </div>

      {/* Right Panel - Visualizations */}
      {result && result.success && (
        <div className="flex-1 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl p-4 overflow-auto">
          <h3 className="text-xl font-bold mb-4">Data Visualizations</h3>

          {/* Histogram */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Distribution (Histogram)</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={result.histogram.frequencies.map((freq, idx) => ({ 
                name: `Bin ${idx + 1}`, 
                frequency: freq 
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="frequency" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Box Plot Info */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold mb-3">Box Plot Summary</h4>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <p className="text-xs text-gray-600">Min</p>
                <p className="font-bold text-lg">{result.min.toFixed(1)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600">Q1</p>
                <p className="font-bold text-lg">{result.q1.toFixed(1)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600">Median</p>
                <p className="font-bold text-lg text-purple-600">{result.median.toFixed(1)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600">Q3</p>
                <p className="font-bold text-lg">{result.q3.toFixed(1)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600">Max</p>
                <p className="font-bold text-lg">{result.max.toFixed(1)}</p>
              </div>
            </div>
          </div>

          {/* Statistical Summary Chart */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Key Metrics</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={[
                { name: 'Mean', value: result.mean },
                { name: 'Median', value: result.median },
                { name: 'Std Dev', value: result.standardDeviation },
                { name: 'Range', value: result.range }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Insights */}
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold mb-2">Quick Insights</h4>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• Dataset contains {result.count} values</li>
              <li>• Average value is {result.mean.toFixed(2)}</li>
              <li>• Middle value (median) is {result.median.toFixed(2)}</li>
              <li>• Values range from {result.min.toFixed(2)} to {result.max.toFixed(2)}</li>
              <li>• Standard deviation indicates {result.standardDeviation > result.mean * 0.3 ? 'high' : 'low'} variability</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}