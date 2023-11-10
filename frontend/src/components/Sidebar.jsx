import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';

import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MuiDrawer from '@mui/material/Drawer';
import DrawerItem from './DrawerItem';

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: 240,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(3),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(7),
      },
    }),
  },
}));

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  return (
    <Drawer variant="permanent" open={open}>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          px: [1],
        }}
      >
        <IconButton onClick={toggleDrawer}>
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Toolbar>
      <Divider />
      <List component="nav">
        <DrawerItem itemLink="/" itemText="Iniciar">
          <HomeIcon />
        </DrawerItem>
        <DrawerItem itemLink="/agenda" itemText="Agenda">
          <CalendarTodayIcon />
        </DrawerItem>
        <DrawerItem itemLink="/pacientes" itemText="Pacientes">
          <PersonIcon />
        </DrawerItem>
        {/* Renderização condicional baseada no tipo de usuário
          {(tipousuario === 'clinica' ||
            tipousuario === 'secretario_vinculado') && (
            <DrawerItem itemLink="/clinicas" itemText="Clínica">
              <BusinessIcon />
            </DrawerItem>
          )} */}
        <DrawerItem itemLink="/cursos" itemText="Cursos">
          <SchoolIcon />
        </DrawerItem>
        <DrawerItem itemLink="/configuracoes" itemText="Configurações">
          <SettingsIcon />
        </DrawerItem>
        <DrawerItem onClick={handleLogout} itemText="Sair">
          <LogoutIcon />
        </DrawerItem>
      </List>
    </Drawer>
  );
}
