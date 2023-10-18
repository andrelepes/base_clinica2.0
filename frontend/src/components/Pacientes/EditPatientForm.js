import React, { useState, useEffect } from 'react';
import PsicologoSelector from './PsicologoSelector';
import api from '../../services/api';

function EditPacientForm({ initialData, onFormSubmit }) {

    const [showPsicologoSelector, setShowPsicologoSelector] = useState(false);
    const [vinculatedPsicologos, setVinculatedPsicologos] = useState([]);
    
    const defaultPacienteData = {
        nome_paciente: '',
        telefone_paciente: '',
        email_paciente: '',
        data_nascimento_paciente: '',
        cep_paciente: '',
        endereco_paciente: '',
        cpf_paciente: ''
        // Adicione outros campos necessários aqui, se houver
    };
    
    const sanitizedInitialData = Object.fromEntries(
        Object.entries(initialData).map(([key, value]) => [key, value ?? ''])
    );
    
    
    const [pacienteData, setPacienteData] = useState({
        ...defaultPacienteData,
        ...sanitizedInitialData  
    });
    useEffect(() => {
        if (initialData && initialData.paciente_id) {
            const fetchVinculatedPsicologos = async () => {
                try {
                    const response = await api.get(`/autorizacoes/autorizados/${initialData.paciente_id}`);
                    setVinculatedPsicologos(response.data);
                } catch (error) {
                    console.error("Erro ao buscar psicólogos vinculados:", error);
                }
            };
            fetchVinculatedPsicologos();
        }
    }, [initialData]);
    
    const handleInputChange = e => {
        const { name, value } = e.target;
        setPacienteData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const submitForm = e => {
        e.preventDefault();
        // Se a data de nascimento estiver vazia, defina como null
        if (!pacienteData.data_nascimento_paciente) {
            pacienteData.data_nascimento_paciente = null;
        }
        onFormSubmit(pacienteData);
    };
    

    const handlePsicologoSelected = async (psicologoId) => {
        if (initialData) {
            try {
                await api.post('/autorizacoes/autorizar', { 
                    clinica_id: initialData.clinica_id, 
                    usuario_id: psicologoId, 
                    paciente_id: initialData.paciente_id 
                });
    
                const response = await api.get(`/autorizacoes/autorizados/${initialData.paciente_id}`);
                
                // Adicionando o novo psicólogo ao estado
                setVinculatedPsicologos(prevVinculated => [...prevVinculated, response.data[response.data.length - 1]]);
                
                setShowPsicologoSelector(false);
            } catch (error) {
                console.error("Erro ao adicionar psicólogo:", error);
                alert("Ocorreu um erro ao adicionar o psicólogo.");
            }
        }
    };
    
    
    const handlePsicologoRemoval = async (psicologoId) => {
        try {
            await api.delete(`/autorizacoes/retirarAutorizacao/${initialData.clinica_id}/${psicologoId}/${initialData.paciente_id}`);
            // Atualize a lista de psicólogos vinculados após a remoção
            const updatedList = vinculatedPsicologos.filter(p => p.usuario_id !== psicologoId);
            setVinculatedPsicologos(updatedList);
        } catch (error) {
            console.error("Erro ao remover psicólogo:", error);
            alert("Ocorreu um erro ao remover o psicólogo.");
        }
    };
    
    return (
        <div>
            <form onSubmit={submitForm} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1rem' }}>
            <label htmlFor='nome_paciente'>Nome:</label>
            <input type='text' id='nome_paciente' name='nome_paciente' value={pacienteData.nome_paciente} onChange={handleInputChange} required />
            <label htmlFor='telefone_paciente'>Telefone:</label>
            <input type='tel' id='telefone_paciente' name='telefone_paciente' value={pacienteData.telefone_paciente} onChange={handleInputChange} required />
            <label htmlFor='email_paciente'>Email:</label>
            <input type='email' id='email_paciente' name='email_paciente' value={pacienteData.email_paciente} onChange={handleInputChange} required />
            <label htmlFor='data_nascimento_paciente'>Data de Nascimento:</label>
            <input type='date' id='data_nascimento_paciente' name='data_nascimento_paciente' value={pacienteData.data_nascimento_paciente} onChange={handleInputChange} />
            <label htmlFor='cep_paciente'>CEP:</label>
            <input type='text' id='cep_paciente' name='cep_paciente' value={pacienteData.cep_paciente} onChange={handleInputChange} />
            <label htmlFor='endereco_paciente'>Endereço:</label>
            <input type='text' id='endereco_paciente' name='endereco_paciente' value={pacienteData.endereco_paciente} onChange={handleInputChange} />
            <label htmlFor='cpf_paciente'>CPF:</label>
            <input type='text' id='cpf_paciente' name='cpf_paciente' value={pacienteData.cpf_paciente} onChange={handleInputChange} />
            <div></div>
        <button type='submit' style={{ justifySelf: 'center' }}>
            {(initialData && initialData.paciente_id) ? 'Atualizar Paciente' : 'Adicionar Paciente'}
        </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button type="button" onClick={() => setShowPsicologoSelector(true)}>
                Adicionar Psicólogo Responsável
            </button>
            {vinculatedPsicologos.map(psicologo => (
                <span key={psicologo.usuario_id}>
                    {psicologo.nome_usuario} 
                    <button onClick={(e) => { e.preventDefault(); handlePsicologoRemoval(psicologo.usuario_id); }}>X</button>
                </span>
            ))}
        </div>

        {showPsicologoSelector && (
            <PsicologoSelector onPsicologoSelected={handlePsicologoSelected} />
        )}
    </div>
);
}

export default EditPacientForm;