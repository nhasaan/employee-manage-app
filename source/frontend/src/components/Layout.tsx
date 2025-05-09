import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  HiOutlineHome,
  HiOutlineUserGroup,
  HiOutlinePlus,
} from 'react-icons/hi';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    {
      path: '/',
      label: 'Dashboard',
      icon: <HiOutlineHome className="w-5 h-5" />,
    },
    {
      path: '/employees',
      label: 'Employee List',
      icon: <HiOutlineUserGroup className="w-5 h-5" />,
    },
    {
      path: '/employees/new',
      label: 'Add Employee',
      icon: <HiOutlinePlus className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="bg-white w-64 p-4 shadow-md h-full fixed left-0 top-0">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary-600">Employee Portal</h1>
      </div>
      <ul>
        {navItems.map((item) => (
          <li key={item.path} className="mb-2">
            <Link
              to={item.path}
              className={`
                flex items-center p-3 rounded-md transition-colors 
                ${
                  location.pathname === item.path
                    ? 'bg-primary-100 text-primary-600'
                    : 'hover:bg-gray-100 text-gray-700'
                }
              `}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

const Layout: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-grow p-8 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
