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

export default function OfficeForm({
  open,
  setOpen,
  fetchOffices,
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { clinicaId: clinica_id } = useAuth();

  const handleClose = () => {
    setDescription('');
    setName('');
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      nome_consultorio: name,
      descricao: description,
      clinica_id,
    };
    try {
      await api.post('/consultorios', formData);
      toast.success('Consultório adicionado com sucesso!');
      fetchOffices();
      handleClose();
    } catch (error) {
      toast.error('Ocorreu um erro ao adicionar o consultório');
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
      <DialogTitle>Adicionar Consultório</DialogTitle>
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
                id="nome_consultorio"
                label="Nome"
                name="nome_consultorio"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoFocus
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Descrição</InputLabel>
              <OutlinedInput
                id="description"
                name="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                label="Descrição"
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
