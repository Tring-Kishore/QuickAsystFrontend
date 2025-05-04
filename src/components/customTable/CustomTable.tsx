import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  Box,
  Typography,
  SelectChangeEvent,
  Dialog,
  dividerClasses,
} from "@mui/material";
import "./CustomTable.scss";
import SortIcon from "../../assets/images/Sort.svg";
import DialogueInvoice from "../dialoguesInvoice/DialogueInvoice";
import EditIcon from '../../assets/images/editicon.svg';
import PayoutIcon from '../../assets/images/payouticon.svg';
import DollarIcon from '../../assets/images/dollar_cross.svg';
import DollarTick from '../../assets/images/dollar_tick.svg';
import InvoiceIcon from '../../assets/images/InvoiceIcon.svg';
import { UPDATE_TP_PAYOUT_STATUS } from "../dialoguesInvoice/DialogueInvoiceAPI/DialogueInvoiceAPI";
import { useMutation } from "@apollo/client";
import { showErrorToast, showSuccessToast } from "../CustomToast/CustomToast";
export interface Column<T = any> {
  id: Extract<keyof T, string>;
  label: string | any;
  format?: (value: any, row: T) => React.ReactNode;
  className?: string;
}

interface ReusableTableProps<T> {
  columns: Column[];
  data: T[];
  getRowId: (row: T) => string | number;
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
  page?: number;
  rowsPerPage?: number;
  onPageChange?: (newPage: number) => void;
  onRowsPerPageChange?: (newRowsPerPage: number) => void;
  totalCount?: number;
  hideCheckbox?: boolean;
  hideActions?: boolean;
  tabName?: string;
  onDelistClick?:(ticketPlacementId:string) => void;
  onSortChange?: (sortBy: string, sortDirection: 'asc' | 'desc') => void;
}

