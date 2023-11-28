import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import Tooltip from '@mui/material/Tooltip';

export default function PatientRow({
  patient = {
    paciente_id: null,
    nome_paciente: '',
    status_paciente: '',
  },
  onEdit,
  onDelete,
  onInfo,
  assignedPsychologists = 'Nenhum psicólogo autorizado',
}) {
  return (
    <TableRow
      hover
      tabIndex={-1}
      key={patient.paciente_id}
    >
      <TableCell>
        <Stack direction="row" spacing={1}>
          <IconButton aria-label="edit" onClick={onEdit}>
            <Tooltip title="Editar" arrow disableInteractive>
              <EditIcon />
            </Tooltip>
          </IconButton>
          <IconButton aria-label="delete" onClick={onDelete}>
            <Tooltip title="Excluir" arrow disableInteractive>
              <DeleteIcon color="error" />
            </Tooltip>
          </IconButton>
          <IconButton aria-label="info" onClick={onInfo}>
            <Tooltip title="Informações do paciente" arrow disableInteractive>
              <InfoIcon color="primary" />
            </Tooltip>
          </IconButton>
        </Stack>
      </TableCell>
      <TableCell
        component="th"
        id={patient.paciente_id}
        scope="row"
        padding="normal"
      >
        {patient.nome_paciente}
      </TableCell>
      <TableCell align="center">{patient.status_paciente}</TableCell>
      <TableCell align="center">{assignedPsychologists}</TableCell>
    </TableRow>
  );
}
