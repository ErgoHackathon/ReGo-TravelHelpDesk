import * as React from "react";
import {
    Modal,
    Box,
    Typography,
    TextField,
    Checkbox,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Grid
} from "@mui/material";
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import { toast } from "react-toastify";
// import SharedButton from "../sharedComponents/SharedButton";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 750,
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

export default function RaiseRequestModal({ open, onClose }) {
    const employees = [
        { id: 1, name: "Ben K." },
        { id: 2, name: "Sarah M." },
        { id: 3, name: "Alex J." },
    ];

    const [destination, setDestination] = React.useState("");
    const [destinationCity, setDestinationCity] = React.useState("");
    const [reason, setReason] = React.useState("");

    const [rows, setRows] = React.useState(
        employees.map(emp => ({
            ...emp,
            selected: false,
            departure: null,
            arrival: null,
        }))
    );

    const handleCheck = (id) => {
        setRows(rows.map(r => r.id === id ? { ...r, selected: !r.selected } : r));
    };

    const handleDateChange = (id, field, value) => {
        setRows(rows.map(r => (r.id === id ? { ...r, [field]: value } : r)));
    };

    const handleSubmit = () => {
        toast.success('Request Sent')
        const selectedData = rows.filter(r => r.selected);
        console.log({
            destination,
            reason,
            employees: selectedData,
        });
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Raise New Travel Request
                </Typography>

                {/* Destination + Reason */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            label="Destination Country"
                            placeholder="e.g., Tokyo, Japan"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            label="Destination City"
                            placeholder="e.g., Tokyo, Japan"
                            value={destinationCity}
                            onChange={(e) => setDestinationCity(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            label="Reason for Travel"
                            placeholder="e.g., Client meeting"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </Grid>
                </Grid>

                {/* Employee table */}
                <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#fef2f2' }}>
                                <TableCell>Select</TableCell>
                                <TableCell>Employee Name</TableCell>
                                <TableCell>Departure Date</TableCell>
                                <TableCell>Arrival Date</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={row.selected}
                                            onChange={() => handleCheck(row.id)}
                                        />
                                    </TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>

                                        {/* <DatePicker
                      label="Departure Date"
                      value={row.departure}
                      onChange={(val) => handleDateChange(row.id, "departure", val)}
                      disabled={!row.selected}
                      slotProps={{ textField: { fullWidth: true, size: "small" } }}
                    /> */}
                                    </TableCell>
                                    <TableCell>
                                        {/* <DatePicker
                      label="Arrival Date"
                      value={row.arrival}
                      onChange={(val) => handleDateChange(row.id, "arrival", val)}
                      disabled={!row.selected}
                      slotProps={{ textField: { fullWidth: true, size: "small" } }}
                    /> */}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Buttons */}
                <Box sx={{ mt: 3, textAlign: "right" }}>

                    <Button onClick={onClose} sx={{ mr: 2 }} variant="outlined">
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleSubmit}
                    >
                        Review & Submit Request
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
