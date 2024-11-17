import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ClinicDetails from './Clinic/ClinicDetails';

export default function Profile() {
  const { tipousuario } = useAuth();
  return (
    <Box>
      <Paper
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        }}
      >
        <Toolbar
          sx={{
            pl: { sm: 0 },
            pr: { xs: 1, sm: 1 },
          }}
        >
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h5"
            id="tableTitle"
            component="div"
          >
            Configurações do Perfil
          </Typography>
        </Toolbar>
        {tipousuario === 'clinica' && <ClinicDetails />}
      </Paper>
    </Box>
  );
}
