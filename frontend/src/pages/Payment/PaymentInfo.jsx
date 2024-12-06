import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import PhoneInput from '../../components/MaskedInputs/PhoneInput';

const statusEnum = {
  pending: 'Pendente',
  approved: 'Aprovado',
  rejected: 'Rejeitado',
  cancelled: 'Cancelado',
};
export default function PaymentInfo({
  open,
  setOpen,
  selectedPayment,
  setSelectedPayment,
  patient
}) {
  const [payment, setPayment] = useState({});
  const [phone, setPhone] = useState('');

  const handleClose = () => {
    setOpen(false);
    setSelectedPayment(null);
    setPayment(null);
  };

  useEffect(() => {
    if (open) {
      setPayment(selectedPayment);
      setPhone(patient?.telefone_paciente);
    }
  }, [open]);
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      keepMounted
      fullWidth
      maxWidth={'md'}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Informações do Pagamento
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
      {payment && (
        <DialogContent>
          <Typography>
            Título do pagamento: Consulta de {patient.nome_paciente}
          </Typography>
          <Typography>Valor: {payment.price.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}</Typography>
          <Typography>Status: {statusEnum[payment.payment_status]}</Typography>

          <Box>
            <Paper sx={{ padding: 1, paddingBottom: 3 }}>
              <Typography>Pagar agora:</Typography>
              <Grid container>
                <Grid item md={4}>
                  <img
                    src={`data:image/png;base64,${payment.payment_qr_code}`}
                    width={200}
                  />
                </Grid>
                <Grid item md={8}>
                  <PhoneInput
                    value={phone}
                    handleChange={(event) => setPhone(event.target.value)}
                    required
                    label="Telefone"
                    fullWidth
                  />

                  <TextField
                    label="Código Pix"
                    fullWidth
                    defaultValue={payment.payment_code}
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                    multiline
                    sx={{ marginTop: 2 }}
                    disabled
                  />

                  <Button
                    variant="contained"
                    color="success"
                    target="_blank"
                    href={`https://wa.me/55${phone.replace(
                      /\D/g,
                      ''
                    )}?text=${encodeURIComponent(
                      `Olá ${patient.nome_paciente},\nSegue o código Pix para os atendimentos do mês: \n${payment.payment_url}`
                    )}`}
                    fullWidth
                    sx={{ marginTop: 2 }}
                  >
                    Enviar por Whatsapp{' '}
                    <WhatsAppIcon sx={{ marginLeft: 1, marginRight: -1 }} />
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </DialogContent>
      )}
    </Dialog>
  );
}
