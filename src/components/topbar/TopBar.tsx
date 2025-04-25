import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_PROFILE } from './topbarApi/TopBarAPI';
import searchicon from '../../assets/images/Search.svg';
import profilepic from '../../assets/images/profilepic.jpg';
import './TopBar.scss';
import ProfileMenu from '../menuitems/ProfileMenu';

const TopBar = () => {
  const { data, loading, error } = useQuery(GET_USER_PROFILE);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
 
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  if (loading) return <div className='topbar-outer-class'>Loading...</div>;
  if (error) return <div className='topbar-outer-class'>Error loading profile</div>;

  const user = data?.get_user_profile;
  const fullName =  user[0]?.u_full_name;
  const imageKey =  user[0]?.u_avatar_url;
  const profileImageUrl = imageKey ? `${process.env.REACT_APP_DEV_LINK}${imageKey}` : profilepic;



  return (
    <div className='topbar-container'>
      <div className='topbar-outer-class'>
        <div className='top-bar-search'>
          <div className="search">
            <img src={searchicon} alt="search" />
            <input type="text" className='searchbar' placeholder='Search...' />
          </div>
        </div>
        <div className='top-bar-profile' onClick={toggleMenu}>
          <div className='topbar-proflie-pic'>
            <img 
              src={profileImageUrl} 
              alt="profile" 
              className='profilepic'
            />
          </div>
          <div className='topbar-profile-name'>
            <p>{fullName || 'Guest'}</p>
          </div>
        </div>
      </div>
      <div className={`menu-options ${isMenuOpen ? 'menu-active' : ''}`}>
        <ProfileMenu onItemClick={toggleMenu} />
      </div>
    </div>
  );
};

export default TopBar;