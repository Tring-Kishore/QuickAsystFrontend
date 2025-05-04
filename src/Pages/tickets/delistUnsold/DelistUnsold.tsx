import React from "react";
import { useQuery } from "@apollo/client";
import CustomTable, { Column } from "../../../components/customTable/CustomTable";
import { FILTER_UNSOLD_TICKETS_QUERY } from "./delistUnsoldAPI/DelistUnsoldAPI";
import { CircularProgress } from "@mui/material";
interface FilterUnsoldTicket {
  tp_id: string;
  e_name: string;
  e_date: string;
  e_address: string;
  tp_section: string;
  tp_row: string;
  tp_seat_no: string;
  u_full_name: string;
  u_email_id: string;
  e_date_time_zone?: string;
}
const DelistUnsold: React.FC = () => {
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { data, loading, error } = useQuery(FILTER_UNSOLD_TICKETS_QUERY, {
    variables: {
      enddate: null,
      startdate: null,
      leagueId: null,
      ticketId: null,
      ticketPlacementId: null,
      array_tpid: null,
      pageSize: rowsPerPage,
      pageOffset: (page - 1) * rowsPerPage,
      order_by: [{ e_name: "asc" }],
      search_event: "%",
      ticketStatus: null,
    },
    fetchPolicy: "network-only",
  });
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(1);
  };
  const columns: Column<FilterUnsoldTicket>[] = [
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
    { id: "u_full_name", label: "User Name", width: "120px" },
    { id: "u_email_id", label: "Email" },
  ];
  if (loading) {
    return <div className="circular-progress"><CircularProgress/></div>
  }
  if (error) {
    return <div>Error loading unsold tickets</div>;
  }
  return (
    <div className="fullheight">
      <CustomTable
        columns={columns}
        data={data?.filterUnsoldTickets || []}
        getRowId={(row: FilterUnsoldTicket) => row.tp_id}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        totalCount={data?.filterUnsoldTickets_aggreagate?.aggregate?.count || 0}
        hideCheckbox={true}
        hideActions={true}
      />
    </div>
  );
};
export default DelistUnsold;
