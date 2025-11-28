import React from "react";
import { TableHead, TableRow, TableCell } from "@mui/material";

export default function TableHeader({ columns }) {
  return (
    <TableHead>
      <TableRow sx={{ bgcolor: "#f9f9f9" }}>
        {columns.map((col) => (
          <TableCell key={col} sx={{ fontWeight: "bold", color: "grey.600" }}>
            {col}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
