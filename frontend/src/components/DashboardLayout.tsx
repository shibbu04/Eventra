// DashboardLayout.tsx
import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  const token = localStorage.getItem('token');
  const [isOpen, setIsOpen] = useState(false);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;