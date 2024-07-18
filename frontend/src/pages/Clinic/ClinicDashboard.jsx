import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

import TableWithActions from '../../components/TableWithActions';
import ConfirmationDialog from '../../components/ConfirmationDialog';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import Grid from '@mui/material/Grid';
import PsychologistForm from './PsychologistForm';
import SecretaryForm from './SecretaryForm';
import OfficeForm from './OfficeForm';
import { useNavigate } from 'react-router-dom';
import VinculatePsychologistDialog from '../Psychologist/VinculatePsychologistDialog';

export default function ClinicDashboard() {
  const [psychologists, setPsychologists] = useState([]);
  const [secretaries, setSecretaries] = useState([]);
  const [offices, setOffices] = useState([]);
  const [isOpenPsychologistForm, setIsOpenPsychologistForm] = useState(false);
  const [isOpenSecretaryForm, setIsOpenSecretaryForm] = useState(false);
  const [isOpenOfficeForm, setIsOpenOfficeForm] = useState(false);
  const [isOpenVinculationDialog, setIsOpenVinculationDialog] = useState(false);
  const [selectedPsychologist, setSelectedPsychologist] = useState(false);
  const [selectedSecretary, setSelectedSecretary] = useState(false);
  const [selectedOffice, setSelectedOffice] = useState(false);
  const [confirmationTitle, setConfirmationTitle] = useState('');
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [confirmRoute, setConfirmRoute] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');

  const { clinicaId } = useAuth();

  const navigate = useNavigate();

  const fetchPsychologists = async () => {
    try {
      const response = await api.get(
        `/clinicas/${clinicaId}/linked-psychologists/`
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
  const handleDelete = async () => {
    try {
      await api.delete(confirmRoute);
      setOpenConfirmation(false);
      toast.success('Registro deletado com sucesso');
      fetchPsychologists();
      fetchSecretaries();
      fetchOffices();
    } catch (error) {
      toast.error(
        'Ocorreu um erro ao deletar o registro, verifique se o mesmo está sendo utilizado'
      );
      setOpenConfirmation(false);
    }
  };

  const handleVinculation = (psychologist) => {
    setSelectedPsychologist(psychologist);
    setIsOpenVinculationDialog(true);
  };

  const confirmButton = (title, proceedRoute, message = '') => {
    setConfirmationTitle(title);
    setConfirmRoute(proceedRoute);
    setConfirmMessage(message);
    setOpenConfirmation(true);
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
        <Grid container spacing={2} direction="row">
          <Grid item md={6} xs={12}>
            <TableWithActions
              title="Responsáveis Vinculados"
              data={psychologists}
              startingPages={10}
              addFunction={() => setIsOpenPsychologistForm(true)}
              editFunction={(psychologist) => {
                setSelectedPsychologist(psychologist);
                setIsOpenPsychologistForm(true);
              }}
              infoFunction={(psychologist) =>
                navigate(`/psicologo/${psychologist.usuario_id}`)
              }
              deleteFunction={(psychologist) => {
                confirmButton(
                  `Excluir ${psychologist.nome_usuario}`,
                  `/usuarios/${psychologist.usuario_id}`,
                  'Deseja excluir este responsável?'
                );
              }}
              otherFunction={{
                title: 'Vincular pacientes',
                function: (psychologist) => handleVinculation(psychologist),
                icon: <GroupAddIcon color="secondary" />,
              }}
              fields={[
                {
                  title: 'Ações',
                  dataTitle: 'acoes',
                },
                {
                  title: 'Nome',
                  dataTitle: 'nome_usuario',
                  maxWidth: 100,
                  overflow: 'hidden',
                  filterable: true,
                },
                {
                  title: 'Email',
                  dataTitle: 'email_usuario',
                  maxWidth: 220,
                  overflow: 'hidden',
                  filterable: true,
                },
                {
                  title: 'Status',
                  dataTitle: 'status_usuario',
                  maxWidth: 80,
                  overflow: 'hidden',
                  filterable: true,
                },
              ]}
            />
          </Grid>
          <Grid item container direction="row" md={6}>
            <Grid item xs={12}>
              <TableWithActions
                title="Secretários Vinculados"
                data={secretaries}
                addFunction={() => setIsOpenSecretaryForm(true)}
                editFunction={(secretary) => {
                  setSelectedSecretary(secretary);
                  setIsOpenSecretaryForm(true);
                }}
                infoFunction={(secretary) =>
                  navigate(`/secretario/${secretary.usuario_id}`)
                }
                deleteFunction={(secretary) => {
                  confirmButton(
                    'Excluir o secretário?',
                    `/usuarios/${secretary.usuario_id}`,
                    'Este registro será permanentemente excluído.'
                  );
                }}
                fields={[
                  {
                    title: 'Ações',
                    dataTitle: 'acoes',
                  },
                  {
                    title: 'Nome',
                    dataTitle: 'nome_usuario',
                    maxWidth: 100,
                    overflow: 'hidden',
                    filterable: true,
                  },
                  {
                    title: 'Email',
                    dataTitle: 'email_usuario',
                    maxWidth: 220,
                    overflow: 'hidden',
                    filterable: true,
                  },
                  {
                    title: 'Status',
                    dataTitle: 'status_usuario',
                    maxWidth: 80,
                    overflow: 'hidden',
                    filterable: true,
                  },
                ]}
              />
            </Grid>
            <Grid item xs={12}>
              <TableWithActions
                title="Consultórios"
                data={offices}
                addFunction={() => setIsOpenOfficeForm(true)}
                editFunction={(office) => {
                  setSelectedOffice(office);
                  setIsOpenOfficeForm(true);
                }}
                deleteFunction={(office) => {
                  confirmButton(
                    'Excluir Consultório',
                    `/consultorios/${office.consultorio_id}`,
                    `Deseja excluir o consultório ${office.nome_consultorio}?`
                  );
                }}
                fields={[
                  {
                    title: 'Ações',
                    dataTitle: 'acoes',
                  },
                  {
                    title: 'Nome',
                    dataTitle: 'nome_consultorio',
                    maxWidth: 200,
                    overflow: 'hidden',
                    filterable: true,
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
        </Grid>
      </Paper>
      <PsychologistForm
        open={isOpenPsychologistForm}
        setOpen={setIsOpenPsychologistForm}
        fetchPsychologists={fetchPsychologists}
        selectedPsychologist={selectedPsychologist}
        setSelectedPsychologist={setSelectedPsychologist}
      />
      <SecretaryForm
        open={isOpenSecretaryForm}
        setOpen={setIsOpenSecretaryForm}
        fetchSecretaries={fetchSecretaries}
        selectedSecretary={selectedSecretary}
        setSelectedSecretary={setSelectedSecretary}
      />
      <OfficeForm
        open={isOpenOfficeForm}
        setOpen={setIsOpenOfficeForm}
        fetchOffices={fetchOffices}
        selectedOffice={selectedOffice}
        setSelectedOffice={setSelectedOffice}
      />
      <VinculatePsychologistDialog
        open={isOpenVinculationDialog}
        setOpen={setIsOpenVinculationDialog}
        selectedPsychologist={selectedPsychologist}
        setSelectedPsychologist={setSelectedPsychologist}
      />
      <ConfirmationDialog
        title={confirmationTitle}
        handleClose={() => setOpenConfirmation(false)}
        confirmAction={handleDelete}
        message={confirmMessage}
        open={openConfirmation}
      />
    </Box>
  );
}
