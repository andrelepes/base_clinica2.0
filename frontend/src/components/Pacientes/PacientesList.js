import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import AddPatientForm from './AddPatientForm';
import { useClinicaId } from '../../contexts/ClinicaIdContext';

function PacientesList() {
    const [pacientes, setPacientes] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingPatient, setEditingPatient] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(''); // State para filtrarPorStatus
    const [searchName, setSearchName] = useState(''); // State para filtrarPorNome
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { clinicaId, usuarioId } = useClinicaId();
    const [psicologosVinculados, setPsicologosVinculados] = useState({});


    const fetchAllPacientes = useCallback(async () => {
        try {
            let endpoint = `/pacientes/filtrar?page=${currentPage}`;
            const response = await api.get(endpoint);
            setPacientes(response.data.data);
    
            // Supondo que a API retorne os psicólogos vinculados em um campo 'psicologosVinculados'
            const newPsicologosVinculados = {};
            response.data.data.forEach(paciente => {
                newPsicologosVinculados[paciente.paciente_id] = paciente.psicologosVinculados;
            });
            setPsicologosVinculados(newPsicologosVinculados);
    
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Erro ao buscar todos os pacientes:', error);
        }
    }, [currentPage]);
    
    const fetchFilteredPacientes = useCallback(async () => {
        try {
            let endpoint = `/pacientes/filtrar?page=${currentPage}`;
            const params = [];
            if (searchName) {
                params.push(`nome=${searchName}`);
            }
            if (selectedStatus) {
                params.push(`status=${selectedStatus}`);
            }
            if (params.length) {
                endpoint += `&${params.join('&')}`;
            }
            const response = await api.get(endpoint);
            setPacientes(response.data.data);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Erro ao filtrar os pacientes:', error);
        }
    }, [currentPage, searchName, selectedStatus]);
    
    useEffect(() => {
        if (searchName || selectedStatus) {
            fetchFilteredPacientes();
        } else {
            fetchAllPacientes();
        }
    }, [searchName, selectedStatus, currentPage, fetchAllPacientes, fetchFilteredPacientes]);
        
    const handleEdit = (id) => {
        const patientToEdit = pacientes.find(p => p.paciente_id === id);
        setEditingPatient(patientToEdit);
        setShowForm(true);
    }
    
    const handleNewPatient = async (patientData) => {
        try {
            const dataToSend = {
                nome_paciente: patientData.nome_paciente,
                email_paciente: patientData.email_paciente,
                telefone_paciente: patientData.telefone_paciente,
            };
        
            if (editingPatient) {
                // Adicionando campos adicionais para atualização
                dataToSend.data_nascimento_paciente = patientData.data_nascimento_paciente;
                dataToSend.cep_paciente = patientData.cep_paciente;
                dataToSend.endereco_paciente = patientData.endereco_paciente;
                dataToSend.diagnostico = patientData.diagnostico;
                dataToSend.historico_medico = patientData.historico_medico;
                dataToSend.status_paciente = patientData.status_paciente;
                dataToSend.cpf_paciente = patientData.cpf_paciente;
        
                await api.put(`/pacientes/${editingPatient.paciente_id}`, dataToSend);
                
                // Reativar o paciente após atualização
                await api.put(`/pacientes/${editingPatient.paciente_id}/ativo`, { usuario_id: usuarioId });
                
                setEditingPatient(null);
            } else {
                await api.post('/pacientes', dataToSend);
            }
            setShowForm(false);
        } catch (error) {
            console.error('Erro ao adicionar/atualizar paciente:', error);
            if (error.response && error.response.status === 409) {
                alert("E-mail ou CPF já registrado.");
            } else {
                alert("Ocorreu um erro ao adicionar/atualizar o paciente.");
            }
        }

        if (searchName || selectedStatus) {
            fetchFilteredPacientes();
        } else {
            fetchAllPacientes();
        }
    }
    
    
    const handleDelete = async (paciente_id) => {
        try {
            const updateData = {
                usuario_id: usuarioId  // Incluindo o usuario_id para rastrear quem inativou o paciente
            };
            await api.put(`/pacientes/${paciente_id}/inativo`, updateData);  // Use paciente_id aqui
            
            if (searchName || selectedStatus) {
                fetchFilteredPacientes();
            } else {
                fetchAllPacientes();
            }
        } catch (error) {
            console.error("Erro ao marcar paciente como inativo:", error);
            alert("Ocorreu um erro ao marcar o paciente como inativo.");
        }
    }
    
    const adicionarPsicologo = async (pacienteId) => {
        // Aqui você pode abrir um modal ou uma nova página para selecionar um psicólogo vinculado
        // Por simplicidade, vamos assumir que você está usando um prompt para selecionar um psicólogo
        const psicologoId = prompt("Digite o ID do psicólogo vinculado que você deseja adicionar:");
        if (psicologoId) {
            try {
                await api.post('/caminho/para/api/adicionarPsicologo', { pacienteId, psicologoId });
                // Atualize a lista de pacientes após adicionar o psicólogo
                fetchAllPacientes();
            } catch (error) {
                console.error("Erro ao adicionar psicólogo:", error);
                alert("Ocorreu um erro ao adicionar o psicólogo.");
            }
        }
    }
    
    return (
        <div>
            <h2>Pacientes</h2>
    
            <input 
                type="text" 
                placeholder="Buscar por nome" 
                value={searchName} 
                onChange={e => {
                    setSearchName(e.target.value);
                    if (searchName || selectedStatus) {
                        fetchFilteredPacientes();
                    } else {
                        fetchAllPacientes();
                    }
                }}
                onKeyDown={e => {
                    if (e.key === 'Enter') {
                        if (searchName || selectedStatus) {
                            fetchFilteredPacientes();
                        } else {
                            fetchAllPacientes();
                        }
                    }
                }}
            />            <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}>
                <option value="">Todos os Status</option>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
            </select>

            {!showForm && <button onClick={() => setShowForm(true)}>Adicionar Novo Paciente</button>}
            {showForm && <AddPatientForm key={editingPatient ? editingPatient.paciente_id : 'new'} onFormSubmit={handleNewPatient} initialData={editingPatient} />}

            <ul>
            {pacientes.map(paciente => (
    <li key={paciente.paciente_id}>
        <Link 
            to={`/pacientes/${paciente.paciente_id}`}
            style={paciente.status_paciente === 'inativo' ? { textDecoration: 'line-through' } : {}}
        >
            {paciente.nome_paciente}
        </Link>
        {psicologosVinculados[paciente.paciente_id] && psicologosVinculados[paciente.paciente_id].length > 0 ? (
            <span className="psicologos">{psicologosVinculados[paciente.paciente_id].join(', ')}</span>
        ) : (
            <button onClick={() => adicionarPsicologo(paciente.paciente_id)}>Adicionar psicólogo</button>
        )}
        <span onClick={() => handleEdit(paciente.paciente_id)} style={{ cursor: 'pointer', marginLeft: '10px' }}>✎</span>
        <span onClick={() => handleDelete(paciente.paciente_id)} style={{ cursor: 'pointer', marginLeft: '5px' }}>🗑️</span>
    </li>
))}
</ul>

            <div>
                {Array.from({ length: totalPages }).map((_, index) => (
                    <button 
                        key={index} 
                        onClick={() => setCurrentPage(index + 1)}
                        disabled={currentPage === index + 1}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default PacientesList;
