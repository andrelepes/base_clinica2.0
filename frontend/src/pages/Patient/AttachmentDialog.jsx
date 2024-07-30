import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { MuiFileInput } from 'mui-file-input';
import { toast } from 'react-toastify';

import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function AttachementDialog({
  open,
  setOpen,
  selectedRecord,
  setSelectedRecord,
}) {
  const [archive, setArchive] = useState(null);

  const { usuarioId } = useAuth();

  const handleClose = () => {
    setOpen(false);
    setArchive(null);
    setSelectedRecord(null);
  };
  const handleChange = (newFile) => {
    setArchive(newFile);
  };
  const handleSend = async () => {
    try {
      const formData = new FormData();
      formData.append('archive', archive);
      await api.put(
        `/evolutions/archive/${selectedRecord.evolution_id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast.success('Arquivo enviado com sucesso!');
    } catch (error) {
      toast.error('Ocorreu um erro ao enviar o arquivo');
    }
  };
  const handleDownload = async () => {
    try {
      const response = await api.get(
        `/evolutions/archive/${selectedRecord.archive.archive_id}`,
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', selectedRecord.archive.archive_name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error('Ocorreu um erro ao baixar o arquivo');
    }
  };
  return (
    <Dialog open={open} onClose={handleClose} keepMounted>
      <AppBar sx={{ position: 'relative', bgcolor: 'primary.main' }}>
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {selectedRecord?.archive?.archive_id
              ? usuarioId === selectedRecord?.usuario_id
                ? 'Reenviar'
                : 'Baixar'
              : 'Enviar'}{' '}
            arquivo
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent>
        {selectedRecord?.archive?.archive_id ? (
          <Button
            component="label"
            variant="contained"
            tabIndex={-1}
            onClick={handleDownload}
          >
            {selectedRecord.archive.archive_name}
            <CloudDownloadIcon
              sx={{ marginBottom: '3px', marginLeft: '8px' }}
            />
          </Button>
        ) : (
          usuarioId !== selectedRecord?.usuario_id && (
            <Typography>
              Não existe nenhum arquivo para esta evolução
            </Typography>
          )
        )}

        {usuarioId === selectedRecord?.usuario_id && (
          <MuiFileInput
            value={archive}
            onChange={handleChange}
            placeholder="Selecionar arquivo"
            variant="outlined"
            InputProps={{
              startAdornment: <CloudUploadIcon />,
            }}
          />
        )}
      </DialogContent>
      {usuarioId === selectedRecord?.usuario_id && (
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button autoFocus onClick={handleSend} disabled={!archive}>
            Enviar
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
