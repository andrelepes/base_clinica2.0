import { useEffect, useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

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

export default function PatientForm({
  open,
  setOpen,
  selectedPatient,
  setSelectedPatient,
  fetchPatients,
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [cep, setCep] = useState('');
  const [cpf, setCpf] = useState('');
  const [birthDate, setBirthDate] = useState(null);
  const { clinicaId: clinica_id, usuarioId: usuario_id } = useAuth();

  useEffect(() => {
    if (!!selectedPatient.nome_paciente && !name) {
      setName(selectedPatient.nome_paciente ?? '');
      setCpf(selectedPatient.cpf_paciente ?? '');
      setEmail(selectedPatient.email_paciente ?? '');
      setPhone(selectedPatient.telefone_paciente ?? '');
      setBirthDate(
        selectedPatient.data_nascimento_paciente
          ? dayjs(selectedPatient.data_nascimento_paciente)
          : null
      );
      setCep(selectedPatient.cep_paciente ?? '');
      setAddress(selectedPatient.endereco_paciente ?? '');
    }
  }, [open]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const patientData = {
      nome_paciente: name,
      cpf_paciente: cpf,
      email_paciente: email,
      telefone_paciente: phone,
      data_nascimento_paciente: birthDate,
      cep_paciente: cep,
      endereco_paciente: address,
      clinica_id,
      usuario_id,
    };

    try {
      if (selectedPatient.usuario_id) {
        await api.put(`/pacientes/${selectedPatient.usuario_id}`, patientData);
        await api.put(`/pacientes/${selectedPatient.usuario_id}/ativo`, {
          usuario_id,
        });
        toast.success(
          `${patientData.nome_paciente} foi atualizado com sucesso!`
        );
        fetchPatients();
        handleClose();
      } else {
        await api.post('/pacientes', patientData);
        toast.success(
          `${patientData.nome_paciente} foi cadastrado com sucesso!`
        );
        fetchPatients();
        handleClose();
      }
    } catch (error) {
      toast.error(
        error.response.data.message ??
          'Ocorreu um erro ao adicionar/atualizar o paciente.'
      );
    }
  };

  const handleClose = () => {
    setOpen(false);
    setName('');
    setCpf('');
    setEmail('');
    setPhone('');
    setBirthDate(null);
    setCep('');
    setAddress('');
    setSelectedPatient(null);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      keepMounted
      fullWidth
      maxWidth={'md'}
    >
      <DialogTitle>
        {selectedPatient.nome_paciente ? 'Editar' : 'Adicionar'} Paciente
      </DialogTitle>
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
                value={name}
                onChange={(event) => setName(event.target.value)}
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
                value={email}
                onChange={(event) => setEmail(event.target.value)}
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
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                label="Endereço"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <DialogActions>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button type="submit">
                {selectedPatient.nome_paciente ? 'Editar' : 'Adicionar'}
              </Button>
            </DialogActions>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
