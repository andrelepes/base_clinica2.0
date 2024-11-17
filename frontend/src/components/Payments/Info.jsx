import Typography from '@mui/material/Typography';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
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
export default function Info({
  patient_name,
  amount,
  status,
  qr_code,
  pix_code,
  pix_url,
}) {
  const [phone, setPhone] = useState('');
  return (
    <>
      <Box sx={{ padding: 1 }}>
        <Typography>Título do pagamento: Consulta de {patient_name}</Typography>
        <Typography>
          Valor:{' '}
          {amount.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </Typography>
        <Typography>Status: {statusEnum[status]}</Typography>
      </Box>

      <Box>
        {status === 'pending' && (
          <Paper sx={{ padding: 1, paddingBottom: 3 }}>
            <Typography>Pagar agora:</Typography>
            <Grid container>
              <Grid item md={4}>
                <img src={`data:image/png;base64,${qr_code}`} width={200} />
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
                  defaultValue={pix_code}
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
                    `Olá ${patient_name},\nSegue o código Pix para os atendimentos do mês: \n${pix_url}`
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
        )}
      </Box>
    </>
  );
}
