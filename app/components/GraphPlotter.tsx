'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculatorApi } from '../services/calculatorApi';

export default function GraphPlotter() {
  const [functionExpr, setFunctionExpr] = useState('x^2');
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
  const [plotData, setPlotData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlot = async () => {
    if (!functionExpr.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await calculatorApi.plotFunction(functionExpr, xMin, xMax, 100);

      if (result.success) {
        const chartData = result.xValues.map((x, index) => ({
          x: parseFloat(x.toFixed(2)),
          y: parseFloat(result.yValues[index].toFixed(2))
        }));
        setPlotData(chartData);
      } else {
        setError(result.error || 'Failed to plot function');
      }
    } catch (err) {
      console.error('Plot error:', err);
      setError('Failed to connect to plotting service');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-bold mb-3">Function Plotter</h3>

      <div className="space-y-2 mb-3">
        <input
          type="text"
          value={functionExpr}
          onChange={(e) => setFunctionExpr(e.target.value)}
          placeholder="e.g., x^2, sin(x)"
          className="w-full p-2 border border-gray-300 rounded-lg text-sm"
        />

        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            value={xMin}
            onChange={(e) => setXMin(parseFloat(e.target.value))}
            placeholder="X Min"
            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
          />
          <input
            type="number"
            value={xMax}
            onChange={(e) => setXMax(parseFloat(e.target.value))}
            placeholder="X Max"
            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      </div>

      <button
        onClick={handlePlot}
        disabled={isLoading}
        className="w-full bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600 font-semibold disabled:bg-gray-400 mb-3"
      >
        {isLoading ? 'Plotting...' : 'Plot'}
      </button>

      {error && (
        <div className="p-2 bg-red-100 border border-red-500 rounded-lg mb-3">
          <p className="text-red-600 text-xs">{error}</p>
        </div>
      )}

      {plotData.length > 0 && (
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={plotData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="y" stroke="#8b5cf6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}