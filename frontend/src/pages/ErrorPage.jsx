import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link, useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: '100vh',
        minWidth: '100vw',
        bgcolor: 'principal.main',
      }}
    >
      <Typography variant="h1" style={{ color: 'white' }}>
        {error.status} :/
      </Typography>
      <Typography variant="h6" style={{ color: 'white' }}>
        Ocorreu um erro ao acessar a página.
      </Typography>
      <Link to="/">
        <Button variant="contained">Ir ao Início</Button>
      </Link>
    </Box>
  );
}
