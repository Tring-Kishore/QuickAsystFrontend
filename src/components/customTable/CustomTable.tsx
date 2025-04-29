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
} from "@mui/material";
import "./CustomTable.scss";
import SortIcon from "../../assets/images/Sort.svg";

export interface Column<T = any> {
  id: Extract<keyof T, string>;
  label: string;
  format?: (value: any, row: T) => React.ReactNode;
}

interface ReusableTableProps<T> {
  columns: Column[];
  data: T[];
  getRowId: (row: T) => string | number;
}

const CustomTable = <T,>({
  columns,
  data,
  getRowId,
}: ReusableTableProps<T>) => {
  const [selected, setSelected] = useState<(string | number)[]>([]);

  // Check if all rows are selected
  const isAllSelected = data.length > 0 && selected.length === data.length;

  // Toggle select all
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = data.map((row) => getRowId(row));
      setSelected(allIds);
    } else {
      setSelected([]);
    }
  };

  // Toggle individual row
  const handleRowSelect = (id: string | number) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  return (
    <TableContainer component={Paper} className="custom-table-container">
      <Table stickyHeader>
        <TableHead>
          <TableRow className="table-head-row">
            <TableCell padding="checkbox" className="table-checkbox">
              <Checkbox checked={isAllSelected} onChange={handleSelectAll} />
            </TableCell>
            {columns.map((column) => (
              <TableCell key={column.id}>
                <div className="column-header">
                  {column.label}
                  <img src={SortIcon} alt="Sort" className="sort-icon" />
                </div>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row: any) => {
            const rowId = getRowId(row);
            const isChecked = selected.includes(rowId);

            return (
              <TableRow key={rowId} className="custom-table-rows">
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isChecked}
                    onChange={() => handleRowSelect(rowId)}
                  />
                </TableCell>
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    {column.format
                      ? column.format(row[column.id], row)
                      : row[column.id]}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomTable;
