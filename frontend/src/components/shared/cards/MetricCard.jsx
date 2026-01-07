/**
 * MetricCard Component
 * Reusable metric card for dashboards
 * Reduces duplication across Employee, Manager, AVP, SVP dashboards
 */

import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const MetricCard = ({
    icon,
    label,
    value,
    color = '#1976d2',
    onClick,
    subtitle
}) => {
    return (
        <Card
            onClick={onClick}
            sx={{
                cursor: onClick ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
                borderLeft: `4px solid ${color}`,
                '&:hover': onClick ? {
                    transform: 'translateY(-2px)',
                    boxShadow: 3
                } : {}
            }}
        >
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Box sx={{ color: color, opacity: 0.8, fontSize: 32 }}>
                        {icon}
                    </Box>
                </Box>

                <Typography
                    variant="body2"
                    sx={{
                        color: 'text.secondary',
                        textTransform: 'uppercase',
                        fontWeight: 500,
                        letterSpacing: 0.5,
                        fontSize: 12
                    }}
                >
                    {label}
                </Typography>

                <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: 'text.primary', mt: 1 }}
                >
                    {value}
                </Typography>

                {subtitle && (
                    <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>
                        {subtitle}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default MetricCard;
