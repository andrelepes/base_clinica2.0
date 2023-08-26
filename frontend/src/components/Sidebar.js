import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Avatar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import BusinessIcon from '@mui/icons-material/Business'; // Ícone para clínicas

function Sidebar() {
    const username = localStorage.getItem('username') || 'Usuário';
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
        window.location.reload();
    };

    return (
        <Drawer
            variant="permanent"
            anchor="left"
        >
            <Avatar alt={username} src="/path-to-user-image.jpg">{username.charAt(0)}</Avatar>
            <List>
                <ListItem button component={Link} to="/">
                    <ListItemIcon><HomeIcon /></ListItemIcon>
                    <ListItemText primary="Iniciar" />
                </ListItem>
                <ListItem button component={Link} to="/agenda">
                    <ListItemIcon><CalendarTodayIcon /></ListItemIcon>
                    <ListItemText primary="Agenda" />
                </ListItem>
                <ListItem button component={Link} to="/pacientes">
                    <ListItemIcon><PersonIcon /></ListItemIcon>
                    <ListItemText primary="Pacientes" />
                </ListItem>
                <ListItem button component={Link} to="/clinicas"> {/* Novo item para clínicas */}
                    <ListItemIcon><BusinessIcon /></ListItemIcon>
                    <ListItemText primary="Clínica" />
                </ListItem>
                <ListItem button component={Link} to="/cursos">
                    <ListItemIcon><SchoolIcon /></ListItemIcon>
                    <ListItemText primary="Cursos" />
                </ListItem>
                <ListItem button component={Link} to="/configuracoes">
                    <ListItemIcon><SettingsIcon /></ListItemIcon>
                    <ListItemText primary="Configurações" />
                </ListItem>
                <ListItem button onClick={handleLogout}>
                    <ListItemIcon><LogoutIcon /></ListItemIcon>
                    <ListItemText primary="Sair" />
                </ListItem>
            </List>
        </Drawer>
    );
}

export default Sidebar;
