import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar/Sidebar';
import "./MainLayout.css";

const MainLayout = () => {
  return (
    <div className="main-page">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="page">
        <Outlet /> {/* This will render the nested routes */}
      </div>
    </div>
  );
};

export default MainLayout;
