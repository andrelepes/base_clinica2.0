import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import AddPsychologistForm from './AddPsychologistForm';
import { useClinicaId } from '../../contexts/ClinicaIdContext';
import ConfirmationModal from '../ConfirmationModal';
import AddSecretaryForm from './AddSecretaryForm';

function ClinicasList() {
  const { clinicaId } = useClinicaId();
  const [showPsychologistForm, setShowPsychologistForm] = useState(false);
  const [linkedPsychologists, setLinkedPsychologists] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedPsychologistId, setSelectedPsychologistId] = useState(null);
  const [psychologistIndexToInactivate, setPsychologistIndexToInactivate] = useState(null);
  const [expandedRowIndex, setExpandedRowIndex] = useState(null);
  const [showSecretaryForm, setShowSecretaryForm] = useState(false);  // 2. Estado para o Formulário de Secretário
  const [linkedSecretaries, setLinkedSecretaries] = useState([]);  // 3. Lista de Secretários Vinculados
  const [selectedSecretaryId, setSelectedSecretaryId] = useState(null);
  const [secretaryIndexToInactivate, setSecretaryIndexToInactivate] = useState(null);
  const [expandedSecretaryRowIndex, setExpandedSecretaryRowIndex] = useState(null);
  
  const linkStyle = {
    color: 'blue',
    textDecoration: 'underline',
    cursor: 'pointer'
};

