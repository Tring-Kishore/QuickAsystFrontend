import React, { useState } from 'react';
import { 
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Dialog
} from '@mui/material';
import manageAccountsLogo from '../../assets/images/Manage_Accounts.svg';
import reseticon from '../../assets/images/LockReset.svg';
import signouticon from '../../assets/images/Signout.svg';
import './ProfileMenu.scss'; 
import { useNavigate } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth';
import CustomPassword from '../customPassword/CustomPassword';

export interface MenuItem {
  icon: string;
  text: string;
  path?: string;
  onClick?: () => void;
}

export const profileMenuItems: MenuItem[] = [
  { 
    icon: manageAccountsLogo, 
    text: 'My Account',
    path: '/dashboard/profile'
  },
  { 
    icon: reseticon, 
    text: 'Change Password'
  },
  {
    icon: signouticon,
    text: 'Sign Out'
  }
];

interface ProfileMenuProps {
  onItemClick: () => void; 
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ onItemClick }) => {
  const navigate = useNavigate();
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);

  const handleItemClick = (item: MenuItem) => {
    if (item.path) {
      navigate(item.path);
    }
    onItemClick();
    
    if (item.text === 'Sign Out') {
      signOut({ global: true })
        .then(() => window.location.href = '/signin')
        .catch(error => console.error('Error signing out:', error));
    }
    if (item.text === 'Change Password') {
      setOpenPasswordDialog(true);
    }
  };

  const handleClosePasswordDialog = () => {
    setOpenPasswordDialog(false);
  };

  return (
    <>
      <Box component="nav" className="navContainer"> 
        <List sx={{ padding: 0 }}>
          {profileMenuItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton 
                className="styledListItemButton"
                onClick={() => handleItemClick(item)}
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

      <Dialog
        open={openPasswordDialog}
        onClose={handleClosePasswordDialog}
        maxWidth="sm"
        fullWidth
      >
        <CustomPassword onClose={handleClosePasswordDialog} />
      </Dialog>
    </>
  );
};

export default ProfileMenu;