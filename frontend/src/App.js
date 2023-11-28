import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import { router } from './routes';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { Theme } from './styles/theme';

function App() {
  const token = localStorage.getItem('token');

  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <RouterProvider router={router} />
      <ToastContainer autoClose={3000} />
    </ThemeProvider>
  );
}

export default App;
