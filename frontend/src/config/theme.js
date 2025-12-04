/**
 * MUI Theme Configuration
 * Custom Material-UI theme for ReGo Travel Management System
 */

import { createTheme } from '@mui/material/styles';

// ============================================
// COLOR PALETTE
// ============================================

const colors = {
    primary: {
        main: '#b91c1c', // Corporate red
        light: '#dc2626',
        dark: '#991b1b',
        contrastText: '#ffffff'
    },
    secondary: {
        main: '#fef2f2', // Light red background
        light: '#ffffff',
        dark: '#fee2e2',
        contrastText: '#1f2937'
    },
    error: {
        main: '#dc2626',
        light: '#ef4444',
        dark: '#b91c1c'
    },
    warning: {
        main: '#f59e0b',
        light: '#fbbf24',
        dark: '#d97706'
    },
    info: {
        main: '#3b82f6',
        light: '#60a5fa',
        dark: '#2563eb'
    },
    success: {
        main: '#10b981',
        light: '#34d399',
        dark: '#059669'
    },
    grey: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827'
    }
};

// ============================================
// TYPOGRAPHY
// ============================================

const typography = {
    fontFamily: [
        'Inter',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif'
    ].join(','),
    h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
        lineHeight: 1.2
    },
    h2: {
        fontSize: '2rem',
        fontWeight: 700,
        lineHeight: 1.3
    },
    h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
        lineHeight: 1.4
    },
    h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.4
    },
    h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.5
    },
    h6: {
        fontSize: '1rem',
        fontWeight: 600,
        lineHeight: 1.5
    },
    subtitle1: {
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: 1.75
    },
    subtitle2: {
        fontSize: '0.875rem',
        fontWeight: 500,
        lineHeight: 1.57
    },
    body1: {
        fontSize: '1rem',
        lineHeight: 1.5
    },
    body2: {
        fontSize: '0.875rem',
        lineHeight: 1.43
    },
    button: {
        fontSize: '0.875rem',
        fontWeight: 600,
        textTransform: 'none'
    },
    caption: {
        fontSize: '0.75rem',
        lineHeight: 1.66
    },
    overline: {
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.5px',
        textTransform: 'uppercase'
    }
};

// ============================================
// SPACING
// ============================================

const spacing = 8; // Base spacing unit (8px)

// ============================================
// BREAKPOINTS
// ============================================

const breakpoints = {
    values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920
    }
};

// ============================================
// SHAPE
// ============================================

const shape = {
    borderRadius: 8
};

// ============================================
// SHADOWS
// ============================================

const shadows = [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.05)',
    '0px 4px 8px rgba(0, 0, 0, 0.08)',
    '0px 8px 16px rgba(0, 0, 0, 0.1)',
    '0px 12px 24px rgba(0, 0, 0, 0.12)',
    '0px 16px 32px rgba(0, 0, 0, 0.14)',
    '0px 20px 40px rgba(0, 0, 0, 0.16)',
    '0px 24px 48px rgba(0, 0, 0, 0.18)',
    '0px 28px 56px rgba(0, 0, 0, 0.2)',
    '0px 32px 64px rgba(0, 0, 0, 0.22)',
    '0px 36px 72px rgba(0, 0, 0, 0.24)',
    '0px 40px 80px rgba(0, 0, 0, 0.26)',
    '0px 44px 88px rgba(0, 0, 0, 0.28)',
    '0px 48px 96px rgba(0, 0, 0, 0.3)',
    '0px 52px 104px rgba(0, 0, 0, 0.32)',
    '0px 56px 112px rgba(0, 0, 0, 0.34)',
    '0px 60px 120px rgba(0, 0, 0, 0.36)',
    '0px 64px 128px rgba(0, 0, 0, 0.38)',
    '0px 68px 136px rgba(0, 0, 0, 0.4)',
    '0px 72px 144px rgba(0, 0, 0, 0.42)',
    '0px 76px 152px rgba(0, 0, 0, 0.44)',
    '0px 80px 160px rgba(0, 0, 0, 0.46)',
    '0px 84px 168px rgba(0, 0, 0, 0.48)',
    '0px 88px 176px rgba(0, 0, 0, 0.5)',
    '0px 92px 184px rgba(0, 0, 0, 0.52)'
];

// ============================================
// COMPONENT OVERRIDES
// ============================================

const components = {
    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: 8,
                padding: '10px 24px',
                fontSize: '0.875rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.12)'
                }
            },
            contained: {
                '&:hover': {
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)'
                }
            }
        }
    },
    MuiCard: {
        styleOverrides: {
            root: {
                borderRadius: 12,
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
                '&:hover': {
                    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.12)'
                }
            }
        }
    },
    MuiPaper: {
        styleOverrides: {
            root: {
                borderRadius: 12
            },
            elevation1: {
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)'
            },
            elevation2: {
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.08)'
            },
            elevation3: {
                boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)'
            }
        }
    },
    MuiTextField: {
        styleOverrides: {
            root: {
                '& .MuiOutlinedInput-root': {
                    borderRadius: 8
                }
            }
        }
    },
    MuiChip: {
        styleOverrides: {
            root: {
                borderRadius: 6,
                fontWeight: 500
            }
        }
    },
    MuiTableCell: {
        styleOverrides: {
            head: {
                fontWeight: 600,
                backgroundColor: colors.grey[50]
            }
        }
    },
    MuiAppBar: {
        styleOverrides: {
            root: {
                boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)'
            }
        }
    }
};

// ============================================
// CREATE THEME
// ============================================

const theme = createTheme({
    palette: colors,
    typography,
    spacing,
    breakpoints,
    shape,
    shadows,
    components
});

export default theme;

// Export individual parts for use elsewhere
export { colors, typography, spacing, breakpoints, shape };
