
import React from 'react';
import { useQuery } from '@apollo/client';
import CustomTable, { Column } from '../../../components/customTable/CustomTable';
import { GET_MANAGE_TICKETS, ManageTicket } from './ManageTicketsAPI';
import { Chip } from '@mui/material';
import './ManageTickets.scss';
const ManageTickets = () => {
  const { loading, error, data } = useQuery(GET_MANAGE_TICKETS, {
    variables: {
      pageSize: 10,
      pageOffset: 0,
      
    },
    fetchPolicy: 'cache-and-network',
  });

  const columns: Column<ManageTicket>[] = [
    { id: 'e_name', label: 'Event Name' },
    { id: 'l_name', label: 'League Name' },
    { id: 'e_date', label: 'Event Date' },
    { id: 'tp_section', label: 'Section' },
    { id: 'tp_row', label: 'Row' },
    { id: 'tp_seat_no', label: 'Seat No' },
    {
        id: "tp_status",
        label: "Status",
        format: (value: string) => (
          <Chip className='custom-chip'
            label={value}
            color={
              value === "Verified"
                ? "success"
                : value === "Delist"
                ? "error"
                : value === "ToBeVerified"
                ? "warning"
                : "default"
            }
            size="medium"
            variant="filled"
          />
        ),
      },
    { id: 'full_name', label: 'User Name' },
    { id: 'u_email_id', label: 'Email' },
    
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <CustomTable 
        columns={columns} 
        data={data?.filtermanagetickets || []} 
        getRowId={(row: ManageTicket) => row.tp_id} 
      />
    </div>
  );
};

export default ManageTickets;