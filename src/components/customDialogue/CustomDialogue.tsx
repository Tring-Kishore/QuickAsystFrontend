import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import {
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Checkbox,
  SelectChangeEvent,
} from "@mui/material";
import "./CustomDialogue.scss";
import DayProgress from "../customProgress/DaysProgress";
import { GET_LEAGUES } from "./CustomDialogueAPI/CustomDialogueAPI";
import { 
  formatDate, 
  getEndOfMonth, 
  getLastMonthEnd, 
  getLastMonthStart, 
  getStartOfMonth, 
  getStartOfToday, 
  getStartOfYesterday 
} from "../../utils/DateFomatter";
import CloseIcon from '@mui/icons-material/Close';
type ValidationStatus = boolean | null;
type DateRange = 'Today' | 'Yesterday' | 'Last 30 days' | 'This month' | 'Last month' | null;
type ListStatus = 'List' | 'DelistInProgress' | null;
type SoldTicketsStatus = 'NotInitiated' | 'Inprogress' | 'Success' | 'Failed' | null;
type SoldTicketsType = 'Voided_Payout' | 'Unvoided_Payout' | null;

interface Filters {
  leagueId: string | null;
  validationStatus: ValidationStatus;
  dateRange: DateRange;
  startDate: string | null;
  endDate: string | null;
  daysLeft: number | null;
  listStatus: ListStatus;
  soldTicketsStatus: SoldTicketsStatus;
  soldTicketsType: SoldTicketsType;
}

interface CustomDialogueProps {
  onActiveTabs: number;
  onApplyFilters: (filters: Filters) => void;
  onClose?: () => void;
}

