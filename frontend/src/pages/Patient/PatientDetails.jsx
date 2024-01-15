import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableFooter from '@mui/material/TableFooter';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Tooltip from '@mui/material/Tooltip';
import TablePagination from '@mui/material/TablePagination';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import Grid from '@mui/material/Grid';
import TaskIcon from '@mui/icons-material/Task';
import EvolutionDetailsRow from '../../components/Patients/EvolutionDetailsRow';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import PatientDetailCard from '../../components/Patients/PatientDetailCard';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import PatientAnamnesisForm from './PatientAnamnesisForm';
import PatientClosureForm from './PatientClosureForm';
import dayjs from 'dayjs';

export default function PatientDetails() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('nome_paciente');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [evolutions, setEvolutions] = useState([]);
  const [anamnesis, setAnamnesis] = useState(null);
  const [closure, setClosure] = useState(null);
  const [readOnly, setReadOnly] = useState(false);
  const [selectedEvolution, setSelectedEvolution] = useState(null);
  const [isOpenPatientForm, setIsOpenPatientForm] = useState(false);
  const [isOpenAnamnesisForm, setIsOpenAnamnesisForm] = useState(false);
  const [isOpenClosureForm, setIsOpenClosureForm] = useState(false);
  const [isOpenConfirmation, setIsOpenConfirmation] = useState(false);
  const [paciente, setPaciente] = useState(null);

  const { usuarioId: usuario_id } = useAuth();

  const paciente_id = useParams().id;

  const visibleRows = useMemo(
    () =>
      evolutions?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [evolutions, page, rowsPerPage]
  );

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - evolutions?.length) : 0;

  const fetchEvolutions = useCallback(async () => {
    try {
      const response = await api.get(`/evolutions/paciente/${paciente_id}`);
      setEvolutions(response.data);
      setSelectedEvolution(null);
    } catch (error) {
      toast.error('Erro ao buscar todas as evoluções');
    }
  }, []);

  const fetchPacienteDetails = async () => {
    try {
      const response = await api.get(`/pacientes/${paciente_id}`);
      setPaciente(response.data.data);
    } catch (error) {
      toast.error('Erro ao buscar detalhes do paciente');
    }
  };

  const fetchReports = async () => {
    try {
      const anamnesisResponse = await api.get(
        `/anamnesis/patient/${paciente_id}`
      );
      setAnamnesis(anamnesisResponse.data);
      const closureResponse = await api.get(`/closure/patient/${paciente_id}`);
      setClosure(closureResponse.data);
    } catch (error) {
      if (error.response.status !== 404) {
        toast.error('Erro ao buscar relatórios');
      }
    }
  };

  const handleChangeStatus = async () => {
    try {
      const updateData = {
        usuario_id,
      };

      if (paciente?.status_paciente === 'ativo') {
        await api.put(`/pacientes/${paciente_id}/inativo`, updateData);
        setPaciente((prevState) => ({
          ...prevState,
          status_paciente: 'inativo',
        }));
        toast.success('Status do paciente alterado com sucesso!');
      } else if (paciente?.status_paciente === 'inativo') {
        await api.put(`/pacientes/${paciente_id}/ativo`, updateData); // Use paciente_id aqui
        setPaciente((prevState) => ({
          ...prevState,
          status_paciente: 'ativo',
        }));
        toast.success('Status do paciente alterado com sucesso!');
      }
    } catch (error) {
      toast.error('Ocorreu um erro ao trocar o status do paciente');
    }
  };

  let isMounted = false;
  useEffect(() => {
    if (!isMounted) {
      isMounted = true;
      return;
    }
    if (!evolutions.length) {
      fetchEvolutions();
    }
    if (!paciente?.status_paciente) {
      fetchPacienteDetails();
    }
    if (!anamnesis || !closure) {
      fetchReports();
    }
  }, []);
  return (
    <Box sx={{ width: '100%' }} display="flex">
      <Grid container>
        <Grid item md={3} xs={12}>
          <PatientDetailCard
            handleChangeStatus={handleChangeStatus}
            patient={paciente}
          />
        </Grid>
        <Grid item md={9} xs={12}>
          <Paper sx={{ width: '100%', mb: 2, height: '97.5%' }}>
            <Toolbar
              sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
              }}
            >
              <Typography
                sx={{ flex: '1 1 100%' }}
                variant="h"
                id="tableTitle"
                component="div"
              >
                Evoluções
              </Typography>
              <Tooltip title="Adicionar Anamnese" disableInteractive>
                <IconButton onClick={() => setIsOpenAnamnesisForm(true)}>
                  <NoteAddIcon fontSize="large" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Adicionar Formulário de Alta" disableInteractive>
                <IconButton onClick={() => setIsOpenClosureForm(true)}>
                  <TaskIcon fontSize="large" />
                </IconButton>
              </Tooltip>
            </Toolbar>
            <TableContainer>
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Data da Sessão</TableCell>
                    <TableCell>Humor do Paciente na Chegada</TableCell>

                    <TableCell>Humor do Paciente na Saída</TableCell>
                    <TableCell>Evoluções Pendentes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleRows?.map((evolution) => (
                    <EvolutionDetailsRow
                      evolution={evolution}
                      key={evolution.evolution_id}
                    />
                  ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 73 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {/* <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[
                    5,
                    10,
                    25,
                    { label: 'Todas', value: -1 },
                  ]}
                  count={patients?.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter> */}
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Paper sx={{ width: '100%', mb: 2 }}>
          <TableContainer>
            <Table sx={{ minWidth: 750 }} size="medium">
              <TableHead>
                <TableRow>
                  <TableCell>Ações</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Data de Preenchimento</TableCell>
                  <TableCell>Responsável</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Anamnese</TableCell>
                  <TableCell>
                    {dayjs(anamnesis?.created_at).format('DD/MM/YYYY')}
                  </TableCell>
                  <TableCell>{anamnesis?.nome_usuario}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Alta do Paciente</TableCell>
                  <TableCell>
                    {closure
                      ? dayjs(closure.created_at).format('DD/MM/YYYY')
                      : '-'}
                  </TableCell>
                  <TableCell>{closure ? closure.nome_usuario : '-'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
      <PatientAnamnesisForm
        open={isOpenAnamnesisForm}
        setOpen={setIsOpenAnamnesisForm}
        anamnesis={anamnesis}
        isRead={readOnly}
        setIsRead={setReadOnly}
        fetchEvolutions={fetchEvolutions}
      />
      <PatientClosureForm
        open={isOpenClosureForm}
        setOpen={setIsOpenClosureForm}
        closure={closure}
        isRead={readOnly}
        setIsRead={setReadOnly}
        fetchEvolutions={fetchEvolutions}
        sessions={evolutions}
        expectationsAnamneseOptions={anamnesis}
      />
    </Box>
  );
}
