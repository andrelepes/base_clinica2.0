import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TableWithActions from '../../components/TableWithActions';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';

export default function PsychologistsList() {
  const [psychologists, setPsychologists] = useState([]);

  const fetchPsychologists = async () => {
    try {
      const { data } = await api.get('/usuarios/psychologists/hours');
      console.log(data);
      const hours = data.map((usuario) => {
        const horasRestantes = Math.max(240 - usuario.total_horas_sessao, 0);
        return {
          ...usuario,
          horas_restantes: horasRestantes,
        };
      });
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
    <Box>
      <Paper>
        <TableWithActions
          title="Horas Realizadas"
          data={psychologists}
          fields={[
            {
              title: 'Nome do Psicólogo',
              dataTitle: 'nome_usuario',
              maxWidth: 100,
              overflow: 'hidden',
              filterable: true,
            },
            {
              title: 'Horas Realizadas',
              dataTitle: 'total_horas_sessao',
              maxWidth: 80,
              overflow: 'hidden',
            },
            {
              title: 'Horas Restantes',
              dataTitle: 'horas_restantes',
              maxWidth: 80,
              overflow: 'hidden',
            },
          ]}
        />
      </Paper>
    </Box>
  );
}
