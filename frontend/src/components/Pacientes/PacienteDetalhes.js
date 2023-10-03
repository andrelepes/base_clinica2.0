import React, { useState, useEffect, useCallback } from 'react'; // Importe useCallback
import api from 'C:/Users/andre/base_clinica/frontend/src/services/api';
import AddProntuarioForm from './AddProntuarioForm';
import { useParams } from 'react-router-dom';
import { useClinicaId } from '../../contexts/ClinicaIdContext';

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
    const { usuarioId } = useClinicaId();
    const { id: paciente_id } = useParams();


    const fetchProntuarios = useCallback(async () => { // Use useCallback aqui
        try {
            const response = await api.get(`/api/prontuarios/pacientes/${id}/prontuarios`);
            setProntuarios(response.data);
        } catch (error) {
            console.error('Erro ao buscar prontuários:', error);
        }
    }, [id]); // Adicione as dependências aqui

    useEffect(() => {
        const fetchPacienteDetails = async () => {
            try {
                const response = await api.get(`/api/pacientes/${id}`);
                setPaciente(response.data);
            } catch (error) {
                console.error('Erro ao buscar detalhes do paciente:', error);
            }
        };

        fetchPacienteDetails();
        fetchProntuarios();
    }, [id, fetchProntuarios]); // Adicione fetchProntuarios aqui

    const handleNewProntuario = async (prontuarioData) => {
        try {
            if (editProntuarioId) {
                // Atualizar um prontuário existente
                await api.put(`/api/prontuarios/${editProntuarioId}`, prontuarioData);
            } else {
                // Adicionar um novo prontuário
                await api.post('/api/prontuarios', {
                    ...prontuarioData,
                    paciente_id: id
                });
                setShowProntuarioForm(false);
            }
            fetchProntuarios();
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
    const handleSetInactive = async () => {
        try {
            const updateData = {
                usuario_id: usuarioId  // Incluindo o usuario_id para rastrear quem inativou o paciente
            };
            await api.put(`/pacientes/${paciente_id}/inativo`, updateData);  // Use paciente_id aqui
            setPaciente(prevState => ({ ...prevState, status_paciente: 'inativo' }));
            alert("Paciente definido como inativo com sucesso!");
        } catch (error) {
            console.error('Erro ao definir paciente como inativo:', error);
            alert("Ocorreu um erro ao definir o paciente como inativo.");
        }
    };
    
    const handleDeleteProntuario = async (prontuarioId) => {
        try {
            await api.delete(`/api/prontuarios/${prontuarioId}`);
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
                    <p><strong>Nome:</strong> {paciente.nome_paciente}</p>
                    <p><strong>CPF:</strong> {paciente.cpf_paciente}</p>
                    <p><strong>Data de Nascimento:</strong> {formatDate(paciente.data_nascimento_paciente.split('T')[0])}</p>
                    <p><strong>Telefone:</strong> {paciente.telefone_paciente}</p>
                    <p><strong>Email:</strong> {paciente.email_paciente}</p>
                    <p><strong>CEP:</strong> {paciente.cep_paciente}</p>
                    <p><strong>Endereço:</strong> {paciente.endereco_paciente}</p>
                    <p><strong>Status:</strong> {paciente.status_paciente}</p>
                    {paciente.status_paciente === 'ativo' && <button onClick={handleSetInactive}>Definir como Inativo</button>}
                </div>
            )}
            <h3>Prontuários</h3>
            {!showProntuarioForm && <button onClick={() => setShowProntuarioForm(true)}>Adicionar Novo Prontuário</button>}
            {showProntuarioForm && 
                <AddProntuarioForm 
                    onFormSubmit={handleNewProntuario} 
                    initialData={editProntuarioId ? prontuarios.find(p => p.prontuario_id === editProntuarioId) : {}}
                />
            }
            
            <ul>
                {prontuarios.map(prontuario => (
                    <li key={prontuario.prontuario_id}>
                        Data: {formatDate(prontuario.data_prontuario.split('T')[0])} | Notas: {prontuario.notas_sessao}
                        <button onClick={() => handleEditProntuario(prontuario.prontuario_id)}>Editar</button>
                        <button onClick={() => handleDeleteProntuario(prontuario.prontuario_id)}>Excluir</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PacienteDetalhes;
