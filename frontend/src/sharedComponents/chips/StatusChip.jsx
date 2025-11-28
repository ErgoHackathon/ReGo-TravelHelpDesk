import React from "react";
import { Chip } from "@mui/material";

export default function StatusChip({ label, color }) {
  return (
    <Chip
      label={label}
      size="small"
      sx={{
        fontWeight: "bold",
        textTransform: "none",
        bgcolor: color,
      }}
    />
  );
}
