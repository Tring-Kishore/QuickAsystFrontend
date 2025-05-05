import React, { useState } from "react";
import { Box, Tab, Tabs, Button, Menu, MenuItem, Popover } from "@mui/material";
import { FilterList as FilterIcon } from "@mui/icons-material";
import { useMutation, useQuery } from '@apollo/client';
import "./Tickets.scss";
import ManageTickets from "./manageTickets/ManageTickets";
import bulkactionicon from "../../assets/images/bulkactionicon.svg";
import CustomDialogue from "../../components/customDialogue/CustomDialogue";
import { UPDATE_TICKET_STATUS, GET_MANAGE_TICKETS } from "./manageTickets/manageTicketsAPI/ManageTicketsAPI";
import DelistReturn from "./delistReturn/DelistReturn";
import DelistUnsold from "./delistUnsold/DelistUnsold";
import ListTickets from "./listTickets/ListTickets";
import SoldTickets from "./soldTickets/SoldTickets";
import { showInfoToast } from "../../components/CustomToast/CustomToast";
type FilterState = {
  leagueId: string | null;
  validationStatus: boolean | null;
  dateRange: string | null;
  startDate: string | null;
  endDate: string | null;
  daysLeft: number | null;
  listStatus: string | null;
  soldTicketsStatus: string | null;
  soldTicketsType: 'Voided_Payout' | 'Unvoided_Payout' | null;
};

const Tickets = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTicketIds, setSelectedTicketIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    leagueId: null,
    validationStatus: null,
    dateRange: null,
    startDate: null,
    endDate: null,
    daysLeft: null,
    listStatus: null,
    soldTicketsStatus: null,
    soldTicketsType: null,
  });

  const [updateTicketStatus] = useMutation(UPDATE_TICKET_STATUS);
  const { refetch } = useQuery(GET_MANAGE_TICKETS, {
    fetchPolicy: 'network-only',
  });

  const bulkActionOpen = Boolean(anchorEl);
  const filterOpen = Boolean(filterAnchorEl);

  const handleFilterApply = (newFilters: FilterState) => {
    setFilters(newFilters);
    setFilterAnchorEl(null);
  };

  const handleTabChange = (event: any, newValue: number) => {
    setActiveTab(newValue);
    setFilters({
      leagueId: null,
      validationStatus: null,
      dateRange: null,
      startDate: null,
      endDate: null,
      daysLeft: null,
      listStatus: null,
      soldTicketsStatus: null,
      soldTicketsType: null,
    });
  };

  const handleSelectionChange = (selectedIds: string[]) => {
    setSelectedTicketIds(selectedIds);
  };

  const handleBulkActionClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setFilterAnchorEl(null);
  };

  const handleBulkAction = async (action: string) => {
    if (selectedTicketIds.length === 0) {
      showInfoToast("Please select at least one ticket");
      handleClose();
      return;
    }
    try {
      let isValid: boolean | null = null;
      switch (action) {
        case 'Valid':
          isValid = true;
          break;
        case 'Invalid':
          isValid = false;
          break;
        case 'Publish':
          break;
        case 'Return':
          break;
      }
      if (isValid !== null) {
        await updateTicketStatus({
          variables: {
            ticketPlacementId: selectedTicketIds,
            isValid,
            isUndoRequest: false,
          },
        });
        await refetch();
      }
      handleClose();
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <ManageTickets onSelectionChange={handleSelectionChange} filters={filters} />;
      case 1:
        return <ListTickets filters={filters} />;
      case 2:
        return <SoldTickets filters={filters} />;
      case 3:
        return <DelistReturn filters={filters} />;
      case 4:
        return <DelistUnsold filters={filters} />;
      default:
        return null;
    }
  };

  return (
    <div className="tickets-outer-class">
      <div className="btns">
        <div>
          <Box className="all-tabs">
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              className="custom-tabs"
              aria-label="Tickets"
            >
              <Tab label="Manage Tickets" className="tab" />
              <Tab label="List Tickets" className="tab" />
              <Tab label="Sold Tickets" className="tab" />
              <Tab label="Delist And Return" className="tab" />
              <Tab label="Delist And Unsold" className="tab" />
            </Tabs>
          </Box>
        </div>
        <div className="tickets-btns">
          <div className="tickets-btns-top">
            {activeTab === 0 && (
              <>
                <Button
                  className="bulk-action-btn"
                  variant="outlined"
                  endIcon={<img src={bulkactionicon} className="bulk-action-icon-style" />}
                  onClick={handleBulkActionClick}
                >
                  Bulk Action
                </Button>
                <Menu
                  id="fade-menu"
                  anchorEl={anchorEl}
                  open={bulkActionOpen}
                  onClose={handleClose}
                >
                  <MenuItem onClick={() => handleBulkAction('Valid')}>Valid</MenuItem>
                  <MenuItem onClick={() => handleBulkAction('Invalid')}>Invalid</MenuItem>
                  <MenuItem onClick={() => handleBulkAction('Publish')}>Publish</MenuItem>
                  <MenuItem onClick={() => handleBulkAction('Return')}>Return</MenuItem>
                </Menu>
              </>
            )}
            <Button
              className="tickets-filter-btn"
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={handleFilterClick}
            >
              Filter
            </Button>
            <Popover
              open={filterOpen}
              anchorEl={filterAnchorEl}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <CustomDialogue onActiveTabs={activeTab} onApplyFilters={handleFilterApply} onClose={() => setFilterAnchorEl(null)} />
            </Popover>
          </div>
        </div>
      </div>
      {renderTabContent()}
    </div>
  );
};

export default Tickets;
