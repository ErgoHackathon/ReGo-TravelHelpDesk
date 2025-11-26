import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { TextField, Button, Box } from '@mui/material';

export default function CreateRequest() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState({ travel_type: 'domestic', destination_country: '', destination_city: '', departure_date: '', return_date: '', estimated_cost: '' });

  const create = useMutation((data) => api.post('/travel-requests', data), {
    onSuccess: () => qc.invalidateQueries(['travelRequests'])
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await create.mutateAsync(form);
    navigate('/travel-requests');
  };

  return (
    <Box sx={{ p: 3 }} component="form" onSubmit={handleSubmit}>
      <h2>Create Travel Request</h2>
      <TextField fullWidth name="destination_country" label="Country" value={form.destination_country} onChange={handleChange} sx={{ mb: 2 }} />
      <TextField fullWidth name="destination_city" label="City" value={form.destination_city} onChange={handleChange} sx={{ mb: 2 }} />
      <TextField fullWidth name="departure_date" label="Departure" value={form.departure_date} onChange={handleChange} sx={{ mb: 2 }} />
      <TextField fullWidth name="return_date" label="Return" value={form.return_date} onChange={handleChange} sx={{ mb: 2 }} />
      <TextField fullWidth name="estimated_cost" label="Estimated Cost" value={form.estimated_cost} onChange={handleChange} sx={{ mb: 2 }} />
      <Button type="submit" variant="contained">Submit Request</Button>
    </Box>
  );
}
