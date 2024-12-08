import { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import CPFInput from '../../components/MaskedInputs/CPFInput';
import PhoneInput from '../../components/MaskedInputs/PhoneInput';
import CEPInput from '../../components/MaskedInputs/CEPInput';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';

export default function PsychologistDetailsDialog({
  open,
  setOpen,
  selectedPsychologist,
  setSelectedPsychologist,
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cep, setCep] = useState('');
  const [cpf, setCpf] = useState('');
  const [address, setAddress] = useState('');
  const [auxiliarMail, setAuxiliarMail] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [birthDate, setBirthDate] = useState(null);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenHours, setIsOpenHours] = useState(false);

  const handleClose = () => {
    setName('');
    setEmail('');
    setPhone('');
    setCep('');
    setCpf('');
    setAddress('');
    setAuxiliarMail('');
    setStartTime(null);
    setEndTime(null);
    setBirthDate(null);
    setIsOpenEdit(false);
    setIsOpenHours(false);
    setOpen(false);
    setSelectedPsychologist(null);
  };

  useEffect(() => {
    if (selectedPsychologist) {
      setName(selectedPsychologist.nome_usuario);
      setEmail(selectedPsychologist.email_usuario);
      setPhone(selectedPsychologist.telefone_usuario);
      setCep(selectedPsychologist.cep_usuario);
      setAddress(selectedPsychologist.endereco_usuario);
      setCpf(selectedPsychologist.cpfcnpj);
      setAuxiliarMail(selectedPsychologist.email_auxiliar);
      setStartTime(
        selectedPsychologist.start_hour
          ? dayjs(selectedPsychologist.start_hour, 'HH:mm:ss')
          : null
      );
      setEndTime(
        selectedPsychologist.end_hour
          ? dayjs(selectedPsychologist.end_hour, 'HH:mm:ss')
          : null
      );
      setBirthDate(
        selectedPsychologist.data_nascimento_usuario
          ? dayjs(selectedPsychologist.data_nascimento_usuario)
          : null
      );
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
      <DialogTitle>Detalhes do Psicólogo</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} marginTop={0.5}>
          <Grid item xs={12} md={6}>
            <FormControl variant="outlined" fullWidth required>
              <InputLabel>Nome</InputLabel>
              <OutlinedInput
                id="nome_psicologo"
                label="Nome"
                name="nome_psicologo"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="full-name"
                autoFocus
                readOnly
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <CPFInput
              required
              label="CPF"
              id="cpf_psicologo"
              name="cpf_psicologo"
              value={cpf}
              handleChange={(event) => setCpf(event.target.value)}
              fullWidth
              readOnly
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DatePicker
              label="Data de Nascimento"
              id="data_nascimento_psicologo"
              name="data_nascimento_psicologo"
              value={birthDate}
              onChange={(newValue) => setBirthDate(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
              readOnly
            />
          </Grid>
          <Grid item xs={12} md={4.5}>
            <FormControl variant="outlined" fullWidth required>
              <InputLabel>Email</InputLabel>
              <OutlinedInput
                id="email_psicologo"
                name="email_psicologo"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                label="Email"
                readOnly
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4.5}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Email Auxiliar</InputLabel>
              <OutlinedInput
                id="email_auxiliar_psicologo"
                name="email_auxiliar_psicologo"
                value={auxiliarMail}
                onChange={(event) => setAuxiliarMail(event.target.value)}
                autoComplete="email"
                label="Email Auxiliar"
                readOnly
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <PhoneInput
              label="Telefone"
              name="telefone_psicologo"
              id="telefone_psicologo"
              value={phone}
              fullWidth
              handleChange={(event) => setPhone(event.target.value)}
              readOnly
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CEPInput
              label="CEP"
              id="cep_psicologo"
              name="cep_psicologo"
              value={cep}
              fullWidth
              handleChange={(event) => setCep(event.target.value)}
              readOnly
            />
          </Grid>
          <Grid item xs={12} md={9}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Endereço</InputLabel>
              <OutlinedInput
                id="endereco_psicologo"
                name="endereco_psicologo"
                autoComplete="address"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                label="Endereço"
                readOnly
              />
            </FormControl>
          </Grid>
          <Grid item md={6} xs={12} marginTop={2.5}>
            <InputLabel>Horário de Início</InputLabel>
            <TimeField
              value={startTime}
              onChange={(newValue) => setStartTime(newValue)}
              readOnly
              fullWidth
            />
          </Grid>
          <Grid item md={6} xs={12} marginTop={2.5}>
            <InputLabel>Horário de Fim</InputLabel>
            <TimeField
              value={endTime}
              onChange={(newValue) => setEndTime(newValue)}
              readOnly
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
