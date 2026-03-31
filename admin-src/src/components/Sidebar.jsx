import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Collapse,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventNoteIcon from '@mui/icons-material/EventNote';
import GroupIcon from '@mui/icons-material/Group';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../hooks/useAuth';

export default function Sidebar({ onItemClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { authUser, doLogout } = useAuth();

  const [cadastrosOpen, setCadastrosOpen] = useState(true);
  const [operacoesOpen, setOperacoesOpen] = useState(true);

  function go(path) {
    navigate(path);
    if (onItemClick) onItemClick();
  }

  function isActive(path) {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(path + '/');
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Brand */}
      <Toolbar sx={{ gap: 1.5 }}>
        <Box
          component="img"
          src="/assets/img/Logo_Terr_White-removebg-preview.png"
          alt="Logo"
          sx={{ height: 32, width: 32, objectFit: 'contain' }}
        />
        <Box>
          <Typography variant="subtitle2" fontWeight={700} color="text.primary" lineHeight={1.2}>
            Terreiro Admin
          </Typography>
          <Typography variant="caption" color="text.secondary" lineHeight={1.2}>
            Tia Maria e Jupira
          </Typography>
        </Box>
      </Toolbar>

      <Divider />

      {/* Navigation */}
      <List sx={{ px: 1, py: 1, flexGrow: 1, overflow: 'auto' }}>
        {/* Dashboard */}
        <ListItemButton selected={isActive('/')} onClick={() => go('/')}>
          <ListItemIcon>
            <DashboardIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Dashboard" primaryTypographyProps={{ fontSize: '0.875rem' }} />
        </ListItemButton>

        {/* Cadastros group */}
        <ListItemButton onClick={() => setCadastrosOpen((v) => !v)} sx={{ mt: 0.5 }}>
          <ListItemIcon>
            <FolderOpenIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Cadastros" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 700 }} />
          {cadastrosOpen ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
        </ListItemButton>

        <Collapse in={cadastrosOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{ pl: 4 }}
              selected={isActive('/gira')}
              onClick={() => go('/gira')}
            >
              <ListItemIcon>
                <EventNoteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Giras"
                primaryTypographyProps={{ fontSize: '0.875rem' }}
              />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              selected={isActive('/mediums')}
              onClick={() => go('/mediums')}
            >
              <ListItemIcon>
                <GroupIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Médiuns"
                primaryTypographyProps={{ fontSize: '0.875rem' }}
              />
            </ListItemButton>
          </List>
        </Collapse>

        {/* Operações group */}
        <ListItemButton onClick={() => setOperacoesOpen((v) => !v)} sx={{ mt: 0.5 }}>
          <ListItemIcon>
            <BuildCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Operações" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 700 }} />
          {operacoesOpen ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
        </ListItemButton>

        <Collapse in={operacoesOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{ pl: 4 }}
              selected={isActive('/porta')}
              onClick={() => go('/porta')}
            >
              <ListItemIcon>
                <MeetingRoomIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Porta"
                primaryTypographyProps={{ fontSize: '0.875rem' }}
              />
            </ListItemButton>
          </List>
        </Collapse>
      </List>

      {/* User footer */}
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary" display="block" mb={1}>
          {authUser?.username || ''}
        </Typography>
        <Button
          fullWidth
          size="small"
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={doLogout}
        >
          Sair
        </Button>
      </Box>
    </Box>
  );
}
