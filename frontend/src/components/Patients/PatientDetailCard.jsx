import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';

import PersonIcon from '@mui/icons-material/Person';
import WalletIcon from '@mui/icons-material/Wallet';
import CakeIcon from '@mui/icons-material/Cake';
import PhoneIcon from '@mui/icons-material/Phone';
import MailIcon from '@mui/icons-material/Mail';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import Switch from '@mui/material/Switch';
import dayjs from 'dayjs';

export default function PatientDetailCard({
  patient = {},
  handleChangeStatus,
}) {
  return (
    <Box sx={{ width: '100%', maxWidth: 420, paddingRight: 6 }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
          }}
        >
          <Typography sx={{ flex: '1 1 100%' }} variant="h5" component="div">
            Detalhes do Paciente
          </Typography>
        </Toolbar>
        <List>
          <ListItem>
            <ListItemIcon>
              <PersonIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText
              primary={patient?.nome_paciente}
              secondary="Nome do Paciente"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <WalletIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText
              primary={patient?.cpf_paciente}
              secondary="CPF do Paciente"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CakeIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText
              primary={dayjs(patient?.data_nascimento_paciente).format('DD/MM/YYYY')}
              secondary="Data de Nascimento do Paciente"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <PhoneIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText
              primary={patient?.telefone_paciente}
              secondary="Telefone do Paciente"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <MailIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText
              primary={patient?.email_paciente}
              sx={{overflowX:'hidden'}}
              secondary="E-mail do Paciente"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <LocationOnIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText
              primary={patient?.cep_paciente}
              secondary="CEP do Paciente"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <HomeIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText
              primary={patient?.endereco_paciente}
              secondary="Endereço do Paciente"
            />
          </ListItem>
          <ListItem>
            <Tooltip
              title={patient?.status_paciente}
              arrow
              disableInteractive
              placement="right"
            >
              <Switch
                value={patient?.status_paciente === 'ativo'}
                checked={patient?.status_paciente === 'ativo'}
                edge="start"
                onChange={handleChangeStatus}
                inputProps={{ 'aria-labelledby': 'switch-status-label' }}
              />
            </Tooltip>
            <ListItemText
              sx={{ marginLeft: 0 }}
              primary="Inativo | Ativo"
              id="switch-status-label"
            />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
}
