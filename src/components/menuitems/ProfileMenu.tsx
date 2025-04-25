import React from 'react';
import { 
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import manageAccountsLogo from '../../assets/images/Manage_Accounts.svg';
import reseticon from '../../assets/images/LockReset.svg';
import signouticon from '../../assets/images/Signout.svg';
import './ProfileMenu.scss'; 
import { useNavigate } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth';
interface MenuItem {
  icon: string;
  text: string;
  path?: string;
  onClick?: () => void;
}

interface ProfileMenuProps {
  onItemClick: () => void; 
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ onItemClick }) => {
  const navigate = useNavigate();
  
  const menuItems: MenuItem[] = [
    { 
      icon: manageAccountsLogo, 
      text: 'My Account',
      onClick: () => {
        navigate('/dashboard/profile');
        onItemClick();
      }
    },
    { 
      icon: reseticon, 
      text: 'Change Password',
      onClick: () => {
        console.log('Change password clicked');
        onItemClick();
      }
    },
    {
      icon: signouticon,
      text: 'Sign Out',
      onClick: async () => {
        try {
          await signOut({ global: true });
          console.log('Signed out successfully');
          onItemClick();
          window.location.href = '/signin';
        } catch (error) {
          console.error('Error signing out:', error);
        }
      }
    }
  ];

  return (
    <Box component="nav" className="navContainer"> 
      <List sx={{ padding: 0 }}>
        {menuItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton 
              className="styledListItemButton"
              onClick={item.onClick}
            > 
              <ListItemIcon className="menuItemIcon"> 
                <img src={item.icon} alt={`${item.text.toLowerCase()} logo`} />
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                className="menuItemText" 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ProfileMenu;