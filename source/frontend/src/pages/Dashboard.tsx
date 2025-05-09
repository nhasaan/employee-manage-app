import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  HiOutlineUsers,
  HiOutlineCurrencyDollar,
  HiOutlineBriefcase,
} from 'react-icons/hi';
import { employeeService } from '@/services/api';

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => (
  <div className={`card flex items-center p-6 ${color}`}>
    <div className="mr-4 text-white rounded-full p-3 bg-opacity-20">{icon}</div>
    <div>
      <h3 className="text-sm text-gray-600 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { data: employees, isLoading } = useQuery({
    queryKey: ['employees', 'stats'],
    queryFn: () => employeeService.getEmployees({ per_page: 1 }),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-3 gap-6">
        <StatCard
          title="Total Employees"
          value={employees?.meta.total || 0}
          icon={<HiOutlineUsers className="w-6 h-6" />}
          color="bg-primary-50"
        />
        <StatCard
          title="Departments"
          value={3}
          icon={<HiOutlineBriefcase className="w-6 h-6" />}
          color="bg-green-50"
        />
        <StatCard
          title="Average Salary"
          value="$75,000"
          icon={<HiOutlineCurrencyDollar className="w-6 h-6" />}
          color="bg-blue-50"
        />
      </div>
    </div>
  );
};

export default Dashboard;
