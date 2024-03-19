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
  closeFunction
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

export { reschedule, cancelSchedule, cascadeSchedule };
