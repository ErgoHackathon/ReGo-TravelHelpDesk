// src/components/shared/data-display/StatDisplay.jsx
import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import SharedCard from "../cards/SharedCard"; // if default export

const StatDisplay = ({ title, value, icon, trend }) => (
  <SharedCard sx={{ boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Left section */}
        <Box>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mt: 1,
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              {value}
            </Typography>
          </Box>
        </Box>

        {/* Right section (icon) */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          {icon}
        </Box>
      </Box>

      {trend && (
        <Typography
          variant="body2"
          color={trend > 0 ? "success.main" : "error.main"}
          sx={{ mt: 2 }}
        >
          {trend > 0 ? "+" : ""}
          {trend}% vs last month
        </Typography>
      )}
    </Box>
  </SharedCard>
);

export default StatDisplay;
