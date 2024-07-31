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
}) {
  const [paciente, setPaciente] = useState({});
  const { usuarioId: usuario_id } = useAuth();

  const handleClose = () => {
    setOpen(false);
    setSelectedPatient(null);
  };

  const handleChangeStatus = async () => {
    try {
      const updateData = {
        usuario_id,
      };

      if (paciente?.status_paciente === 'ativo') {
        await api.put(
          `/pacientes/${selectedPatient.paciente_id}/inativo`,
          updateData
        );
        setPaciente((prevState) => ({
          ...prevState,
          status_paciente: 'inativo',
        }));
        toast.success('Status do paciente alterado com sucesso!');
      } else if (paciente?.status_paciente === 'inativo') {
        await api.put(
          `/pacientes/${selectedPatient.paciente_id}/ativo`,
          updateData
        ); // Use paciente_id aqui
        setPaciente((prevState) => ({
          ...prevState,
          status_paciente: 'ativo',
        }));
        toast.success('Status do paciente alterado com sucesso!');
      }
    } catch (error) {
      toast.error('Ocorreu um erro ao trocar o status do paciente');
    }
  };

  useEffect(() => {
    if (open) {
      setPaciente(selectedPatient);
    }
  }, [open]);
  return (
    <Dialog open={open} onClose={handleClose} keepMounted>
      <AppBar sx={{ position: 'relative', bgcolor: 'primary.main' }}>
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
          handleChangeStatus={handleChangeStatus}
          patient={paciente}
        />
      </DialogContent>
    </Dialog>
  );
}
