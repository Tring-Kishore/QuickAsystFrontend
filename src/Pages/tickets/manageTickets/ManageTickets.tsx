import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Chip, MenuItem, Select } from "@mui/material";
import CustomTable, { Column } from "../../../components/customTable/CustomTable";
import {
  GET_MANAGE_TICKETS,
  UPDATE_TICKET_STATUS,
  ManageTicket,
} from "./manageTicketsAPI/ManageTicketsAPI";
import "./ManageTickets.scss";
import CircularProgress from '@mui/material/CircularProgress';
import { calculateDaysLeft, formatToCDT } from "../../../utils/DateFomatter";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface Filters {
  leagueId: string | null;
  validationStatus: boolean | null;
  dateRange: string | null;
  startDate: string | null;
  endDate: string | null;
  daysLeft: number | null;
}

interface ManageTicketsProps {
  onSelectionChange: (selectedIds: string[]) => void;
  filters: Filters;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

const useManageTickets = (
  pageSize: number,
  pageOffset: number,
  filters: Filters,
  orderBy: { [key: string]: string | 'asc' | 'desc' }[]
) => {
  const { loading, error, data, refetch } = useQuery(GET_MANAGE_TICKETS, {
    variables: {
      pageSize,
      pageOffset,
      search_event: "%",
      ticketStatus: filters.validationStatus !== null ? 
        (filters.validationStatus ? "Verified" : "Delist") : 
        null,
      ticketId: null,
      tpId: null,
      array_tpid: null,
      day: filters.daysLeft || null,
      enddate: filters.endDate || null,
      leagueId: filters.leagueId || null,
      startdate: filters.startDate || null,
      order_by: orderBy,
    },
    fetchPolicy: "network-only",
  });

  const [updateTicketStatus] = useMutation(UPDATE_TICKET_STATUS);

  const tickets = data?.filtermanagetickets || [];
  const totalCount = data?.filtermanagetickets_aggregate?.aggregate?.count || 0;

  const handleStatusChange = async (
    ticketId: string,
    newValidityStatus: boolean | null
  ) => {
    try {
      await updateTicketStatus({
        variables: {
          ticketPlacementId: [ticketId],
          isValid: newValidityStatus === null ? null : newValidityStatus,
          isUndoRequest: false,
        },
      });
      refetch();
    } catch (error) {
      console.error("Error updating ticket status:", error);
      throw error;
    }
  };

  return {
    loading,
    error,
    tickets,
    totalCount,
    handleStatusChange,
    refetch,
  };
};

const ManageTickets = ({ onSelectionChange, filters }: ManageTicketsProps) => {
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'tp_updated_at',
    direction: 'desc',
  });

  const handleSortChange = (sortBy: string, sortDirection: 'asc' | 'desc') => {
    setSortConfig({ key: sortBy, direction: sortDirection });
  };

  const {
    loading,
    error,
    tickets,
    totalCount,
    handleStatusChange,
  } = useManageTickets(
    rowsPerPage, 
    (page - 1) * rowsPerPage,
    filters,
    [
      { [sortConfig.key]: sortConfig.direction },
      { tp_id: 'asc' }
    ]
  );

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(1);
  };

  const handleSelectionChange = (ids: (string | number)[]) => {
    onSelectionChange(ids as string[]);
  };

  const getStatusFromValidity = (validityStatus: boolean | null): string => {
    if (validityStatus === null) {
      return "ToBeVerified";
    } 
    return validityStatus ? "Verified" : "Delist";
  };

  const CustomArrowIcon = () => (
    <KeyboardArrowDownIcon className="custom-select-icon" />
  );

  const columns: Column<ManageTicket>[] = [
    { id: "e_name", label: "Events", className: 'column-events' },
    {
      id: "e_date",
      label: "Date",
      format: (value) => `${formatToCDT(value)} CDT`,
      className: 'column-date',
    },
    { id: "e_address", label: "Venue", className: 'column-venue' },
    {
      id: "tp_section",
      label: (
        <div className="ticket-placement-header">
          <div className="main-header">Ticket Placement</div>
          <div className="sub-headers">
            <span>Section</span>
            <span>Row</span>
            <span>Seat</span>
          </div>
        </div>
      ),
      format: (_, row) => (
        <div className="ticket-placement-values">
          <span>{row.tp_section}</span>
          <span>{row.tp_row}</span>
          <span>{row.tp_seat_no}</span>
        </div>
      ),
      className: 'column-ticket-placement',
    },
    {
      id: "tp_validity_status",
      label: "Validate",
      format: (value: boolean | null, row: ManageTicket) => {
        const handleChange = async (event: any) => {
          let newValue: boolean | null = null;
          if (event.target.value === "Valid") {
            newValue = true;
          } else if (event.target.value === "Invalid") {
            newValue = false;
          }
          await handleStatusChange(row.tp_id, newValue);
        };
        let selectValue = value ? "Valid" : (!value ? "Invalid" : "Select");
        return (
          <Select className="select-validate"
            value={selectValue}
            onChange={handleChange}
            size="small"
            IconComponent={CustomArrowIcon}
          >
            <MenuItem value="Select">Select</MenuItem>
            <MenuItem value="Valid">Valid</MenuItem>
            <MenuItem value="Invalid">Invalid</MenuItem>
          </Select>
        );
      },
      className: 'column-validate',
    },
    {
      id: "tp_status",
      label: "Status",
      format: (_, row) => {
        const status = getStatusFromValidity(row.tp_validity_status);
        const statusValue = status.toLowerCase().replace(/\s+/g, "");
        const displayText =
          status === "ToBeVerified" ? "To Be Verified" : status;

        return (
          <Chip
            className="custom-chip"
            data-status={statusValue}
            label={displayText}
            size="medium"
            variant="filled"
          />
        );
      },
      className: 'column-status',
    },
    { id: "full_name", label: "User Name", className: 'column-user-name' },
    { id: "u_email_id", label: "Email" },
    {
      id: "e_date_time_zone",
      label: "Period Left",
      format: (value: string) => calculateDaysLeft(value),
      className: 'column-period-left'
    }
  ];

  if (loading) {
    return <div className="circular-progress"><CircularProgress /></div>;
  } 
  if (error) {
    return <div>Error loading tickets</div>;
  } 
  return (
    <div className="manageTicket-fullheight">
      <CustomTable
        columns={columns}
        data={tickets}
        getRowId={(row: ManageTicket) => row.tp_id}
        onSelectionChange={handleSelectionChange}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        totalCount={totalCount}
        tabName="manageTickets"
        onSortChange={handleSortChange}
      />
    </div>
  );
};

export default ManageTickets;
