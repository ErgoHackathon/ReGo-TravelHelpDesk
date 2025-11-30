
import React from 'react';
import { TableHead, TableRow, TableCell } from '@mui/material';

const TableHeader = ({ columns }) => (
  <TableHead>
    <TableRow>
      {columns.map((col) => (
        <TableCell key={col}>{col}</TableCell>
      ))}
    </TableRow>
  </TableHead>
);

export default TableHeader;