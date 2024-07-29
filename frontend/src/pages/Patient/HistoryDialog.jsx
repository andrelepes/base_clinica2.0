import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import TableWithActions from '../../components/TableWithActions';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
export default function HistoryDialog({ recordType, open, setOpen, record }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (open) {
      if (record?.length > 0) {
        const partial = record.map((item) => {
          const data_modificada = dayjs(item.data_atualizacao).format(
            'DD/MM/YYYY [às] HH:mm:ss'
          );
          return { ...item, data_modificada };
        });
        setData(partial);
      }
    }
  }, [record, open]);
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Dialog open={open} onClose={handleClose} keepMounted>
      <AppBar sx={{ position: 'relative', bgcolor: 'primary.main' }}>
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Histórico da {recordType}
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
        {record?.length > 0 ? (
          <TableWithActions
            fields={[
              {
                title: 'Modificado por:',
                dataTitle: 'nome_modificador',
                maxWidth: 100,
                overflow: 'hidden',
                filterable: true,
              },
              {
                title: 'Data da modificação',
                dataTitle: 'data_modificada',
                maxWidth: 50,
                overflow: 'hidden',
                filterable: true,
              },
            ]}
            data={data}
          />
        ) : (
          <Typography>Não existem modificações para este registro.</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}
