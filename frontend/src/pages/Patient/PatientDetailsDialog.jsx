import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import PatientDetailCard from '../../components/Patients/PatientDetailCard';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

export default function PatientDetailsDialog({
  open,
  setOpen,
  selectedPatient,
  setSelectedPatient,
  changeStatusFunction
}) {
  const [paciente, setPaciente] = useState({});
  const { usuarioId: usuario_id } = useAuth();

  const handleClose = () => {
    setOpen(false);
    setSelectedPatient(null);
  };

  useEffect(() => {
    if (open) {
      setPaciente(selectedPatient);
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
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Informações do Paciente
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
        <PatientDetailCard
          handleChangeStatus={changeStatusFunction}
          patient={paciente}
        />
      </DialogContent>
    </Dialog>
  );
}
