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
import TableSortLabel from '@mui/material/TableSortLabel';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import HistoryIcon from '@mui/icons-material/History';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Grid from '@mui/material/Grid';
import TaskIcon from '@mui/icons-material/Task';
import EvolutionDetailsRow from '../../components/Patients/EvolutionDetailsRow';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import PatientAnamnesisForm from './PatientAnamnesisForm';
import PatientClosureForm from './PatientClosureForm';
import PatientEvolutionsForm from './PatientEvolutionsForm';
import dayjs from 'dayjs';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import HistoryDialog from './HistoryDialog';
import { getComparator, stableSort } from '../../utils/sortFunctions';
import { visuallyHidden } from '@mui/utils';
import AttachementDialog from './AttachmentDialog';

export default function PatientDetails() {
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('session_date');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [evolutions, setEvolutions] = useState([]);
  const [anamnesis, setAnamnesis] = useState(null);
  const [closure, setClosure] = useState(null);
  const [readOnly, setReadOnly] = useState(false);
  const [selectedEvolution, setSelectedEvolution] = useState(null);
  const [isOpenEvolutionForm, setIsOpenEvolutionForm] = useState(false);
  const [isOpenAnamnesisForm, setIsOpenAnamnesisForm] = useState(false);
  const [isOpenClosureForm, setIsOpenClosureForm] = useState(false);
  const [isOpenConfirmation, setIsOpenConfirmation] = useState(false);
  const [paciente, setPaciente] = useState(null);
  const [nextAppointment, setNextAppointment] = useState(null);

  const [isOpenAttachmentDialog, setIsOpenAttachmentDialog] = useState(false);
  const [isOpenHistory, setIsOpenHistory] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [recordType, setRecordType] = useState('');

  const { usuarioId: usuario_id, tipousuario } = useAuth();

  const paciente_id = useParams().id;

  const visibleRows = useMemo(
    () =>
      stableSort(evolutions, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [evolutions, page, rowsPerPage, order, orderBy]
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property) => (event) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

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

  const fetchNextAppointment = async () => {
    try {
      const response = await api.get(`/agendamentos/next/${paciente_id}`);
      setNextAppointment(response.data);
    } catch (error) {
      if (error.response.status !== 404) {
        toast.error('Ocorreu um erro ao buscar os agendamentos');
      }
    }
  };

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

  const handleEvolutionHistoryModal = (historyArray) => {
    setSelectedRecord(historyArray);
    setRecordType(
      `Evolução da Sessão: ${dayjs(selectedEvolution?.session_date).format(
        'DD/MM/YYYY [às] HH:mm'
      )}`
    );
    setIsOpenHistory(true);
  };

  const handleAnamnesisHistoryModal = (historyArray) => {
    setSelectedRecord(historyArray);
    setRecordType('Anamnese do paciente');
    setIsOpenHistory(true);
  };

  const handleClosureHistoryModal = (historyArray) => {
    setSelectedRecord(historyArray);
    setRecordType('Alta do paciente');
    setIsOpenHistory(true);
  };

  const handleDownloadEvolutionReportPDF = async (evolution) => {
    try {
      const response = await api.get(
        `/evolutions/reports/pdf/${evolution.evolution_id}`,
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `evolucao_${dayjs(evolution?.session_date).format(
        'DD-MM-YYYY-HH-mm'
      )}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      toast.error('Ocorreu um erro ao baixar a evolução!');
    }
  };

  const handleDownloadAnamnesisReportPDF = async (anamnesis_id) => {
    try {
      const response = await api.get(`/anamnesis/reports/pdf/${anamnesis_id}`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `anamnese_${paciente.nome_paciente}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      toast.error('Ocorreu um erro ao baixar a evolução!');
    }
  };

  const handleDownloadClosureReportPDF = async (patient_closure_id) => {
    try {
      const response = await api.get(
        `/closure/reports/pdf/${patient_closure_id}`,
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Relatorio_de_Alta_${paciente.nome_paciente}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      toast.error('Ocorreu um erro ao baixar a evolução!');
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
    if (!nextAppointment) {
      fetchNextAppointment();
    }
  }, []);
  return (
    <Box sx={{ width: '100%' }} display="flex">
      <Grid container>
        {nextAppointment && (
          <Grid item xs={12} md={3}>
            <Box
              sx={{
                maxWidth: 420,
                maxHeight: 164,
                paddingRight: 6,
              }}
            >
              <Paper sx={{ mb: 2 }}>
                <List>
                  <ListItem sx={{ py: 0, minHeight: 32 }}>
                    <Typography variant="h6">Próxima Sessão</Typography>
                  </ListItem>
                  <ListItem sx={{ py: 0, minHeight: 32 }}>
                    <ListItemIcon>
                      <CalendarMonthIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={dayjs(nextAppointment.data_hora_inicio).format(
                        'DD/MM/YYYY [às] HH:mm'
                      )}
                      secondary="Horário"
                    />
                  </ListItem>
                  <ListItem sx={{ py: 0, minHeight: 32 }}>
                    <ListItemIcon>
                      <MeetingRoomIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={nextAppointment.nome_consultorio}
                      secondary="Consultório"
                    />
                  </ListItem>
                  <ListItem sx={{ py: 0, minHeight: 32 }}>
                    <ListItemIcon>
                      <EventRepeatIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={nextAppointment.recorrencia}
                      secondary="Recorrência"
                    />
                  </ListItem>
                </List>
              </Paper>
            </Box>
          </Grid>
        )}
        <Grid item xs={12} md={nextAppointment ? 9 : 12}>
          <Paper sx={{ width: '100%', mb: 2 }}>
            <Toolbar
              sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
              }}
            >
              <Typography
                sx={{ flex: '1 1 100%' }}
                variant="h6"
                component="div"
              >
                Formulários Especiais
              </Typography>
            </Toolbar>
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
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        {anamnesis ? (
                          <IconButton
                            aria-label="edit"
                            onClick={() => setIsOpenAnamnesisForm(true)}
                            disabled={anamnesis.usuario_id !== usuario_id}
                          >
                            <Tooltip
                              title="Editar Anamnese"
                              arrow
                              disableInteractive
                            >
                              <EditIcon />
                            </Tooltip>
                          </IconButton>
                        ) : (
                          <Tooltip
                            title="Adicionar Anamnese"
                            disableInteractive
                          >
                            <IconButton
                              onClick={() => setIsOpenAnamnesisForm(true)}
                              disabled={tipousuario !== 'psicologo_vinculado'}
                            >
                              <NoteAddIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        {anamnesis && (
                          <IconButton
                            aria-label="info"
                            onClick={() => {
                              setReadOnly(true);
                              setIsOpenAnamnesisForm(true);
                            }}
                          >
                            <Tooltip
                              title="Ver Anamnese"
                              arrow
                              disableInteractive
                            >
                              <VisibilityIcon color="primary" />
                            </Tooltip>
                          </IconButton>
                        )}
                        {anamnesis && tipousuario === 'clinica' && (
                          <IconButton
                            aria-label="history"
                            onClick={() => {
                              handleAnamnesisHistoryModal(
                                anamnesis.anamnesis_changelog
                              );
                            }}
                          >
                            <Tooltip
                              title="Ver Histórico de Anamnese"
                              arrow
                              disableInteractive
                            >
                              <HistoryIcon color="success" />
                            </Tooltip>
                          </IconButton>
                        )}
                        {anamnesis && (
                          <IconButton
                            aria-label="info"
                            onClick={() => {
                              handleDownloadAnamnesisReportPDF(
                                anamnesis.anamnesis_id
                              );
                            }}
                          >
                            <Tooltip
                              title="Baixar a Anamnese"
                              arrow
                              disableInteractive
                            >
                              <FileDownloadIcon color="primary" />
                            </Tooltip>
                          </IconButton>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>Anamnese</TableCell>
                    <TableCell>
                      {anamnesis
                        ? dayjs(anamnesis.created_at).format('DD/MM/YYYY')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {anamnesis ? anamnesis.nome_usuario : '-'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        {closure ? (
                          <IconButton
                            aria-label="edit"
                            onClick={() => setIsOpenClosureForm(true)}
                            disabled={anamnesis.usuario_id !== usuario_id}
                          >
                            <Tooltip
                              title="Editar Formulário de Alta"
                              arrow
                              disableInteractive
                            >
                              <EditIcon />
                            </Tooltip>
                          </IconButton>
                        ) : (
                          <Tooltip
                            title="Adicionar Formulário de Alta"
                            disableInteractive
                          >
                            <IconButton
                              onClick={() => setIsOpenClosureForm(true)}
                              disabled={tipousuario !== 'psicologo_vinculado'}
                            >
                              <TaskIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        {closure && (
                          <IconButton
                            aria-label="info"
                            onClick={() => {
                              setReadOnly(true);
                              setIsOpenClosureForm(true);
                            }}
                          >
                            <Tooltip
                              title="Ver Formulário de Alta"
                              arrow
                              disableInteractive
                            >
                              <VisibilityIcon color="primary" />
                            </Tooltip>
                          </IconButton>
                        )}
                        {closure && tipousuario === 'clinica' && (
                          <IconButton
                            aria-label="history"
                            onClick={() => {
                              handleClosureHistoryModal(
                                closure.patient_closure_changelog
                              );
                            }}
                          >
                            <Tooltip
                              title="Ver Histórico do Formulário de Alta"
                              arrow
                              disableInteractive
                            >
                              <HistoryIcon color="success" />
                            </Tooltip>
                          </IconButton>
                        )}
                        {closure && (
                          <IconButton
                            aria-label="info"
                            onClick={() => {
                              handleDownloadClosureReportPDF(
                                closure.patient_closure_id
                              );
                            }}
                          >
                            <Tooltip
                              title="Baixar o relatório de Alta"
                              arrow
                              disableInteractive
                            >
                              <FileDownloadIcon color="primary" />
                            </Tooltip>
                          </IconButton>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>Alta do Paciente</TableCell>
                    <TableCell>
                      {closure
                        ? dayjs(closure.created_at).format('DD/MM/YYYY')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {closure ? closure.nome_usuario : '-'}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        <Grid item xs={12}>
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
                <IconButton
                  onClick={() => setIsOpenAnamnesisForm(true)}
                  disabled={tipousuario !== 'psicologo_vinculado'}
                >
                  <NoteAddIcon fontSize="large" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Adicionar Formulário de Alta" disableInteractive>
                <IconButton
                  onClick={() => setIsOpenClosureForm(true)}
                  disabled={tipousuario !== 'psicologo_vinculado'}
                >
                  <TaskIcon fontSize="large" />
                </IconButton>
              </Tooltip>
            </Toolbar>
            <TableContainer>
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell>Ações</TableCell>
                    <TableCell
                      sortDirection={orderBy === 'session_date' ? order : false}
                    >
                      <TableSortLabel
                        active={orderBy === 'session_date'}
                        direction={orderBy === 'session_date' ? order : 'desc'}
                        onClick={handleRequestSort('session_date')}
                      >
                        Data da Sessão
                        {orderBy === 'session_date' ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === 'desc'
                              ? 'sorted descending'
                              : 'sorted ascending'}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'arrival_mood_state'}
                        direction={
                          orderBy === 'arrival_mood_state' ? order : 'desc'
                        }
                        onClick={handleRequestSort('arrival_mood_state')}
                      >
                        Humor do Paciente na Chegada
                        {orderBy === 'arrival_mood_state' ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === 'desc'
                              ? 'sorted descending'
                              : 'sorted ascending'}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>

                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'departure_mood_state'}
                        direction={
                          orderBy === 'departure_mood_state' ? order : 'desc'
                        }
                        onClick={handleRequestSort('departure_mood_state')}
                      >
                        Humor do Paciente na Saída
                        {orderBy === 'departure_mood_state' ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === 'desc'
                              ? 'sorted descending'
                              : 'sorted ascending'}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'evolution_status'}
                        direction={
                          orderBy === 'evolution_status' ? order : 'desc'
                        }
                        onClick={handleRequestSort('evolution_status')}
                      >
                        Evoluções Pendentes
                        {orderBy === 'evolution_status' ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === 'desc'
                              ? 'sorted descending'
                              : 'sorted ascending'}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'signatures'}
                        direction={orderBy === 'signatures' ? order : 'desc'}
                        onClick={handleRequestSort('signatures')}
                      >
                        Total de Assinaturas
                        {orderBy === 'signatures' ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === 'desc'
                              ? 'sorted descending'
                              : 'sorted ascending'}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleRows?.map((evolution) => (
                    <EvolutionDetailsRow
                      evolution={evolution}
                      key={evolution.evolution_id}
                      authorizationTotal={paciente?.authorization_total}
                      onEdit={() => {
                        setSelectedEvolution(evolution);
                        setIsOpenEvolutionForm(true);
                      }}
                      onInfo={() => {
                        setReadOnly(true);
                        setSelectedEvolution(evolution);
                        setIsOpenEvolutionForm(true);
                      }}
                      onHistory={() => {
                        handleEvolutionHistoryModal(
                          evolution.evolution_changelog
                        );
                      }}
                      onAttach={() => {
                        setSelectedRecord(evolution);
                        setIsOpenAttachmentDialog(true);
                      }}
                      onDownload={() => {
                        handleDownloadEvolutionReportPDF(evolution);
                      }}
                    />
                  ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 73 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[
                        5,
                        10,
                        25,
                        { label: 'Todas', value: -1 },
                      ]}
                      count={evolutions?.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
      <PatientEvolutionsForm
        open={isOpenEvolutionForm}
        setOpen={setIsOpenEvolutionForm}
        selectedEvolution={selectedEvolution}
        isRead={readOnly}
        setIsRead={setReadOnly}
        fetchEvolutions={fetchEvolutions}
        setSelectedEvolution={setSelectedEvolution}
        patientName={paciente?.nome_paciente}
      />
      <PatientAnamnesisForm
        open={isOpenAnamnesisForm}
        setOpen={setIsOpenAnamnesisForm}
        anamnesis={anamnesis}
        isRead={readOnly}
        setIsRead={setReadOnly}
        fetchAnamnesis={fetchReports}
      />
      <PatientClosureForm
        open={isOpenClosureForm}
        setOpen={setIsOpenClosureForm}
        closure={closure}
        isRead={readOnly}
        setIsRead={setReadOnly}
        fetchClosure={fetchReports}
        sessions={evolutions}
        expectationsAnamneseOptions={anamnesis}
      />
      <HistoryDialog
        open={isOpenHistory}
        setOpen={setIsOpenHistory}
        recordType={recordType}
        record={selectedRecord}
      />
      <AttachementDialog
        open={isOpenAttachmentDialog}
        setOpen={setIsOpenAttachmentDialog}
        selectedRecord={selectedRecord}
        setSelectedRecord={setSelectedRecord}
        fetchEvolutions={fetchEvolutions}
      />
    </Box>
  );
}
