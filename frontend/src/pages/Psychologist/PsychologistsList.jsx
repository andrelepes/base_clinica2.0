import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import CollapsibleRow from '../../components/CollapsibleRow';

export default function PsychologistsList() {
  const [psychologists, setPsychologists] = useState([]);
  const [psychologistsHistory, setPsychologistsHistory] = useState([]);

  const fetchPsychologists = async () => {
    try {
      const { data } = await api.get('/usuarios/psychologists/hours');
      const hours = data.data.map((usuario) => {
        const horasRestantes = Math.max(50 - usuario.total_horas_sessao, 0);
        return {
          ...usuario,
          horas_restantes: horasRestantes,
        };
      });
      setPsychologistsHistory(data.additional_data);
      setPsychologists(hours);
    } catch (error) {
      toast.error('Não foi possível retornar os psicólogos');
    }
  };

  let isMounted = false;
  useEffect(() => {
    if (!isMounted) {
      isMounted = true;
      return;
    }
    fetchPsychologists();
  });
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
            Relatório de Horas
          </Typography>
        </Toolbar>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Nome do Aluno</TableCell>
                <TableCell>Horas Confirmadas</TableCell>
                <TableCell>Horas Pendentes</TableCell>
                <TableCell>Evoluções Pendentes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {psychologists.map((psychologist) => (
                <CollapsibleRow
                  key={psychologist.name}
                  data={psychologist}
                  title={'Histórico'}
                  fields={[
                    {
                      title: 'Nome do Aluno',
                      dataTitle: 'nome_usuario',
                    },
                    {
                      title: 'Horas Confirmadas',
                      dataTitle: 'total_horas_sessao',
                    },
                    {
                      title: 'Horas Pendentes',
                      dataTitle: 'horas_restantes',
                    },
                    {
                      title: 'Evoluções Pendentes',
                      dataTitle: 'pending_evolutions_count',
                    },
                  ]}
                  subData={
                    psychologistsHistory[
                      psychologistsHistory.findIndex((subArray) =>
                        subArray.some(
                          (obj) => obj.usuario_id === psychologist.usuario_id
                        )
                      )
                    ]
                  }
                  subFields={[
                    {
                      title: 'Data da Sessão',
                      dataTitle: 'data_hora_inicio',
                    },
                    {
                      title: 'Nome do Paciente',
                      dataTitle: 'nome_paciente',
                    },
                    {
                      title: 'Status',
                      dataTitle: 'status',
                    },
                    {
                      title: 'Evolução Feita?',
                      dataTitle: 'evolution_status',
                    },
                  ]}
                />
              ))}
              {psychologists.length < 1 && 
                <TableRow>
                  <TableCell align='center' colSpan={6}>Não foram encontrados registros</TableCell>
                </TableRow>}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
