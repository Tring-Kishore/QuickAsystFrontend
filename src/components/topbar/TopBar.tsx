import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_PROFILE } from './topbarApi/TopBarAPI';
import searchicon from '../../assets/images/Search.svg';
import profilepic from '../../assets/images/profilepic.jpg';
import menuIcon from '../../assets/images/burgericon.svg';
import './TopBar.scss';
import ProfileMenu from '../menuitems/ProfileMenu';
import MobileMenu from '../mobileMenu/MobileMenu';
import sidebarsmalllogo from '../../assets/images/QuickAsystLogosidebar.svg';
const TopBar = () => {
  const { data, loading , error } = useQuery(GET_USER_PROFILE);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleProfileMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  if (loading){
     return <div className='topbar-outer-class'>Loading...</div>
    }
  if(error){
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
        <div className="topbar-mobile-logo">
        <img src={sidebarsmalllogo} alt="quick asyst logo"/>
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
              <p>{fullName}</p>
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

      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={toggleMobileMenu}
      />
    </>
  );
};

export default TopBar;
