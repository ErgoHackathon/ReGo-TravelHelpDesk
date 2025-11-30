// src/components/shared/data-display/InfoDisplay.jsx
import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import SharedCard from '../cards/SharedCard';

const InfoDisplay = ({ title, items }) => (
  <SharedCard>
    <Box sx={{ p: 2 }}>
      <Typography 
        variant="h6" 
        fontWeight="bold" 
        gutterBottom
      >
        {title}
      </Typography>

      <List>
        {items.map((item, index) => (
          <ListItem 
            key={index}
            sx={{ py: 1 }}
          >
            <ListItemText
              primary={item.label}
              secondary={item.value}
              primaryTypographyProps={{
                variant: 'body2',
                color: 'text.secondary'
              }}
              secondaryTypographyProps={{
                variant: 'body1',
                fontWeight: 500
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  </SharedCard>
);

export default InfoDisplay;