import React from "react";
import { Stack } from "@mui/material";
import SharedButton from "../buttons/SharedButton";

export default function TableRowActionButtons({
  actionText,
  actionColor,
  extraActionText,
  extraActionColor,
  statusColor,
}) {
  return (
    <Stack direction="row" spacing={1}>
      {extraActionText && (
        <SharedButton
          size="small"
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            bgcolor: statusColor,
            color: extraActionColor,
          }}
        >
          {extraActionText}
        </SharedButton>
      )}

      <SharedButton
        size="small"
        sx={{ textTransform: "none", fontWeight: "bold", color: actionColor }}
      >
        {actionText}
      </SharedButton>
    </Stack>
  );
}