const visitedLinkStyle = {
    color: 'purple',
    textDecoration: 'underline',
    cursor: 'pointer'
};


  const fetchLinkedPsychologists = useCallback(async () => {  // Use useCallback aqui
    try {
      const response = await api.get(`/usuarios/linked-psychologists/${clinicaId}`);
      const filteredPsychologists = response.data.filter(
        psychologist => psychologist.status_usuario === 'ativo' || psychologist.status_usuario === 'aguardando confirmacao'
      );
      setLinkedPsychologists(filteredPsychologists);
    } catch (error) {
      console.error('Erro ao buscar psicólogos vinculados:', error);
    }
  }, [clinicaId]);  // Dependência

  const fetchLinkedSecretaries = useCallback(async () => {
    try {
      const response = await api.get(`/usuarios/linked-secretaries/${clinicaId}`);
      const filteredSecretaries = response.data.filter(
        secretary => secretary.status_usuario === 'ativo' || secretary.status_usuario === 'aguardando confirmacao'
      );
      setLinkedSecretaries(filteredSecretaries);
    } catch (error) {
      console.error('Erro ao buscar secretários vinculados:', error);
    }
  }, [clinicaId]);
  
  useEffect(() => {
    fetchLinkedPsychologists();
  }, [clinicaId, fetchLinkedPsychologists]);  // A lista de dependências permanece a mesma

  const handleInactivate = (index) => {
    console.log("handleInactivate chamado");
    const psychologist = linkedPsychologists[index];
    console.log("ID do psicólogo a ser inativado:", psychologist.usuario_id);
    setSelectedPsychologistId(psychologist.usuario_id);
    setPsychologistIndexToInactivate(index);
    setModalOpen(true);
  };

  const handleConfirmInactivate = () => {
    console.log("handleConfirmInactivate chamado");
    console.log("ID do psicólogo a ser inativado:", selectedPsychologistId);
    if (selectedPsychologistId) {
      updatePsychologistStatus(selectedPsychologistId, 'inativo');
    } else {
      console.error("selectedPsychologistId não está definido");
    }
  };
  const handleAddPsicologo = (e) => {
    e.preventDefault();
    setShowPsychologistForm(true); // Mostrando o formulário
  };
  const handleAddSecretario = () => {  // 4. Botão para Adicionar Secretário
    setShowSecretaryForm(true);  // Mostrando o formulário
  };
  const updatePsychologistStatus = async (usuario_id, novoStatus) => {
    try {
      const response = await api.put(`/usuarios/update-status/${usuario_id}`, { novoStatus });
      console.log(response.data.message);
      fetchLinkedPsychologists();  // Atualizar a lista
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };
  const toggleExpandRow = (index) => {
    if (expandedRowIndex === index) {
      setExpandedRowIndex(null);
    } else {
      setExpandedRowIndex(index);
    }
  };
  const toggleExpandSecretaryRow = (index) => {
    if (expandedSecretaryRowIndex === index) {
      setExpandedSecretaryRowIndex(null);
    } else {
      setExpandedSecretaryRowIndex(index);
    }
  };
  useEffect(() => {
    fetchLinkedSecretaries();
  }, [clinicaId, fetchLinkedSecretaries]);

  const handleInactivateSecretary = (index) => {
    console.log("handleInactivateSecretary chamado");
    const secretary = linkedSecretaries[index];
    console.log("ID do secretário a ser inativado:", secretary.usuario_id);
    setSelectedSecretaryId(secretary.usuario_id);
    setSecretaryIndexToInactivate(index);
    setModalOpen(true);
  };

  const handleConfirmInactivateSecretary = () => {
    console.log("handleConfirmInactivateSecretary chamado");
    console.log("ID do secretário a ser inativado:", selectedSecretaryId);
    if (selectedSecretaryId) {
      updateSecretaryStatus(selectedSecretaryId, 'inativo');
    } else {
      console.error("selectedSecretaryId não está definido");
    }
  };

  const updateSecretaryStatus = async (usuario_id, novoStatus) => {
    try {
      const response = await api.put(`/usuarios/update-status/${usuario_id}`, { novoStatus });
      console.log(response.data.message);
      fetchLinkedSecretaries();  // Atualizar a lista
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };
  return (
    <div>
      <h2>Clínica</h2>
      <div>
        <h3>Psicólogos Vinculados</h3>
        <button onClick={handleAddPsicologo}>Adicionar Psicólogo</button>
      </div>
      {showPsychologistForm && <AddPsychologistForm fetchLinkedPsychologists={fetchLinkedPsychologists} />}
      <div>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Telefone</th>
            </tr>
          </thead>
          <tbody>
          {linkedPsychologists.map((psychologist, index) => (
          <React.Fragment key={psychologist.usuario_id}>
          <tr onClick={() => toggleExpandRow(index)}>
          <td 
    style={expandedRowIndex === index ? visitedLinkStyle : linkStyle} 
    onClick={() => toggleExpandRow(index)}
>
    {psychologist.nome_usuario}
</td>
          <td>{psychologist.telefone_usuario}</td>
          </tr>
          {expandedRowIndex === index && (
                  <tr>
                    <td colSpan="2">
                      <div className="expanded-content">
                      <p>Status: {psychologist.status_usuario}</p>
                        <p>Email: {psychologist.email_usuario}</p>
                        <p>Nascimento: {psychologist.data_nascimento_usuario}</p>
                        <p>Qualificações: {psychologist.qualificacoes}</p>
                        <p>Registro: {psychologist.registro_profissional}</p>
                        <p>Horários Disponíveis: {psychologist.horarios_disponiveis}</p>
                        <button onClick={(e) => { e.stopPropagation(); handleInactivate(index); }}>Excluir</button>
                    </div>
                  </td>
                </tr>
              )}
              {psychologistIndexToInactivate === index && (
                <tr>
                  <td colSpan="2">
                    <ConfirmationModal
                      isOpen={isModalOpen}
                      onClose={() => setModalOpen(false)}
                      onConfirm={handleConfirmInactivate}
                    />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
    <div>
      <h3>Secretários Vinculados</h3>
      <button onClick={handleAddSecretario}>Adicionar Secretário</button>
    </div>
    {showSecretaryForm && <AddSecretaryForm fetchLinkedSecretaries={fetchLinkedSecretaries} />}
    <div>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Telefone</th>
          </tr>
        </thead>
        <tbody>
        {linkedSecretaries.map((secretary, index) => (
          <React.Fragment key={secretary.usuario_id}>
            <tr onClick={() => toggleExpandSecretaryRow(index)}>
            <td 
    style={expandedSecretaryRowIndex === index ? visitedLinkStyle : linkStyle} 
    onClick={() => toggleExpandSecretaryRow(index)}
>
    {secretary.nome_usuario}
</td>
              <td>{secretary.telefone_usuario}</td>
            </tr>
            {expandedSecretaryRowIndex === index && (
              <tr>
                <td colSpan="2">
                  <div className="expanded-content">
                    <p>Status: {secretary.status_usuario}</p>
                    <p>Email: {secretary.email_usuario}</p>
                    <p>Nascimento: {secretary.data_nascimento_usuario}</p>
                    <button onClick={(e) => { e.stopPropagation(); handleInactivateSecretary(index); }}>Excluir</button>
                    </div>
                  </td>
                </tr>
              )}
               {secretaryIndexToInactivate === index && (
                <tr>
                  <td colSpan="2">
                    <ConfirmationModal
                      isOpen={isModalOpen}
                      onClose={() => setModalOpen(false)}
                      onConfirm={handleConfirmInactivateSecretary}
                      />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>  
      </div>
</div>
);
}

export default ClinicasList;
