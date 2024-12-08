import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';

import PersonIcon from '@mui/icons-material/Person';
import WalletIcon from '@mui/icons-material/Wallet';
import CakeIcon from '@mui/icons-material/Cake';
import PhoneIcon from '@mui/icons-material/Phone';
import MailIcon from '@mui/icons-material/Mail';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import dayjs from 'dayjs';

export default function PatientDetailCard({
  patient = {},
}) {
  return (
    <Box sx={{ width: '100%', paddingRight: 6 }}>
      <Grid container alignItems={'center'} marginLeft={2}>
        <Grid item md={8} xs={12}>
          <Typography sx={{ flex: '1 1 100%' }} variant="h5" component="div">
            Detalhes do Paciente
          </Typography>
        </Grid>
        <Grid item md={4} xs={12}>
          <ListItem>
            <ListItemText
              primary={
                patient?.status_paciente === 'ativo' ? 'Ativo' : 'Inativo'
              }
              secondary={'Status do Paciente'}
              id="switch-status-label"
            />
          </ListItem>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item md={5} xs={12}>
          <ListItem>
            <ListItemIcon>
              <PersonIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText
              primary={patient?.nome_paciente}
              secondary="Nome do Paciente"
            />
          </ListItem>
        </Grid>
        <Grid item md={3.5} xs={12}>
          <ListItem>
            <ListItemIcon>
              <WalletIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText
              primary={patient?.cpf_paciente}
              secondary="CPF do Paciente"
            />
          </ListItem>
        </Grid>
        <Grid item md={3.5} xs={12}>
          <ListItem>
            <ListItemIcon>
              <PhoneIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText
              primary={patient?.telefone_paciente}
              secondary="Telefone do Paciente"
            />
          </ListItem>
        </Grid>
        <Grid item md={4.5} xs={12}>
          <ListItem>
            <ListItemIcon>
              <CakeIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText
              primary={dayjs(patient?.data_nascimento_paciente).format(
                'DD/MM/YYYY'
              )}
              secondary="Data de Nascimento do Paciente"
            />
          </ListItem>
        </Grid>

        <Grid item md={7.5} xs={12}>
          <ListItem>
            <ListItemIcon>
              <MailIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText
              primary={patient?.email_paciente}
              sx={{ overflowX: 'hidden' }}
              secondary="E-mail do Paciente"
            />
          </ListItem>
        </Grid>
        <Grid item md={3} xs={12}>
          <ListItem>
            <ListItemIcon>
              <LocationOnIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText
              primary={patient?.cep_paciente}
              secondary="CEP do Paciente"
            />
          </ListItem>
        </Grid>
        <Grid item md={9} xs={12}>
          <ListItem>
            <ListItemIcon>
              <HomeIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText
              primary={patient?.endereco_paciente}
              secondary="Endereço do Paciente"
            />
          </ListItem>
        </Grid>
      </Grid>
    </Box>
  );
}
