// Base interfaces for common data structures

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links?: {
    first?: string;
    last?: string;
    prev?: string | null;
    next?: string | null;
  };
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

// Utility type for making properties optional
export type Nullable<T> = {
  [P in keyof T]?: T[P] | null;
}

export interface Department {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface EmployeeDetail {
  designation: string;
  salary: number;
  address: string;
  joined_date: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: Department;
  designation: string;
  salary: number;
  address: string;
  joined_date: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links?: {
    first?: string;
    last?: string;
    prev?: string | null;
    next?: string | null;
  };
}

export interface EmployeeFormData {
  name: string;
  email: string;
  department_id: number;
  designation: string;
  salary: number;
  address: string;
  joined_date: string;
}
