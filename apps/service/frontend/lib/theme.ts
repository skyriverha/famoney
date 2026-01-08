'use client';

import { createTheme } from '@mui/material/styles';

// MUI 팔레트 타입 확장
declare module '@mui/material/styles' {
  interface Palette {
    purple: Palette['primary'];
    pink: Palette['primary'];
  }
  interface PaletteOptions {
    purple?: PaletteOptions['primary'];
    pink?: PaletteOptions['primary'];
  }
  interface PaletteColor {
    50?: string;
  }
  interface SimplePaletteColorOptions {
    50?: string;
  }
}

// Figma 디자인에서 추출한 색상 팔레트
const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // Blue 600
      light: '#3b82f6',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
      50: '#eff6ff', // Blue 50
    },
    secondary: {
      main: '#10b981', // Green 600
      light: '#34d399',
      dark: '#059669',
      contrastText: '#ffffff',
      50: '#ecfdf5', // Green 50
    },
    error: {
      main: '#ef4444',
      50: '#fef2f2',
    },
    warning: {
      main: '#f59e0b',
      50: '#fffbeb',
    },
    info: {
      main: '#3b82f6',
      50: '#eff6ff',
    },
    success: {
      main: '#10b981',
      50: '#f0fdf4', // Green 50 (lighter)
    },
    purple: {
      main: '#9333ea', // Purple 600
      light: '#a855f7',
      dark: '#7c3aed',
      contrastText: '#ffffff',
      50: '#faf5ff', // Purple 50
    },
    pink: {
      main: '#ec4899', // Pink 500
      light: '#f472b6',
      dark: '#db2777',
      contrastText: '#ffffff',
      50: '#fce7f3', // Pink 50
    },
    background: {
      default: '#f9fafb', // Gray 50
      paper: '#ffffff',
    },
    text: {
      primary: '#111827', // Gray 900
      secondary: '#6b7280', // Gray 500
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '10px 20px',
        },
        sizeLarge: {
          height: 56,
          fontSize: '1.125rem',
        },
        sizeMedium: {
          height: 48,
        },
        sizeSmall: {
          height: 36,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid #e5e7eb',
        },
      },
    },
  },
});

export default theme;

