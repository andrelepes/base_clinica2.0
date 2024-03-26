import { createTheme } from '@mui/material/styles';
import { ptBR } from '@mui/material/locale';

export const Theme = createTheme(
  {
    palette: {
      primary: { main: '#156AED' },
      principal: { main: '#1FD0E0' },
      middleBlue: { main: '#16A9F7' },
      middleGreen: { main: '#16F7CC' },
      success: { main: '#15ED86' },
    },
    shape: {
      borderRadius: 6,
    },
  },
  ptBR
);
