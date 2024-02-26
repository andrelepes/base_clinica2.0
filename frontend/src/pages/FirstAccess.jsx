import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useParams } from 'react-router-dom';

export default function FirstAccess() {
  const [tipoUsuario, setTipoUsuario] = useState('');
  const [name, setName] = useState('');
  const [senha, setSenha] = useState('');
  const [email, setEmail] = useState('');
  const [emailAuxiliar, setEmailAuxiliar] = useState('');
  const { firstAccessRegister, getFirstAccessUserInformation } = useAuth();
  const firstAccessToken = useParams().hash;

  let isMounted = false;
  useEffect(() => {
    if (!isMounted && firstAccessToken) {
      setFirstAccessUserData();
      isMounted = true;
    }
  }, []);

  const setFirstAccessUserData = async () => {
    const data = await getFirstAccessUserInformation({ firstAccessToken });
    setName(data.nome_usuario);
    setEmail(data.email_usuario);
    setTipoUsuario(data.tipousuario);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    firstAccessRegister({
      nome_usuario: name,
      email_auxiliar: emailAuxiliar,
      senha: senha,
      firstAccessToken
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'principal.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Primeiro Acesso
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl variant="outlined" fullWidth required>
                <InputLabel>Nome Completo</InputLabel>
                <OutlinedInput
                  autoComplete="full-name"
                  label="Nome Completo"
                  name="nome"
                  id="nome"
                  autoFocus
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Perfil</InputLabel>
                <Select
                  label="Perfil"
                  id="tipousuario"
                  value={tipoUsuario}
                  onChange={(event) => {
                    setTipoUsuario(event.target.value);
                  }}
                  disabled
                >
                  <MenuItem value={'secretario_vinculado'}>
                    Secretário Vinculado
                  </MenuItem>
                  <MenuItem value={'psicologo_vinculado'}>
                    Psicólogo Vinculado
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel>Email Cadastrado</InputLabel>
                <OutlinedInput
                  id="email_usuario"
                  name="email_usuario"
                  value={email}
                  autoComplete="email"
                  label="Email Cadastrado"
                  disabled
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel>Email Auxiliar</InputLabel>
                <OutlinedInput
                  id="email_auxiliar"
                  name="email_auxiliar"
                  value={emailAuxiliar}
                  onChange={(event) => setEmailAuxiliar(event.target.value)}
                  autoComplete="email"
                  label="Email Auxiliar"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="outlined" fullWidth required>
                <InputLabel>Senha</InputLabel>
                <OutlinedInput
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  name="senha"
                  label="Senha"
                  type="password"
                  id="senha"
                  autoComplete="new-password"
                />
              </FormControl>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Primeiro Acesso
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Já tem uma conta? Clique aqui
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
