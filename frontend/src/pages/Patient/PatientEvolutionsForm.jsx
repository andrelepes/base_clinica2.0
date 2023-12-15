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

export default function PatientEvolutionsForm({
  open,
  setOpen,
  selectedEvolution,
  setSelectedEvolution,
  fetchEvolutions,
}) {
  const [attended, setAttended] = useState('');
  const [punctuality, setPunctuality] = useState('');
  const [arrivalMood, setArrivalMood] = useState(-1);
  const [arrivalMoodHover, setArrivalMoodHover] = useState(-1);
  const [discussedSubject, setDiscussedSubject] = useState('');
  const [interventionAnalysis, setInterventionAnalysis] = useState('');
  const [nextSession, setNextSession] = useState('');
  const [departureMood, setDepartureMood] = useState(-1);
  const [departureMoodHover, setDepartureMoodHover] = useState(-1);
  const [notesComments, setNotesComments] = useState('');
  const { usuarioId: usuario_id } = useAuth();

  const { id: paciente_id } = useParams();

  useEffect(() => {
    if (!!selectedEvolution?.attendance_status && !attended) {
      setAttended(selectedEvolution.attendance_status ?? '');
      setPunctuality(selectedEvolution.punctuality_status ?? '');
      setArrivalMood(selectedEvolution.arrival_mood_state ?? -1);
      setDiscussedSubject(selectedEvolution.discussion_topic ?? '');
      setInterventionAnalysis(selectedEvolution.analysis_intervention ?? '');
      setNextSession(selectedEvolution.next_session_plan ?? '');
      setDepartureMood(selectedEvolution.departure_mood_state ?? -1);
      setNotesComments(selectedEvolution.therapist_notes ?? '');
    }
  }, [open]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const evolutionData = {
      usuario_id,
      paciente_id,
      attendance_status: attended,
      punctuality_status: punctuality,
      arrival_mood_state: arrivalMood,
      discussion_topic: discussedSubject,
      analysis_intervention: interventionAnalysis,
      next_session_plan: nextSession,
      departure_mood_state: departureMood,
      therapist_notes: notesComments,
      evolution_status: true,
    };
    try {
      if (selectedEvolution?.evolution_id) {
        await api.put(
          `/evolutions/paciente/${selectedEvolution.evolution_id}`,
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
            Evolução de Paciente, Data da Sessão:{' '}
            {selectedEvolution?.appointment?.session_date}
          </Typography>
          <Button autoFocus color="inherit" onClick={handleSubmit}>
            Adicionar
          </Button>
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
              id="subject"
              value={discussedSubject}
              onChange={(event) => setDiscussedSubject(event.target.value)}
              label="Assunto Discutido"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <TextField
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
