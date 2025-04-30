import React from "react";
import { useQuery } from "@apollo/client";
import { GET_LIST_TICKETS, ListTicket } from "./ListTicketsAPI/ListTicketsAPI";
import CustomTable, { Column } from "../../../components/customTable/CustomTable";
import { CircularProgress } from "@mui/material";
const useListTickets = (pageSize: number, pageOffset: number) => {
  const { loading, error, data, refetch } = useQuery(GET_LIST_TICKETS, {
    variables: {
      pageSize,
      pageOffset,
      search_event: "%",
      ticketStatus: null,
      ticketId: null,
      ticketPlacementId: null,
      array_tpid: null,
      enddate: null,
      leagueId: null,
      startdate: null,
      order_by: null,
    },
    fetchPolicy: "network-only",
  });
  const tickets: ListTicket[] = data?.filterlisttickets || [];
  const totalCount: number = data?.filterlisttickets_aggregate?.aggregate?.count || 0;

  return { loading, error, tickets, totalCount, refetch };
};
const ListTickets = () => {
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { loading, error, tickets, totalCount } = useListTickets(
    rowsPerPage,
    (page - 1) * rowsPerPage
  );
  const handlePageChange = (newPage: number) => setPage(newPage);
  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(1);
  };
  const columns: Column<ListTicket>[] = [
    { id: "e_name", label: "Event" },
    { id: "e_date", label: "Date" },
    { id: "e_address", label: "Venue" },
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
    { id: "tp_row", label: "Row" },
    { id: "tp_seat_no", label: "Seat No" },
    { id: "tp_status", label: "Status" },
    { id: "u_full_name", label: "User Name" },
    { id: "u_email_id", label: "Email" },
    { id: "tp_list_price", label: "Price" },
  ];
  if (loading) return <div className="circular-progress"><CircularProgress/></div>
  if (error) return <div>Error loading list tickets.</div>;
  return (
    <div>
      <CustomTable
        columns={columns}
        data={tickets}
        getRowId={(row: ListTicket) => row.tp_id}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        totalCount={totalCount}
        hideCheckbox={true}
      />
    </div>
  );
};
export default ListTickets;
