import { toast } from 'react-toastify';
import api from '../services/api';

const reschedule = async ({
  agendamento_id,
  paciente_id,
  usuario_id,
  data_hora_inicio,
  consultorio_id,
  data_hora_fim,
  tipo_sessao,
  closeFunction,
}) => {
  try {
    await api.post(`/agendamentos/reschedule/${agendamento_id}`, {
      paciente_id,
      usuario_id,
      data_hora_inicio,
      consultorio_id,
      data_hora_fim,
      tipo_sessao,
    });

    closeFunction();

    toast.success('Consulta remarcada com sucesso!');
  } catch (error) {
    toast.error('Ocorreu um erro ao remarcar a consulta');
  }
};

const cancelSchedule = async ({ agendamento_id, closeFunction }) => {
  try {
    await api.delete(`/agendamentos/${agendamento_id}`);
    closeFunction();
    toast.success('Desmarcação realizada com sucesso!');
  } catch (error) {
    toast.error('Ocorreu um erro ao desmarcar a consulta.');
  }
};

const cascadeSchedule = async ({ paciente_id, closeFunction }) => {
  try {
    await api.delete(`/agendamentos/cascade/${paciente_id}`);
    closeFunction();
    toast.success('Consultas removidas com sucesso!');
  } catch (error) {
    toast.error('Ocorreu um erro ao remover todas as consultas.');
  }
};

const updateOffice = async ({
  consultorio_id,
  descricao,
  nome_consultorio,
  closeFunction,
}) => {
  try {
    await api.put(`/consultorios/${consultorio_id}`, {
      descricao,
      nome_consultorio,
    });
    closeFunction();
    toast.success('Consultório atualizado com sucesso!');
  } catch (error) {
    toast.error('Ocorreu um erro ao atualizar consultório');
  }
};

const updateUsernameAndEmail = async ({
  usuario_id,
  email_usuario,
  nome_usuario,
  closeFunction,
}) => {
  try {
    await api.put(`/usuarios/update/${usuario_id}`, {
      email_usuario,
      nome_usuario,
      usuario_id
    });
    closeFunction();
    toast.success('Registro atualizado com sucesso!');
  } catch (error) {
    toast.error('Ocorreu um erro ao atualizar o registro');
  }
};

export { reschedule, cancelSchedule, cascadeSchedule, updateOffice, updateUsernameAndEmail };
