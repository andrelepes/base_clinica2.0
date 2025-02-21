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
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';
import api from '../../services/api';
import dayjs from 'dayjs';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CPFInput from '../../components/MaskedInputs/CPFInput';

export default function ClinicDetails() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [coordinatorName, setCoordinatorName] = useState('');
  const [coordinatorEmail, setCoordinatorEmail] = useState('');
  const [coordinatorPhone, setCoordinatorPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [cep, setCep] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [address, setAddress] = useState('');
  const [auxiliarMail, setAuxiliarMail] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [monthlyFee, setMonthlyFee] = useState();
  const [expiresIn, setExpiresIn] = useState();
  const [isOpenClinicInfo, setIsOpenClinicInfo] = useState(false);
  const [isOpenCoordinatorInfo, setIsOpenCoordinatorInfo] = useState(false);

  const { user, usuarioId: usuario_id } = useAuth();

  const handleSubmitClinicInfo = async (event) => {
    event.preventDefault();

    if (expiresIn < 1 || expiresIn > 30) {
      toast.error('O dia de vencimento deve ser entre 1 e 30');
      return;
    }

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
      monthly_fee: monthlyFee,
      expires_in_day: expiresIn,
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
  const handleSubmitCoordinator = async (event) => {
    event.preventDefault();

    const coordinatorData = {
      nome_coordenador: coordinatorName,
      email_coordenador: coordinatorEmail,
      cpf_coordenador: cpf,
      telefone_coordenador: coordinatorPhone,
    };

    try {
      await api.put('/usuarios/coordinator', { ...coordinatorData });
      toast.success('Informações do coordenador atualizadas com sucesso.');
    } catch (error) {
      toast.error(
        error.response.data.message ??
          'Ocorreu um erro ao atualizar os dados do coordenador.'
      );
    }
  };

  const fetchCoordinatorInfo = async () => {
    try {
      const { data } = await api.get('/usuarios/coordinator');
      setCoordinatorName(data.nome_coordenador);
      setCoordinatorEmail(data.email_coordenador);
      setCoordinatorPhone(data.telefone_coordenador);
      setCpf(data.cpf_coordenador);
    } catch (error) {
      if (error.response.status === 404) {
        return;
      }
      toast.error(
        error.response.data.message ??
          'Ocorreu um erro ao buscar os dados do coordenador.'
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
      setMonthlyFee(user.monthly_fee);
      setExpiresIn(user.expires_in_day);
      fetchCoordinatorInfo();
    }
  }, [user]);
  return (
    <Box>
      <List
        sx={{ width: '100%', bgcolor: 'background.paper' }}
        component="nav"
        fullWidth
      >
        <ListItemButton onClick={() => setIsOpenClinicInfo(!isOpenClinicInfo)}>
          <ListItemText primary="Informações da Clínica" />
          {isOpenClinicInfo ? (
            <KeyboardArrowUpIcon />
          ) : (
            <KeyboardArrowDownIcon />
          )}
        </ListItemButton>
        <Collapse in={isOpenClinicInfo} timeout="auto">
          <Grid
            container
            spacing={2}
            marginTop={0.5}
            component="form"
            onSubmit={handleSubmitClinicInfo}
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
              <FormControl variant="outlined" fullWidth>
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
                label="CEP"
                id="cep_clinica"
                name="cep_clinica"
                value={cep}
                fullWidth
                handleChange={(event) => setCep(event.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={9}>
              <FormControl variant="outlined" fullWidth>
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

            <Grid item xs={12} md={2} marginTop={3}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel>Mensalidade (em R$)</InputLabel>
                <OutlinedInput
                  id="monthly_fee"
                  name="monthly_fee"
                  value={monthlyFee}
                  onChange={(event) => setMonthlyFee(event.target.value)}
                  label="Mensalidade (em R$)"
                  type="number"
                />
              </FormControl>
              <FormControl variant="outlined" fullWidth sx={{ marginTop: 5 }}>
                <InputLabel>Dia de Vencimento da Cobrança</InputLabel>
                <OutlinedInput
                  id="expires_in_day"
                  name="expires_in_day"
                  value={expiresIn}
                  onChange={(event) => setExpiresIn(event.target.value)}
                  label="Dia de Vencimento da Cobrança"
                  type="number"
                />
              </FormControl>
            </Grid>

            <Grid item md={5} xs={12} marginTop={2.5}>
              <InputLabel>Horário de Início</InputLabel>
              <DigitalClock
                ampm={false}
                value={startTime}
                onChange={(newValue) => setStartTime(newValue)}
                timeStep={30}
              />
            </Grid>
            <Grid item md={5} xs={12} marginTop={2.5}>
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
              <Button
                onClick={handleSubmitClinicInfo}
                variant="contained"
                fullWidth
              >
                Atualizar Cadastro
              </Button>
            </Grid>
            <Grid item xs={12} md={12}></Grid>
          </Grid>
        </Collapse>
        <ListItemButton
          onClick={() => setIsOpenCoordinatorInfo(!isOpenCoordinatorInfo)}
        >
          <ListItemText primary="Informações do Coordenador" />
          {isOpenCoordinatorInfo ? (
            <KeyboardArrowUpIcon />
          ) : (
            <KeyboardArrowDownIcon />
          )}
        </ListItemButton>
        <Collapse in={isOpenCoordinatorInfo} timeout="auto">
          <Grid
            container
            spacing={2}
            marginTop={0.5}
            component="form"
            onSubmit={handleSubmitCoordinator}
          >
            <Grid item xs={12} md={8}>
              <FormControl variant="outlined" fullWidth required>
                <InputLabel>Nome do Coordenador</InputLabel>
                <OutlinedInput
                  id="nome_coordenador"
                  label="Nome"
                  name="nome_coordenador"
                  value={coordinatorName}
                  onChange={(event) => setCoordinatorName(event.target.value)}
                  autoComplete="full-name"
                  autoFocus
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <CPFInput
                required
                label="CPF do Coordenador"
                id="cpf_coordenador"
                name="cpf_coordenador"
                value={cpf}
                handleChange={(event) => setCpf(event.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <FormControl variant="outlined" fullWidth required>
                <InputLabel>Email Coordenador</InputLabel>
                <OutlinedInput
                  id="email_coordenador"
                  name="email_coordenador"
                  value={coordinatorEmail}
                  onChange={(event) => setCoordinatorEmail(event.target.value)}
                  autoComplete="email"
                  label="Email"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <PhoneInput
                label="Telefone do Coordenador"
                name="telefone_coordenador"
                id="telefone_coordenador"
                value={coordinatorPhone}
                fullWidth
                handleChange={(event) =>
                  setCoordinatorPhone(event.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} md={8}></Grid>
            <Grid item xs={12} md={4}>
              <Button
                onClick={handleSubmitCoordinator}
                variant="contained"
                fullWidth
              >
                Atualizar Cadastro
              </Button>
            </Grid>
            <Grid item xs={12} md={12}></Grid>
          </Grid>
        </Collapse>
      </List>
    </Box>
  );
}
