import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import api from '../../services/api';

import {
  ScheduleComponent,
  Inject,
  Day,
  ViewsDirective,
  ViewDirective,
} from '@syncfusion/ej2-react-schedule';
import dayjs from 'dayjs';

export default function OfficeAppointmentSchedule() {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('/agendamentos/consultorios/');

      const result = data.map((item) => {
        return item.map((subItem) => {
          return {
            Id: subItem.agendamento_id,
            Subject: `${subItem.nome_paciente} | ${subItem.nome_usuario} | ${subItem.nome_consultorio}`,
            StartTime: new Date(subItem.data_hora_inicio),
            EndTime: new Date(subItem.data_hora_fim),
            nome_consultorio: subItem.nome_consultorio,
          };
        });
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
  }, []);

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
            Agenda por Consultório
          </Typography>
          <Box sx={{ pt: 2 }}>
            <DatePicker
              label="Selecionar Dia"
              id="selected_date"
              name="selected_date"
              value={selectedDate}
              disablePast
              onChange={(newValue) => setSelectedDate(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Box>
        </Toolbar>
        <Box sx={{ overflowX: 'auto', display: 'flex', width: '100%', p: 1 }}>
          <Box sx={{ display: 'flex' }}>
            {appointments.map((agendamento) => {
              return (
                <Box
                  key={agendamento[0].nome_consultorio}
                  sx={{
                    minWidth: 200, // Define uma largura mínima para cada item
                    height: '100%',
                    m: 1, // Margem ao redor de cada item
                    backgroundColor: 'primary.main',
                    color: '#fff',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Toolbar
                    sx={{
                      pl: { sm: 2 },
                      pr: { xs: 1, sm: 1 },
                    }}
                  >
                    <Typography
                      sx={{ flex: '1 1 100%' }}
                      variant="h6"
                      id="tableTitle"
                      component="div"
                    >
                      {agendamento[0]?.nome_consultorio}
                    </Typography>
                  </Toolbar>
                  <ScheduleComponent
                    eventSettings={{ dataSource: agendamento }}
                    timeScale={{ enable: true, interval: 30, slotCount: 1 }}
                    popupOpen={onPopupOpen}
                    showHeaderBar={false}
                    selectedDate={selectedDate}
                  >
                    <ViewsDirective>
                      <ViewDirective
                        option="Day"
                        startHour="07:00"
                        endHour="22:00"
                      />
                    </ViewsDirective>
                    <Inject services={[Day]} />
                  </ScheduleComponent>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
