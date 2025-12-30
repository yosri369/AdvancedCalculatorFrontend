'use client';

import { useState, useEffect, useRef } from 'react';

declare const Plotly: any;

export default function Graph3D() {
  const [functionExpr, setFunctionExpr] = useState('sin(sqrt(x^2 + y^2))');
  const [xRange, setXRange] = useState({ min: -5, max: 5 });
  const [yRange, setYRange] = useState({ min: -5, max: 5 });
  const [isLoading, setIsLoading] = useState(false);
  const plotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.plot.ly/plotly-2.27.0.min.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const evaluateFunction = (x: number, y: number, expr: string): number => {
    try {
      const sanitized = expr
        .replace(/\^/g, '**')
        .replace(/sqrt/g, 'Math.sqrt')
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/log/g, 'Math.log')
        .replace(/exp/g, 'Math.exp');
      
      return eval(sanitized);
    } catch (error) {
      return 0;
    }
  };

  const handlePlot = async () => {
    if (!plotRef.current || typeof window === 'undefined') return;

    setIsLoading(true);

    try {
      const points = 40;
      const xStep = (xRange.max - xRange.min) / points;
      const yStep = (yRange.max - yRange.min) / points;

      const xValues: number[] = [];
      const yValues: number[] = [];
      const zValues: number[][] = [];

      for (let i = 0; i <= points; i++) {
        xValues.push(xRange.min + i * xStep);
        yValues.push(yRange.min + i * yStep);
      }

      for (let i = 0; i <= points; i++) {
        const row: number[] = [];
        for (let j = 0; j <= points; j++) {
          const x = xValues[j];
          const y = yValues[i];
          const z = evaluateFunction(x, y, functionExpr);
          row.push(z);
        }
        zValues.push(row);
      }

      const data = [{
        type: 'surface',
        x: xValues,
        y: yValues,
        z: zValues,
        colorscale: 'Viridis'
      }];

      const layout = {
        title: `z = ${functionExpr}`,
        autosize: true,
        scene: {
          xaxis: { title: 'X' },
          yaxis: { title: 'Y' },
          zaxis: { title: 'Z' }
        },
        margin: { l: 0, r: 0, b: 0, t: 40 }
      };

      if (typeof Plotly !== 'undefined') {
        Plotly.newPlot(plotRef.current, data, layout);
      }

    } catch (error) {
      console.error('3D plotting error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full bg-white/95 backdrop-blur-md rounded-xl shadow-2xl p-4 flex flex-col">
      <h2 className="text-2xl font-bold mb-4">3D Function Plotter</h2>

      <div className="mb-3">
        <input
          type="text"
          value={functionExpr}
          onChange={(e) => setFunctionExpr(e.target.value)}
          placeholder="e.g., sin(sqrt(x^2 + y^2))"
          className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-4 gap-2 mb-3">
        <input
          type="number"
          value={xRange.min}
          onChange={(e) => setXRange({ ...xRange, min: parseFloat(e.target.value) })}
          placeholder="X Min"
          className="w-full p-2 text-sm border border-gray-300 rounded-lg"
        />
        <input
          type="number"
          value={xRange.max}
          onChange={(e) => setXRange({ ...xRange, max: parseFloat(e.target.value) })}
          placeholder="X Max"
          className="w-full p-2 text-sm border border-gray-300 rounded-lg"
        />
        <input
          type="number"
          value={yRange.min}
          onChange={(e) => setYRange({ ...yRange, min: parseFloat(e.target.value) })}
          placeholder="Y Min"
          className="w-full p-2 text-sm border border-gray-300 rounded-lg"
        />
        <input
          type="number"
          value={yRange.max}
          onChange={(e) => setYRange({ ...yRange, max: parseFloat(e.target.value) })}
          placeholder="Y Max"
          className="w-full p-2 text-sm border border-gray-300 rounded-lg"
        />
      </div>

      <button
        onClick={handlePlot}
        disabled={isLoading}
        className="w-full bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 font-semibold disabled:bg-gray-400 mb-3"
      >
        {isLoading ? 'Plotting...' : 'Plot 3D Function'}
      </button>

      <div ref={plotRef} className="flex-1 border-2 border-gray-200 rounded-lg"></div>

      <div className="mt-3 flex flex-wrap gap-2">
        {['sin(sqrt(x^2 + y^2))', 'x^2 + y^2', 'sin(x) * cos(y)'].map((example, index) => (
          <button
            key={index}
            onClick={() => setFunctionExpr(example)}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-xs"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}