import React from "react";
import { Box, Container } from "@mui/material";

export default function PageWrapper({ children }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Container maxWidth={false} sx={{ py: 4, mt: 10 }}>
        {children}
      </Container>
    </Box>
  );
}
