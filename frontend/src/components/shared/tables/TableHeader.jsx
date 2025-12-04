
import React from 'react';
import { TableHead, TableRow, TableCell } from '@mui/material';

const TableHeader = ({ columns }) => (
  <TableHead>
    <TableRow>
      {columns.map((col) => (
        <TableCell key={col.id || col}>{col.label || col}</TableCell>
      ))}
    </TableRow>
  </TableHead>
);

export default TableHeader;