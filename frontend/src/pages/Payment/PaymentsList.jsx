import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ReceiptIcon from '@mui/icons-material/Receipt';
import TableContainer from '@mui/material/TableContainer';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { useState } from 'react';
import PaymentInfo from './PaymentInfo';
import dayjs from 'dayjs';
import Info from '../../components/Payments/Info';

const statusEnum = {
  pending: 'Pendente',
  approved: 'Aprovado',
  rejected: 'Rejeitado',
  cancelled: 'Cancelado',
};

function PatientRows({ total, count, nome_paciente, nome_psicologo, payments }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TableRow
        sx={{
          '& > *': { borderBottom: 'unset' },
          backgroundColor:
            payments.payment_status === 'pending' ? 'orangered' : 'lightgreen',
        }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell>{nome_paciente}</TableCell>
        <TableCell>{nome_psicologo ?? 'Não informado'}</TableCell>
        <TableCell>{dayjs(payments.expires_in).format('DD/MM/YYYY')}</TableCell>

      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Detalhe do Pagamento
              </Typography>
              <Paper>
                <Info
                  amount={payments.price}
                  patient_name={nome_paciente}
                  pix_code={payments.payment_code}
                  pix_url={payments.payment_url}
                  qr_code={payments.payment_qr_code}
                  status={payments.payment_status}
                />
              </Paper>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

function MonthRows({ mes, total, count, patients, number }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TableRow
        sx={{
          '& > *': {
            borderBottom: 'unset',
            backgroundColor: number % 2 ? 'lightgray' : 'lightblue',
          },
        }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell sx={{ maxWidth: '80%', width: 1 }}>{mes}</TableCell>
        <TableCell>
          {total.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box>
              <Typography variant="h6" gutterBottom component="div">
                Pagamentos Realizados
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Nome do paciente</TableCell>
                    <TableCell>Psicólogo Responsável</TableCell>
                    <TableCell>Data de Expiração</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patients.filter(
                    (item) => item.dados_pagamento.payment_status !== 'pending'
                  ).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        Sem registros
                      </TableCell>
                    </TableRow>
                  ) : (
                    patients.map((item) => {
                      if (item.dados_pagamento.payment_status === 'pending') {
                        return null;
                      }
                      return (
                        <PatientRows
                          key={item.nome_paciente}
                          count={item.count_pagamentos_paciente}
                          total={item.total_price_paciente}
                          nome_paciente={item.nome_paciente}
                          payments={item.dados_pagamento}
                          nome_psicologo={item.nome_psicologo}
                        />
                      );
                    })
                  )}
                </TableBody>
              </Table>
              <Typography variant="h6" gutterBottom component="div">
                Pagamentos Não Realizados
              </Typography>
              <Table
                size="small"
                aria-label="purchases"
                sx={{ marginBottom: 5 }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Nome do paciente</TableCell>
                    <TableCell>Psicólogo Responsável</TableCell>
                    <TableCell>Data de Expiração</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patients.filter(
                    (item) => item.dados_pagamento.payment_status === 'pending'
                  ).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        Sem registros
                      </TableCell>
                    </TableRow>
                  ) : (
                    patients.map((item) => {
                      if (item.dados_pagamento.payment_status !== 'pending') {
                        return null; // Retorna null em vez de undefined para não renderizar nada
                      }
                      return (
                        <PatientRows
                          key={item.nome_paciente}
                          count={item.count_pagamentos_paciente}
                          total={item.total_price_paciente}
                          nome_paciente={item.nome_paciente}
                          payments={item.dados_pagamento}
                          nome_psicologo={item.nome_psicologo}
                        />
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

function YearRows({ year, total, count, meses }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell sx={{ width: 50 }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell sx={{ maxWidth: '80%', width: 1 }}>{year}</TableCell>
        <TableCell>
          {total.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Mês</TableCell>
                    <TableCell>Total Mensal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {meses.map((item, index) => (
                    <MonthRows
                      number={index}
                      key={item.mes}
                      count={item.count_pagamentos_mes}
                      total={item.total_price_mes}
                      mes={item.mes}
                      patients={item.pacientes}
                    />
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function PaymentsList() {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isOpenPaymentInfo, setIsOpenPaymentInfo] = useState(false);

  const fetchPreferences = async () => {
    try {
      const response = await api.get('/payment/getallpayments/year');

      setPayments(response.data[0].resultado);
    } catch (error) {
      toast.error('Opa, algo errado aconteceu');
    }
  };

  const handlePaymentInfo = (payment) => {
    setSelectedPayment(payment);
    setIsOpenPaymentInfo(true);
  };
  let isMounted = false;
  useEffect(() => {
    if (isMounted) {
      fetchPreferences();
    }
    isMounted = true;
  }, []);
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
            variant="h4"
            id="title"
            component="div"
          >
            Listagem de pagamentos
          </Typography>
        </Toolbar>
        {payments.length > 0 && (
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Ano</TableCell>
                  <TableCell>Total Anual</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((payment) => (
                  <YearRows
                    key={payment.ano}
                    count={payment.count_pagamentos_ano}
                    total={payment.total_price_ano}
                    year={payment.ano}
                    meses={payment.meses}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
      <PaymentInfo
        open={isOpenPaymentInfo}
        setOpen={setIsOpenPaymentInfo}
        selectedPayment={selectedPayment}
        setSelectedPayment={setSelectedPayment}
      />
    </Box>
  );
}
