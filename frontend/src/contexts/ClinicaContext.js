import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';  // Certifique-se de que o caminho está correto

// Criar o contexto
export const ClinicaContext = createContext();

// Componente provedor
export const ClinicaProvider = ({ children }) => {
    const [clinica, setClinica] = useState(null);

    useEffect(() => {
        const fetchClinica = async () => {
            try {
                // Obtendo o ID da clínica logada do localStorage
                const clinicaId = localStorage.getItem('clinicaId');  
                if (!clinicaId) {
                    console.error('ID da clínica não encontrado no localStorage');
                    return;
                }
                
                const response = await api.get(`/clinicas/${clinicaId}`);
                setClinica(response.data);
            } catch (error) {
                console.error('Erro ao buscar informações da clínica:', error);
            }
        };

        fetchClinica();
    }, []);

    // Log para depuração
    useEffect(() => {
        console.log('Estado atual da clínica:', clinica);
    }, [clinica]);

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
