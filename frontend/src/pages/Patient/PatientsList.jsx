import PatientRow from '../../components/Patients/PatientRow';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import PatientForm from './PatientForm';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TablePagination from '@mui/material/TablePagination';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import api from '../../services/api';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function PatientsList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isOpenPatientForm, setIsOpenPatientForm] = useState(false);
  const [isOpenConfirmation, setIsOpenConfirmation] = useState(false);

  const { usuarioId: usuario_id } = useAuth();

  const navigate = useNavigate();

  const fetchPatients = useCallback(async () => {
    try {
      const response = await api.get(`/pacientes/filtrar`);
      setPatients(response.data.data);
      setSelectedPatient(null);
    } catch (error) {
      toast.error('Erro ao buscar todos os pacientes');
    }
  }, []);

  const visibleRows = useMemo(
    () => patients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [patients, page, rowsPerPage]
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
  const handleConfirmDelete = (patient) => {
    setSelectedPatient(patient);
    setIsOpenConfirmation(true);
  };
  const handleDelete = async () => {
    try {
      setIsOpenConfirmation(false);
      await api.put(`/pacientes/${selectedPatient.paciente_id}/inativo`, {
        usuario_id,
      });
      toast.success(
        `${selectedPatient.nome_paciente} foi inativado com sucesso`
      );
      setSelectedPatient(null);
      fetchPatients();
    } catch (error) {
      toast.error('Ocorreu um erro ao inativar o paciente');
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

          <Tooltip title="Adicionar Paciente" disableInteractive>
            <IconButton onClick={() => setIsOpenPatientForm(true)}>
              <PersonAddIcon fontSize="large" />
            </IconButton>
          </Tooltip>
        </Toolbar>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} size="medium">
            <TableHead>
              <TableRow>
                <TableCell padding="normal">Ações</TableCell>

                <TableCell padding={'normal'}>Nome do Paciente</TableCell>
                <TableCell padding={'normal'}>Status do Paciente</TableCell>
                <TableCell padding={'normal'}>
                  Psicólogos Responsáveis
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.map((patient) => (
                <PatientRow
                  patient={patient}
                  key={patient.paciente_id}
                  onDelete={() => handleConfirmDelete(patient)}
                  onEdit={() => handleEdit(patient)}
                  onInfo={() => navigate(`/pacientes/${patient.paciente_id}`)}
                  //   assignedPsychologists={
                  //     psicologosVinculados[patient.paciente_id]?.length > 0
                  //       ? psicologosVinculados[patient.paciente_id].join(', ')
                  //       : undefined
                  //   }
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
      <ConfirmationDialog
        open={isOpenConfirmation}
        handleClose={() => {
          setIsOpenConfirmation(false);
          setSelectedPatient(null);
        }}
        title={`Inativar ${selectedPatient?.nome_paciente}`}
        message="Tem certeza que deseja inativar o paciente?"
        confirmAction={handleDelete}
      />
    </Box>
  );
}
