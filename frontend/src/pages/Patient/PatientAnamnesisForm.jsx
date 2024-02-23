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
  maritalStatusOptions,
  careModalityOptions,
  genderOptions,
  educationLevelOptions,
  socioeconomicLevelOptions,
  specialNeedsOptions,
  referredByOptions,
  undergoingTreatmentOptions,
  treatmentExpectationOptions,
  diagnosisOptions,
  healthyLifeHabitsOptions,
} from '../../utils/anamnesisFormOptions';
import { forwardRef, useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PatientAnamnesisForm({
  open,
  setOpen,
  isRead,
  setIsRead,
  fetchEvolutions,
  anamnesis,
}) {
  const [maritalStatus, setMaritalStatus] = useState('');
  const [careModality, setCareModality] = useState('');
  const [gender, setGender] = useState('');
  const [occupation, setOccupation] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [socioeconomicLevel, setSocioeconomicLevel] = useState('');
  const [specialNeeds, setSpecialNeeds] = useState('');
  const [referredBy, setReferredBy] = useState('');
  const [undergoingTreatment, setUndergoingTreatment] = useState([]);
  const [treatmentExpectation, setTreatmentExpectation] = useState([]);
  const [diagnosis, setDiagnosis] = useState([]);
  const [healthyLifeHabits, setHealthyLifeHabits] = useState([]);
  const [relevantInformation, setRelevantInformation] = useState('');

  const { usuarioId: usuario_id } = useAuth();
  const { id: paciente_id } = useParams();

  useEffect(() => {
    if (anamnesis && !maritalStatus) {
      setMaritalStatus(anamnesis?.marital_status);
      setCareModality(anamnesis?.care_modality);
      setGender(anamnesis?.gender);
      setOccupation(anamnesis?.occupation);
      setEducationLevel(anamnesis?.education_level);
      setSocioeconomicLevel(anamnesis?.socioeconomic_level);
      setSpecialNeeds(anamnesis?.special_needs);
      setReferredBy(anamnesis?.referred_by);
      setUndergoingTreatment(anamnesis?.undergoing_treatment.split(','));
      setTreatmentExpectation(anamnesis?.treatment_expectation.split(','));
      setDiagnosis(anamnesis?.diagnosis.split(','));
      setHealthyLifeHabits(anamnesis?.healthy_life_habits.split(','));
      setRelevantInformation(anamnesis?.relevant_information);
    }
  }, [open]);

  const handleClose = () => {
    setMaritalStatus('');
    setCareModality('');
    setGender('');
    setOccupation('');
    setEducationLevel('');
    setSocioeconomicLevel('');
    setSpecialNeeds('');
    setReferredBy('');
    setUndergoingTreatment([]);
    setTreatmentExpectation([]);
    setDiagnosis([]);
    setHealthyLifeHabits([]);
    setRelevantInformation('');
    setIsRead(false);
    setOpen(false);
  };
  const handleSubmit = async () => {
    const data = {
      usuario_id,
      paciente_id,
      marital_status: maritalStatus,
      care_modality: careModality,
      gender: gender,
      occupation: occupation,
      education_level: educationLevel,
      socioeconomic_level: socioeconomicLevel,
      special_needs: specialNeeds,
      referred_by: referredBy,
      undergoing_treatment: undergoingTreatment.toString(),
      treatment_expectation: treatmentExpectation.toString(),
      diagnosis: diagnosis.toString(),
      healthy_life_habits: healthyLifeHabits.toString(),
      relevant_information: relevantInformation,
    };

    try {
      await api.post('/anamnesis/', data);
      toast.success('Anamnese criada com sucesso!');
      fetchEvolutions();
      handleClose();
    } catch (error) {
      toast.error('Ocorreu um erro ao enviar a Anamnese do paciente');
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
            Anamnese de Paciente
          </Typography>
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
          <Grid item container spacing={2} direction="column" xs={12} md={3}>
            <Grid item xs={12} md={5}>
              <FormControl variant="outlined" fullWidth>
                <FormLabel>Tipo de Atendimento</FormLabel>
                <RadioGroup
                  value={careModality}
                  onChange={(event) => setCareModality(event.target.value)}
                >
                  {careModalityOptions.map((option) => (
                    <FormControlLabel
                      disabled={isRead}
                      key={option}
                      value={option}
                      control={<Radio />}
                      label={option}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl variant="outlined" fullWidth>
                <FormLabel>Sexo</FormLabel>
                <RadioGroup
                  value={gender}
                  onChange={(event) => setGender(event.target.value)}
                >
                  {genderOptions.map((option) => (
                    <FormControlLabel
                      disabled={isRead}
                      key={option}
                      value={option}
                      control={<Radio />}
                      label={option}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl variant="outlined" fullWidth>
              <FormLabel>Estado Civil</FormLabel>
              <RadioGroup
                value={maritalStatus}
                onChange={(event) => setMaritalStatus(event.target.value)}
              >
                {maritalStatusOptions.map((option) => (
                  <FormControlLabel
                    disabled={isRead}
                    key={option}
                    value={option}
                    control={<Radio />}
                    label={option}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl variant="outlined" fullWidth>
              <FormLabel>Nivel de Escolaridade Completo</FormLabel>
              <RadioGroup
                value={educationLevel}
                onChange={(event) => setEducationLevel(event.target.value)}
              >
                {educationLevelOptions.map((option) => (
                  <FormControlLabel
                    disabled={isRead}
                    key={option}
                    value={option}
                    control={<Radio />}
                    label={option}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl variant="outlined" fullWidth>
              <FormLabel>Nível Socioenconômico</FormLabel>
              <RadioGroup
                value={socioeconomicLevel}
                onChange={(event) => setSocioeconomicLevel(event.target.value)}
              >
                {socioeconomicLevelOptions.map((option) => (
                  <FormControlLabel
                    disabled={isRead}
                    key={option}
                    value={option}
                    control={<Radio />}
                    label={option}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              disabled={isRead}
              id="occupation"
              value={occupation}
              onChange={(event) => setOccupation(event.target.value)}
              label="Profissão/Ocupação"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              disabled={isRead}
              id="relevant-information"
              value={relevantInformation}
              onChange={(event) => setRelevantInformation(event.target.value)}
              label="Informações relevantes, não contempladas pelo questionário:"
              multiline
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Autocomplete
              disabled={isRead}
              id="special-needs"
              freeSolo
              inputValue={specialNeeds}
              onInputChange={(event, newValue) => setSpecialNeeds(newValue)}
              options={specialNeedsOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Apresenta necessidade especial?"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Autocomplete
              disabled={isRead}
              id="referedby"
              freeSolo
              inputValue={referredBy}
              onInputChange={(event, newValue) => setReferredBy(newValue)}
              options={referredByOptions}
              renderInput={(params) => (
                <TextField {...params} label="Encaminhado por" />
              )}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Autocomplete
              disabled={isRead}
              id="undergoing-treatment"
              freeSolo
              multiple
              value={undergoingTreatment}
              onChange={(event, newValue) => setUndergoingTreatment(newValue)}
              options={undergoingTreatmentOptions}
              renderInput={(params) => (
                <TextField {...params} label="Em tratamento" />
              )}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Autocomplete
              disabled={isRead}
              id="treatment-expectation"
              freeSolo
              multiple
              value={treatmentExpectation}
              onChange={(event, newValue) => setTreatmentExpectation(newValue)}
              options={treatmentExpectationOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Qual expectativa para o tratamento:"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Autocomplete
              disabled={isRead}
              id="diagnosis"
              freeSolo
              multiple
              value={diagnosis}
              onChange={(event, newValue) => setDiagnosis(newValue)}
              options={diagnosisOptions}
              renderInput={(params) => (
                <TextField {...params} label="Diagnóstico" />
              )}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Autocomplete
              disabled={isRead}
              id="life-habits"
              freeSolo
              multiple
              value={healthyLifeHabits}
              onChange={(event, newValue) => setHealthyLifeHabits(newValue)}
              options={healthyLifeHabitsOptions}
              renderInput={(params) => (
                <TextField {...params} label="Hábitos de vida saudáveis:" />
              )}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