const CustomTable = <T,>({
  columns,
  data,
  getRowId,
  onSelectionChange,
  page = 1,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  totalCount = 0,
  hideCheckbox = false,
  hideActions = false,
  tabName = "",
  onDelistClick,
  onSortChange,
}: ReusableTableProps<T>) => {
  const [selected, setSelected] = useState<(string | number)[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const isAllSelected = data.length > 0 && selected.length === data.length;
  const currentTabName = tabName;
  const [dialogType, setDialogType] = useState<'publish' | 'sold' | 'editpublish' | 'editlisttickets' | 'invoice'>('publish');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  }>({ key: 'tp_updated_at', direction: 'desc' });
  const [updatePayoutStatus] = useMutation(UPDATE_TP_PAYOUT_STATUS);
  const handleSort = (columnId: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig.key === columnId) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    } else {
      direction = 'asc';
    }
    
    let sortKey = columnId;
    setSortConfig({ key: sortKey, direction });
    onSortChange?.(sortKey, direction);
  };
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = data.map((row) => getRowId(row));
      setSelected(allIds);
      onSelectionChange?.(allIds);
    } else {
      setSelected([]);
      onSelectionChange?.([]);
    }
  };

  const handleRowSelect = (id: string | number) => {
    let newSelected: (string | number)[];
    if (selected.includes(id)) {
      newSelected = selected.filter((item) => item !== id);
    } else {
      newSelected = [...selected, id];
    }
    setSelected(newSelected);
    onSelectionChange?.(newSelected);
  };

  const isVerifiedStatus = (row: any): boolean => {
    return row.tp_status?.toString().toLowerCase() === "verified";
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    onPageChange?.(newPage);
  };

  const handleRowsPerPageChange = (event: SelectChangeEvent<number>) => {
    onRowsPerPageChange?.(Number(event.target.value));
  };

  const totalPages = Math.ceil(totalCount / rowsPerPage);

  const handleEditPublish = (row : any) => {
    setSelectedTicket(row);
    setDialogType('editpublish');
    setOpen(true);
  }

  const handlePublishClick = (row: any) => {
    setSelectedTicket(row);
    setDialogType('publish');
    setOpen(true);
  };

  const handleSoldClick = (row: any) => {
    setSelectedTicket(row);
    setDialogType('sold');
    setOpen(true);
  };

  const handleEditListTickets = (row:any) => {
    setSelectedTicket(row);
    setDialogType('editlisttickets');
    setOpen(true);
  }

  const handlePayoutStatusUpdate = async (ticketPlacementId: string) => {
    try {
      const { data } = await updatePayoutStatus({
        variables: {
          tpId: ticketPlacementId
        }
      });
      
      if (data?.updateTpPayoutStatus) {
        showSuccessToast(data.updateTpPayoutStatus.message || "Payout status updated successfully");
      }
    } catch (error) {
      console.error("Error updating payout status:", error);
      showErrorToast("Failed to update payout status");
    }
  };

  return (
    <>
      <TableContainer component={Paper} className="custom-table-container">
        <Table stickyHeader>
          <TableHead>
            <TableRow className="table-head-row">
              {!hideCheckbox && (
                <TableCell padding="checkbox" className="table-checkbox">
                  <Checkbox
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="checkbox"
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell key={column.id}>
                  <div 
                    className={`column-header ${column.className || ""}`}
                    onClick={() => handleSort(column.id)}
                    
                  >
                    {column.label}
                    {column.id !== "tp_section" && (
                      <img 
                        src={SortIcon} 
                        alt="Sort" 
                        className="sort-icon"
                      />
                    )}
                  </div>
                </TableCell>
              ))}
              {!hideActions && (
                <TableCell className="sticky-actions">
                  {currentTabName === 'soldTickets' ? 'Sold Price' : 'Action'}</TableCell>
              )}
            </TableRow>
          </TableHead><TableBody>
            {data.map((row: any) => {
              const rowId = getRowId(row);
              const isChecked = selected.includes(rowId);
              const isVerified = isVerifiedStatus(row);
              return (
                <TableRow key={rowId} className="custom-table-rows">
                  {!hideCheckbox && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isChecked}
                        onChange={() => handleRowSelect(rowId)}
                        className="checkbox"
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      className={`table-body-content ${column.className || ""}`}
                    >
                      {column.format
                        ? column.format(row[column.id], row)
                        : row[column.id]}
                    </TableCell>
                  ))}
                  {tabName === "manageTickets" && (
                    <TableCell className="sticky-actions">
                      <button
                        className={`manage-ticket-publish-btn ${
                          isVerified ? "verified" : ""
                        }`}
                        disabled={!isVerified}
                        onClick={() => handlePublishClick(row)}
                      >
                        Publish
                      </button>
                      <button className={`editicon-class ${isVerified ? "Verified" : ""}`} onClick={() => handleEditPublish(row)}>
                        <img src={EditIcon} alt="edit icon"  />
                      </button>
                    </TableCell>
                  )}
                  {currentTabName === "listTickets" && (
                    <TableCell className="sticky-actions">
                    <div className="action-buttons-container">
                      <button className="action-btn delist-btn" onClick={() => onDelistClick?.(row.tp_id)}>Delist</button>
                      <button className="action-btn list-btn" disabled>List</button>
                      <button className="action-btn return-btn" disabled>Return</button>
                      <button className="action-btn sold-btn" onClick={() => handleSoldClick(row)}>Sold</button>
                      <button className={`editicon-class ${isVerified ? "Verified" : ""}`} onClick={() => handleEditListTickets(row)}>
                        <img src={EditIcon} alt="Edit icon"  />
                      </button>
                    </div>
                  </TableCell>
                    
                  )}
                  {currentTabName === "soldTickets" && (
                    <TableCell className="sticky-actions">
                      <div className="sold-action-values-container">
                        <div className="sold-tickets-actions">{row.tp_list_price ? `$${row.tp_list_price}` : 'N/A'}</div>
                        <div className="sold-tickets-actions">{row.tp_logitix_amount ? `$${row.tp_logitix_amount}` : 'N/A'}</div>
                        <div className="sold-tickets-actions">{row.tp_quick_cut_amount ? `$${row.tp_quick_cut_amount}` : 'N/A'}</div>
                        {row.tp_payment_status === 'Success' && (
                        <div className="sold-tickets-actions">
                          <img src={InvoiceIcon} alt="Invoice icon" />
                        </div>
                      )}
                      {row.tp_payment_status !== 'Success' && (
                        <>
                          {row.tp_payment_status === 'Failed' ? (
                            <div 
                              className="sold-tickets-actions" 
                              onClick={() => {
                                setSelectedTicket(row);
                                setDialogType('invoice');
                                setOpen(true);
                              }}
                            >
                              <img src={PayoutIcon} alt="Payout icon" />
                            </div>
                          ) : (
                            <>
                              <div 
                                className="sold-tickets-actions" 
                                onClick={() => {
                                  setSelectedTicket(row);
                                  setDialogType('invoice');
                                  setOpen(true);
                                }}
                              >
                                <img src={PayoutIcon} alt="Payout icon" />
                              </div>
                              {row.tp_payout_status === 'Voided_Payout' ? (
                                <div 
                                  className="sold-tickets-actions dollar-close"
                                  onClick={() => handlePayoutStatusUpdate(row.tp_id)}
                                >
                                  <img className="dollar-icon" src={DollarTick} alt="Dollar icon" />
                                </div>
                              ) : (
                                <div 
                                  className="sold-tickets-actions dollar-close"
                                  onClick={() => handlePayoutStatusUpdate(row.tp_id)}
                                >
                                  <img className="dollar-icon" src={DollarIcon} alt="Dollar icon" />
                                </div>
                              )}
                            </>
                          )}
                        </>
                      )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {totalCount <= 0 ? (
        <div className="record-not-found">Record Not Found</div>
      ) : (

      <Box className="pagination-container">
        <Box className="rows-per-page-control">
          <Typography variant="body2" className="rows-per-page-label">
            Show:
          </Typography>
          <FormControl size="small" variant="standard">
            <Select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              disableUnderline
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          shape="rounded"
          className="custom-pagination"
        />
      </Box>
      )}

      <Dialog
  open={open}
  onClose={() => setOpen(false)}
  maxWidth="sm"
  fullWidth
>
  <DialogueInvoice
    ticketData={selectedTicket}
    onClose={() => setOpen(false)}
    dialogType={dialogType}
  />
</Dialog>
    </>
  );
};

export default CustomTable;
