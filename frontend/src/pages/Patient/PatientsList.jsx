import PatientRow from '../../components/Patients/PatientRow';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import PatientForm from './PatientForm';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableFooter from '@mui/material/TableFooter';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TablePagination from '@mui/material/TablePagination';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { visuallyHidden } from '@mui/utils';

import api from '../../services/api';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getComparator, stableSort } from '../../utils/sortFunctions';
import ScheduleForm from '../Appointment/ScheduleForm';
import PatientDetailsDialog from './PatientDetailsDialog';
import PaymentInfo from '../Payment/PaymentInfo';

export default function PatientsList() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('nome_paciente');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [isOpenPatientDetailDialog, setIsOpenPatientDetailDialog] =
    useState(false);
  const [isOpenPatientForm, setIsOpenPatientForm] = useState(false);
  const [isOpenScheduleForm, setIsOpenScheduleForm] = useState(false);
  const [isOpenConfirmation, setIsOpenConfirmation] = useState(false);

  const [isOpenPaymentInfo, setIsOpenPaymentInfo] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const { usuarioId: usuario_id, tipousuario } = useAuth();

  const navigate = useNavigate();

  const fetchPatients = useCallback(async () => {
    try {
      await api.get('/evolutions/generate');
      const response = await api.get(`/pacientes/pendentes`);
      setPatients(response.data.data);
      setSelectedPatient(null);
    } catch (error) {
      toast.error('Erro ao buscar todos os pacientes');
    }
  }, []);

  const visibleRows = useMemo(
    () =>
      stableSort(patients, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [patients, page, rowsPerPage, order, orderBy]
  );

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - patients?.length) : 0;

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

  let isMounted = false;
  useEffect(() => {
    if (!isMounted) {
      isMounted = true;
      return;
    }
    if (!patients.length) {
      fetchPatients();
    }
  }, []);

  const handleEdit = (patient) => {
    setSelectedPatient(patient);
    setIsOpenPatientForm(true);
  };
  const handleSchedule = (patient) => {
    setSelectedPatient(patient);
    setIsOpenScheduleForm(true);
  };
  const handleConfirmStatusChange = (patient) => {
    setSelectedPatient(patient);
    setIsOpenConfirmation(true);
  };
  const handleInfo = (patient) => {
    setSelectedPatient(patient);
    setIsOpenPatientDetailDialog(true);
  };
  const handlePaymentAdd = async (patient) => {
    try {
      const response = await api.get(
        `/payment/paywithpix/${patient.paciente_id}`
      );
      setSelectedPatient(patient);
      setSelectedPayment(response.data);
      setIsOpenPaymentInfo(true);
      toast.success('Pagamento adicionado!');
    } catch (error) {
      toast.error('Ocorreu um erro ao adicionar pagamento');
    }
  };
  const handleFolder = (patient) => {
    if (tipousuario !== 'secretario_vinculado') {
      navigate(`/pacientes/${patient.paciente_id}`);
    }
  };

  const handleChangeStatus = async () => {
    try {
      setIsOpenConfirmation(false);
      const updateData = {
        usuario_id,
      };

      if (selectedPatient?.status_paciente === 'ativo') {
        await api.put(
          `/pacientes/${selectedPatient.paciente_id}/inativo`,
          updateData
        );
        fetchPatients();
        toast.success(`${selectedPatient.nome_paciente} foi inativado com sucesso`);
      } else if (selectedPatient?.status_paciente === 'inativo') {
        await api.put(
          `/pacientes/${selectedPatient.paciente_id}/ativo`,
          updateData
        ); // Use paciente_id aqui
        fetchPatients();
        toast.success(`${selectedPatient.nome_paciente} foi ativado com sucesso`);
      }
    } catch (error) {
      toast.error('Ocorreu um erro ao trocar o status do paciente');
    }
  };

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
            variant="h"
            id="tableTitle"
            component="div"
          >
            Pacientes
          </Typography>

          <Tooltip title="Agendar Horário" disableInteractive>
            <IconButton onClick={() => setIsOpenScheduleForm(true)}>
              <CalendarMonthIcon color="success" fontSize="large" />
            </IconButton>
          </Tooltip>
          {tipousuario !== 'psicologo_vinculado' && (
            <Tooltip title="Adicionar Paciente" disableInteractive>
              <IconButton onClick={() => setIsOpenPatientForm(true)}>
                <PersonAddIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} size="medium">
            <TableHead>
              <TableRow>
                <TableCell padding="normal">Ações</TableCell>
                <TableCell
                  sortDirection={orderBy === 'nome_paciente' ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === 'nome_paciente'}
                    direction={orderBy === 'nome_paciente' ? order : 'asc'}
                    onClick={handleRequestSort('nome_paciente')}
                  >
                    Nome do Paciente
                    {orderBy === 'nome_paciente' ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === 'desc'
                          ? 'sorted descending'
                          : 'sorted ascending'}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sortDirection={orderBy === 'status_paciente' ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === 'status_paciente'}
                    direction={orderBy === 'status_paciente' ? order : 'asc'}
                    onClick={handleRequestSort('status_paciente')}
                  >
                    Status do Paciente
                    {orderBy === 'status_paciente' ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === 'desc'
                          ? 'sorted descending'
                          : 'sorted ascending'}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>

                <TableCell padding={'normal'}>
                  Psicólogos Responsáveis
                </TableCell>
                <TableCell padding={'normal'}>Evoluções Pendentes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.map((patient) => (
                <PatientRow
                  patient={patient}
                  key={patient.paciente_id}
                  onChangeStatus={() => handleConfirmStatusChange(patient)}
                  onEdit={() => handleEdit(patient)}
                  onInfo={() => handleInfo(patient)}
                  onSchedule={() => handleSchedule(patient)}
                  onFolder={() => handleFolder(patient)}
                  onPaymentAdd={() => handlePaymentAdd(patient)}
                  assignedPsychologists={
                    patient.psicologos_autorizados?.length > 0
                      ? patient.psicologos_autorizados
                          .map((psychologist) => {
                            return psychologist.nome_psicologo;
                          })
                          .join(', ')
                      : undefined
                  }
                />
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 73 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
              {visibleRows.length < 1 &&
              <TableRow>
                  <TableCell colSpan={6} align='center'>Não foram encontrados registros</TableCell>
                </TableRow>}
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
                  count={patients?.length}
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
      <PatientForm
        open={isOpenPatientForm}
        setOpen={setIsOpenPatientForm}
        selectedPatient={selectedPatient ?? {}}
        setSelectedPatient={setSelectedPatient}
        fetchPatients={fetchPatients}
      />
      <ScheduleForm
        open={isOpenScheduleForm}
        setOpen={setIsOpenScheduleForm}
        // selectedPatient={selectedPatient ?? {}}
        // setSelectedPatient={setSelectedPatient}
      />
      <ConfirmationDialog
        open={isOpenConfirmation}
        handleClose={() => {
          setIsOpenConfirmation(false);
          setSelectedPatient(null);
        }}
        title={`${
          selectedPatient?.status_paciente === 'ativo' ? 'Inativar' : 'Ativar'
        } ${selectedPatient?.nome_paciente}`}
        message={`Tem certeza que deseja ${
          selectedPatient?.status_paciente === 'ativo' ? 'inativar' : 'ativar'
        } o paciente?`}
        confirmAction={handleChangeStatus}
      />
      <PatientDetailsDialog
        open={isOpenPatientDetailDialog}
        setOpen={setIsOpenPatientDetailDialog}
        selectedPatient={selectedPatient}
        setSelectedPatient={setSelectedPatient}
        changeStatusFunction={handleChangeStatus}
      />
      <PaymentInfo
        open={isOpenPaymentInfo}
        setOpen={setIsOpenPaymentInfo}
        selectedPayment={selectedPayment}
        setSelectedPayment={setSelectedPayment}
        patient={selectedPatient}
      />
    </Box>
  );
}
