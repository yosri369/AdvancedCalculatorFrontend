import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api/calculator';
const AUTH_BASE_URL = 'http://localhost:8081/api/auth';


export interface CalculationRequest {
  expression: string;
  language: string;
}

export interface CalculationResponse {
  expression: string;
  result: number;
  success: boolean;
  error: string | null;
}

export interface PlotData {
  xValues: number[];
  yValues: number[];
  success: boolean;
  error: string | null;
}

export interface MatrixRequest {
  matrixA: number[][];
  matrixB?: number[][];
  operation: string;
}

export interface MatrixResponse {
  result: number[][] | null;
  scalarResult: number | null;
  success: boolean;
  error: string | null;
}

export interface EquationRequest {
  equation: string;
  type: string;
}

export interface EquationResponse {
  solutions: number[];
  success: boolean;
  error: string | null;
  explanation: string;
}

export interface StatisticsRequest {
  data: number[];
}

export interface StatisticsResponse {
  mean: number;
  median: number;
  mode: number | null;
  standardDeviation: number;
  variance: number;
  min: number;
  max: number;
  range: number;
  sum: number;
  count: number;
  q1: number;
  q3: number;
  histogram: {
    labels: number[];
    frequencies: number[];
  };
  success: boolean;
  error: string | null;
}

// Auth interfaces
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
}

export interface MessageResponse {
  message: string;
}

// Set up axios interceptor to add token to requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export const calculatorApi = {
  calculate: async (request: CalculationRequest): Promise<CalculationResponse> => {
    const response = await axios.post(`${API_BASE_URL}/calculate`, request);
    return response.data;
  },

  plotFunction: async (
    func: string,
    xMin: number = -10,
    xMax: number = 10,
    points: number = 100
  ): Promise<PlotData> => {
    const response = await axios.get(`${API_BASE_URL}/plot`, {
      params: { function: func, xMin, xMax, points }
    });
    return response.data;
  },

  matrixOperation: async (request: MatrixRequest): Promise<MatrixResponse> => {
    const response = await axios.post(`${API_BASE_URL}/matrix`, request);
    return response.data;
  },

  solveEquation: async (request: EquationRequest): Promise<EquationResponse> => {
    const response = await axios.post(`${API_BASE_URL}/solve`, request);
    return response.data;
  },

   calculateStatistics: async (request: StatisticsRequest): Promise<StatisticsResponse> => {
    const response = await axios.post(`${API_BASE_URL}/statistics`, request);
    return response.data;
  },

  checkHealth: async (): Promise<string> => {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.data;
  },
   // Auth methods
  login: async (request: LoginRequest): Promise<AuthResponse> => {
    const response = await axios.post(`${AUTH_BASE_URL}/login`, request);
    return response.data;
  },

  register: async (request: RegisterRequest): Promise<MessageResponse> => {
    const response = await axios.post(`${AUTH_BASE_URL}/register`, request);
    return response.data;
  },

  validateToken: async (): Promise<AuthResponse> => {
    const response = await axios.get(`${AUTH_BASE_URL}/validate`);
    return response.data;
  }

};