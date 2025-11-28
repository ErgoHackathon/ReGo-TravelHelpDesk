import React from "react";
import SharedCard from "./SharedCard";
import { Typography } from "@mui/material";

export default function InfoCard({ title, content, sx }) {
  return (
    <SharedCard sx={{ p: 2, ...sx }}>
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h6">{content}</Typography>
    </SharedCard>
  );
}
