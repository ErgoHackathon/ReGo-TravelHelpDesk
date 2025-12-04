import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Grid,
    TextField,
    MenuItem,
    Typography,
    InputAdornment
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FlightLand, AttachMoney, Description } from '@mui/icons-material';
import BaseLayout from '../../components/layout/BaseLayout';
import { Navbar, SharedButton, SharedCard } from '../../components/shared';
import { logout } from '../../features/authSlice';

const CreateRequest = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        destinationCity: '',
        destinationCountry: '',
        departureDate: null,
        returnDate: null,
        travelType: 'Business',
        purpose: '',
        estimatedCost: ''
    });

    const handleLogout = async () => {
        await dispatch(logout());
        navigate('/login', { replace: true });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        // Mock submission logic
        console.log('Request Submitted:', formData);
        // In a real app, dispatch an action to save this
        navigate('/dashboard');
    };

    return (
        <BaseLayout variant="dashboard">
            <Navbar user={user} onLogout={handleLogout} />

            <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
                <SharedCard variant="dashboard">
                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#1e293b' }}>
                        Create New Travel Request
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Destination City"
                                name="destinationCity"
                                value={formData.destinationCity}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><FlightLand /></InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Destination Country"
                                name="destinationCountry"
                                value={formData.destinationCountry}
                                onChange={handleChange}
                            />
                        </Grid>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Grid item xs={12} sm={6}>
                                <DatePicker
                                    label="Departure Date"
                                    value={formData.departureDate}
                                    onChange={(newValue) => setFormData({ ...formData, departureDate: newValue })}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <DatePicker
                                    label="Return Date"
                                    value={formData.returnDate}
                                    onChange={(newValue) => setFormData({ ...formData, returnDate: newValue })}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </Grid>
                        </LocalizationProvider>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                fullWidth
                                label="Travel Type"
                                name="travelType"
                                value={formData.travelType}
                                onChange={handleChange}
                            >
                                <MenuItem value="Business">Business</MenuItem>
                                <MenuItem value="Training">Training</MenuItem>
                                <MenuItem value="Conference">Conference</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Estimated Cost"
                                name="estimatedCost"
                                type="number"
                                value={formData.estimatedCost}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><AttachMoney /></InputAdornment>,
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Purpose of Travel"
                                name="purpose"
                                value={formData.purpose}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start" sx={{ mt: 1.5 }}><Description /></InputAdornment>,
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                            <SharedButton
                                variant="outlined"
                                onClick={() => navigate('/dashboard')}
                                sx={{ borderColor: '#64748b', color: '#64748b' }}
                            >
                                Cancel
                            </SharedButton>
                            <SharedButton
                                variant="contained"
                                onClick={handleSubmit}
                                sx={{ bgcolor: '#b91c1c', '&:hover': { bgcolor: '#991b1b' }, px: 4 }}
                            >
                                Submit Request
                            </SharedButton>
                        </Grid>
                    </Grid>
                </SharedCard>
            </Box>
        </BaseLayout>
    );
};

export default CreateRequest;
