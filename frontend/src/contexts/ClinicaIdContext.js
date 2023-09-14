import React, { createContext, useContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';

const ClinicaIdContext = createContext();

export const useClinicaId = () => {
  const context = useContext(ClinicaIdContext);
  if (!context) {
    throw new Error('useClinicaId must be used within a ClinicaIdProvider');
  }
  return context;
};

export const ClinicaIdProvider = ({ children }) => {
  const [clinicaId, setClinicaId] = useState(null);
  const [usuarioId, setUsuarioId] = useState(null);

  useEffect(() => {
    const updateClinicaId = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwt_decode(token);
          console.log('Token decodificado:', decoded);

          if (decoded && decoded.user && 'usuario_id' in decoded.user && 'clinica_id' in decoded.user) {
            console.log('usuario_id no token:', decoded.user.usuario_id);
            console.log('clinica_id no token:', decoded.user.clinica_id);

            const newClinicaId = decoded.user.clinica_id;
            const newUsuarioId = decoded.user.usuario_id;

            setClinicaId(newClinicaId);
            setUsuarioId(newUsuarioId);
          } else {
            console.error('Campos não encontrados no token decodificado');
          }
        } catch (error) {
          console.error('Erro ao decodificar o token:', error);
        }
      }
    };

    // Atualizar o clinicaId quando o componente é montado
    updateClinicaId();

    // Atualizar o clinicaId quando o token no armazenamento local muda
    const handleStorageChange = () => {
      updateClinicaId();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const value = { clinicaId, setClinicaId, usuarioId, setUsuarioId };

  return (
    <ClinicaIdContext.Provider value={value}>
      {children}
    </ClinicaIdContext.Provider>
  );
};
