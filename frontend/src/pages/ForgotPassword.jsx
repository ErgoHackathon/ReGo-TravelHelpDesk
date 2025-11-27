import React from "react";
import { Box, Typography, Button } from "@mui/material";
import EngineeringIcon from "@mui/icons-material/Engineering";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate(); // hook to navigate programmatically

  const handleGoHome = () => {
    navigate("/"); // redirect to home page
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        bgcolor: "#fef2f2",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        p: 3,
      }}
    >
      <Box>
        <Box
          sx={{
            bgcolor: "#ffcdd2",
            borderRadius: "50%",
            p: 4,
            mb: 3,
            display: "inline-flex",
          }}
        >
          <EngineeringIcon sx={{ fontSize: 60, color: "#b71c1c" }} />
        </Box>

        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          color="#b71c1c"
        >
          Page Under Construction
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 480, mx: "auto", mb: 4 }}
        >
          Sorry, this page is currently under development. Please check back
          later!
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={handleGoHome}
          sx={{ py: 1.2, px: 4, fontWeight: 600 }}
        >
          Go to Home
        </Button>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
