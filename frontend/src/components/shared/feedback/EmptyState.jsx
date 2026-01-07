/**
 * EmptyState Component
 * Reusable empty state display for tables and lists
 * Replaces repeated empty state JSX across components
 */

import React from 'react';
import { Box, Typography } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';

const EmptyState = ({
    icon = <InfoOutlined sx={{ fontSize: 64 }} />,
    title = 'No Data Found',
    message = 'There are no items to display.',
    action
}) => {
    return (
        <Box
            sx={{
                textAlign: 'center',
                py: 6,
                px: 3
            }}
        >
            <Box sx={{ color: 'text.secondary', opacity: 0.5, mb: 2 }}>
                {icon}
            </Box>

            <Typography
                variant="h6"
                sx={{ color: 'text.primary', fontWeight: 600, mb: 1 }}
            >
                {title}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                {message}
            </Typography>

            {action && (
                <Box sx={{ mt: 3 }}>
                    {action}
                </Box>
            )}
        </Box>
    );
};

export default EmptyState;
