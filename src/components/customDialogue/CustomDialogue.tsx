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
import { formatDate, getEndOfMonth, getLastMonthEnd, getLastMonthStart, getStartOfMonth, getStartOfToday, getStartOfYesterday } from "../../utils/DateFomatter";
import CloseIcon from '@mui/icons-material/Close';
interface CustomDialogueProps {
  onActiveTabs: number;
  onApplyFilters: (filters: {
    leagueId: string | null;
    validationStatus: boolean | null;
    dateRange: string | null;
    startDate: string | null;
    endDate: string | null;
    daysLeft: number | null;
    listStatus : string | null;
    soldTicketsStatus : string | null;
    soldTicketsType: 'Voided_Payout' | 'Unvoided_Payout' | null;
  }) => void;
  onClose?: () => void;
}

const CustomDialogue = ({ onActiveTabs, onApplyFilters , onClose }: CustomDialogueProps) => {
  const [validationStatus, setValidationStatus] = React.useState<boolean | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
  const [selectedLeague, setSelectedLeague] = React.useState<string>("");
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [listStatus,setListStatus] = useState<string | null>(null);
  const [soldTicketsStatus,setSoldTicketsStatus] = useState<string | null>(null);
  const [soldTicketsType,setSoldTicketsType] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{
    startDate: string | null;
    endDate: string | null;
  }>({ startDate: null, endDate: null });

  const handleReset = () => {
    setValidationStatus(null);
    setSelectedDate(null);
    setSelectedLeague("");
    setDateRange({ startDate: null, endDate: null });
    setDaysLeft(null);
    setListStatus(null);
    setSoldTicketsStatus(null);
    setSoldTicketsType(null);
  };

 
  const handleApply = () => {
    let startDate = null;
    let endDate = null;
    
    if (selectedDate) {
      switch (selectedDate) {
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
        default:
          break;
      }
    }

    onApplyFilters({
      leagueId: selectedLeague || null,
      validationStatus: onActiveTabs === 0 ? validationStatus : null,
      dateRange: selectedDate,
      startDate,
      endDate,
      daysLeft: onActiveTabs === 0 ? daysLeft : null,
      listStatus : onActiveTabs === 1 ? listStatus : null,
      soldTicketsStatus : onActiveTabs === 2 ? soldTicketsStatus : null,
      soldTicketsType: onActiveTabs === 2 ? 
      (soldTicketsStatus === 'Voided_Payout' ? 'Voided_Payout' : 'Unvoided_Payout') 
      : null
  });
  };

  const { loading, error, data } = useQuery(GET_LEAGUES);

  const handleValidationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    let newValue: boolean | null = null;
    if (value === 'true') {
      newValue = true;
    }
    else if (value === 'false') {
      newValue = false;
    }
    setValidationStatus(newValue);
  };

  const handleListStatus = (event : React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    let newValue : string | null = null;
    if(value === 'List'){
      newValue = 'List';
    }
    else if(value === 'DelistInProgress'){
      newValue = 'DelistInProgress'
    }
    setListStatus(newValue);
  }

  const handleSoldTicketsStatus = (event : React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    let newValue : string | null = null;
    let newTypValue : string | null = null;
    if(value === 'NotInitiated'){
      newValue = 'NotInitiated';
      newTypValue = 'Unvoided_Payout';
    }
    else if(value === 'Inprogress'){
      newValue = 'Inprogress';
      newTypValue = 'Unvoided_Payout';
    }
    else if (value === 'Success'){
      newValue = 'Success';
      newTypValue = 'Unvoided_Payout';
    }
    else if(value === 'Failed'){
      newValue = 'Failed';
      newTypValue = 'Unvoided_Payout';
    }
    else if(value === 'Voided_Payout'){
      newValue = null;
      newTypValue = 'Voided_Payout';
    }
    setSoldTicketsStatus(newValue);
    setSoldTicketsType(newTypValue);
  }

  const handleDateChange = (dateOption: string) => {
    setSelectedDate(dateOption);
  };

  const handleLeagueChange = (event: SelectChangeEvent) => {
    setSelectedLeague(event.target.value);
  };

  const dateOptions = [
    "Today",
    "Yesterday",
    "Last 30 days",
    "This month",
    "Last month",
  ];

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
            value={selectedLeague}
            onChange={handleLeagueChange}
            size="small"
            displayEmpty
            fullWidth
          >
            <MenuItem value="" disabled>
              {loading ? "Loading leagues..." : "Select a league"}
            </MenuItem>
            {error && (
              <MenuItem value="" disabled>
                Error loading leagues
              </MenuItem>
            )}
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
                value={validationStatus}
                onChange={handleValidationChange}
              >
                <FormControlLabel
                  value="true"
                  control={<Radio color="primary" />}
                  label="Valid"
                />
                <FormControlLabel
                  value="false"
                  control={<Radio color="primary" />}
                  label="Invalid"
                />
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
                aria-label="validation"
                name="validation-radio-group"
                value={listStatus}
                onChange={handleListStatus}
              >
                <FormControlLabel
                  value="List"
                  control={<Radio color="primary" />}
                  label="Listed"
                />
                <FormControlLabel
                  value="DelistInProgress"
                  control={<Radio color="primary" />}
                  label="Delist requested"
                />
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
                value={soldTicketsStatus || soldTicketsType || ''}
                onChange={handleSoldTicketsStatus}
              >
                <FormControlLabel
                  value="NotInitiated"
                  control={<Radio color="primary" />}
                  label="Sold"
                />
                <FormControlLabel
                  value="Inprogress"
                  control={<Radio color="primary" />}
                  label="In Progress"
                />
                <FormControlLabel
                  value="Success"
                  control={<Radio color="primary" />}
                  label="Settled"
                />
                <FormControlLabel
                  value="Failed"
                  control={<Radio color="primary" />}
                  label="Failed"
                />
                <FormControlLabel
                  value="Voided_Payout"
                  control={<Radio color="primary" />}
                  label="Voided Payout"
                />
              </RadioGroup>
            </FormControl>
          </div>
        )}

        <div className="custom-dialogue-date">
          <p>Date</p>
          <div className="date-options-paper">
            {dateOptions.map((option) => (
              <div
                key={option}
                className="date-option"
                onClick={() => handleDateChange(option)}
              >
                <span>{option}</span>
                <Checkbox
                  checked={selectedDate === option}
                  color="primary"
                  size="small"
                />
              </div>
            ))}
          </div>
        </div>

        {onActiveTabs === 0 && (
          <div className="custom-dialogue-period-left">
            <p>Period Left</p>
            <DayProgress value={daysLeft} onChange={setDaysLeft} />
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
