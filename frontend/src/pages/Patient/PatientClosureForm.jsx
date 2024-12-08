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
import Autocomplete from '@mui/material/Autocomplete';
import Slide from '@mui/material/Slide';

import {
  caseStatusOptions,
  healthyLifeHabitsOptions,
} from '../../utils/anamnesisFormOptions';
import { satisfactionStates } from '../../utils/formTypes';
import { forwardRef, useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PatientClosureForm({
  open,
  setOpen,
  isRead,
  setIsRead,
  fetchClosure,
  closure,
  expectationsAnamneseOptions,
  sessions,
}) {
  const [caseStatus, setCaseStatus] = useState('');
  const [overallResultsEvaluation, setOverallResultsEvaluation] = useState(0);
  const [initialExpectationsMet, setInitialExpectationsMet] = useState([]);
  const [sessionsNumber, setSessionsNumber] = useState(0);
  const [healthyHabitsAcquired, setHealthyHabitsAcquired] = useState([]);
  const [relevantInformation, setRelevantInformation] = useState('');
  const [expectationsOptions, setExpectationsOptions] = useState([]);

  const { usuarioId: usuario_id, user } = useAuth();
  const { id: paciente_id } = useParams();

  useEffect(() => {
    if (sessions) {
      setSessionsNumber(sessions?.length);
    }
    if (expectationsAnamneseOptions) {
      setExpectationsOptions(
        expectationsAnamneseOptions?.treatment_expectation.split(',')
      );
    }
    if (closure) {
      setCaseStatus(closure?.case_status);
      setOverallResultsEvaluation(closure?.overall_results_evaluation);
      setInitialExpectationsMet(closure?.initial_expectations_met.split(','));
      setHealthyHabitsAcquired(
        closure?.healthy_life_habits_acquired.split(',')
      );
      setRelevantInformation(closure?.additional_relevant_information);
    }
  }, [open]);

  const handleClose = () => {
    setCaseStatus('');
    setOverallResultsEvaluation(0);
    setInitialExpectationsMet([]);
    setSessionsNumber(0);
    setHealthyHabitsAcquired([]);
    setRelevantInformation('');
    setIsRead(false);
    setOpen(false);
  };
  const handleSubmit = async () => {
    const data = {
      usuario_id,
      paciente_id,
      case_status: caseStatus,
      overall_results_evaluation: overallResultsEvaluation,
      initial_expectations_met: initialExpectationsMet.toString(),
      treatment_duration_sessions: sessionsNumber,
      healthy_life_habits_acquired: healthyHabitsAcquired.toString(),
      additional_relevant_information: relevantInformation,
    };

    try {
      if (!closure?.patient_closure_id) {
        await api.post('/closure/', data);
        toast.success('Formulário de Alta criado com sucesso!');
      } else {
        await api.put(`/closure/${closure.patient_closure_id}`, {
          ...data,
          closure_id: closure.patient_closure_id,
        });
        toast.success('Formulário de Alta atualizado com sucesso!');
      }
      fetchClosure();
      handleClose();
    } catch (error) {
      toast.error('Ocorreu um erro ao enviar o Formulário de Alta');
    }
  };

  const handleSign = async () => {
    try {
      await api.put('/closure/sign', {
        usuario_id,
        closure_id: closure.patient_closure_id,
      });
      toast.success('Assinatura realizada com sucesso');
      fetchClosure();
      handleClose();
    } catch (error) {
      toast.error(
        error.response.data.message ?? 'Erro ao assinar o formulário de alta'
      );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen
      keepMounted
      TransitionComponent={Transition}
    >
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
            Alta de Paciente
          </Typography>
          {closure?.patient_closure_id &&
            !closure?.patient_closure_signs?.find(
              (item) => item.nome_usuario == user.nome_usuario
            )?.status && (
              <Button
                color="inherit"
                onClick={handleSign}
                sx={{ border: '1px solid', marginRight: 2 }}
              >
                Assinar Formulário de Alta
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
        <Grid
          container
          spacing={2}
          direction="row"
          justifyContent="space-between"
        >
          <Grid item xs={12} md={5}>
            <FormControl variant="outlined" fullWidth>
              <FormLabel>Avaliação de resultados</FormLabel>
              <RadioGroup
                value={overallResultsEvaluation}
                onChange={(event) =>
                  setOverallResultsEvaluation(event.target.value)
                }
              >
                {satisfactionStates.map((option) => (
                  <FormControlLabel
                    disabled={isRead}
                    key={option.id}
                    value={option.value}
                    control={<Radio />}
                    label={option.title}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid container spacing={4} direction="column">
            <Grid item xs={12} md={3}>
              <Autocomplete
                disabled={isRead}
                id="case-status"
                freeSolo
                value={caseStatus}
                onChange={(event, newValue) => setCaseStatus(newValue)}
                options={caseStatusOptions}
                renderInput={(params) => (
                  <TextField {...params} label="Situação do Caso:" />
                )}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <Autocomplete
                disabled={isRead}
                id="treatment-expectations-met"
                freeSolo
                multiple={expectationsOptions.length > 1}
                value={initialExpectationsMet}
                onChange={(event, newValue) =>
                  setInitialExpectationsMet(newValue)
                }
                options={expectationsOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Expectativas iniciais que foram atendidas:"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Autocomplete
                disabled={isRead}
                id="life-habits-acquired"
                freeSolo
                multiple
                value={healthyHabitsAcquired}
                onChange={(event, newValue) =>
                  setHealthyHabitsAcquired(newValue)
                }
                options={healthyLifeHabitsOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Hábitos saudáveis adquiridos ao longo do tratamento:"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                disabled={isRead}
                id="relevant-information"
                value={relevantInformation}
                onChange={(event) => setRelevantInformation(event.target.value)}
                label="Informações adicionais:"
                multiline
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
