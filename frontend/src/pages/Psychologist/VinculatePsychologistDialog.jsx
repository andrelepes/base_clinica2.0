import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { useEffect, useState } from 'react';

export default function VinculatePsychologistDialog({
  open,
  setOpen,
  selectedPsychologist,
  setSelectedPsychologist,
}) {
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [patientsList, setPatientsList] = useState([]);

  const handleClose = () => {
    setSelectedPatients([]);
    setSelectedPsychologist(null);
    setOpen(false);
  };

  const fetchPatients = async () => {
    try {
      const response = await api.get(`/pacientes/clinica`);
      setPatientsList(response.data);
    } catch (error) {
      toast.error('Ocorreu um erro ao carregar os pacientes');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      pacientes: selectedPatients.map((patient) => patient.paciente_id),
    };

    try {
      await api.post(
        `/pacientes/vincular/${selectedPsychologist.usuario_id}`,
        data
      );
      toast.success('Pacientes vinculados com sucesso');
      handleClose();
    } catch (error) {
      toast.error('Ocorreu um erro ao vincular os pacientes');
    }
    console.log(data, selectedPsychologist.usuario_id);
  };

  useEffect(() => {
    if (open === true) {
      fetchPatients();
    }
    if (selectedPsychologist?.pacientes_autorizados){
      setSelectedPatients([...selectedPsychologist.pacientes_autorizados])
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      keepMounted
      fullWidth
      maxWidth={'md'}
    >
      <DialogTitle>Vincular pacientes ao psicólogo</DialogTitle>
      <DialogContent>
        <Grid
          container
          spacing={2}
          marginTop={0.5}
          component="form"
          onSubmit={handleSubmit}
        >
          <Grid item xs={12}>
            <Autocomplete
              id="selectedPatients"
              multiple
              disableCloseOnSelect
              value={selectedPatients}
              onChange={(event, newValue) => setSelectedPatients(newValue)}
              options={patientsList}
              getOptionLabel={(patient) => patient.nome_paciente}
              renderOption={(props, patient) => {
                const isSelected = selectedPatients.some((selectedPatient) => selectedPatient.paciente_id === patient.paciente_id);
                const { key, ...optionProps } = props;
                return (
                  <li key={key} {...optionProps}>
                    <Checkbox
                      icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                      checkedIcon={<CheckBoxIcon fontSize="small" />}
                      style={{ marginRight: 8 }}
                      checked={isSelected}
                    />
                    {patient.nome_paciente}
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextField {...params} label="Selecionar Pacientes" />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <DialogActions>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button type="submit">Vincular</Button>
            </DialogActions>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
