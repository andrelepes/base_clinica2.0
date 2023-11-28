import { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers';

import Dialog from '@mui/material/Dialog';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputLabel from '@mui/material/InputLabel';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';

import PhoneInput from '../../components/MaskedInputs/PhoneInput';
import CEPInput from '../../components/MaskedInputs/CEPInput';
import CPFInput from '../../components/MaskedInputs/CPFInput';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

export default function AddPatientForm({ open, setOpen }) {
  const [phone, setPhone] = useState('');
  const [cep, setCep] = useState('');
  const [cpf, setCpf] = useState('');
  const [birthDate, setBirthDate] = useState(null);
  const { clinicaId: clinica_id, usuarioId: usuario_id } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const newPatientData = {
      nome_paciente: data.get('nome_paciente'),
      cpf_paciente: cpf,
      email_paciente: data.get('email_paciente'),
      telefone_paciente: phone,
      data_nascimento_paciente: birthDate,
      cep_paciente: cep,
      endereco_paciente: data.get('endereco_paciente'),
      clinica_id,
      usuario_id,
    };
    try {
      await api.post('/pacientes', newPatientData);
      toast.success(
        `${newPatientData.nome_paciente} foi cadastrado com sucesso!`
      );
      handleClose();
    } catch (error) {
      toast.error(
        error.response.data.message ??
          'Ocorreu um erro ao adicionar/atualizar o paciente.'
      );
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      keepMounted
      fullWidth
      maxWidth={'md'}
    >
      <DialogTitle>Adicionar Paciente</DialogTitle>
      <DialogContent>
        <Grid
          container
          spacing={2}
          marginTop={0.5}
          component="form"
          onSubmit={handleSubmit}
        >
          <Grid item xs={12} md={8}>
            <FormControl variant="outlined" fullWidth required>
              <InputLabel>Nome</InputLabel>
              <OutlinedInput
                id="nome_paciente"
                label="Nome"
                name="nome_paciente"
                autoComplete="full-name"
                autoFocus
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <CPFInput
              required
              label="CPF"
              id="cpf_paciente"
              name="cpf_paciente"
              value={cpf}
              handleChange={(event) => setCpf(event.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <FormControl variant="outlined" fullWidth required>
              <InputLabel>Email</InputLabel>
              <OutlinedInput
                id="email_paciente"
                name="email_paciente"
                autoComplete="email"
                label="Email"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <PhoneInput
              required
              label="Telefone"
              name="telefone_paciente"
              id="telefone_paciente"
              value={phone}
              handleChange={(event) => setPhone(event.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <DatePicker
              label="Data de Nascimento"
              id="data_nascimento_paciente"
              name="data_nascimento_paciente"
              value={birthDate}
              onChange={(newValue) => setBirthDate(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CEPInput
              required
              label="CEP"
              id="cep_paciente"
              name="cep_paciente"
              value={cep}
              handleChange={(event) => setCep(event.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={9}>
            <FormControl required variant="outlined" fullWidth>
              <InputLabel>Endereço</InputLabel>
              <OutlinedInput
                id="endereco_paciente"
                name="endereco_paciente"
                autoComplete="address"
                label="Endereço"
              />
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
