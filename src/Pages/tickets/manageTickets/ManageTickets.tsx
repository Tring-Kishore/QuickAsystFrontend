import React, { useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Chip, MenuItem, Select } from "@mui/material";
import CustomTable, { Column } from "../../../components/customTable/CustomTable";
import {
  GET_MANAGE_TICKETS,
  UPDATE_TICKET_STATUS,
  ManageTicket,
} from "./manageTicketsAPI/ManageTicketsAPI";
import "./ManageTickets.scss";
interface ManageTicketsProps {
  onSelectionChange: (selectedIds: string[]) => void;
}
const useManageTickets = (pageSize: number, pageOffset: number) => {
  const { loading, error, data, refetch } = useQuery(GET_MANAGE_TICKETS, {
    variables: {
      pageSize,
      pageOffset,
      search_event: "%",
      ticketStatus: null,
      ticketId: null,
      tpId: null,
      array_tpid: null,
      day: null,
      enddate: null,
      leagueId: null,
      startdate: null,
      order_by: null,
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
const ManageTickets = ({ onSelectionChange }: ManageTicketsProps) => {
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const {
    loading,
    error,
    tickets,
    totalCount,
    handleStatusChange,
  } = useManageTickets(rowsPerPage, (page - 1) * rowsPerPage);
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
    if (validityStatus === null) return "ToBeVerified";
    return validityStatus ? "Verified" : "Delist";
  };
  const columns: Column<ManageTicket>[] = [
    { id: "e_name", label: "Events", width: "220px" },
    { id: "e_date", label: "Date", width: "170px" },
    { id: "e_address", label: "Venue", width: "160px" },
    {
      id: "tp_section",
      label: (
        <div className="ticket-placement-header">
          <div className="main-header">Ticket Placement</div>
          <div className="sub-headers">
            <span>Sec</span>
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
      width: "200px",
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
        return (
          <Select
            value={
              value === true ? "Valid" : value === false ? "Invalid" : "Select"
            }
            onChange={handleChange}
            size="small"
          >
            <MenuItem value="Select">Select</MenuItem>
            <MenuItem value="Valid">Valid</MenuItem>
            <MenuItem value="Invalid">Invalid</MenuItem>
          </Select>
        );
      },
      width: "140px",
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
      width: "140px",
    },
    { id: "full_name", label: "User Name", width: "120px" },
    { id: "u_email_id", label: "Email" },
    { id: "e_date_time_zone", label: "Period Left", width: "130px" },
  ];
  if (loading){
    return <div>Loading...</div>;
  } 
  if (error){
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
      />
    </div>
  );
};
export default ManageTickets;
