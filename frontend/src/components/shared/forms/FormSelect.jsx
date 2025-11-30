// src/components/shared/forms/FormSelect.jsx
import React from 'react';
import { TextField, MenuItem } from '@mui/material';
import { useField } from 'formik';

const FormSelect = ({ label, options, ...props }) => {
  const [field, meta] = useField(props);
  
  return (
    <TextField
      select
      fullWidth
      label={label}
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
      sx={{
        mb: 2,
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          '&.Mui-focused fieldset': {
            borderColor: '#b91c1c',
          }
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: '#b91c1c',
        }
      }}
      {...field}
      {...props}
    >
      {options.map(option => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default FormSelect;