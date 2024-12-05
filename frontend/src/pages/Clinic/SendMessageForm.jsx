import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { useEffect, useState } from 'react';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
export default function SendMessageForm({
  open,
  setOpen,
  fetchMessages,
  selectedMessage,
  setSelectedMessage,
}) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [psychologists, setPsychologists] = useState([]);
  const [selectedPsychologist, setSelectedPsychologist] = useState('');

  const { clinicaId } = useAuth();

  const handleClose = () => {
    setMessage('');
    setSubject('');
    setSelectedPsychologist(null);
    setOpen(false);
    setSelectedMessage(null);
  };

  const fetchPsychologists = async () => {
    try {
      const { data } = await api.get('/usuarios/psychologists/from/clinic/');

      data.unshift({ nome_usuario: 'Todos', usuario_id: 0 });

      setPsychologists(data);
    } catch (error) {
      toast.error('Erro ao buscar psicólogos');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      subject,
      message,
      usuario_id: selectedPsychologist.usuario_id,
    };
    try {
      if (selectedMessage) {
        await api.put(
          `/clinic-messages/${selectedMessage.message_id}`,
          formData
        );
        toast.success('Mensagem editada com sucesso!');
      } else {
        await api.post('/clinic-messages/', formData);
        toast.success('Mensagem adicionada com sucesso!');
      }
      fetchMessages();
      handleClose();
    } catch (error) {
      toast.error('Ocorreu um erro ao adicionar a mensagem no mural');
    }
  };

  useEffect(() => {
    if (psychologists.length < 1 && clinicaId) {
      fetchPsychologists();
    }

    if (selectedMessage) {
      setMessage(selectedMessage.message);
      setSubject(selectedMessage.subject);
      setSelectedPsychologist(
        psychologists.find(
          (psychologist) =>
            psychologist.nome_usuario === selectedMessage.receiver
        )
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
      <DialogTitle>
        {selectedMessage ? 'Editar mensagem' : 'Adicionar mensagem ao mural'}
      </DialogTitle>
      <DialogContent>
        <Grid
          container
          spacing={2}
          marginTop={0.5}
          component="form"
          onSubmit={handleSubmit}
        >
          <Grid item md={6} xs={12}>
            <FormControl fullWidth>
              <InputLabel>Selecionar Psicólogo</InputLabel>
              <Select
                label="Selecionar Psicólogo"
                id="psychologist"
                value={selectedPsychologist}
                onChange={(event) =>
                  setSelectedPsychologist(event.target.value)
                }
                MenuProps={MenuProps}
              >
                {psychologists.map((item) => {
                  return (
                    <MenuItem key={item.usuario_id} value={item}>
                      {item.nome_usuario}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl variant="outlined" fullWidth required>
              <InputLabel>Assunto</InputLabel>
              <OutlinedInput
                id="subject"
                label="Assunto"
                name="subject"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                autoFocus
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={12}>
            <FormControl variant="outlined" fullWidth required>
              <InputLabel>Mensagem</InputLabel>
              <OutlinedInput
                id="message"
                name="message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                label="Mensagem"
                multiline
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <DialogActions>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button type="submit">
                {selectedMessage ? 'Editar mensagem' : 'Adicionar ao Mural'}
              </Button>
            </DialogActions>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
