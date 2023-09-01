import React, { createContext, useState, useContext } from 'react';

// Criar o contexto
export const ClinicaContext = createContext();  // <-- Adicionei o export aqui

// Componente provedor
export const ClinicaProvider = ({ children }) => {
    const [clinica, setClinica] = useState(null);

    return (
        <ClinicaContext.Provider value={{ clinica, setClinica }}>
            {children}
        </ClinicaContext.Provider>
    );
};

// Hook personalizado para usar o contexto da clínica
export const useClinica = () => {
    const context = useContext(ClinicaContext);
    if (!context) {
        throw new Error('useClinica deve ser usado dentro de um ClinicaProvider');
    }
    return context;
};
