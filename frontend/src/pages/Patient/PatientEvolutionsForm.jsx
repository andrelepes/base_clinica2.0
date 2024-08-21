import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';

import {
  attendedOptions,
  punctualityOptions,
  moodStates,
} from '../../utils/formTypes';
import { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

export default function PatientEvolutionsForm({
  open,
  setOpen,
  isRead,
  setIsRead,
  fetchEvolutions,
  selectedEvolution,
  setSelectedEvolution,
  patientName,
}) {
  const [attended, setAttended] = useState('');
  const [punctuality, setPunctuality] = useState('');
  const [arrivalMood, setArrivalMood] = useState(-1);
  const [discussedSubject, setDiscussedSubject] = useState('');
  const [interventionAnalysis, setInterventionAnalysis] = useState('');
  const [nextSession, setNextSession] = useState('');
  const [departureMood, setDepartureMood] = useState(-1);
  const [notesComments, setNotesComments] = useState('');

  const [arrivalMoodHover, setArrivalMoodHover] = useState(-1);
  const [departureMoodHover, setDepartureMoodHover] = useState(-1);
  const { usuarioId: usuario_id, user } = useAuth();

  const { id: paciente_id } = useParams();

  useEffect(() => {
    if (!!selectedEvolution?.attendance_status && !attended) {
      setAttended(selectedEvolution.attendance_status ?? '');
      setPunctuality(selectedEvolution.punctuality_status ?? '');
      setArrivalMood(
        moodStates.find(
          (mood) => mood.id === selectedEvolution.arrival_mood_state
        )?.value ?? -1
      );
      setDiscussedSubject(selectedEvolution.discussion_topic ?? '');
      setInterventionAnalysis(selectedEvolution.analysis_intervention ?? '');
      setNextSession(selectedEvolution.next_session_plan ?? '');
      setDepartureMood(
        moodStates.find(
          (mood) => mood.id === selectedEvolution.departure_mood_state
        )?.value ?? -1
      );
      setNotesComments(selectedEvolution.therapist_notes ?? '');
    }
  }, [selectedEvolution]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const evolutionData = {
      usuario_id,
      paciente_id,
      attendance_status: attended,
      punctuality_status: punctuality,
      arrival_mood_state: moodStates.find((mood) => mood.value === arrivalMood)
        ?.id,
      discussion_topic: discussedSubject,
      analysis_intervention: interventionAnalysis,
      next_session_plan: nextSession,
      departure_mood_state: moodStates.find(
        (mood) => mood.value === departureMood
      )?.id,
      therapist_notes: notesComments,
      evolution_status: true,
    };
    try {
      if (selectedEvolution?.evolution_id) {
        await api.put(
          `/evolutions/${selectedEvolution.evolution_id}`,
          evolutionData
        );
        toast.success('A evolução foi enviada com sucesso');
        fetchEvolutions();
        handleClose();
      } else {
        await api.post('/evolutions', evolutionData);
        toast.success('A evolução foi enviada com sucesso');
        fetchEvolutions();
        handleClose();
      }
    } catch (error) {
      toast.error(error.response.data.message ?? 'Erro no envio da evolução');
    }
  };

  const handleSign = async () => {
    try {
      await api.put('/evolutions/sign', {
        usuario_id,
        evolution_id: selectedEvolution.evolution_id,
      });
      toast.success('Assinatura realizada com sucesso');
      fetchEvolutions();
      handleClose();
    } catch (error) {
      toast.error(error.response.data.message ?? 'Erro ao assinar a evolução');
    }
  };

  const handleClose = () => {
    setAttended('');
    setPunctuality('');
    setArrivalMood(-1);
    setArrivalMoodHover(-1);
    setDiscussedSubject('');
    setInterventionAnalysis('');
    setNextSession('');
    setDepartureMood(-1);
    setDepartureMoodHover(-1);
    setNotesComments('');
    setSelectedEvolution(null);
    setOpen(false);
    setIsRead(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullScreen keepMounted>
      <AppBar sx={{ position: 'relative', bgcolor: 'primary.main' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Evolução de {patientName}, Data da Sessão:{' '}
            {dayjs(selectedEvolution?.session_date).format(
              'DD/MM/YYYY [às] HH:mm'
            )}
          </Typography>
          {selectedEvolution?.evolution_status &&
            !selectedEvolution?.evolution_signs?.find(
              (item) => item.nome_usuario == user.nome_usuario
            )?.status && (
              <Button
                color="inherit"
                onClick={handleSign}
                sx={{ border: '1px solid', marginRight: 2 }}
              >
                Assinar evolução
              </Button>
            )}
          {!isRead && (
            <Button autoFocus color="inherit" onClick={handleSubmit}>
              Enviar
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <DialogContent>
        <Grid container spacing={2} direction="row" justifyContent="center">
          <Grid item xs={12} md={3}>
            <FormControl variant="outlined" fullWidth>
              <FormLabel>Compareceu</FormLabel>
              <RadioGroup
                value={attended}
                onChange={(event) => setAttended(event.target.value)}
              >
                {attendedOptions.map((option) => (
                  <FormControlLabel
                    key={option.id}
                    value={option.id}
                    control={<Radio />}
                    label={option.title}
                    disabled={isRead}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item container xs={12} md={3} spacing={2}>
            <Grid item xs={12}>
              <Typography component="legend" variant="subtitle1">
                Ânimo em que o paciente chegou:
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Rating
                  disabled={isRead}
                  value={arrivalMood}
                  precision={0.5}
                  onChange={(_, newMood) => {
                    setArrivalMood(newMood);
                  }}
                  onChangeActive={(_, newHover) => {
                    setArrivalMoodHover(newHover);
                  }}
                  emptyIcon={
                    <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                  }
                />
                {arrivalMood !== null && (
                  <Box sx={{ ml: 2 }}>
                    {arrivalMoodHover !== -1
                      ? moodStates.find(
                          (mood) => mood.value === arrivalMoodHover
                        )?.title
                      : moodStates.find((mood) => mood.value === arrivalMood)
                          ?.title}
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography component="legend" variant="subtitle1">
                Ânimo em que o paciente saiu:
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Rating
                  disabled={isRead}
                  value={departureMood}
                  precision={0.5}
                  onChange={(_, newMood) => {
                    setDepartureMood(newMood);
                  }}
                  onChangeActive={(_, newHover) => {
                    setDepartureMoodHover(newHover);
                  }}
                  emptyIcon={
                    <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                  }
                />
                {arrivalMood !== null && (
                  <Box sx={{ ml: 2 }}>
                    {departureMoodHover !== -1
                      ? moodStates.find(
                          (mood) => mood.value === departureMoodHover
                        )?.title
                      : moodStates.find((mood) => mood.value === departureMood)
                          ?.title}
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl variant="outlined" fullWidth>
              <FormLabel>Pontualidade</FormLabel>
              <RadioGroup
                value={punctuality}
                onChange={(event) => setPunctuality(event.target.value)}
              >
                {punctualityOptions.map((option) => (
                  <FormControlLabel
                    disabled={isRead}
                    key={option.id}
                    value={option.id}
                    control={<Radio />}
                    label={option.title}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={8}>
            <TextField
              disabled={isRead}
              id="subject"
              value={discussedSubject}
              onChange={(event) => setDiscussedSubject(event.target.value)}
              label="Assunto Discutido"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <TextField
              disabled={isRead}
              id="analysis"
              value={interventionAnalysis}
              onChange={(event) => setInterventionAnalysis(event.target.value)}
              label="Análise e intervenção realizada"
              fullWidth
              multiline
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <TextField
              disabled={isRead}
              id="next_session"
              value={nextSession}
              onChange={(event) => setNextSession(event.target.value)}
              label="O que ficou para a próxima sessão"
              fullWidth
              multiline
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <TextField
              disabled={isRead}
              id="notes"
              value={notesComments}
              onChange={(event) => setNotesComments(event.target.value)}
              label="Notas/Comentários do psicoterapeuta"
              fullWidth
              multiline
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
