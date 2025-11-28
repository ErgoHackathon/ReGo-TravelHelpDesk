import React from "react";
import { Table, TableContainer, Paper } from "@mui/material";

export default function SharedTable({ children }) {
  return (
    <TableContainer component={Paper} elevation={2}>
      <Table size="small">{children}</Table>
    </TableContainer>
  );
}
