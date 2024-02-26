import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {
  Agenda,
  Day,
  Inject,
  Month,
  ScheduleComponent,
  ViewDirective,
  ViewsDirective,
  WorkWeek,
} from '@syncfusion/ej2-react-schedule';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('/agendamentos/meus/');

      const result = data.map((item) => {
        return {
          Id: item.agendamento_id,
          Subject: `${item.nome_paciente} | ${item.nome_usuario} | ${item.nome_consultorio}`,
          StartTime: new Date(item.data_hora_inicio),
          EndTime: new Date(item.data_hora_fim),
          nome_consultorio: item.nome_consultorio,
        };
      });

      setAppointments(result);
    } catch (error) {
      toast.error('Erro ao buscar agendamentos');
    }
  };

  const onPopupOpen = (args) => {
    args.cancel = true;
  };

  let isMounted = false;
  useEffect(() => {
    if (!isMounted) {
      isMounted = true;
      return;
    }
    fetchAppointments();
  });
  return (
    <Box>
      <Paper sx={{ width: '100%', mb: 2, height: '97.5%' }}>
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
          }}
        >
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h5"
            id="tableTitle"
            component="div"
          >
            Meus Agendamentos
          </Typography>
        </Toolbar>
        <ScheduleComponent
          agendaDaysCount={30}
          eventSettings={{ dataSource: appointments }}
          popupOpen={onPopupOpen}
        >
          <ViewsDirective>
            <ViewDirective option="Day" startHour="07:00" endHour="22:00" />
            <ViewDirective
              option="WorkWeek"
              startHour="07:00"
              endHour="22:00"
            />
            <ViewDirective option="Month" />
            <ViewDirective option="Agenda" />
          </ViewsDirective>
          <Inject services={[Day, WorkWeek, Month, Agenda]} />
        </ScheduleComponent>
      </Paper>
    </Box>
  );
}
