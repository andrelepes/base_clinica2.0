import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import AddCardIcon from '@mui/icons-material/AddCard';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import ReplayIcon from '@mui/icons-material/Replay';
import Tooltip from '@mui/material/Tooltip';
import { useAuth } from '../../contexts/AuthContext';
// import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export default function PatientRow({
  patient = {
    paciente_id: null,
    nome_paciente: '',
    status_paciente: '',
    pending_evolutions_count: '',
  },
  onEdit,
  onChangeStatus,
  onInfo,
  onSchedule,
  onPaymentAdd,
  onFolder,
  assignedPsychologists = 'Nenhum psicólogo autorizado',
}) {
  const { tipousuario } = useAuth();
  return (
    <TableRow hover tabIndex={-1} key={patient.paciente_id}>
      <TableCell sx={{ width: 150 }}>
        <Stack direction="row" spacing={1}>
          <IconButton aria-label="edit" onClick={onEdit}>
            <Tooltip title="Editar" arrow disableInteractive>
              <EditIcon />
            </Tooltip>
          </IconButton>
          <IconButton aria-label="change-status" onClick={onChangeStatus}>
            <Tooltip
              title={
                patient.status_paciente === 'ativo' ? 'Inativar' : 'Ativar'
              }
              arrow
              disableInteractive
            >
              {patient.status_paciente === 'ativo' ? (
                <DeleteIcon color="error" />
              ) : (
                <ReplayIcon color="warning" />
              )}
            </Tooltip>
          </IconButton>
          {tipousuario !== 'secretario_vinculado' && (
            <>
              <IconButton aria-label="folder" onClick={onFolder}>
                <Tooltip title="Pasta do paciente" arrow disableInteractive>
                  <ContentPasteIcon color="success" />
                </Tooltip>
              </IconButton>
              <IconButton aria-label="card" onClick={onPaymentAdd}>
                <Tooltip title="Adicionar cobrança" arrow disableInteractive>
                  <AddCardIcon color="warning" />
                </Tooltip>
              </IconButton>
            </>
          )}
          <IconButton aria-label="info" onClick={onInfo}>
            <Tooltip title="Informações do paciente" arrow disableInteractive>
              <InfoIcon color="primary" />
            </Tooltip>
          </IconButton>
          {/* <IconButton aria-label="schedule" onClick={onSchedule}>
            <Tooltip title="Agendar horário" arrow disableInteractive>
              <CalendarMonthIcon color="success" />
            </Tooltip>
          </IconButton> */}
        </Stack>
      </TableCell>
      <TableCell>{patient.nome_paciente}</TableCell>
      <TableCell>{patient.status_paciente}</TableCell>
      <TableCell>{assignedPsychologists}</TableCell>
      <TableCell>{patient.pending_evolutions_count}</TableCell>
    </TableRow>
  );
}
