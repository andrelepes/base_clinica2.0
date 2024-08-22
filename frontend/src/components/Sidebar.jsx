import { useState } from 'react';
import { styled } from '@mui/material';
import { useMediaQuery } from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LogoutIcon from '@mui/icons-material/Logout';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import BusinessIcon from '@mui/icons-material/Business';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

import Toolbar from '@mui/material/Toolbar';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MuiDrawer from '@mui/material/Drawer';
import DrawerItem from './DrawerItem';
import { useAuth } from '../contexts/AuthContext';

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
  const isLargeScreen = useMediaQuery('(min-width:1025px)');

  const [open, setOpen] = useState(isLargeScreen);
  const [isOpenSchedule, setIsOpenSchedule] = useState(false);
  const { tipousuario, logout } = useAuth();

  const toggleDrawer = () => {
    setOpen(!open);
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
        <DrawerItem
          onClick={() => {
            setIsOpenSchedule(!isOpenSchedule);
          }}
          itemText="Agenda"
          afterText={isOpenSchedule ? <ExpandLess /> : <ExpandMore />}
        >
          <CalendarTodayIcon />
        </DrawerItem>
        <Collapse in={isOpenSchedule} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 1 }}>
            <Divider />
            {tipousuario !== 'clinica' && (
              <DrawerItem itemText="Meus agendamentos" itemLink="/agenda/minha">
                <EventNoteIcon />
              </DrawerItem>
            )}
            <DrawerItem
              itemText="Por consultório"
              itemLink="/agenda/consultorios"
            >
              <MeetingRoomIcon />
            </DrawerItem>
            {tipousuario === 'clinica' && (
              <DrawerItem
                itemText="Por psicólogo"
                itemLink="/agenda/psicologos"
              >
                <SupervisorAccountIcon />
              </DrawerItem>
            )}
            {tipousuario !== 'psicologo_vinculado' && (
              <DrawerItem itemText="Por paciente" itemLink="/agenda/pacientes">
                <PersonIcon />
              </DrawerItem>
            )}
          </List>
          <Divider />
        </Collapse>
        <DrawerItem itemLink="/pacientes" itemText="Pacientes">
          <PersonIcon />
        </DrawerItem>
        {tipousuario === 'clinica' && (
          <DrawerItem itemLink="/psicologos" itemText="Alunos">
            <AssignmentIndIcon />
          </DrawerItem>
        )}
        {tipousuario === 'clinica' && (
          <DrawerItem itemLink="/clinicas" itemText="Clínica">
            <BusinessIcon />
          </DrawerItem>
        )}
        <DrawerItem itemLink="/cursos" itemText="Cursos">
          <SchoolIcon />
        </DrawerItem>
        <DrawerItem itemLink="/configuracoes" itemText="Configurações">
          <ManageAccountsIcon />
        </DrawerItem>
        <DrawerItem onClick={logout} itemText="Sair">
          <LogoutIcon />
        </DrawerItem>
      </List>
    </Drawer>
  );
}
