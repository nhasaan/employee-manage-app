import axios from 'axios';
import {
  Employee,
  Department,
  EmployeeFormData,
  PaginatedResponse,
} from '@/types';

const API_BASE_URL = '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding tokens or handling global request configs
apiClient.interceptors.request.use(
  (config) => {
    // Add authorization token if exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized access (e.g., redirect to login)
          console.error('Unauthorized access');
          break;
        case 403:
          console.error('Forbidden access');
          break;
        case 500:
          console.error('Server error');
          break;
      }
    }
    return Promise.reject(error);
  }
);

export const employeeService = {
  getEmployees: async (
    params: {
      page?: number;
      per_page?: number;
      search?: string;
      department_id?: number;
      min_salary?: number;
      max_salary?: number;
      sort_by?: string;
      sort_dir?: 'asc' | 'desc';
    } = {}
  ) => {
    const response = await apiClient.get<PaginatedResponse<Employee>>(
      '/employees',
      { params }
    );
    return response.data;
  },

  getEmployeeById: async (id: string) => {
    const response = await apiClient.get<Employee>(`/employees/${id}`);
    return response.data;
  },

  createEmployee: async (data: EmployeeFormData) => {
    const response = await apiClient.post<Employee>('/employees', data);
    return response.data;
  },

  updateEmployee: async (id: string, data: EmployeeFormData) => {
    const response = await apiClient.put<Employee>(`/employees/${id}`, data);
    return response.data;
  },

  deleteEmployee: async (id: string) => {
    await apiClient.delete(`/employees/${id}`);
  },
};

export const departmentService = {
  getDepartments: async () => {
    const response = await apiClient.get<Department[]>('/departments');
    return response.data;
  },

  createDepartment: async (data: { name: string; description?: string }) => {
    const response = await apiClient.post<Department>('/departments', data);
    return response.data;
  },

  updateDepartment: async (
    id: number,
    data: { name: string; description?: string }
  ) => {
    const response = await apiClient.put<Department>(
      `/departments/${id}`,
      data
    );
    return response.data;
  },

  deleteDepartment: async (id: number) => {
    await apiClient.delete(`/departments/${id}`);
  },
};
