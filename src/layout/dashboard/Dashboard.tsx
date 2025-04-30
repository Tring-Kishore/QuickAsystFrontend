import React from 'react';
import SideBar from '../../Pages/sidebar/SideBar';
import { Outlet } from 'react-router-dom';
import './Dashboard.scss';
import TopBar from '../../components/topbar/TopBar';
const Dashboard: React.FC = () => {
  return (
    <div className='outer-class-dashboard'>
    <SideBar/>
    <div className='content-dashboard'>
      <TopBar/>
      <Outlet />
    </div>
  </div>
  );
};
export default Dashboard;
