import React from "react";
import { Modal, Box } from "@mui/material";

export default function SharedModal({ open, onClose, children }) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ p: 4, bgcolor: "white", borderRadius: 2, maxWidth: 500, margin: "100px auto" }}>
        {children}
      </Box>
    </Modal>
  );
}
