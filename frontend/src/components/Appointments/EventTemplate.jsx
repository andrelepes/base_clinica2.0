import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import Tooltip from '@mui/material/Tooltip';

export default function EventTemplate(props) {
  return (
    <Card
      sx={{
        maxHeight: 'auto',
        width: 'auto',
        minWidth: 280,
        overflow: 'scroll',
        scrollbarWidth: 'none',
        display: 'flex',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent>
          <Box
            sx={{
              maxHeight: 80,
              mt: -1.5,
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <Box>
              <Typography sx={{ fontSize: 14 }} color="text.secondary">
                {props.nome_consultorio}
              </Typography>
              <Typography sx={{ fontSize: 18 }}>
                {props.nome_usuario}
                <br />
                {props.nome_paciente}
              </Typography>
            </Box>
          </Box>
        </CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
          <Typography
            sx={{
              mx: 1,
              mr: 2,
              backgroundColor: 'middleGreen.main',
              maxHeight: 50,
              pr: 0.5,
              pl: 0.5,
              borderRadius: 1.5,
            }}
            color="primary"
          >
            {props.start}
            <br />
            {props.end}
          </Typography>
          <Stack direction="row" spacing={0}>
            <IconButton aria-label="reschedule" onClick={props.onReschedule}>
              <Tooltip title="Remarcar Consulta" arrow disableInteractive>
                <EditCalendarIcon color="primary" />
              </Tooltip>
            </IconButton>
            <IconButton aria-label="delete" onClick={props.onDelete}>
              <Tooltip title="Desmarcar Consulta" arrow disableInteractive>
                <EventBusyIcon color="error" />
              </Tooltip>
            </IconButton>
            <IconButton aria-label="cascade" onClick={props.onCascade}>
              <Tooltip title="Cancelar recorrência" arrow disableInteractive>
                <DeleteSweepIcon color="error" />
              </Tooltip>
            </IconButton>
          </Stack>
        </Box>
      </Box>
    </Card>
  );
}
