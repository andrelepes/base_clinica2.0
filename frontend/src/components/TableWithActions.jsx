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
import TableSortLabel from '@mui/material/TableSortLabel';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import Box from '@mui/material/Box';
import TableBody from '@mui/material/TableBody';
import Stack from '@mui/material/Stack';
import { useState, useMemo } from 'react';
import { getComparator, stableSort } from '../utils/sortFunctions';
import { visuallyHidden } from '@mui/utils';

export default function TableWithActions({
  title,
  fields = [{ title: '', dataTitle: '', filterable: false }],
  data = [],
  addFunction,
  editFunction,
  deleteFunction,
  infoFunction,
  addIcon = <AddIcon />,
  editIcon = <EditIcon />,
  deleteIcon = <DeleteIcon color="error" />,
  infoIcon = <InfoIcon color="info" />,
}) {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const visibleRows = useMemo(
    () =>
      stableSort(data, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [data, page, rowsPerPage, order, orderBy]
  );

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data?.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property) => (event) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

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

          {addFunction && (
            <Tooltip title={`Adicionar ${title}`} disableInteractive>
              <IconButton onClick={addFunction}>{addIcon}</IconButton>
            </Tooltip>
          )}
        </Toolbar>
        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow>
                {fields.map((fieldHead) => {
                  return fieldHead.filterable ? (
                    <TableCell
                      sortDirection={
                        orderBy === fieldHead.dataTitle ? order : false
                      }
                      key={fieldHead.title}
                    >
                      <TableSortLabel
                        active={orderBy === fieldHead.dataTitle}
                        direction={
                          orderBy === fieldHead.dataTitle ? order : 'asc'
                        }
                        onClick={handleRequestSort(fieldHead.dataTitle)}
                      >
                        {fieldHead.title}
                        {orderBy === fieldHead.dataTitle ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === 'desc'
                              ? 'sorted descending'
                              : 'sorted ascending'}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>
                  ) : (
                    <TableCell key={fieldHead.title}>
                      {fieldHead.title}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.map((item, index) => (
                <TableRow hover tabIndex={-1} key={`${title}${index}`}>
                  {fields.map((field) => {
                    if (field.dataTitle === 'acoes') {
                      return (
                        <TableCell sx={{ width: 'auto' }} key={field.dataTitle}>
                          <Stack direction="row" spacing={1}>
                            {editFunction && (
                              <IconButton
                                aria-label="edit"
                                onClick={() => editFunction(item)}
                              >
                                <Tooltip
                                  title="Editar"
                                  arrow
                                  disableInteractive
                                >
                                  {editIcon}
                                </Tooltip>
                              </IconButton>
                            )}
                            {deleteFunction && (
                              <IconButton
                                aria-label="delete"
                                onClick={() => deleteFunction(item)}
                              >
                                <Tooltip
                                  title="Excluir"
                                  arrow
                                  disableInteractive
                                >
                                  {deleteIcon}
                                </Tooltip>
                              </IconButton>
                            )}
                            {infoFunction && (
                              <IconButton
                                aria-label="info"
                                onClick={() => infoFunction(item)}
                              >
                                <Tooltip
                                  title="Detalhes"
                                  arrow
                                  disableInteractive
                                >
                                  {infoIcon}
                                </Tooltip>
                              </IconButton>
                            )}
                          </Stack>
                        </TableCell>
                      );
                    } else {
                      return (
                        <TableCell
                          key={field.dataTitle}
                          sx={{
                            maxWidth: field.maxWidth,
                            overflow: field.overflow,
                          }}
                        >
                          {item[field.dataTitle]}
                        </TableCell>
                      );
                    }
                  })}
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 73 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[
                    5,
                    10,
                    25,
                    { label: 'Todas', value: -1 },
                  ]}
                  count={data?.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
