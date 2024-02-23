import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import Tooltip from '@mui/material/Tooltip';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export default function PatientRow({
  patient = {
    paciente_id: null,
    nome_paciente: '',
    status_paciente: '',
    pending_evolutions_count: '',
  },
  onEdit,
  onDelete,
  onInfo,
  onSchedule,
  assignedPsychologists = 'Nenhum psicólogo autorizado',
}) {
  return (
    <TableRow hover tabIndex={-1} key={patient.paciente_id}>
      <TableCell sx={{ width: 150 }}>
        <Stack direction="row" spacing={1}>
          <IconButton aria-label="edit" onClick={onEdit}>
            <Tooltip title="Editar" arrow disableInteractive>
              <EditIcon />
            </Tooltip>
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={onDelete}
            disabled={patient.status_paciente === 'inativo'}
          >
            <Tooltip title="Excluir" arrow disableInteractive>
              <DeleteIcon
                color={
                  patient.status_paciente === 'inativo' ? 'disabled' : 'error'
                }
              />
            </Tooltip>
          </IconButton>
          <IconButton aria-label="info" onClick={onInfo}>
            <Tooltip title="Informações do paciente" arrow disableInteractive>
              <InfoIcon color="primary" />
            </Tooltip>
          </IconButton>
          <IconButton aria-label="schedule" onClick={onSchedule}>
            <Tooltip title="Agendar horário" arrow disableInteractive>
              <CalendarMonthIcon color="success" />
            </Tooltip>
          </IconButton>
        </Stack>
      </TableCell>
      <TableCell>{patient.nome_paciente}</TableCell>
      <TableCell>{patient.status_paciente}</TableCell>
      <TableCell>{assignedPsychologists}</TableCell>
      <TableCell>{patient.pending_evolutions_count}</TableCell>
    </TableRow>
  );
}
