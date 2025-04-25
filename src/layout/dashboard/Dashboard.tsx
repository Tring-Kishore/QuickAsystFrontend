import React from 'react';
import SideBar from '../../Pages/sidebar/SideBar';
import { Outlet } from 'react-router-dom';
import './Dashboard.scss';

const Dashboard: React.FC = () => {
  return (
    <div className='outer-class-dashboard'>
    <SideBar/>
    <div className='content-dashboard'>
      <Outlet />
    </div>
  </div>
  );
};

export default Dashboard;
