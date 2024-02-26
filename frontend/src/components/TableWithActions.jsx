import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';

import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Box from '@mui/material/Box';
import TableBody from '@mui/material/TableBody';
import Stack from '@mui/material/Stack';

export default function TableWithActions({
  title,
  fields = [{ title: '', dataTitle: '' }],
  data = [],
  addFunction,
  editFunction,
  deleteFunction,
  infoFunction,
  addIcon = <AddIcon />,
  editIcon = <EditIcon />,
  deleteIcon = <DeleteIcon />,
  infoIcon = <InfoIcon />,
}) {
  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
          }}
        >
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h"
            id="tableTitle"
            component="div"
          >
            {title}
          </Typography>

          <Tooltip title={`Adicionar ${title}`} disableInteractive>
            <IconButton onClick={addFunction}>{addIcon}</IconButton>
          </Tooltip>
        </Toolbar>
        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow>
                {fields.map((fieldHead) => (
                  <TableCell key={fieldHead.title}>{fieldHead.title}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, index) => (
                <TableRow hover tabIndex={-1} key={`${title}${index}`}>
                  {fields.map((field) => {
                    if (field.dataTitle === 'acoes') {
                      return (
                        <TableCell sx={{ width: 150 }} key={field.dataTitle}>
                          <Stack direction="row" spacing={1}>
                            <IconButton
                              aria-label="edit"
                              onClick={editFunction}
                            >
                              <Tooltip title="Editar" arrow disableInteractive>
                                {editIcon}
                              </Tooltip>
                            </IconButton>
                            <IconButton
                              aria-label="delete"
                              onClick={deleteFunction}
                            >
                              <Tooltip title="Excluir" arrow disableInteractive>
                                {deleteIcon}
                              </Tooltip>
                            </IconButton>
                            <IconButton
                              aria-label="info"
                              onClick={infoFunction}
                            >
                              <Tooltip
                                title="Detalhes"
                                arrow
                                disableInteractive
                              >
                                {infoIcon}
                              </Tooltip>
                            </IconButton>
                          </Stack>
                        </TableCell>
                      );
                    } else {
                      return (
                        <TableCell key={field.dataTitle} sx={{maxWidth: field.maxWidth, overflow: field.overflow}}>
                          {item[field.dataTitle]}
                        </TableCell>
                      );
                    }
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
