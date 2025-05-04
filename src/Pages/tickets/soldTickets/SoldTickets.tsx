import { useQuery } from '@apollo/client';
import React, { useState } from 'react'
import { FILTER_SOLD_TICKETS } from './soldTicketsAPI/SoldTicketsAPI';
import CustomTable, { Column } from '../../../components/customTable/CustomTable';
import { CircularProgress } from '@mui/material';
interface FilterSoldTickets{
  tp_id:string;
  e_name:string;
  e_date:string;
  e_address:string;
  tp_section:string;
  tp_row:string;
  tp_seat_no:string;
  u_full_name:string;
  u_email_id:string;
}
const SoldTickets = () => {
  const [page,setPage] = useState(1);
  const [rowsPerPage,setRowsPerPage] = useState(10);
  const {data , loading, error} = useQuery(FILTER_SOLD_TICKETS,{
    variables:{
      pageSize:rowsPerPage,
      pageOffset:(page - 1) * rowsPerPage,
      order_by : [{e_name:"asc"}],
    },
    fetchPolicy:'network-only',
  });
  const handlePageChange = (newPage : number) => {
    setPage(newPage);
  };
  const handleRowsPerPageChange = (newRowsPerPage : number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(1);
  };
  const columns : Column<FilterSoldTickets>[] = [
    {id: 'e_name',label:'Events',width:'220px'},
    {id:'e_date',label:'Date',width:'170px'},
    {id:'e_address',label:'venue',width:'160px'},
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
    {id:'u_full_name',label:'User Name',width:'120px'},
    {id:'u_email_id',label:'Email'},
  ];
  if(loading){
    return <div className="circular-progress"><CircularProgress/></div>
  }
  if(error){
    return <div>Error...</div>
  }
  const totalCount = data?.FilterSoldTickets_aggregate?.aggregate?.count || 0;
  console.log('the soldtickets',totalCount);
  return (
    <div>
      <div className="fullheight">
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
        />
      </div>
    </div>
  )
}
export default SoldTickets
