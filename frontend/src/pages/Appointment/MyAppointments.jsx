import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {
  Agenda,
  Day,
  Inject,
  MonthAgenda,
  ScheduleComponent,
  ViewDirective,
  ViewsDirective,
  WorkWeek,
} from '@syncfusion/ej2-react-schedule';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import dayjs from 'dayjs';
import EventTemplate from '../../components/Appointments/EventTemplate';
import RescheduleForm from './RescheduleForm';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import { cancelSchedule, cascadeSchedule } from '../../utils/apiFunctions';

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isOpenRescheduleForm, setIsOpenRescheduleForm] = useState(false);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    useState(false);
  const [isOpenCascadeConfirmation, setIsOpenCascadeConfirmation] =
    useState(false);

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('/agendamentos/meus/');

      const result = data.map((item) => {
        return {
          Id: item.agendamento_id,
          nome_paciente: item.nome_paciente,
          nome_usuario: item.nome_usuario,
          nome_consultorio: item.nome_consultorio,
          StartTime: new Date(item.data_hora_inicio),
          EndTime: new Date(item.data_hora_fim),
          start: dayjs(item.data_hora_inicio).format('HH:mm'),
          end: dayjs(item.data_hora_fim).format('HH:mm'),
          onReschedule: () => {
            setSelectedAppointment(item);
            setIsOpenRescheduleForm(true);
          },
          onDelete: () => {
            setSelectedAppointment(item);
            setIsOpenDeleteConfirmation(true);
          },
          onCascade: () => {
            setSelectedAppointment(item);
            setIsOpenCascadeConfirmation(true);
          },
        };
      });

      setAppointments(result);
    } catch (error) {
      toast.error('Erro ao buscar agendamentos');
    }
  };

  const handleDelete = () => {
    cancelSchedule({
      agendamento_id: selectedAppointment.agendamento_id,
      closeFunction: () => {
        setSelectedAppointment(null);
        setIsOpenDeleteConfirmation(false);
        fetchAppointments();
      },
    });
  };
  const handleCascade = () => {
    cascadeSchedule({
      paciente_id: selectedAppointment.paciente_id,
      closeFunction: () => {
        setSelectedAppointment(null);
        setIsOpenCascadeConfirmation(false);
        fetchAppointments();
      },
    });
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
          eventSettings={{ dataSource: appointments, template: EventTemplate }}
          popupOpen={onPopupOpen}
          timeScale={{ enable: true, interval: 60, slotCount: 4 }}
        >
          <ViewsDirective>
            <ViewDirective option="Day" startHour="07:00" endHour="22:00" />
            <ViewDirective
              option="WorkWeek"
              startHour="07:00"
              endHour="22:00"
            />
            <ViewDirective option="MonthAgenda" />
            <ViewDirective option="Agenda" />
          </ViewsDirective>
          <Inject services={[Day, WorkWeek, MonthAgenda, Agenda]} />
        </ScheduleComponent>
      </Paper>
      <RescheduleForm
        open={isOpenRescheduleForm}
        setOpen={()=>setIsOpenRescheduleForm(false)}
        selectedAppointment={selectedAppointment}
        setSelectedAppointment={setSelectedAppointment}
        updateAppointments={fetchAppointments}
      />
      <ConfirmationDialog
        open={isOpenDeleteConfirmation}
        handleClose={()=>setIsOpenDeleteConfirmation(false)}
        confirmAction={handleDelete}
        message={'Deseja realmente cancelar o agendamento?'}
        title={'Cancelar agendamento'}
      />
      <ConfirmationDialog
        open={isOpenCascadeConfirmation}
        handleClose={()=>setIsOpenCascadeConfirmation(false)}
        confirmAction={handleCascade}
        message={
          'Deseja realmente excluir todos os próxmos agendamentos desse paciente?'
        }
        title={'Excluir todos Agendamentos'}
      />
    </Box>
  );
}
