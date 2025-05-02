import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_PROFILE } from './topbarApi/TopBarAPI';
import searchicon from '../../assets/images/Search.svg';
import profilepic from '../../assets/images/profilepic.jpg';
import menuIcon from '../../assets/images/burgericon.svg';
import './TopBar.scss';
import ProfileMenu from '../menuitems/ProfileMenu';
import sidebarsmalllogo from '../../assets/images/QuickAsystLogosidebar.svg';
import { CircularProgress } from '@mui/material';
import { sidebarItems } from '../../Pages/sidebar/SideBar';
import { profileMenuItems } from '../menuitems/ProfileMenu';
import { useNavigate } from 'react-router-dom';

const TopBar = () => {
  const { data, loading, error } = useQuery(GET_USER_PROFILE);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleProfileMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleMobileMenuItemClick = (path?: string) => {
    if (path) {
      navigate(path);
    }
    setIsMobileMenuOpen(false);
  };

  if (loading) {
    return <div className='circular-progress'><CircularProgress /></div>
  }
  if (error) {
    return <div> error </div>
  }

  const user = data?.get_user_profile || [];
  const imageKey = user[0]?.u_avatar_url;
  const fullName = data ? user[0]?.u_full_name : 'Guest';
  const profileImageUrl = imageKey ? `${process.env.REACT_APP_DEV_LINK}${imageKey}` : profilepic;

  return (
    <>
      <div className='topbar-container'>
        <div className='topbar-outer-class'>
          <div className='topbar-mobile-logo'>
            <img src={sidebarsmalllogo} alt="quick asyst logo" />
          </div>
          <div className='top-bar-search'>
            <div className="search">
              <img src={searchicon} alt="search" />
              <input type="text" className='searchbar' placeholder='Search...' />
            </div>
          </div>
          <div className='top-bar-profile' onClick={toggleProfileMenu}>
            <div className='topbar-proflie-pic'>
              <img
                src={profileImageUrl}
                alt="profile"
                className='profilepic'
              />
            </div>
            <div className='topbar-profile-name'>
              <p>{fullName.length > 10 ? fullName.slice(0, 11) + "..." : fullName}</p>
            </div>
          </div>
          <button className="mobile-menu-button" onClick={toggleMobileMenu}>
            <img src={menuIcon} alt="Menu" />
          </button>
        </div>
        <div className={`menu-options ${isMenuOpen ? 'menu-active' : ''}`}>
          <ProfileMenu onItemClick={toggleProfileMenu} />
        </div>
      </div>

      
      {isMobileMenuOpen && (
        <div className="mobile-menu-container">
          <div className="mobile-menu-content">
            <div className="mobile-menu-section">
              <h3 className="section-title">Menu</h3>
              <div className="options-list">
                {sidebarItems.map((item) => (
                  <div
                    key={item.id}
                    className="menu-option"
                    onClick={() => handleMobileMenuItemClick(item.path)}
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
                    onClick={() => handleMobileMenuItemClick(item.path)}
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
      )}
    </>
  );
};

export default TopBar;