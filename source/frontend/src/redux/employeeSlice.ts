import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Employee, PaginatedResponse } from '@/types';

interface EmployeeState {
  employees: Employee[];
  pagination: PaginatedResponse<Employee>['meta'];
  selectedEmployee: Employee | null;
  loading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  pagination: {
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  },
  selectedEmployee: null,
  loading: false,
  error: null,
};

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setEmployees: (
      state,
      action: PayloadAction<PaginatedResponse<Employee>>
    ) => {
      state.employees = action.payload.data;
      state.pagination = action.payload.meta;
    },
    setSelectedEmployee: (state, action: PayloadAction<Employee | null>) => {
      state.selectedEmployee = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addEmployee: (state, action: PayloadAction<Employee>) => {
      state.employees.push(action.payload);
      state.pagination.total += 1;
    },
    updateEmployee: (state, action: PayloadAction<Employee>) => {
      const index = state.employees.findIndex(
        (emp) => emp.id === action.payload.id
      );
      if (index !== -1) {
        state.employees[index] = action.payload;
      }
    },
    removeEmployee: (state, action: PayloadAction<string>) => {
      state.employees = state.employees.filter(
        (emp) => emp.id !== action.payload
      );
      state.pagination.total -= 1;
    },
  },
});

export const {
  setEmployees,
  setSelectedEmployee,
  setLoading,
  setError,
  addEmployee,
  updateEmployee,
  removeEmployee,
} = employeeSlice.actions;

export default employeeSlice.reducer;
