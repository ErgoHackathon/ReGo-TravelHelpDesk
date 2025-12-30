import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { formatToNoramlDate } from '../../../utils/helpers';

const DateEditor = ({ employee, departurDate, arrivalDate,onSave, closeDateEditor }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString(); // Convert to ISO format
  };
  
  const departureDateToDisplay = formatToNoramlDate(new Date(departurDate))
  const arrivalDateToDisplay = formatToNoramlDate(new Date(arrivalDate))
  
  const handleSave = () => {
    const formattedStartDate = formatDateTime(startDate);
    const formattedEndDate = formatDateTime(endDate);
    // Call the onSave function passed from the parent component
    onSave(formattedStartDate, formattedEndDate);
    
    closeDateEditor(); // Close the editor after saving
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          Start Date
        </Typography>
        <TextField
          type="date" // Change to date for date-only input
          size="small"
          fullWidth
          variant="standard"
          InputProps={{ disableUnderline: true }}
          onChange={(e) => {
            setStartDate(e.target.value);
          }}
          inputProps={{
            min: getTodayDate(), // Set min to today
          }}
          value={startDate?startDate:departureDateToDisplay}
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          End Date
        </Typography>
        <TextField
          type="date" // Change to date for date-only input
          size="small"
          fullWidth
          variant="standard"
          InputProps={{ disableUnderline: true }}
          onChange={(e) => {
            setEndDate(e.target.value);
          }}
          inputProps={{
            min: startDate || getTodayDate(), // Ensure end date is after start date
          }}
          value={endDate?endDate:arrivalDateToDisplay}
        />
      </Box>
      <Button variant="contained" onClick={handleSave} sx={{ mt: 1 }}>
        Save Dates
      </Button>
      <Button variant="outlined" onClick={closeDateEditor} sx={{ mt: 1, ml: 1 }}>
        Cancel
      </Button>
    </Box>
  );
};

export default DateEditor;