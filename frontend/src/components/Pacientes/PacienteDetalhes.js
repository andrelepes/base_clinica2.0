import React, { useState, useEffect, useCallback } from 'react'; // Importe useCallback
import api from '../../services/api';
import AddProntuarioForm from './AddProntuarioForm';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function formatDate(isoDate) {
    if (!isoDate) return 'Data não disponível'; 
    const [year, month, day] = isoDate.split('-');
    return `${day}-${month}-${year}`;
}


function PacienteDetalhes() {
    const [pacientes, setPaciente] = useState(null);
    const [prontuarios, setProntuarios] = useState([]);
    const [showProntuarioForm, setShowProntuarioForm] = useState(false);
    const [editProntuarioId, setEditProntuarioId] = useState(null);
    const { usuarioId, clinicaId, tipousuario } = useAuth();
    const { id: paciente_id } = useParams();

    const fetchProntuarios = useCallback(async () => { 
        try {
            const response = await api.get(`/prontuarios/${paciente_id}/prontuarios`);
            setProntuarios(response.data);
        } catch (error) {
            console.error('Erro ao buscar prontuários:', error);
        }
    }, [paciente_id]); 

    useEffect(() => {
        const fetchPacienteDetails = async () => {
            try {
                const response = await api.get(`/pacientes/${paciente_id}`);
                setPaciente(response.data.data); // Alteração aqui
            } catch (error) {
                console.error('Erro ao buscar detalhes do paciente:', error);
            }
        };
    
        fetchPacienteDetails();
        fetchProntuarios();
    }, [paciente_id, fetchProntuarios]);
    

    const handleNewProntuario = async (prontuarioData) => {
        try {
            const requestData = {
                ...prontuarioData,
                paciente_id: paciente_id,
                usuario_id: usuarioId,
                tipousuario: tipousuario,
                clinica_id: clinicaId,
            };
            console.log("Dados do prontuário antes de enviar:", requestData);

            if (editProntuarioId) {
                // Atualizar um prontuário existente
                await api.put(`/prontuarios/${paciente_id}/prontuarios/${editProntuarioId}`, requestData);
            } else {
                // Adicionar um novo prontuário
                await api.post('/prontuarios/', requestData);
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
    const handleSetActive = async () => {
        try {
            const updateData = {
                usuario_id: usuarioId  // Incluindo o usuario_id para rastrear quem ativou o paciente
            };
            await api.put(`/pacientes/${paciente_id}/ativo`, updateData);  // Note que eu supus o endpoint /ativo, você precisará verificar isso com seu backend
            setPaciente(prevState => ({ ...prevState, status_paciente: 'ativo' }));
            alert("Paciente definido como ativo com sucesso!");
        } catch (error) {
            console.error('Erro ao definir paciente como ativo:', error);
            alert("Ocorreu um erro ao definir o paciente como ativo.");
        }
    };
    const sortedProntuarios = [...prontuarios].sort((a, b) => {
        const dateA = new Date(a.data_hora_agendamento);
        const dateB = new Date(b.data_hora_agendamento);
        return dateB - dateA;
    });
    
    const handleDeleteProntuario = async (prontuarioId) => {
        try {
            await api.delete(`/prontuarios/prontuarios/${prontuarioId}`);
            fetchProntuarios();
        } catch (error) {
            console.error('Erro ao excluir prontuário:', error);
            alert("Ocorreu um erro ao excluir o prontuário.");
        }
    };
    return (
        <div>
            {pacientes && (
                <div>
                    <h2>Detalhes do Paciente</h2>
                    <p><strong>Nome:</strong> {pacientes.nome_paciente}</p>
                    <p><strong>CPF:</strong> {pacientes.cpf_paciente}</p>
                    <p><strong>Data de Nascimento:</strong> {pacientes.data_nascimento_paciente ? formatDate(pacientes.data_nascimento_paciente.split('T')[0]) : 'Data não disponível'}</p>
                    <p><strong>Telefone:</strong> {pacientes.telefone_paciente}</p>
                    <p><strong>Email:</strong> {pacientes.email_paciente}</p>
                    <p><strong>CEP:</strong> {pacientes.cep_paciente}</p>
                    <p><strong>Endereço:</strong> {pacientes.endereco_paciente}</p>
                    <p><strong>Status:</strong> {pacientes.status_paciente}</p>
                    {pacientes.status_paciente === 'ativo' ? (
    <button onClick={handleSetInactive}>Definir como Inativo</button>
) : (
    <button onClick={handleSetActive}>Definir como Ativo</button>
)}

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
    {sortedProntuarios.map(prontuario => (
        <li key={prontuario.prontuario_id}>
            Data: {prontuario.data_hora_agendamento ? formatDate(prontuario.data_hora_agendamento.split('T')[0]) : 'Data não disponível'} | Notas: {prontuario.notas_sessao}
            <button onClick={() => handleEditProntuario(prontuario.prontuario_id)}>Editar</button>
            <button onClick={() => handleDeleteProntuario(prontuario.prontuario_id)}>Excluir</button>
        </li>
    ))}
</ul>
        </div>
    );
}

export default PacienteDetalhes;
