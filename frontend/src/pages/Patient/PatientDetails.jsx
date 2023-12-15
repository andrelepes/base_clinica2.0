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

export default function PatientDetails() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('nome_paciente');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [evolutions, setEvolutions] = useState([]);
  const [selectedEvolution, setSelectedEvolution] = useState(null);
  const [isOpenPatientForm, setIsOpenPatientForm] = useState(false);
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
  }, []);
  return (
    <Box sx={{ width: '100%' }} display="flex">
      <PatientDetailCard
        handleChangeStatus={handleChangeStatus}
        paciente={paciente}
      />
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
            Evoluções
          </Typography>
          <Tooltip title="Adicionar Anamnese" disableInteractive>
            <IconButton onClick={() => console.log('anamnese')}>
              <NoteAddIcon fontSize="large" />
            </IconButton>
          </Tooltip>
        </Toolbar>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} size="medium">
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
    </Box>
  );
}
