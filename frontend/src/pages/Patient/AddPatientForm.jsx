import { useState } from 'react';
import DatePicker from '@mui/x-date-pickers/DatePicker';

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

export default function AddPatientForm({ open, handleClose }) {
  const [phone, setPhone] = useState('');
  const [cep, setCep] = useState('');
  const [cpf, setCpf] = useState('');

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
        <Grid container spacing={2} marginTop={0.5}>
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
                margin="normal"
                id="endereco_paciente"
                name="endereco_paciente"
                autoComplete="address"
                label="Endereço"
              />
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleClose}>Adicionar</Button>
      </DialogActions>
    </Dialog>
  );
}
