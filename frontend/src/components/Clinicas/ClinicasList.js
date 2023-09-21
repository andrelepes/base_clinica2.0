import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import AddPsychologistForm from './AddPsychologistForm';
import { useClinicaId } from '../../contexts/ClinicaIdContext';
import ConfirmationModal from '../ConfirmationModal';

function ClinicasList() {
  const { clinicaId } = useClinicaId();
  const [showPsychologistForm, setShowPsychologistForm] = useState(false);
  const [linkedPsychologists, setLinkedPsychologists] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedPsychologistId, setSelectedPsychologistId] = useState(null);
  const [psychologistIndexToInactivate, setPsychologistIndexToInactivate] = useState(null);
  const [expandedRowIndex, setExpandedRowIndex] = useState(null);

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
  const handleAddSecretario = () => {
    alert('Adicionar Secretário foi clicado');
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
          <td>{psychologist.nome_usuario}</td>
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
    </div>
  );    
}

export default ClinicasList;
