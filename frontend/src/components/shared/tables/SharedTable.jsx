// src/components/shared/tables/SharedTable.jsx
import React from 'react';
import { Table, TableContainer, Paper } from '@mui/material';

const SharedTable = ({ children }) => (
  <TableContainer component={Paper}>
    <Table>{children}</Table>
  </TableContainer>
);

export default SharedTable;
