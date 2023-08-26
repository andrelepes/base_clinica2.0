import React, { useState, useEffect } from 'react';
import api from 'C:/Users/andre/base_clinica/frontend/src/services/api';
import AddProntuarioForm from './AddProntuarioForm';
import { useParams } from 'react-router-dom';

function formatDate(isoDate) {
    const [year, month, day] = isoDate.split('-');
    return `${day}-${month}-${year}`;
}

function PacienteDetalhes() {
    const [paciente, setPaciente] = useState(null);
    const [prontuarios, setProntuarios] = useState([]);
    const [showProntuarioForm, setShowProntuarioForm] = useState(false);
    const [editProntuarioId, setEditProntuarioId] = useState(null);
    const { id } = useParams();

    const fetchProntuarios = async () => {
        try {
            const response = await api.get(`/pacientes/${id}/prontuarios`);
            setProntuarios(response.data);
        } catch (error) {
            console.error('Erro ao buscar prontuários:', error);
        }
    };

    useEffect(() => {
        const fetchPacienteDetails = async () => {
            try {
                const response = await api.get(`/pacientes/${id}`);
                setPaciente(response.data);
            } catch (error) {
                console.error('Erro ao buscar detalhes do paciente:', error);
            }
        };

        fetchPacienteDetails();
        fetchProntuarios();
    }, [id]);

    const handleNewProntuario = async (prontuarioData) => {
        try {
            if (editProntuarioId) {
                await api.put(`/${editProntuarioId}`, prontuarioData);
                fetchProntuarios();
            } else {
                await api.post('/', {
                    ...prontuarioData,
                    paciente_id: id
                });
                fetchProntuarios();
                setShowProntuarioForm(false);
            }
            setEditProntuarioId(null);
        } catch (error) {
            console.error('Erro ao processar o prontuário:', error);
            alert("Ocorreu um erro ao processar o prontuário.");
        }
    };

    const handleEditProntuario = (prontuarioId) => {
        setShowProntuarioForm(true);
        setEditProntuarioId(prontuarioId);
    };

    const handleDeleteProntuario = async (prontuarioId) => {
        try {
            await api.delete(`/${prontuarioId}`);
            fetchProntuarios();
        } catch (error) {
            console.error('Erro ao excluir prontuário:', error);
            alert("Ocorreu um erro ao excluir o prontuário.");
        }
    };

    return (
        <div>
            {paciente && (
                <div>
                    <h2>Detalhes do Paciente</h2>
                    <p><strong>Nome:</strong> {paciente.nome}</p>
                    <p><strong>CPF:</strong> {paciente.cpf}</p>
                    <p><strong>Data de Nascimento:</strong> {formatDate(paciente.data_nascimento.split('T')[0])}</p>
                    <p><strong>Telefone:</strong> {paciente.telefone}</p>
                    <p><strong>Email:</strong> {paciente.email}</p>
                    <p><strong>CEP:</strong> {paciente.cep}</p>
                    <p><strong>Endereço:</strong> {paciente.endereco}</p>
                </div>
            )}
            <h3>Prontuários</h3>
            {!showProntuarioForm && <button onClick={() => setShowProntuarioForm(true)}>Adicionar Novo Prontuário</button>}
            {showProntuarioForm && 
                <AddProntuarioForm 
                    onFormSubmit={handleNewProntuario} 
                    initialData={editProntuarioId ? prontuarios.find(p => p.id === editProntuarioId) : {}}
                />
            }
            
            <ul>
                {prontuarios.map(prontuario => (
                    <li key={prontuario.id}>
                        Data: {formatDate(prontuario.data.split('T')[0])} | Notas: {prontuario.notas_sessao}
                        <button onClick={() => handleEditProntuario(prontuario.id)}>Editar</button>
                        <button onClick={() => handleDeleteProntuario(prontuario.id)}>Excluir</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PacienteDetalhes;
