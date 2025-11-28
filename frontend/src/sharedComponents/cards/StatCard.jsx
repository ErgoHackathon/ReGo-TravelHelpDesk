import React from "react";
import { Box, Typography } from "@mui/material";
import SharedCard from "./SharedCard";

export default function StatCard({ title, value, icon, color }) {
  return (
    <SharedCard
      sx={{
        p: 3,
        border: "1.5px solid",
        borderColor: color,
        borderTop: `7px solid ${color}`,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="caption" color="grey.600">
            {title}
          </Typography>
          <Typography variant="h5" fontWeight="bold">
            {value}
          </Typography>
        </Box>

        {icon}
      </Box>
    </SharedCard>
  );
}
