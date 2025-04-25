
import React, { useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import './Tickets.scss';
import ManageTickets from './manageTickets/ManageTickets';

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

const Tickets = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: any, newValue: number) => {
    setActiveTab(newValue);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <ManageTickets />;
      case 1:
        return <div>List Tickets Content</div>;
      case 2:
        return <div>Sold Tickets Content</div>;
      case 3:
        return <div>Delist And Return Content</div>;
      case 4:
        return <div>Delist And Unsold Content</div>;
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>User Table</h2>
      <div className="btns">
        <Box className='all-tabs'>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            className='custom-tabs'  
            aria-label='Tickets' 
            TabIndicatorProps={{className:'custom-tab-indicator'}}
          >
            <Tab label='Manage Tickets' />
            <Tab label='List Tickets' />
            <Tab label='Sold Tickets' />
            <Tab label='Delist And Return' />
            <Tab label='Delist And Unsold'/>
          </Tabs>
        </Box>
      </div>
      {renderTabContent()}
    </div>
  );
};

export default Tickets;