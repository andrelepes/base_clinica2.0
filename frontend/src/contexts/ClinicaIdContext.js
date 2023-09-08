import React, { createContext, useContext, useState } from 'react';

const ClinicaIdContext = createContext();

export const useClinicaId = () => {
  const context = useContext(ClinicaIdContext);
  if (!context) {
    throw new Error('useClinicaId must be used within a ClinicaIdProvider');
  }
  return context;
};

export const ClinicaIdProvider = ({ children }) => {
  const [clinicaId, setClinicaId] = useState(null);  // ou valor inicial
  const value = { clinicaId, setClinicaId };

  return (
    <ClinicaIdContext.Provider value={value}>
      {children}
    </ClinicaIdContext.Provider>
  );
};
