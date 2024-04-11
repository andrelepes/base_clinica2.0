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
  Agenda,
  ViewsDirective,
  ViewDirective,
} from '@syncfusion/ej2-react-schedule';
import dayjs from 'dayjs';
import RescheduleForm from './RescheduleForm';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import EventTemplate from '../../components/Appointments/EventTemplate';
import { cancelSchedule, cascadeSchedule } from '../../utils/apiFunctions';

export default function PatientAppointmentSchedule() {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [isOpenRescheduleForm, setIsOpenRescheduleForm] = useState(false);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    useState(false);
  const [isOpenCascadeConfirmation, setIsOpenCascadeConfirmation] =
    useState(false);

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('/agendamentos/pacientes/');

      const result = data.map((item) => {
        return item.map((subItem) => {
          return {
            Id: subItem.agendamento_id,
            nome_paciente: subItem.nome_paciente,
            nome_usuario: subItem.nome_usuario,
            nome_consultorio: subItem.nome_consultorio,
            StartTime: new Date(subItem.data_hora_inicio),
            EndTime: new Date(subItem.data_hora_fim),
            nome_usuario: subItem.nome_usuario,
            start: dayjs(subItem.data_hora_inicio).format('HH:mm'),
            end: dayjs(subItem.data_hora_fim).format('HH:mm'),
            onReschedule: () => {
              setSelectedAppointment(subItem);
              setIsOpenRescheduleForm(true);
            },
            onDelete: () => {
              setSelectedAppointment(subItem);
              setIsOpenDeleteConfirmation(true);
            },
            onCascade: () => {
              setSelectedAppointment(subItem);
              setIsOpenCascadeConfirmation(true);
            },
          };
        });
      });

      setAppointments(result);
    } catch (error) {
      toast.error('Ocorreu um erro ao buscar os agendamentos');
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
            Agenda por Pacientes
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
        <Box
          sx={{
            overflowX: 'auto',
            display: 'flex',
            width: '100%',
            p: 1,
            transform: 'scaleY(-1)',
          }}
        >
          <Box sx={{ display: 'flex', transform: 'scaleY(-1)' }}>
            {appointments.map((agendamento) => {
              return (
                <Box
                  key={agendamento[0].nome_paciente}
                  sx={{
                    minWidth: 450, // Define uma largura mínima para cada item
                    height: '100%',
                    m: 1, // Margem ao redor de cada item
                    backgroundColor: 'primary.main',
                    color: '#fff',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflowY: 'scroll',
                    maxHeight: 1260,
                    minHeight: 1260,
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
                      {agendamento[0]?.nome_paciente}
                    </Typography>
                  </Toolbar>
                  <ScheduleComponent
                    height={'100%'}
                    eventSettings={{
                      dataSource: agendamento,
                      template: EventTemplate,
                    }}
                    timeScale={{ enable: true, interval: 60, slotCount: 4 }}
                    popupOpen={onPopupOpen}
                    // showHeaderBar={false}
                    selectedDate={selectedDate}
                    agendaDaysCount={300}
                  >
                    <ViewsDirective>
                      <ViewDirective
                        option="Day"
                        startHour="07:00"
                        endHour="22:00"
                      />
                      <ViewDirective option="Agenda" />
                    </ViewsDirective>
                    <Inject services={[Day, Agenda]} />
                  </ScheduleComponent>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Paper>
      <RescheduleForm
        open={isOpenRescheduleForm}
        setOpen={() => setIsOpenRescheduleForm(false)}
        selectedAppointment={selectedAppointment}
        setSelectedAppointment={setSelectedAppointment}
        updateAppointments={fetchAppointments}
      />
      <ConfirmationDialog
        open={isOpenDeleteConfirmation}
        handleClose={() => setIsOpenDeleteConfirmation(false)}
        confirmAction={handleDelete}
        message={'Deseja realmente cancelar o agendamento?'}
        title={'Cancelar agendamento'}
      />
      <ConfirmationDialog
        open={isOpenCascadeConfirmation}
        handleClose={() => setIsOpenCascadeConfirmation(false)}
        confirmAction={handleCascade}
        message={
          'Deseja realmente excluir todos os próxmos agendamentos desse paciente?'
        }
        title={'Excluir todos Agendamentos'}
      />
    </Box>
  );
}
