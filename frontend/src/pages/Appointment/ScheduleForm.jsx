import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';

import { recurrenceOptions } from '../../utils/formTypes';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import api from '../../services/api';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const shouldDisableTime = (value, view) => {
  const hour = value.hour();
  if (view === 'hours') {
    return hour < 7 || hour > 21;
  }
  if (view === 'minutes') {
    const minute = value.minute();
    return minute > 0 && hour === 20;
  }
  return false;
};

export default function ScheduleForm({
  open,
  setIsOpen,
  selectedPatient,
  setSelectedPatient,
}) {
  const [offices, setOffices] = useState([]);
  const [date, setDate] = useState(null);
  const [hour, setHour] = useState(null);
  const [sessionTime, setSessionTime] = useState(60);
  const [recurrence, setRecurrence] = useState('');
  const [office, setOffice] = useState([]);
  const { clinicaId, usuarioId: usuario_id } = useAuth();

  const fetchOffices = async () => {
    try {
      const response = await api.get(`/consultorios/clinica/${clinicaId}`);
      setOffices(response.data);
    } catch (error) {
      toast.error('Ocorreu um erro ao buscar os consultórios');
    }
  };

  let isMounted = false;
  useEffect(() => {
    if (!isMounted && !offices.length && clinicaId) {
      isMounted = true;
      fetchOffices();
    }
  }, [open]);

  const handleClose = () => {
    setOffices([]);
    setDate(null);
    setHour(null);
    setSessionTime(60);
    setRecurrence('');
    setOffice([]);
    setSelectedPatient(null);
    setIsOpen(false);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    const fullDate = dayjs(
      `${dayjs(date).format('YYYY-MM-DD')}T${dayjs(hour).format('HH:mm')}`
    );

    const formData = {
      paciente_id: selectedPatient.paciente_id,
      usuario_id,
      data_hora_inicio: fullDate.format('YYYY-MM-DD HH:mm:ss.SSSSSS'),
      status: 'agendado',
      consultorio_id: office,
      data_hora_fim: fullDate
        .add(sessionTime, 'minute')
        .format('YYYY-MM-DD HH:mm:ss.SSSSSS'),
      tipo_sessao: sessionTime,
      recorrencia: recurrence,
    };

    try {
      await api.post('/agendamentos', formData);
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
        <Grid
          container
          spacing={2}
          marginTop={0.5}
          component="form"
          onSubmit={handleSubmit}
        >
          <Grid item md={4} xs={12}>
            <DateCalendar
              label="Dia"
              value={date}
              onChange={(newValue) => setDate(newValue)}
              views={['month', 'day']}
              format="LL"
              disablePast
              slotProps={{ calendarHeader: 'Dia' }}
            />
          </Grid>
          <Grid item md={3} xs={12} marginLeft={7} marginRight={2}>
            <DigitalClock
              ampm={false}
              value={hour}
              onChange={(newValue) => setHour(newValue)}
              timeStep={30}
              shouldDisableTime={shouldDisableTime}
              skipDisabled
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Duração (em Minutos)</InputLabel>
              <OutlinedInput
                id="session-time"
                value={sessionTime}
                onChange={(event) => setSessionTime(event.target.value)}
                label="Duração (em Minutos)"
                autoComplete="number"
              />
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
              >
                {recurrenceOptions.map((item) => {
                  return (
                    <MenuItem key={item.id} value={item.title}>
                      {item.title}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={6} xs={12}>
            <FormControl fullWidth>
              <InputLabel>Consultório</InputLabel>
              <Select
                label="Consultório"
                id="office"
                value={office}
                onChange={(event) => {
                  setOffice(event.target.value);
                }}
              >
                {offices.map((item) => {
                  return (
                    <MenuItem
                      key={item.consultorio_id}
                      value={item.consultorio_id}
                    >
                      {item.nome_consultorio}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <DialogActions>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button type="submit">Adicionar</Button>
            </DialogActions>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
