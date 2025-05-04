import React, { useEffect, useState } from 'react';
import './SideBar.scss';
import logo from '../../assets/images/sidebar-logo.png';
import dashboardlogo from '../../assets/images/Dashboard.svg';
import ticketlogo from '../../assets/images/Ticket.svg';
import sidebarsmalllogo from '../../assets/images/QuickAsystLogosidebar.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
export interface SidebarItem {
  id: string;
  name: string;
  icon: string;
  altText: string;
  path: string;
}
export const sidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: dashboardlogo,
    altText: 'dashboard-logo',
    path: '/dashboard'
  },
  {
    id: 'tickets',
    name: 'Tickets',
    icon: ticketlogo,
    altText: 'ticket-logo',
    path: '/dashboard/tickets'
  }
];
const SideBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>('dashboard');
  const location = useLocation();
  const navigate = useNavigate();
  const toggleNav = () => setIsOpen(!isOpen);
  const handleNavigation = (item: SidebarItem) => {
    setActiveItem(item.id);
    navigate(item.path);
  };
  useEffect(() => {
    const currentPath = location.pathname;
    const currentItem = sidebarItems.find(item => item.path === currentPath);
    if (currentItem) {
      setActiveItem(currentItem.id);
    }
  }, [location]);
  return (
    <>
    <div className={`sidepanel ${isOpen ? 'open' : ''}`}>
      <div className='sidebar-logo'>
        <img src={isOpen ? logo : sidebarsmalllogo} alt="quick asyst logo"/>
      </div>
      <div className="sidebar-list">
        {sidebarItems.map((item) => (
          <div 
            className={`sidebar-options ${activeItem === item.id ? 'active' : ''}`} 
            key={item.id} 
            onClick={() => handleNavigation(item)}
          >
            <div className="sidebar-option-logo">
              <img src={item.icon} alt={item.altText} width={24} height={24} />
            </div>
            {isOpen && (
              <div className="sidebar-option-text">
                <p>{item.name}</p>
              </div>
            )}
          </div>
        ))}
      </div>
        
    </div>
    <div className={`toggle-btn ${isOpen ? 'open' : ''}`} onClick={toggleNav}>
      {isOpen ? <ArrowBackIosNewIcon/> : <ArrowForwardIosIcon/>}
    </div>
    </>
  );
};

export default SideBar;
