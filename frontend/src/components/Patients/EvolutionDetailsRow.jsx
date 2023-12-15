import { useState } from 'react';
import {
  attendedOptions,
  moodStates,
  punctualityOptions,
} from '../../utils/formTypes';

import IconButton from '@mui/material/IconButton';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import Rating from '@mui/material/Rating';
import dayjs from 'dayjs';

export default function EvolutionDetailsRow({ evolution }) {
  const {
    attendance_status,
    punctuality_status,
    arrival_mood_state,
    session_date,
    analysis_intervention,
    next_session_plan,
    departure_mood_state,
    therapist_notes,
    evolution_status
  } = evolution;

  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {dayjs(session_date).format('DD/MM/YYYY')}
        </TableCell>
        <TableCell align="left">
          <Rating value={moodStates[arrival_mood_state].value} readOnly />{' '}
          {moodStates[arrival_mood_state].title}
        </TableCell>
        <TableCell align="left">
          <Rating value={moodStates[departure_mood_state].value} readOnly />{' '}
          {moodStates[departure_mood_state].title}
        </TableCell>
        <TableCell>{evolution_status ? 'Feita' : 'Pendente'}</TableCell>
      </TableRow>
      <TableRow>
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
                      {attendedOptions[attendance_status].title}{' '}
                      {punctualityOptions[punctuality_status].title}
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
      </TableRow>
    </>
  );
}
