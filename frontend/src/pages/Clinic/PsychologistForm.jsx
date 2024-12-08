import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { useEffect, useState } from 'react';
import { updateUsernameAndEmail } from '../../utils/apiFunctions';

export default function PsychologistForm({
  open,
  setOpen,
  fetchPsychologists,
  selectedPsychologist,
  setSelectedPsychologist,
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { clinicaId } = useAuth();

  const handleClose = () => {
    setEmail('');
    setName('');
    setSelectedPsychologist(null);
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    const formData = {
      nome_usuario: name,
      email_usuario: email,
      clinicaId,
    };
    try {
      if (selectedPsychologist) {
        updateUsernameAndEmail({
          usuario_id: selectedPsychologist.usuario_id,
          nome_usuario: name,
          email_usuario: email,
          closeFunction: handleClose,
        });
      } else {
        await api.post('/usuarios/add-linked-psychologist', formData);
        toast.success('Psicólogo adicionado com sucesso!');
      }
      setLoading(false);
      fetchPsychologists();
      handleClose();
    } catch (error) {
      toast.error('Ocorreu um erro ao adicionar o psicólogo');
    }
  };

  useEffect(() => {
    if (selectedPsychologist) {
      setName(selectedPsychologist.nome_usuario);
      setEmail(selectedPsychologist.email_usuario);
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
      <DialogTitle>
        {selectedPsychologist ? 'Editar' : 'Adicionar'} Psicólogo
      </DialogTitle>
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
              <Button type="submit" disabled={loading}>
                {selectedPsychologist ? 'Editar' : 'Adicionar'}
                {loading && (
                  <CircularProgress sx={{ marginLeft: 1 }} size={15} />
                )}
              </Button>
            </DialogActions>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
