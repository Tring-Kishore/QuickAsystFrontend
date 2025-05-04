
import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import CustomTable, { Column } from "../../../components/customTable/CustomTable";
import { FILTER_RETURN_TICKETS_QUERY } from "./delistReturnAPI/DelistReturnAPI";
import { CircularProgress } from "@mui/material";
interface FilterReturnTicket {
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
interface DelistReturnProps {
  filters: {
    leagueId: string | null;
    startDate: string | null;
    endDate: string | null;
  };
}
const DelistReturn: React.FC<DelistReturnProps> = ({ filters }) => {
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortConfig, setSortConfig] = useState<{
        key: string;
        direction: 'asc' | 'desc';
      }>({ key: 'tp_updated_at', direction: 'desc' });
    
      const handleSortChange = (sortBy: string, sortDirection: 'asc' | 'desc') => {
        setSortConfig({ key: sortBy, direction: sortDirection });
      };
  const { data, loading, error , refetch } = useQuery(FILTER_RETURN_TICKETS_QUERY, {
    variables: {
      enddate: filters.endDate || null,
      startdate: filters.startDate || null,
      leagueId: filters.leagueId || null,
      ticketId: null,
      ticketPlacementId: null,
      array_tpid: null,
      pageSize: rowsPerPage,
      pageOffset: (page - 1) * rowsPerPage,
      order_by: [
        { [sortConfig.key]: sortConfig.direction },
        { tp_id: 'asc' }
      ],
      search_event: "%",
      ticketStatus: null
    },
    fetchPolicy: "network-only",
  });
  useEffect(() => {
    refetch();
  }, [filters, refetch]);
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(1);
  };
  const columns: Column<FilterReturnTicket>[] = [
    { id: "e_name", label: "Events", className:'column-events' },
    { id: "e_date", label: "Date", className:'column-date' },
    { id: "e_address", label: "Venue", className:'column-venue' },
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
      className:'column-ticket-placement'
    },
    { id: "u_full_name", label: "User Name", className:'column-user-name' },
    { id: "u_email_id", label: "Email" },
  ];
  if (loading){
    return <div className="circular-progress"><CircularProgress/></div>
  } 
  if (error){
    return <div>Error loading tickets</div>;
  } 
  return (
    <div className="manageTicket-fullheight">
      <CustomTable
        columns={columns}
        data={data?.filterreturntickets || []}
        getRowId={(row: FilterReturnTicket) => row.tp_id}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        totalCount={data?.filterreturntickets_aggregate?.aggregate?.count || 0}
        hideCheckbox={true}
        hideActions={true}
        onSortChange={handleSortChange}
      />
    </div>
  );
};
export default DelistReturn;
