// src/theme/index.js
import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#b91c1c',
      light: '#c15454',
      dark: '#8b1f1f'
    },
    background: {
      default: '#fef2f2',
      paper: '#ffffff'
    }
  },
  spacing: 8,
  shape: {
    borderRadius: 8
  }
});

export default theme;