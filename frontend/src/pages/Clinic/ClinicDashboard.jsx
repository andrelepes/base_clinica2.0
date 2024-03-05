import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import TableWithActions from '../../components/TableWithActions';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import Grid from '@mui/material/Grid';
import PsychologistForm from './PsychologistForm';
import SecretaryForm from './SecretaryForm';
import OfficeForm from './OfficeForm';

export default function ClinicDashboard() {
  const [psychologists, setPsychologists] = useState([]);
  const [secretaries, setSecretaries] = useState([]);
  const [offices, setOffices] = useState([]);
  const [isOpenPsychologistForm, setIsOpenPsychologistForm] = useState(false);
  const [isOpenSecretaryForm, setIsOpenSecretaryForm] = useState(false);
  const [isOpenOfficeForm, setIsOpenOfficeForm] = useState(false);
  const { clinicaId } = useAuth();
  const fetchPsychologists = async () => {
    try {
      const response = await api.get(
        `/usuarios/linked-psychologists/${clinicaId}`
      );
      const filteredPsychologists = response.data.filter(
        (psychologist) =>
          psychologist.status_usuario === 'ativo' ||
          psychologist.status_usuario === 'aguardando confirmacao'
      );
      setPsychologists(filteredPsychologists);
    } catch (error) {
      toast.error('Erro ao buscar psicólogos vinculados');
    }
  };

  const fetchSecretaries = async () => {
    try {
      const response = await api.get(
        `/usuarios/linked-secretaries/${clinicaId}`
      );
      const filteredSecretaries = response.data.filter(
        (secretary) =>
          secretary.status_usuario === 'ativo' ||
          secretary.status_usuario === 'aguardando confirmacao'
      );
      setSecretaries(filteredSecretaries);
    } catch (error) {
      toast.error('Erro ao buscar secretários vinculados');
    }
  };
  const fetchOffices = async () => {
    try {
      const response = await api.get(`/consultorios/clinica/`);
      setOffices(response.data);
    } catch (error) {
      toast.error('Erro ao buscar consultórios');
    }
  };

  let isMounted = false;
  useEffect(() => {
    if (
      !psychologists.length &&
      !secretaries.length &&
      clinicaId &&
      !isMounted
    ) {
      isMounted = true;
      fetchPsychologists();
      fetchSecretaries();
      fetchOffices();
    }
  }, [clinicaId]);
  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
          }}
        >
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h4"
            id="title"
            component="div"
          >
            Clínica
          </Typography>
        </Toolbar>
        <Grid container spacing={2}>
          <Grid item md={4.5} xs={12}>
            <TableWithActions
              title="Responsáveis Vinculados"
              data={psychologists}
              addFunction={() => setIsOpenPsychologistForm(true)}
              fields={[
                {
                  title: 'Nome',
                  dataTitle: 'nome_usuario',
                  maxWidth: 100,
                  overflow: 'hidden',
                },
                {
                  title: 'Email',
                  dataTitle: 'email_usuario',
                  maxWidth: 220,
                  overflow: 'hidden',
                },
                {
                  title: 'Status',
                  dataTitle: 'status_usuario',
                  maxWidth: 80,
                  overflow: 'hidden',
                },
              ]}
            />
          </Grid>
          <Grid item md={4.5} xs={12}>
            <TableWithActions
              title="Secretários Vinculados"
              data={secretaries}
              addFunction={() => setIsOpenSecretaryForm(true)}
              fields={[
                {
                  title: 'Nome',
                  dataTitle: 'nome_usuario',
                  maxWidth: 100,
                  overflow: 'hidden',
                },
                {
                  title: 'Email',
                  dataTitle: 'email_usuario',
                  maxWidth: 220,
                  overflow: 'hidden',
                },
                {
                  title: 'Status',
                  dataTitle: 'status_usuario',
                  maxWidth: 80,
                  overflow: 'hidden',
                },
              ]}
            />
          </Grid>
          <Grid item md={3} xs={12}>
            <TableWithActions
              title="Consultórios"
              data={offices}
              addFunction={() => setIsOpenOfficeForm(true)}
              fields={[
                {
                  title: 'Nome',
                  dataTitle: 'nome_consultorio',
                  maxWidth: 200,
                  overflow: 'hidden',
                },
                {
                  title: 'Descrição',
                  dataTitle: 'descricao',
                  maxWidth: 200,
                  overflow: 'hidden',
                },
              ]}
            />
          </Grid>
        </Grid>
      </Paper>
      <PsychologistForm
        open={isOpenPsychologistForm}
        setOpen={setIsOpenPsychologistForm}
        fetchPsychologists={fetchPsychologists}
      />
      <SecretaryForm
        open={isOpenSecretaryForm}
        setOpen={setIsOpenSecretaryForm}
        fetchSecretaries={fetchSecretaries}
      />
      <OfficeForm
        open={isOpenOfficeForm}
        setOpen={setIsOpenOfficeForm}
        fetchOffices={fetchOffices}
      />
    </Box>
  );
}
