import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react'
import { FILTER_SOLD_TICKETS } from './soldTicketsAPI/SoldTicketsAPI';
import CustomTable, { Column } from '../../../components/customTable/CustomTable';
import { CircularProgress } from '@mui/material';
import { Chip } from '@mui/material';

interface FilterSoldTickets {
  tp_id: string;
  e_name: string;
  e_date: string;
  e_address: string;
  tp_section: string;
  tp_row: string;
  tp_seat_no: string;
  u_full_name: string;
  u_email_id: string;
  payment_status?: string;
  payout_type?: string;
  tp_payment_status?: string;
  tp_list_price?: number;
  tp_logitix_amount?: number;
  tp_quick_cut_amount?: number;
  tp_payout_status?: string;
}

interface SoldTicketsProps {
  filters: {
    leagueId: string | null;
    dateRange: string | null;
    startDate: string | null;
    endDate: string | null;
    soldTicketsStatus: string | null;
    soldTicketsType: string | null;
  };
}

const SoldTickets = ({ filters }: SoldTicketsProps) => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  }>({ key: 'tp_updated_at', direction: 'desc' });

  const handleSortChange = (sortBy: string, sortDirection: 'asc' | 'desc') => {
    setSortConfig({ key: sortBy, direction: sortDirection });
  };

  const { data, loading, error, refetch } = useQuery(FILTER_SOLD_TICKETS, {
    variables: {
      pageSize: rowsPerPage,
      pageOffset: (page - 1) * rowsPerPage,
      order_by: [
        { [sortConfig.key]: sortConfig.direction },
        { tp_id: 'asc' }
      ],
      array_tpid: null,
      enddate: filters.endDate || null,
      leagueId: filters.leagueId || null,
      paymentStatus: filters.soldTicketsStatus,
      payoutType: filters.soldTicketsType,
      search_event: "%",
      startdate: filters.startDate || null,
      ticketId: null,
      ticketPlacementId: null
    },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    refetch();
  }, [filters, refetch, sortConfig]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(1);
  };

  const columns: Column<FilterSoldTickets>[] = [
    { id: 'e_name', label: 'Events', className: 'column-events' },
    { id: 'e_date', label: 'Date', className: 'column-date' },
    { id: 'e_address', label: 'venue', className: 'column-venue' },
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
      className: 'column-ticket-placement'
    },
    {
      id: 'tp_payment_status',
      label: 'Status',
      format: (value, row) => {
        let status = value || 'Sold';
        let chipColor: 'default' | 'error' | 'success' | 'warning' = 'default';
        
        if (row.tp_payout_status === 'Voided_Payout') {
          status = 'Voided Payout';
          chipColor = 'warning';
        } 
        else {
          switch (status.toLowerCase()) {
            case 'failed':
              chipColor = 'error';
              break;
            case 'success':
              chipColor = 'success';
              status = 'Settled'
              break;
            case 'sold':
              chipColor = 'success';
              status = 'Sold';
              break;
            case 'inprogress':
              chipColor = 'warning';
              status = 'Settlement In Progress'
              break;
            case 'settled':
              chipColor = 'success';
              status = 'Settled'
              break;
            default:
              chipColor = 'default';
          }
        }
        
        return (
          <Chip 
            label={status} 
            color={chipColor}
            variant="outlined"
            size="small"
          />
        );
      }
    },
    { id: 'u_full_name', label: 'User Name', className: 'column-user-name' },
    { id: 'u_email_id', label: 'Email' },
  ];

  if (loading) {
    return <div className="circular-progress"><CircularProgress /></div>
  }
  if (error) {
    return <div>Error...</div>
  }
  
  const totalCount = data?.FilterSoldTickets_aggregate?.aggregate?.count || 0;
  
  return (
    <div className="manageTicket-fullheight">
      <CustomTable
        columns={columns}
        data={data?.FilterSoldTickets || []}
        getRowId={(row: FilterSoldTickets) => row.tp_id}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        totalCount={totalCount || 0}
        hideCheckbox={true}
        tabName='soldTickets'
        onSortChange={handleSortChange}
      />
    </div>
  )
}

export default SoldTickets