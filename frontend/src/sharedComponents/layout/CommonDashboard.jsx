import { Box } from "@mui/material";
import Navbar from "../../components/layout/Navbar";


const CommonDashboard = ({ children }) => {
  const {page} = children
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#fef2f2",
        p: 2,
        position: "relative"
      }}
    >
      
      {page!=="login" && <Navbar/>}

      {/* page content */}
      <Box sx={{ width: "100%" }}>
        {children}
      </Box>
    </Box>
  );
};

export default CommonDashboard;
