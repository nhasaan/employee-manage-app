import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import {
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineSearch,
  HiOutlinePlus,
} from 'react-icons/hi';

import { employeeService, departmentService } from '@/services/api';
import { Employee } from '@/types';
import ConfirmModal from '@/components/ConfirmModal';
import LoadingSpinner from '@/components/LoadingSpinner';

const EmployeeList: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<number | null>(null);
  const [deleteEmployee, setDeleteEmployee] = useState<Employee | null>(null);

  // Fetch employees
  const {
    data: employeesData,
    isLoading: isEmployeesLoading,
    refetch: refetchEmployees,
  } = useQuery({
    queryKey: ['employees', page, search, departmentFilter],
    queryFn: () =>
      employeeService.getEmployees({
        page,
        search,
        department_id: departmentFilter || undefined,
        per_page: 10,
      }),
  });

  // Fetch departments for filtering
  const { data: departments, isLoading: isDepartmentsLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentService.getDepartments(),
  });

  const handleDeleteEmployee = async () => {
    if (deleteEmployee) {
      try {
        await employeeService.deleteEmployee(deleteEmployee.id);
        refetchEmployees();
        setDeleteEmployee(null);
      } catch (error) {
        console.error('Failed to delete employee', error);
      }
    }
  };

  const renderPagination = () => {
    if (!employeesData) return null;

    const { meta } = employeesData;
    const pageNumbers = [];

    for (let i = 1; i <= meta.last_page; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`
            px-4 py-2 border 
            ${
              page === i
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }
          `}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex justify-center items-center space-x-2 mt-6">
        {pageNumbers}
      </div>
    );
  };

  if (isEmployeesLoading || isDepartmentsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Employees</h1>
        <Link to="/employees/new" className="btn btn-primary flex items-center">
          <HiOutlinePlus className="mr-2" /> Add Employee
        </Link>
      </div>

      <div className="flex mb-4 space-x-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input pl-10"
          />
          <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <select
          value={departmentFilter || ''}
          onChange={(e) =>
            setDepartmentFilter(e.target.value ? Number(e.target.value) : null)
          }
          className="form-input"
        >
          <option value="">All Departments</option>
          {departments?.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employeesData?.data.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.department.name}</td>
                <td>{employee.designation}</td>
                <td>${employee.salary.toLocaleString()}</td>
                <td>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/employees/edit/${employee.id}`)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <HiOutlinePencil />
                    </button>
                    <button
                      onClick={() => setDeleteEmployee(employee)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <HiOutlineTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {renderPagination()}

      {deleteEmployee && (
        <ConfirmModal
          isOpen={!!deleteEmployee}
          title="Confirm Deletion"
          message={`Are you sure you want to delete ${deleteEmployee.name}?`}
          onConfirm={handleDeleteEmployee}
          onCancel={() => setDeleteEmployee(null)}
        />
      )}
    </div>
  );
};

export default EmployeeList;
