import React from "react";
import { Typography } from "@mui/material";

export default function SharedTypography({ children }) {
  return (
    <Typography variant="h4" fontWeight="bold" mb={3}>
      {children}
    </Typography>
  );
}
