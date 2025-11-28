import React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

// Styled MUI Button
const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  borderRadius: 8,
  padding: "8px 20px",
  fontWeight: 600,
}));

// Shared reusable button
function SharedButton(props) {
  return <StyledButton {...props} />;
}

export default SharedButton;