const CustomDialogue = ({ onActiveTabs, onApplyFilters, onClose }: CustomDialogueProps) => {

  const [filters, setFilters] = useState<Filters>({
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

  const { loading, error, data } = useQuery(GET_LEAGUES);
  const dateOptions: DateRange[] = ["Today", "Yesterday", "Last 30 days", "This month", "Last month"];

  const handleReset = () => {
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

  const handleApply = () => {
    let { startDate, endDate } = filters;

    if (filters.dateRange) {
      switch (filters.dateRange) {
        case "Today":
          startDate = formatDate(getStartOfToday());
          endDate = null;
          break;
        case "Yesterday":
          startDate = formatDate(getStartOfYesterday());
          endDate = null;
          break;
        case "Last 30 days":
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          startDate = formatDate(thirtyDaysAgo);
          endDate = formatDate(new Date());
          break;
        case "This month":
          startDate = formatDate(getStartOfMonth());
          endDate = formatDate(getEndOfMonth());
          break;
        case "Last month":
          startDate = formatDate(getLastMonthStart());
          endDate = formatDate(getLastMonthEnd());
          break;
      }
    }

    const filtersToApply: Filters = {
      ...filters,
      startDate,
      endDate,
      validationStatus: onActiveTabs === 0 ? filters.validationStatus : null,
      daysLeft: onActiveTabs === 0 ? filters.daysLeft : null,
      listStatus: onActiveTabs === 1 ? filters.listStatus : null,
      soldTicketsStatus: onActiveTabs === 2 ? filters.soldTicketsStatus : null,
      soldTicketsType: onActiveTabs === 2 ? filters.soldTicketsType : null,
    };

    onApplyFilters(filtersToApply);
  };

  const handleValidationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFilters(prev => ({
      ...prev,
      validationStatus: value === 'true' ? true : value === 'false' ? false : null
    }));
  };

  const handleListStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFilters(prev => ({
      ...prev,
      listStatus: value === 'List' ? 'List' : value === 'DelistInProgress' ? 'DelistInProgress' : null
    }));
  };

  const handleSoldTicketsStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFilters(prev => ({
      ...prev,
      soldTicketsStatus: ['NotInitiated', 'Inprogress', 'Success', 'Failed'].includes(value) 
        ? value as SoldTicketsStatus 
        : null,
      soldTicketsType: value === 'Voided_Payout' 
        ? 'Voided_Payout' 
        : ['NotInitiated', 'Inprogress', 'Success', 'Failed'].includes(value)
          ? 'Unvoided_Payout'
          : null
    }));
  };

  const handleDateChange = (dateOption: DateRange) => {
    setFilters(prev => ({ ...prev, dateRange: dateOption }));
  };

  const handleLeagueChange = (event: SelectChangeEvent) => {
    setFilters(prev => ({ ...prev, leagueId: event.target.value || null }));
  };

  const handleDaysLeftChange = (value: number | null) => {
    setFilters(prev => ({ ...prev, daysLeft: value }));
  };

  return (
    <div className="custom-dialogue-outer-class">
      <div className="custom-dialogue-top">
        <h3>Filter</h3>
        <button className="close-button" onClick={onClose || handleReset}>
          <CloseIcon />
        </button>
      </div>
      <div className="custom-dialogue-content">
        <div className="custom-dialogue-event">
          <p>Event</p>
          <Select 
            value={filters.leagueId || ''} 
            onChange={handleLeagueChange} 
            size="small" 
            displayEmpty 
            fullWidth
          >
            <MenuItem value="" disabled>
              {loading ? "Loading leagues..." : "Select a league"}
            </MenuItem>
            {error && <MenuItem value="" disabled>Error loading leagues</MenuItem>}
            {data?.leagues?.map((league: { l_id: string; l_name: string }) => (
              <MenuItem key={league.l_id} value={league.l_id}>
                {league.l_name}
              </MenuItem>
            ))}
          </Select>
        </div>

        {onActiveTabs === 0 && (
          <div className="custom-dialog-validate">
            <p>Validate</p>
            <FormControl component="fieldset">
              <RadioGroup
                row
                aria-label="validation"
                name="validation-radio-group"
                value={String(filters.validationStatus)}
                onChange={handleValidationChange}
              >
                <FormControlLabel value="true" control={<Radio color="primary" />} label="Valid" />
                <FormControlLabel value="false" control={<Radio color="primary" />} label="Invalid" />
              </RadioGroup>
            </FormControl>
          </div>
        )}

        {onActiveTabs === 1 && (
          <div className="custom-dialog-validate">
            <p>Status</p>
            <FormControl component="fieldset">
              <RadioGroup 
                row 
                aria-label="list-status" 
                name="list-status-radio-group" 
                value={filters.listStatus || ''} 
                onChange={handleListStatus}
              >
                <FormControlLabel value="List" control={<Radio color="primary" />} label="Listed" />
                <FormControlLabel value="DelistInProgress" control={<Radio color="primary" />} label="Delist requested" />
              </RadioGroup>
            </FormControl>
          </div>
        )}

        {onActiveTabs === 2 && (
          <div className="custom-dialog-validate">
            <p>Status</p>
            <FormControl component="fieldset">
              <RadioGroup 
                row 
                aria-label="sold-tickets-status" 
                name="sold-tickets-status-radio-group" 
                value={filters.soldTicketsStatus || filters.soldTicketsType || ''} 
                onChange={handleSoldTicketsStatus}
              >
                <FormControlLabel value="NotInitiated" control={<Radio color="primary" />} label="Sold" />
                <FormControlLabel value="Inprogress" control={<Radio color="primary" />} label="In Progress" />
                <FormControlLabel value="Success" control={<Radio color="primary" />} label="Settled" />
                <FormControlLabel value="Failed" control={<Radio color="primary" />} label="Failed" />
                <FormControlLabel value="Voided_Payout" control={<Radio color="primary" />} label="Voided Payout" />
              </RadioGroup>
            </FormControl>
          </div>
        )}

        <div className="custom-dialogue-date">
          <p>Date</p>
          <div className="date-options-paper">
            {dateOptions.map((option) => (
              <div key={option} className="date-option" onClick={() => handleDateChange(option)}>
                <span>{option}</span>
                <Checkbox checked={filters.dateRange === option} color="primary" size="small" />
              </div>
            ))}
          </div>
        </div>

        {onActiveTabs === 0 && (
          <div className="custom-dialogue-period-left">
            <p>Period Left</p>
            <DayProgress value={filters.daysLeft} onChange={handleDaysLeftChange} />
          </div>
        )}

        <div className="custom-dialogue-btns">
          <button className="dialogue-reset-btn" onClick={handleReset}>Reset</button>
          <button className="dialogue-apply-btn" onClick={handleApply}>Apply</button>
        </div>
      </div>
    </div>
  );
};

export default CustomDialogue;