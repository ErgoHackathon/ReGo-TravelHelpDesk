import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Typography,CardContent,Card
} from '@mui/material';
import {

  FlightTakeoff,
} from '@mui/icons-material';
import Navbar from '../../components/layout/Navbar';
import PendingRequestModal from '../../components/PendingRequestModal';
import SharedButton from '../../sharedComponents/buttons/SharedButton';
import PageWrapper from '../../sharedComponents/layout/PageWrapper';
import { SharedTypography, StatusChip, CommonDashboard } from '../../sharedComponents';
import UserAvatar from '../../sharedComponents/avatars/UserAvatars';
import { fetchTravelDeskData } from '../../redux/slices/dashboardSlice';


const TravelDeskPortal = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [pendingRequestModalOpen, setPendingRequestModalOpen] = useState(false);
    const {  pendingRequests } = useSelector((state) => state.dashboard);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        dispatch(fetchTravelDeskData());
      }, [dispatch]);

    const handleViewRequest = (id) =>{
      setSelectedId(id);
      setPendingRequestModalOpen(true)
    }

    return (
      <CommonDashboard>
        <PendingRequestModal
          open={pendingRequestModalOpen}
          onClose={() => setPendingRequestModalOpen(false)}
          requestId={selectedId}
        />

        <PageWrapper>
          {/* Top Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              alignItems: "center",
              mb: 4,
            }}
          >
            {/* Welcome Section */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <UserAvatar firstName={user.firstName} lastName={user.lastName} />

              <Box>
                <SharedTypography>Welcome, {user.firstName}!</SharedTypography>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <StatusChip
                    label={user.role.replace("_", " ")}
                    color="#b22a2a"
                  />

                  {user.department && (
                    <StatusChip
                      label={`Team Lead - ${user.department}`}
                      color="#f5f5f5"
                    />
                  )}
                </Box>
              </Box>
            </Box>

            {/* Raise Travel Request Button */}
            <SharedButton
              variant="contained"
              startIcon={<FlightTakeoff />}
              sx={{
                bgcolor: "#b22a2a",
                "&:hover": { bgcolor: "#8b1f1f" },
                minWidth: 200,
              }}
              // onClick={handleRaiseNewRequest}
            >
              New Booking
            </SharedButton>
          </Box>
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={8} md={12}>
              <Typography variant="h5" sx={{ fontSize: "1.8rem" }}>
                Travel Desk Portal
              </Typography>
              <Card
                sx={{
                  p: 3,
                  border: "1.5px solid",
                  borderColor: "#b91c1c",
                  borderTop: `7px solid #b91c1c`,
                }}
              >
                <CardContent>
                  <Typography variant="h5" sx={{ fontSize: "1.8rem" }}>
                    Pending requests for review
                  </Typography>
                  {console.log(pendingRequests)}
                  {pendingRequests?.map((req, index) => (
                    <Card
                      key={index}
                      sx={{
                        mb: 2,
                        p: 2,
                        border: "1px solid #e5e7eb",
                        backgroundColor: req.isPriority ? "#fee2e2" : "#ffffff",
                      }}
                    >
                      <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Grid item>
                          <Typography
                            sx={{ fontWeight: "bold", fontSize: "1.2rem" }}
                          >
                            {req.id}: {req.employee} to {req.destination}
                          </Typography>

                          <Typography sx={{ fontSize: "1rem", color: "#555" }}>
                            Departure: {req.departure} | Status: {req.status}
                          </Typography>
                        </Grid>

                        <Grid item>
                          <SharedButton
                            variant="contained"
                            sx={{
                              backgroundColor: "#16a34a",
                              "&:hover": { backgroundColor: "#15803d" },
                              mr: 2,
                            }}
                          >
                            Complete & Notify Manager
                          </SharedButton>

                          <SharedButton variant="outlined" onClick={() => handleViewRequest(req.id)} >View</SharedButton>
                        </Grid>
                      </Grid>
                    </Card>
                  ))}
                  <Typography sx={{ fontSize: "1.2rem" }}></Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </PageWrapper>
      </CommonDashboard>
    );
}

export default TravelDeskPortal;