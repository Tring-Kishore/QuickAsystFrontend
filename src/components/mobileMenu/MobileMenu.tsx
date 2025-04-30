import React from 'react';
import { sidebarItems} from '../../Pages/sidebar/SideBar';
import { profileMenuItems } from '../menuitems/ProfileMenu';
import './MobileMenu.scss';
import { useNavigate } from 'react-router-dom';

interface MobileMenuProps {
  isOpen:boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({isOpen, onClose }) => {
  const navigate = useNavigate();
  if(!isOpen){
     return null
    }
  
  const handleItemClick = (path?: string) => {
    if (path) {
      navigate(path);
    }
    onClose();
  };

  return (
    <div className="mobile-menu-container">
      <div className="mobile-menu-content">
        <div className="mobile-menu-section">
          <h3 className="section-title">Menu</h3>
          <div className="options-list">
            {sidebarItems.map((item) => (
              <div 
                key={item.id} 
                className="menu-option" 
                onClick={() => handleItemClick(item.path)}
              >
                <div className="option-icon">
                  <img src={item.icon} alt={item.altText} />
                </div>
                <div className="option-text">{item.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mobile-menu-section">
          <h3 className="section-title">Account</h3>
          <div className="options-list">
            {profileMenuItems.map((item, index) => (
              <div 
                key={index} 
                className="menu-option"
                onClick={() => handleItemClick(item.path)}
              >
                <div className="option-icon">
                  <img src={item.icon} alt={item.text} />
                </div>
                <div className="option-text">{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
