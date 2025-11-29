import * as React from "react";
import {
    Modal,
    Box,
    Typography,
    Grid,
    Paper,
    Divider,
    Button,
    Chip
} from "@mui/material";
import api from "../services/api";      // your axios instance
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { fetchViewDetailsData } from "../redux/slices/dashboardSlice";


const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 900,
    bgcolor: "#fff",
    borderRadius: 3,
    boxShadow: 24,
    p: 4,
    maxHeight: "90vh",
    overflowY: "auto",
};

export default function PendingRequestModal({ open, onClose, requestId }) {
    const [loading, setLoading] = React.useState(false);
    const dispatch = useDispatch();
    const details = useSelector(state => state.dashboard.viewRequestDetails);

    // Fetch request details
    React.useEffect(() => {
    if (open && requestId) {
        dispatch(fetchViewDetailsData(requestId));
    }
}, [open, requestId]);

    const closeDialog = () => {
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
                    Request Details — {requestId}
                </Typography>

                {/* {loading && <Typography>Loading details...</Typography>} */}

                {/* {!loading && details && ( */}
                    <Grid container spacing={3}>

                        {/* EMPLOYEE INFORMATION */}
                        <Grid item xs={12} md={7}>
                            <Paper sx={{ p: 3, borderRadius: 2 }}>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Employee Information
                                </Typography>

                                <Grid container spacing={1}>
                                    <Grid item xs={6}><strong>Employee Name</strong></Grid>
                                    <Grid item xs={6}>{details?.employeeName}</Grid>

                                    <Grid item xs={6}><strong>Employee ID</strong></Grid>
                                    <Grid item xs={6}>{details?.employeeId}</Grid>

                                    <Grid item xs={6}><strong>Email</strong></Grid>
                                    <Grid item xs={6}>{details?.email}</Grid>

                                    <Grid item xs={6}><strong>Phone</strong></Grid>
                                    <Grid item xs={6}>{details?.phone}</Grid>

                                    <Grid item xs={6}><strong>Department</strong></Grid>
                                    <Grid item xs={6}>{details?.department}</Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        {/* STATUS BLOCK */}
                        <Grid item xs={12} md={5}>
                            <Paper sx={{ p: 3, borderRadius: 2 }}>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Status
                                </Typography>

                                <Grid container spacing={1}>
                                    <Grid item xs={6}><strong>Current Status</strong></Grid>
                                    <Grid item xs={6}>
                                        <Chip
                                            label={details?.status}
                                            color={
                                                details?.status === "Approved" ? "success" :
                                                details?.status === "Rejected" ? "error" :
                                                "warning"
                                            }
                                        />
                                    </Grid>

                                    <Grid item xs={6}><strong>Requested On</strong></Grid>
                                    <Grid item xs={6}>{details?.requestedOn}</Grid>

                                    <Grid item xs={6}><strong>Last Updated</strong></Grid>
                                    <Grid item xs={6}>{details?.lastUpdated}</Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        {/* TRAVEL DETAIL SECTION */}
                        <Grid item xs={12}>
                            <Paper sx={{ p: 3, borderRadius: 2 }}>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Travel Details
                                </Typography>

                                <Grid container spacing={1}>
                                    <Grid item xs={6}><strong>Travel Type</strong></Grid>
                                    <Grid item xs={6}>{details?.travelType}</Grid>

                                    <Grid item xs={6}><strong>From</strong></Grid>
                                    <Grid item xs={6}>{details?.from}</Grid>

                                    <Grid item xs={6}><strong>To</strong></Grid>
                                    <Grid item xs={6}>{details?.to}</Grid>

                                    <Grid item xs={6}><strong>Departure Date</strong></Grid>
                                    <Grid item xs={6}>{details?.departureDate}</Grid>

                                    <Grid item xs={6}><strong>Purpose</strong></Grid>
                                    <Grid item xs={6}>{details?.purpose}</Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        {/* ATTACHMENTS */}
                        <Grid item xs={12} md={5}>
                            <Paper sx={{ p: 3, borderRadius: 2 }}>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Attachments
                                </Typography>

                                {details?.attachments.map((a, i) => (
                                    <Box key={i} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                        <Typography>{a.fileName}</Typography>
                                        <Typography color="gray">{a.size} MB</Typography>
                                    </Box>
                                ))}
                            </Paper>
                        </Grid>
                    </Grid>
                {/* )} */}

                {/* FOOTER BUTTONS */}
                <Divider sx={{ my: 3 }} />

                <Box sx={{ textAlign: "right" }}>
                    <Button onClick={onClose} sx={{ mr: 2 }} variant="outlined">
                        Close
                    </Button>
                    <Button variant="contained" color="error">
                        Download PDF
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
