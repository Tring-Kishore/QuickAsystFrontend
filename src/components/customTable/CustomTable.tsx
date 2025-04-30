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
} from "@mui/material";
import "./CustomTable.scss";
import SortIcon from "../../assets/images/Sort.svg";

export interface Column<T = any> {
  id: Extract<keyof T, string>;
  label: string | any;
  format?: (value: any, row: T) => React.ReactNode;
  width?: string | number;
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
}: ReusableTableProps<T>) => {
  const [selected, setSelected] = useState<(string | number)[]>([]);

  const isAllSelected = data.length > 0 && selected.length === data.length;

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
  console.log('the total Page',totalPages);
  

  return (
    <>
      <TableContainer component={Paper} className="custom-table-container">
        <Table stickyHeader>
          <TableHead>
            <TableRow className="table-head-row">
            {!hideCheckbox && (
                <TableCell padding="checkbox" className="table-checkbox">
                  <Checkbox checked={isAllSelected} onChange={handleSelectAll} />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell key={column.id} style={{ width: column.width }}>
                  <div className="column-header">
                    {column.label}
                    <img src={SortIcon} alt="Sort" className="sort-icon" />
                  </div>
                </TableCell>
              ))}
              {!hideActions && (
                <TableCell className="sticky-actions">Actions</TableCell>
              )}
            </TableRow>
          </TableHead>

          
          <TableBody>
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
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      className="table-body-content"
                      style={{ width: column.width }}
                    >
                      {column.format
                        ? column.format(row[column.id], row)
                        : row[column.id]}
                    </TableCell>
                  ))}
                  {!hideActions && (
                    <TableCell className="sticky-actions">
                      <button
                        className={`manage-ticket-publish-btn ${
                          isVerified ? "verified" : ""
                        }`}
                        disabled={!isVerified}
                      >
                        Publish
                      </button>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box className='pagination-container'
      >
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
    </>
  );
};

export default CustomTable;
