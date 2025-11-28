import React from "react";
import { Card } from "@mui/material";

export default function SharedCard({ children, ...props }) {
  return (
    <Card elevation={props.elevation || 2} sx={{ borderRadius: 2, ...props.sx }}>
      {children}
    </Card>
  );
}
