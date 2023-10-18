const Prontuarios = require('../models/Prontuarios');
const Pacientes = require('../models/Pacientes');

const addProntuario = async (req, res) => {
    console.log('Dados recebidos para adicionar prontuário:', req.body);

    const { paciente_id, usuario_id, data_hora_agendamento, notas_sessao } = req.body;

    if (!(await checkPermission(req, paciente_id, usuario_id))) {
        return res.status(403).json({ msg: 'Permissão negada.' });
    }

    try {
        await Prontuarios.addProntuario(paciente_id, usuario_id, data_hora_agendamento, notas_sessao);
        console.log('Prontuário adicionado com sucesso.');
        res.json({ message: 'Prontuário adicionado com sucesso!' });
    } catch (error) {
        console.error('Erro ao adicionar prontuário:', error.message);
        res.status(500).send('Erro no servidor');
    }
};

const getProntuariosByPacienteId = async (req, res) => {
    const pacienteId = req.params.pacientes_id;
    const usuario_id = req.user;

    if (!(await checkPermission(req, pacienteId, usuario_id))) {
        return res.status(403).json({ msg: 'Permissão negada.' });
    }

    try {
        const prontuarios = await Prontuarios.getProntuariosByPacienteId(pacienteId);
        res.json(prontuarios);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro no servidor');
    }
};


const checkPermission = async (req, pacienteId, usuarioId) => {
    const tipousuario = req.tipousuario;  // asumindo que tipousuario é uma propriedade do objeto req

    if (!tipousuario) {
        return false; // Se tipousuario não estiver definido, negue a permissão.
    }

    switch (tipousuario) {
        case 'psicologo':
        case 'psicologo_vinculado':
            return await Prontuarios.isPacienteAssociatedToPsicologo(pacienteId, usuarioId);
        
        case 'clinica':
            return await Prontuarios.isPacienteAssociatedToClinica(pacienteId, req.clinicaId);            

        default:
            return false;  // Por padrão, negue a permissão se tipousuario não corresponder a nenhum tipo conhecido
    }
};


const updateProntuarioById = async (req, res) => {
    const usuario_id = req.user;
    const prontuarioId = req.params.prontuario_id;

    // Obtenha o prontuário pelo ID para descobrir o pacienteId associado a ele.
    const prontuario = await Prontuarios.getProntuarioById(prontuarioId);
    if (!prontuario) {
        return res.status(404).json({ msg: 'Prontuário não encontrado.' });
    }

    // Verifique a permissão usando o pacienteId associado ao prontuário.
    if (!(await checkPermission(req, prontuario.paciente_id, usuario_id))) {
        return res.status(403).json({ msg: 'Permissão negada.' });
    }

    // Atualize os detalhes do prontuário
    const { data_hora_agendamento, notas_sessao } = req.body;
    try {
        await Prontuarios.updateProntuarioDetails(prontuarioId, data_hora_agendamento, notas_sessao);
        return res.status(200).json({ msg: 'Prontuário atualizado com sucesso.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Erro ao atualizar o prontuário.' });
    }
};

const deleteProntuario = async (req, res) => {
    const prontuarioId = req.params.prontuario_id;
    const userId = req.user;

    // Primeiro, verifique se o prontuário realmente existe e foi criado pelo usuário atual.
    const prontuario = await Prontuarios.getProntuarioById(prontuarioId);
    if (!prontuario) {
        return res.status(404).json({ msg: 'Prontuário não encontrado.' });
    }

    if (prontuario.usuario_id !== userId) {
        return res.status(403).json({ msg: 'Permissão negada. Você só pode deletar prontuários que criou.' });
    }

    // Proceda para deletar o prontuário.
    try {
        const rowsDeleted = await Prontuarios.deleteProntuarioById(prontuarioId, userId);
        if (rowsDeleted === 0) {
            return res.status(404).json({ msg: 'Prontuário não encontrado ou já foi deletado.' });
        }
        return res.status(200).json({ msg: 'Prontuário deletado com sucesso.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Erro ao deletar o prontuário.' });
    }
};

module.exports = {
    addProntuario,
    getProntuariosByPacienteId,
    updateProntuarioById,
    deleteProntuario
};

