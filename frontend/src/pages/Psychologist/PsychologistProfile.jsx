import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import CPFInput from '../../components/MaskedInputs/CPFInput';
import PhoneInput from '../../components/MaskedInputs/PhoneInput';
import CEPInput from '../../components/MaskedInputs/CEPInput';
import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import api from '../../services/api';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import Collapse from '@mui/material/Collapse';
import TableWithActions from '../../components/TableWithActions';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function PsychologistProfile() {
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
  const [hours, setHours] = useState([]);

  const { user, usuarioId: usuario_id } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const psychologistData = {
      nome_usuario: name,
      email_usuario: email,
      cpfcnpj: cpf,
      endereco_usuario: address,
      telefone_usuario: phone,
      cep_usuario: cep,
      email_auxiliar: auxiliarMail,
      start_hour: dayjs(startTime).format('HH:mm:ss'),
      end_hour: dayjs(endTime).format('HH:mm:ss'),
      data_nascimento: dayjs(birthDate).format('YYYY-MM-DD'),
    };

    try {
      await api.put(`/usuarios/${usuario_id}`, { ...psychologistData });
      toast.success('Informações do perfil atualizadas com sucesso.');
    } catch (error) {
      toast.error(
        error.response.data.message ?? 'Ocorreu um erro ao atualizar o perfil.'
      );
    }
  };

  const fetchHours = async () => {
    try {
      const response = await api.get(`/usuarios/psychologists/data/`);
      setHours(response.data);
    } catch (error) {
      toast.error('Ocorreu um erro ao carregar os horários');
    }
  };

  useEffect(() => {
    if (user) {
      setName(user.nome_usuario);
      setEmail(user.email_usuario);
      setPhone(user.telefone_usuario);
      setCep(user.cep_usuario);
      setAddress(user.endereco_usuario);
      setCpf(user.cpfcnpj);
      setAuxiliarMail(user.email_auxiliar);
      setStartTime(user.start_hour ? dayjs(user.start_hour, 'HH:mm:ss') : null);
      setEndTime(user.end_hour ? dayjs(user.end_hour, 'HH:mm:ss') : null);
      setBirthDate(
        user.data_nascimento_usuario
          ? dayjs(user.data_nascimento_usuario)
          : null
      );
      fetchHours();
    }
  }, [user]);
  return (
    <Box>
      <List
        sx={{ width: '100%', bgcolor: 'background.paper' }}
        component="nav"
        fullWidth
      >
        <ListItemButton onClick={() => setIsOpenEdit(!isOpenEdit)}>
          <ListItemText primary="Editar Perfil" />
          {isOpenEdit ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </ListItemButton>
        <Collapse in={isOpenEdit} timeout="auto">
          <Grid
            container
            spacing={2}
            marginTop={0.5}
            component="form"
            onSubmit={handleSubmit}
          >
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
        </Collapse>
        <ListItemButton onClick={() => setIsOpenHours(!isOpenHours)}>
          <ListItemText primary="Horas Realizadas" secondary={`Total de horas: ${hours.total_horas_sessao} | Evoluções pendentes: ${hours.pending_evolutions_count}`}/>
          {isOpenHours ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </ListItemButton>
        <Collapse in={isOpenHours} timeout="auto">
          <TableWithActions
            data={hours.hours_data}
            startingPages={-1}
            fields={[
              {
                title: 'Data da Sessão',
                dataTitle: 'data_hora_inicio',
              },
              {
                title: 'Nome do Paciente',
                dataTitle: 'nome_paciente',
              },
              {
                title: 'Status',
                dataTitle: 'status',
              },
              {
                title: 'Evolução Feita?',
                dataTitle: 'evolution_status',
              },
            ]}
          />
        </Collapse>
      </List>
    </Box>
  );
}
