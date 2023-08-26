import React, { useState, useEffect } from 'react';
import api from 'C:/Users/andre/base_clinica/frontend/src/services/api';

function Agenda() {
    const [agendamentos, setAgendamentos] = useState([]);

    useEffect(() => {
        const fetchAgendamentos = async () => {
            try {
                const response = await api.get('/api/agendamentos');
                setAgendamentos(response.data);
            } catch (error) {
                console.error('Erro ao buscar agendamentos', error);
            }
        };

        fetchAgendamentos();
    }, []);

    return (
        <div>
            <h2>Agenda</h2>
            <ul>
                {agendamentos.map(agendamento => (
                    <li key={agendamento.id}>
                        Data e Hora: {agendamento.data_hora.split('T')[0]} {agendamento.data_hora.split('T')[1].split('.')[0]}
                        <br />Paciente ID: {agendamento.paciente_id}
                        <br />Psicólogo ID: {agendamento.psicologo_id}
                        <br />Status: {agendamento.status}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Agenda;
