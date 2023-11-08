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
import FormControl from '@mui/material/FormControl';
import { useState } from 'react';
import api from '../services/api';

export default function Register() {
  const [tipoUsuario, setTipoUsuario] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload = {
      nome_usuario: data.get('nome') + ' ' + data.get('sobrenome'),
      email_usuario: data.get('email_usuario'),
      senha: data.get('senha'),
      tipousuario: tipoUsuario,
    };

    try {
      const response = await api.post('/usuarios/registrar', payload);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', payload.nome_usuario);
      alert('Registro realizado com sucesso!');
      window.location.reload();
    } catch (error) {
      alert('Erro no registro. Por favor, tente novamente.');
    }
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
          Registre-se
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="nome"
                required
                fullWidth
                id="nome"
                label="Nome"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="sobrenome"
                label="Sobrenome"
                name="sobrenome"
                autoComplete="family-name"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="label_for_tipousuario">
                  Selecione seu perfil
                </InputLabel>
                <Select
                  labelId="label_for_tipousuario"
                  label="Selecione seu perfil"
                  id="tipousuario"
                  value={tipoUsuario}
                  onChange={(event) => {
                    setTipoUsuario(event.target.value);
                  }}
                >
                  <MenuItem value={'clinica'}>Clínica</MenuItem>
                  <MenuItem value={'psicologo'}>
                    Psicólogo(a) Autônomo(a)
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email_usuario"
                label="Email"
                name="email_usuario"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="senha"
                label="Senha"
                type="password"
                id="senha"
                autoComplete="new-password"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Registrar
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
