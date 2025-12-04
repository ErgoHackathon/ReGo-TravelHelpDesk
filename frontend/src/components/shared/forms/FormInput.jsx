// src/components/shared/forms/FormInput.jsx
import React from 'react';
import { TextField } from '@mui/material';
import { useField } from 'formik';

const FormInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  
  return (
    <TextField
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
    />
  );
};

export default FormInput;