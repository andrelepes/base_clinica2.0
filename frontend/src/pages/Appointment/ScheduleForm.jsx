import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';

import { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';

import { recurrenceOptions } from '../../utils/formTypes';
import dayjs from 'dayjs';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const minTime = dayjs().hour(6).minute(50);
const maxTime = dayjs().hour(21);

const disableWeekends = (value) => {
  const dayOfWeek = value.day();
  return dayOfWeek === 0 || dayOfWeek === 6;
};

export default function ScheduleForm({ open, setOpen }) {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [psychologists, setPsychologists] = useState([]);
  const [activeStep, setActiveStep] = useState(0);

  const [patient, setPatient] = useState('');
  const [psychologist, setPsychologist] = useState('');
  const [date, setDate] = useState(null);
  const [hour, setHour] = useState(null);
  const [sessionTime, setSessionTime] = useState(60);
  const [recurrence, setRecurrence] = useState('');
  const [office, setOffice] = useState('');
  const [offices, setOffices] = useState([]);
  const [availableOffices, setAvailableOffices] = useState([]);

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('/agendamentos/next/');

      setAppointments(data);
    } catch (error) {
      toast.error('Erro ao calcular horários');
    }
  };
  const fetchPatients = async () => {
    try {
      const { data } = await api.get('/pacientes/clinica/');

      setPatients(data);
    } catch (error) {
      toast.error('Erro ao calcular horários');
    }
  };
  const fetchPsychologists = async () => {
    try {
      const { data } = await api.get('/usuarios/psychologists/from/clinic/');

      setPsychologists(data);
    } catch (error) {
      toast.error('Erro ao calcular horários');
    }
  };
  const fetchOffices = async () => {
    try {
      const response = await api.get(`/consultorios/clinica/`);
      setOffices(response.data);
    } catch (error) {
      toast.error('Ocorreu um erro ao buscar os consultórios');
    }
  };

  const isBusy = (value) => {
    if (!date || !psychologist || !patient) {
      return false;
    }
    const baseDate = dayjs(
      `${date.format('YYYY-MM-DD')}T${value.format('HH:mm')}`
    );
    const sessionEnd = baseDate.add(sessionTime, 'minutes').toISOString();
    const sessionStart = baseDate.toISOString();

    const isPsychologistOrPatientBusy = appointments.some((item) => {
      const guest = item.paciente_id;
      const start = item.data_hora_inicio;
      const end = item.data_hora_fim;
      const host = item.usuario_id;

      return (
        (guest === patient.paciente_id || host === psychologist.usuario_id) &&
        !(sessionEnd <= start || sessionStart >= end)
      );
    });

    if (isPsychologistOrPatientBusy) {
      return true;
    }

    const isAnOfficeAvailable = offices.some((office) => {
      const officeAppointments = appointments.filter(
        (appointment) => appointment.consultorio_id === office.consultorio_id
      );
      return officeAppointments.every((appointment) => {
        const start = appointment.data_hora_inicio;
        const end = appointment.data_hora_fim;
        return sessionStart >= end || sessionEnd <= start;
      });
    });
    return !isAnOfficeAvailable;
  };

  const findAvailableOffices = () => {
    const recurrenceIntervals = recurrence.intervals;

    const sessionDates = recurrenceIntervals.map((days) => {
      const sessionStart = dayjs(
        `${date.format('YYYY-MM-DD')}T${hour.format('HH:mm')}`
      ).add(days, 'days');
      const sessionEnd = sessionStart.add(sessionTime, 'minutes');
      return {
        sessionStart: sessionStart.toISOString(),
        sessionEnd: sessionEnd.toISOString(),
      };
    });
    const filteredOffices = offices.filter((office) => {
      const officeAppointments = appointments.filter(
        (appointment) => appointment.consultorio_id === office.consultorio_id
      );
      return sessionDates.every(({ sessionStart, sessionEnd }) => {
        return officeAppointments.every((appointment) => {
          const start = appointment.data_hora_inicio;
          const end = appointment.data_hora_fim;
          return !(sessionStart < end && sessionEnd > start);
        });
      });
    });

    setOffice('');
    setAvailableOffices(filteredOffices);
  };

  let isMounted = false;
  useEffect(() => {
    if (!isMounted) {
      isMounted = true;
      return;
    }
    if (psychologists.length || patients.length) {
      return;
    }
    fetchAppointments();
    fetchPatients();
    fetchPsychologists();
    fetchOffices();
  }, [open]);

  useEffect(() => {
    if (activeStep === 2) {
      findAvailableOffices();
    }
  }, [activeStep]);

  const handleBack = () =>
    setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const handleNext = () =>
    setActiveStep((prevActiveStep) => prevActiveStep + 1);

  const handleClose = () => {
    setAppointments([]);
    setPatients([]);
    setPsychologists([]);
    setActiveStep(0);
    setPatient('');
    setPsychologist('');
    setDate(null);
    setHour(null);
    setSessionTime(60);
    setRecurrence('');
    setOffice('');
    setOffices([]);
    setAvailableOffices([]);

    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const fullDate = dayjs(
      `${dayjs(date).format('YYYY-MM-DD')}T${dayjs(hour).format('HH:mm')}`
    );

    const formData = {
      paciente_id: patient.paciente_id,
      usuario_id: psychologist.usuario_id,
      data_hora_inicio: fullDate.format('YYYY-MM-DDTHH:mm:ss'),
      status: 'agendado',
      consultorio_id: office.consultorio_id,
      data_hora_fim: fullDate
        .add(sessionTime, 'minute')
        .format('YYYY-MM-DDTHH:mm:ss'),
      tipo_sessao: sessionTime,
      recorrencia: recurrence.title,
      weekInterval: recurrence.intervals[0],
    };

    try {
      if (!formData.weekInterval) {
        await api.post('/agendamentos', formData);
      } else {
        await api.post('/agendamentos/recurrence', formData);
      }
      toast.success('Agendamento realizado com sucesso!');
      handleClose();
    } catch (error) {
      toast.error('Ocorreu um erro ao agendar a consulta');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      keepMounted
      fullWidth
      maxWidth={'md'}
    >
      <DialogTitle>Agendar Horário</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep}>
          <Step>
            <StepLabel>Informações Básicas</StepLabel>
          </Step>
          <Step>
            <StepLabel>Horários</StepLabel>
          </Step>
          <Step>
            <StepLabel error={!(availableOffices.length > 0)}>
              Seleção de Consultório
            </StepLabel>
          </Step>
          <Step>
            <StepLabel>Revisão e Confirmação</StepLabel>
          </Step>
        </Stepper>
        {activeStep === 0 && (
          <Grid
            container
            spacing={2}
            marginTop={2}
            marginBottom={2}
            direction={'column'}
          >
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Psicólogo</InputLabel>
                <Select
                  label="Psicólogo"
                  id="psychologist"
                  value={psychologist}
                  onChange={(event) => setPsychologist(event.target.value)}
                  MenuProps={MenuProps}
                >
                  {psychologists.map((item) => {
                    return (
                      <MenuItem key={item.usuario_id} value={item}>
                        {item.nome_usuario}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Paciente</InputLabel>
                <Select
                  label="Paciente"
                  id="patient"
                  value={patient}
                  onChange={(event) => setPatient(event.target.value)}
                  MenuProps={MenuProps}
                >
                  {patients.map((item) => {
                    return (
                      <MenuItem key={item.paciente_id} value={item}>
                        {item.nome_paciente}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Recorrência</InputLabel>
                <Select
                  label="Recorrência"
                  id="recurrence"
                  value={recurrence}
                  onChange={(event) => setRecurrence(event.target.value)}
                  MenuProps={MenuProps}
                >
                  {recurrenceOptions.map((item) => {
                    return (
                      <MenuItem key={item.id} value={item}>
                        {item.title}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        )}
        {activeStep === 1 && (
          <Grid container spacing={2} marginTop={0.5}>
            <Grid item md={4} xs={12}>
              <DateCalendar
                label="Dia"
                value={date}
                onChange={(newValue) => setDate(newValue)}
                views={['month', 'day']}
                format="LL"
                disablePast
                shouldDisableDate={disableWeekends}
              />
            </Grid>
            <Grid
              item
              md={4}
              xs={12}
              marginLeft={7}
              marginRight={2}
              marginTop={2.5}
            >
              <FormControl variant="outlined" fullWidth>
                <InputLabel>Duração (em Minutos)</InputLabel>
                <OutlinedInput
                  id="session-time"
                  value={sessionTime}
                  onChange={(event) => setSessionTime(event.target.value)}
                  label="Duração (em Minutos)"
                  autoComplete="number"
                  inputProps={{ max: 99, minLength: 2, maxLength: 2 }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} marginTop={2.5}>
              <DigitalClock
                ampm={false}
                value={hour}
                onChange={(newValue) => setHour(newValue)}
                timeStep={30}
                shouldDisableTime={isBusy}
                skipDisabled
                minTime={minTime}
                maxTime={maxTime}
                disabled={!date || !psychologist || !patient}
              />
            </Grid>
          </Grid>
        )}
        {activeStep === 2 && (
          <Grid
            container
            spacing={2}
            marginTop={2}
            marginBottom={2}
            direction={'column'}
          >
            {availableOffices.length > 0 ? (
              <Grid item md={6} xs={12} marginBottom={5}>
                <FormControl fullWidth>
                  <InputLabel>Consultório</InputLabel>
                  <Select
                    label="Consultório"
                    id="office"
                    value={office}
                    onChange={(event) => setOffice(event.target.value)}
                    MenuProps={MenuProps}
                  >
                    {availableOffices.map((item) => {
                      return (
                        <MenuItem key={item.consultorio_id} value={item}>
                          {item.nome_consultorio}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
            ) : (
              <Grid
                item
                md={6}
                xs={12}
                marginLeft={1.5}
                marginTop={2}
                marginBottom={5}
              >
                <Typography variant="h5">
                  Não foram encontrados consultórios vagos para essas
                  configurações. Selecione outro horário.
                </Typography>
              </Grid>
            )}
          </Grid>
        )}
        {activeStep === 3 && (
          <Grid
            container
            spacing={2}
            marginLeft={0}
            marginTop={2}
            direction={'row'}
            sx={{ width: '100%' }}
          >
            <Grid item xs={12} sm={6}>
              <TextField
                label="Psicólogo"
                value={psychologist.nome_usuario}
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                variant="standard"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Paciente"
                value={patient.nome_paciente}
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                variant="standard"
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                label="Recorrência"
                value={recurrence.title}
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                variant="standard"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Horário"
                value={`${dayjs(
                  `${date.format('YYYY-MM-DD')}T${hour.format('HH:mm')}`
                ).format('[Dia] DD/MM/YY [às] hh:mm')}`}
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                variant="standard"
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                label="Duração"
                value={`${sessionTime} minutos`}
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                variant="standard"
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                label="Consultório"
                value={office.nome_consultorio}
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                variant="standard"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography mb={6}>
                Caso todas as informações estejam corretas, clique no botão para
                Agendar.
              </Typography>
            </Grid>
          </Grid>
        )}
        <DialogActions>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Voltar
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          {activeStep === 3 ? (
            <Button onClick={handleSubmit}>Agendar</Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={
                (activeStep === 1 &&
                  (!date ||
                    !hour ||
                    !psychologist ||
                    !patient ||
                    !recurrence)) ||
                (activeStep === 2 &&
                  (!(availableOffices.length > 0) || !office))
              }
            >
              Próximo
            </Button>
          )}
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
