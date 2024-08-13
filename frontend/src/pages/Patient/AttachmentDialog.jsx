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
import Chip from '@mui/material/Chip';
import { MuiFileInput } from 'mui-file-input';
import { toast } from 'react-toastify';

import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export default function AttachementDialog({
  open,
  setOpen,
  selectedRecord,
  setSelectedRecord,
  fetchEvolutions,
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
      fetchEvolutions();
      handleClose();
    } catch (error) {
      toast.error('Ocorreu um erro ao enviar o arquivo');
    }
  };
  const handleDownload = async (archive) => {
    try {
      const response = await api.get(
        `/evolutions/archive/${archive.archive_id}`,
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', archive.archive_name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error('Ocorreu um erro ao baixar o arquivo');
    }
  };

  const handleDelete = async (archive) => {
    try {
      await api.delete(`/evolutions/archive/${archive.archive_id}`);
      toast.success('Arquivo excluído com sucesso!');
      fetchEvolutions();
      handleClose();
    } catch (error) {
      toast.error('Ocorreu um erro ao excluir o arquivo');
    }
  };
  return (
    <Dialog open={open} onClose={handleClose} keepMounted>
      <AppBar sx={{ position: 'relative', bgcolor: 'primary.main' }}>
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {selectedRecord?.archive?.length > 0
              ? usuarioId === selectedRecord?.usuario_id
                ? 'Reenviar ou Baixar'
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
        {selectedRecord?.archive?.length > 0
          ? selectedRecord.archive.map((archive) => (
              <Chip
                variant="outlined"
                label={archive.archive_name}
                onClick={() => handleDownload(archive)}
                sx={{ marginBottom: '16px', marginRight: '16px' }}
                icon={<CloudDownloadIcon />}
                onDelete={
                  usuarioId === selectedRecord?.usuario_id
                    ? () => {
                        handleDelete(archive);
                      }
                    : ''
                }
              />
            ))
          : usuarioId !== selectedRecord?.usuario_id && (
              <Typography>
                Não existe nenhum arquivo para esta evolução
              </Typography>
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
