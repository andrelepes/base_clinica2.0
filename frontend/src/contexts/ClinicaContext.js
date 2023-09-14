import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';  // Certifique-se de que o caminho está correto
import { useClinicaId } from './ClinicaIdContext';  // Importe o hook useClinicaId

// Criar o contexto
export const ClinicaContext = createContext();

// Componente provedor
export const ClinicaProvider = ({ children }) => {
    const [clinica, setClinica] = useState(null);
    const { clinicaId } = useClinicaId();  // Use o hook useClinicaId

    useEffect(() => {
        const fetchClinica = async () => {
            try {
                if (!clinicaId) {
                    console.error('ID da clínica não encontrado no contexto');
                    return;
                }
                
                const response = await api.get(`/usuarios/${clinicaId}`);
                setClinica(response.data);
            } catch (error) {
                console.error('Erro ao buscar informações da clínica:', error);
            }
        };
    
        if (clinicaId) {
            fetchClinica();
        }
    }, [clinicaId]);

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

