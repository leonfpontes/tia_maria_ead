import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#10b981',
      dark: '#059669',
      light: '#34d399',
      contrastText: '#fff',
    },
    secondary: {
      main: '#EC4899',
      contrastText: '#fff',
    },
    background: {
      default: '#0f1a0f',
      paper: '#1a2a1a',
    },
    text: {
      primary: '#e8f5e9',
      secondary: '#a8d5a2',
      disabled: 'rgba(232,245,233,0.38)',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
    success: { main: '#4ade80' },
    warning: { main: '#fbbf24' },
    error: { main: '#f87171' },
    info: { main: '#93c5fd' },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h4: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#122012',
          borderRight: '1px solid rgba(255,255,255,0.08)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#122012',
          backgroundImage: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          boxShadow: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: '0.75rem',
          backgroundImage: 'none',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          color: '#6b9e68',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          fontWeight: 700,
          fontSize: '0.8rem',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        },
        body: {
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          fontSize: '0.875rem',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover td': {
            background: 'rgba(255,255,255,0.03)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '0.72rem',
          height: 22,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4ade80',
          },
        },
        input: {
          '&:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 100px #1a2a1a inset',
            WebkitTextFillColor: '#e8f5e9',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem',
          marginBottom: 2,
          '&.Mui-selected': {
            backgroundColor: 'rgba(16,185,129,0.15)',
            color: '#4ade80',
            '& .MuiListItemIcon-root': {
              color: '#4ade80',
            },
            '&:hover': {
              backgroundColor: 'rgba(16,185,129,0.20)',
            },
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 36,
          color: '#6b9e68',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { fontSize: '0.78rem' },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: '0.5rem' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem',
          fontSize: '0.85rem',
        },
        sizeSmall: {
          padding: '4px 12px',
          fontSize: '0.78rem',
        },
      },
    },
  },
});

export default theme;
