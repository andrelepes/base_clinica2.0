import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { useState } from 'react';

export default function PsychologistForm({
  open,
  setOpen,
  fetchPsychologists,
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { clinicaId } = useAuth();

  const handleClose = () => {
    setEmail('');
    setName('');
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      nome_usuario: name,
      email_usuario: email,
      clinicaId,
    };
    try {
      await api.post('/usuarios/add-linked-psychologist', formData);
      toast.success('Psicólogo adicionado com sucesso!');
      fetchPsychologists();
      handleClose();
    } catch (error) {
      toast.error('Ocorreu um erro ao adicionar o psicólogo');
    }
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      keepMounted
      fullWidth
      maxWidth={'md'}
    >
      <DialogTitle>Adicionar Psicólogo</DialogTitle>
      <DialogContent>
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
                id="nome_usuario"
                label="Nome"
                name="nome_usuario"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="full-name"
                autoFocus
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl variant="outlined" fullWidth required>
              <InputLabel>Email</InputLabel>
              <OutlinedInput
                id="email_usuario"
                name="email_usuario"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                label="Email"
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
