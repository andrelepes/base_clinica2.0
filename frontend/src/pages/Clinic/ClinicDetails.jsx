import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import CNPJInput from '../../components/MaskedInputs/CNPJInput';
import PhoneInput from '../../components/MaskedInputs/PhoneInput';
import CEPInput from '../../components/MaskedInputs/CEPInput';
import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';
import Grid from '@mui/material/Grid';
import api from '../../services/api';
import dayjs from 'dayjs';

export default function ClinicDetails() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cep, setCep] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [address, setAddress] = useState('');
  const [auxiliarMail, setAuxiliarMail] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const { user, usuarioId:usuario_id } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const clinicData = {
      nome_usuario: name,
      email_usuario: email,
      cpfcnpj: cnpj,
      endereco_usuario: address,
      telefone_usuario: phone,
      cep_usuario: cep,
      email_auxiliar: auxiliarMail,
      start_hour: dayjs(startTime).format('HH:mm:ss'),
      end_hour: dayjs(endTime).format('HH:mm:ss'),
    };

    try {
      await api.put(`/usuarios/${usuario_id}`, { ...clinicData });
      toast.success('Informações da clínica atualizada com sucesso.');
    } catch (error) {
      toast.error(
        error.response.data.message ?? 'Ocorreu um erro ao atualizar a clinica.'
      );
    }
  };

  useEffect(() => {
    if (user) {
      setName(user.nome_usuario);
      setEmail(user.email_usuario);
      setPhone(user.telefone_usuario);
      setCep(user.cep_usuario);
      setAddress(user.endereco_usuario);
      setCnpj(user.cpfcnpj);
      setAuxiliarMail(user.email_auxiliar);
      setStartTime(user.start_hour ? dayjs(user.start_hour, 'HH:mm:ss') : null);
      setEndTime(user.end_hour ? dayjs(user.end_hour, 'HH:mm:ss') : null);
    }
  }, [user]);
  return (
    <Box>
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
              id="nome_clinica"
              label="Nome"
              name="nome_clinica"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="full-name"
              autoFocus
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <CNPJInput
            required
            label="CNPJ"
            id="cnpj_clinica"
            name="cnpj_clinica"
            value={cnpj}
            handleChange={(event) => setCnpj(event.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4.5}>
          <FormControl variant="outlined" fullWidth required>
            <InputLabel>Email</InputLabel>
            <OutlinedInput
              id="email_clinica"
              name="email_clinica"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              label="Email"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4.5}>
          <FormControl variant="outlined" fullWidth required>
            <InputLabel>Email Auxiliar</InputLabel>
            <OutlinedInput
              id="email_auxiliar_clinica"
              name="email_auxiliar_clinica"
              value={auxiliarMail}
              onChange={(event) => setAuxiliarMail(event.target.value)}
              autoComplete="email"
              label="Email Auxiliar"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <PhoneInput
            required
            label="Telefone"
            name="telefone_clinica"
            id="telefone_clinica"
            value={phone}
            fullWidth
            handleChange={(event) => setPhone(event.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <CEPInput
            required
            label="CEP"
            id="cep_clinica"
            name="cep_clinica"
            value={cep}
            fullWidth
            handleChange={(event) => setCep(event.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={9}>
          <FormControl required variant="outlined" fullWidth>
            <InputLabel>Endereço</InputLabel>
            <OutlinedInput
              id="endereco_clinica"
              name="endereco_clinica"
              autoComplete="address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              label="Endereço"
            />
          </FormControl>
        </Grid>

        <Grid item md={6} xs={12} marginTop={2.5}>
          <InputLabel>Horário de Início</InputLabel>
          <DigitalClock
            ampm={false}
            value={startTime}
            onChange={(newValue) => setStartTime(newValue)}
            timeStep={30}
          />
        </Grid>
        <Grid item md={6} xs={12} marginTop={2.5}>
          <InputLabel>Horário de Fim</InputLabel>
          <DigitalClock
            ampm={false}
            value={endTime}
            onChange={(newValue) => setEndTime(newValue)}
            timeStep={30}
            minTime={startTime}
          />
        </Grid>
        <Grid item xs={12} md={10}></Grid>
        <Grid item xs={12} md={2}>
          <Button onClick={handleSubmit} variant="contained" fullWidth>
            Atualizar Cadastro
          </Button>
        </Grid>
        <Grid item xs={12} md={12}></Grid>
      </Grid>
    </Box>
  );
}
