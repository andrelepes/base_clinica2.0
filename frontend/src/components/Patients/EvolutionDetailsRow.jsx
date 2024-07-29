import { useState } from 'react';
import {
  attendedOptions,
  moodStates,
  punctualityOptions,
} from '../../utils/formTypes';

import IconButton from '@mui/material/IconButton';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import HistoryIcon from '@mui/icons-material/History';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import dayjs from 'dayjs';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../../contexts/AuthContext';

export default function EvolutionDetailsRow({
  evolution,
  onEdit,
  onInfo,
  onHistory,
}) {
  const {
    arrival_mood_state,
    session_date,
    departure_mood_state,
    evolution_status,
    attendance_status,
    punctuality_status,
    analysis_intervention,
    next_session_plan,
    therapist_notes,
    usuario_id,
  } = evolution;

  const { usuarioId, tipousuario } = useAuth();

  // const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <Stack direction="row" spacing={1}>
            <IconButton
              aria-label="edit"
              onClick={onEdit}
              disabled={usuarioId !== usuario_id}
            >
              <Tooltip title="Editar Evolução" arrow disableInteractive>
                <EditIcon />
              </Tooltip>
            </IconButton>

            <IconButton aria-label="info" onClick={onInfo}>
              <Tooltip title="Ver Evolução" arrow disableInteractive>
                <VisibilityIcon color="primary" />
              </Tooltip>
            </IconButton>
            {tipousuario === 'clinica' && (
              <IconButton aria-label="history" onClick={onHistory}>
                <Tooltip
                  title="Ver Histórico de alterações da Evolução"
                  arrow
                  disableInteractive
                >
                  <HistoryIcon color="success" />
                </Tooltip>
              </IconButton>
            )}
          </Stack>
        </TableCell>
        <TableCell component="th" scope="row">
          {dayjs(session_date).format('DD/MM/YYYY')}
        </TableCell>
        <TableCell align="left">
          <Rating
            value={
              arrival_mood_state &&
              moodStates.find((mood) => mood.id === arrival_mood_state)?.value
            }
            readOnly
            sx={{ verticalAlign: 'bottom' }}
          />{' '}
          {arrival_mood_state && (
            <Typography variant="h">
              {moodStates.find((mood) => mood.id === arrival_mood_state)?.title}
            </Typography>
          )}
        </TableCell>
        <TableCell align="left">
          <Rating
            value={
              departure_mood_state &&
              moodStates.find((mood) => mood.id === departure_mood_state)?.value
            }
            readOnly
            sx={{ verticalAlign: 'bottom' }}
          />{' '}
          {departure_mood_state && (
            <Typography variant="h">
              {
                moodStates.find((mood) => mood.id === departure_mood_state)
                  ?.title
              }
            </Typography>
          )}
        </TableCell>
        <TableCell>{evolution_status ? 'Feita' : 'Pendente'}</TableCell>
      </TableRow>
      {/* <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Detalhes
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Pontualidade e Comprometimento</TableCell>
                    <TableCell>Análise e intervenção realizada</TableCell>
                    <TableCell>O que ficou para a próxima sessão</TableCell>
                    <TableCell>Notas/Comentários do psicoterapeuta</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      {attendance_status &&
                        attendedOptions[attendance_status].title}{' '}
                      {punctuality_status &&
                        punctualityOptions[punctuality_status].title}
                    </TableCell>
                    <TableCell>{analysis_intervention}</TableCell>
                    <TableCell>{next_session_plan}</TableCell>
                    <TableCell>{therapist_notes}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow> */}
    </>
  );
}
