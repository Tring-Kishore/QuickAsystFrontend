import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_LIST_TICKETS, ListTicket, UPDATE_TICKET_STATUS } from "./ListTicketsAPI/ListTicketsAPI";
import CustomTable, { Column } from "../../../components/customTable/CustomTable";
import { CircularProgress } from "@mui/material";
import { formatToCDT } from "../../../utils/DateFomatter";
import { showErrorToast, showSuccessToast } from "../../../components/CustomToast/CustomToast";
interface ListTicketsProps {
  filters: {
    leagueId: string | null;
    listStatus: string | null;
    dateRange: string | null;
    startDate: string | null;
    endDate: string | null;
  };
}
const useListTickets = (pageSize: number, pageOffset: number,filters: ListTicketsProps['filters'],orderBy:any) => {
  const { loading, error, data, refetch } = useQuery(GET_LIST_TICKETS, {
    variables: {
      pageSize,
      pageOffset,
      search_event: "%",
      ticketStatus: filters.listStatus || null,
      ticketId: null,
      ticketPlacementId: null,
      array_tpid: null,
      enddate: filters.endDate || null,
      leagueId: filters.leagueId || null,
      startdate: filters.startDate || null,
      order_by:orderBy
    },
    fetchPolicy: "network-only",
  });
  useEffect(() => {
      refetch();
    }, [filters, refetch]);
  const tickets: ListTicket[] = data?.filterlisttickets || [];
  const totalCount: number = data?.filterlisttickets_aggregate?.aggregate?.count || 0;

  return { loading, error, tickets, totalCount, refetch };
};
const ListTickets = ({filters} : ListTicketsProps) => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [updateTicketStatus] = useMutation(UPDATE_TICKET_STATUS);
  const [sortConfig, setSortConfig] = useState<{
      key: string;
      direction: 'asc' | 'desc';
    }>({ key: 'tp_updated_at', direction: 'desc' });
  
    const handleSortChange = (sortBy: string, sortDirection: 'asc' | 'desc') => {
      setSortConfig({ key: sortBy, direction: sortDirection });
    };
  const { loading, error, tickets, totalCount , refetch } = useListTickets(
    rowsPerPage,
    (page - 1) * rowsPerPage,
    filters,
    [
      { [sortConfig.key]: sortConfig.direction },
      { tp_id: 'asc' }
    ]
  );
  const handlePageChange = (newPage: number) => setPage(newPage);
  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(1);
  };
  const handleDelistClick = async (ticketPlacementId: string) => {
    try {
      const { data } = await updateTicketStatus({
        variables: {
          ticketPlacementId: [ticketPlacementId],
          isValid: false,
          isUndoRequest: false
        }
      });

      if (data?.updateTicketStatus?.message) {
        console.log("Ticket delisted successfully:", data.updateTicketStatus.message);
        showSuccessToast(data.updateTicketStatus.message);
        await refetch();
      }
    } catch (err) {
      console.error("Error delisting ticket:", err);
      showErrorToast("Error in updating delist");
    }
    
  };
  
  const columns: Column<ListTicket>[] = [
    { id: "e_name", label: "Event",className:'column-events' },
    {
          id: "e_date",
          label: "Date",
          format: (value) => `${formatToCDT(value)} CDT`,
          className:'column-date',
        },
    { id: "e_address", label: "Venue",className:'column-venue' },
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
      className:'column-ticket-placement',
    },
    {id:'tp_status',label:'Status',className:'column-status'},
    { id: "u_full_name", label: "User Name",className:'column-user-name' },
    { id: "u_email_id", label: "Email" },
    { id: "tp_list_price", label: "Price" },
  ];
  if (loading){
    return <div className="circular-progress"><CircularProgress/></div>
  } 
  if (error){
    return <div>Error loading list tickets.</div>;
  } 
  return (
    <div className="manageTicket-fullheight">
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
        tabName="listTickets"
        onDelistClick={handleDelistClick}
        onSortChange={handleSortChange}
      />
    </div>
  );
};
export default ListTickets;
