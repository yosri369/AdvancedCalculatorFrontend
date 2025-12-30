'use client';

import { useState } from 'react';
import { calculatorApi, MatrixResponse } from '../services/calculatorApi';

export default function MatrixCalculator() {
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [matrixA, setMatrixA] = useState<number[][]>([[0, 0], [0, 0]]);
  const [matrixB, setMatrixB] = useState<number[][]>([[0, 0], [0, 0]]);
  const [operation, setOperation] = useState('add');
  const [result, setResult] = useState<MatrixResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const initializeMatrices = (newRows: number, newCols: number) => {
    const newMatrixA = Array(newRows).fill(0).map(() => Array(newCols).fill(0));
    const newMatrixB = Array(newRows).fill(0).map(() => Array(newCols).fill(0));
    setMatrixA(newMatrixA);
    setMatrixB(newMatrixB);
  };

  const handleSizeChange = (newRows: number, newCols: number) => {
    setRows(newRows);
    setCols(newCols);
    initializeMatrices(newRows, newCols);
  };

  const updateMatrixA = (row: number, col: number, value: string) => {
    const newMatrix = [...matrixA];
    newMatrix[row][col] = parseFloat(value) || 0;
    setMatrixA(newMatrix);
  };

  const updateMatrixB = (row: number, col: number, value: string) => {
    const newMatrix = [...matrixB];
    newMatrix[row][col] = parseFloat(value) || 0;
    setMatrixB(newMatrix);
  };

  const handleOperation = async () => {
    setIsLoading(true);
    try {
      const response = await calculatorApi.matrixOperation({
        matrixA,
        matrixB: ['add', 'subtract', 'multiply'].includes(operation) ? matrixB : undefined,
        operation
      });
      setResult(response);
    } catch (error) {
      console.error('Matrix operation error:', error);
      setResult({
        result: null,
        scalarResult: null,
        success: false,
        error: 'Failed to perform matrix operation'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderMatrix = (matrix: number[][], isEditable: boolean, updateFunc: any, label: string) => (
    <div className="mb-3">
      <h4 className="font-semibold mb-2 text-sm">{label}</h4>
      <div className="inline-block border-2 border-gray-300 rounded-lg p-2 bg-white">
        {matrix.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 mb-1">
            {row.map((cell, colIndex) => (
              <input
                key={`${rowIndex}-${colIndex}`}
                type="number"
                value={cell}
                onChange={(e) => updateFunc(rowIndex, colIndex, e.target.value)}
                disabled={!isEditable}
                className="w-14 h-10 text-center text-sm border border-gray-300 rounded focus:border-purple-500 focus:outline-none"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  const renderResultMatrix = (matrix: number[][]) => (
    <div className="inline-block border-2 border-green-500 rounded-lg p-2 bg-green-50">
      {matrix.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1 mb-1">
          {row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="w-16 h-10 text-center text-sm border border-green-300 rounded bg-white flex items-center justify-center font-semibold"
            >
              {cell.toFixed(2)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div className="h-full bg-white/95 backdrop-blur-md rounded-xl shadow-2xl p-4 overflow-auto">
      <h2 className="text-2xl font-bold mb-4">Matrix Calculator</h2>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Rows</label>
          <input
            type="number"
            min="1"
            max="4"
            value={rows}
            onChange={(e) => handleSizeChange(parseInt(e.target.value) || 2, cols)}
            className="w-full p-2 text-sm border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Columns</label>
          <input
            type="number"
            min="1"
            max="4"
            value={cols}
            onChange={(e) => handleSizeChange(rows, parseInt(e.target.value) || 2)}
            className="w-full p-2 text-sm border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-700 mb-1">Operation</label>
        <select
          value={operation}
          onChange={(e) => setOperation(e.target.value)}
          className="w-full p-2 text-sm border border-gray-300 rounded-lg"
        >
          <option value="add">Addition (A + B)</option>
          <option value="subtract">Subtraction (A - B)</option>
          <option value="multiply">Multiplication (A × B)</option>
          <option value="determinant">Determinant (det A)</option>
          <option value="inverse">Inverse (A⁻¹)</option>
          <option value="transpose">Transpose (Aᵀ)</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {renderMatrix(matrixA, true, updateMatrixA, 'Matrix A')}
        {['add', 'subtract', 'multiply'].includes(operation) && 
          renderMatrix(matrixB, true, updateMatrixB, 'Matrix B')}
      </div>

      <button
        onClick={handleOperation}
        disabled={isLoading}
        className="w-full bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 font-semibold disabled:bg-gray-400 mb-4"
      >
        {isLoading ? 'Calculating...' : 'Calculate'}
      </button>

      {result && (
        <div className={`p-3 rounded-lg ${
          result.success ? 'bg-green-100 border-2 border-green-500' : 'bg-red-100 border-2 border-red-500'
        }`}>
          {result.success ? (
            <div>
              <h3 className="font-semibold mb-2">Result:</h3>
              {result.scalarResult !== null ? (
                <div className="text-2xl font-bold text-gray-900">
                  {result.scalarResult.toFixed(4)}
                </div>
              ) : result.result && renderResultMatrix(result.result)}
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
  );
}