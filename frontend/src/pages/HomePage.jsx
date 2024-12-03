import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TableWithActions from '../components/TableWithActions';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import PostAddIcon from '@mui/icons-material/PostAdd';
import SendMessageForm from './Clinic/SendMessageForm';

export default function HomePage() {
  const [messages, setMessages] = useState([]);
  const [isOpenMessageForm, setIsOpenMessageForm] = useState(false);
  const { tipousuario, user } = useAuth();

  const fetchMessages = async () => {
    try {
      if (tipousuario === 'clinica') {
        const response = await api.get('/clinic-messages/clinic');
        setMessages(response.data);
      } else {
        const response = await api.get('/clinic-messages/');
        setMessages(response.data);
      }
    } catch (error) {
      toast.error('Não foi possível carregar as mensagens');
    }
  };
  useEffect(() => {
    if (tipousuario) {
      fetchMessages();
    }
  }, [tipousuario]);

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
          }}
        >
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h4"
            id="tableTitle"
            component="div"
          >
            Bem vindo {user?.nome_usuario}
          </Typography>

          {tipousuario === 'clinica' && (
            <Tooltip title="Adicionar Mensagem" disableInteractive>
              <IconButton onClick={() => setIsOpenMessageForm(true)}>
                <PostAddIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
        <TableWithActions
          title={'Confira seu mural de mensagens'}
          data={messages}
          emptyMessage="Nenhuma mensagem foi recebida"
          fields={[
            {
              title: 'Destinatário',
              dataTitle: 'receiver',
            },
            {
              title: 'Assunto',
              dataTitle: 'subject',
            },
            {
              title: 'Mensagem',
              dataTitle: 'message',
            },
            {
              title: 'Enviado em',
              dataTitle: 'created_at',
            },
          ]}
        />
      </Paper>
      {tipousuario === 'clinica' && (
        <SendMessageForm
          open={isOpenMessageForm}
          setOpen={setIsOpenMessageForm}
          fetchMessages={fetchMessages}
        />
      )}
    </Box>
  );
}
