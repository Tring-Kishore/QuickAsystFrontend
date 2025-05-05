import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import CustomTable, { Column } from "../../../components/customTable/CustomTable";
import { FILTER_UNSOLD_TICKETS_QUERY } from "./delistUnsoldAPI/DelistUnsoldAPI";
import { CircularProgress } from "@mui/material";
import { SortConfig } from "../manageTickets/ManageTickets";
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

interface DelistUnsoldProps {
  filters: {
    leagueId: string | null;
    startDate: string | null;
    endDate: string | null;
  };
}
interface FilterUnsoldTicketsQueryResponse {
  filterUnsoldTickets: FilterUnsoldTicket[];
  filterUnsoldTickets_aggreagate: {
    aggregate: {
      count: number;
    };
  };
}

const DelistUnsold: React.FC<DelistUnsoldProps> = ({ filters }) => {
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'tp_updated_at', direction: 'desc' });

  const handleSortChange = (sortBy: string, sortDirection: 'asc' | 'desc') => {
    setSortConfig({ key: sortBy, direction: sortDirection });
  };

  const { data, loading, error, refetch } = useQuery<FilterUnsoldTicketsQueryResponse>(
    FILTER_UNSOLD_TICKETS_QUERY,
    {
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
        ticketStatus: null,
      },
      fetchPolicy: "network-only",
    }
  );

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

  const columns: Column<FilterUnsoldTicket>[] = [
    { id: "e_name", label: "Events", className: 'column-events' },
    { id: "e_date", label: "Date", className: 'column-date' },
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
    { id: "u_full_name", label: "User Name", className: 'column-user-name' },
    { id: "u_email_id", label: "Email" },
  ];

  if (loading) {
    return (
      <div className="circular-progress">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <div>Error loading unsold tickets</div>;
  }

  return (
    <div className="manageTicket-fullheight">
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
        onSortChange={handleSortChange}
      />
    </div>
  );
};

export default DelistUnsold;
