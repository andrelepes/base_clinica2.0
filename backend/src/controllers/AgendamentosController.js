const Agendamentos = require('../models/Agendamentos');
const Evolutions = require('../models/Evolutions');

class AgendamentoController {

    static async checkPermission(req, pacienteId, usuarioId) {
        const tipousuario = req.tipousuario;
        const clinicaId = req.clinicaId; // Adicionado para obter o ID da clínica do usuário

        if (!tipousuario) {
            return false;
        }

        switch (tipousuario) {
            case 'psicologo':
            case 'psicologo_vinculado':
                // Verifica se o psicólogo está associado ao paciente
                return await Agendamentos.isPacienteAssociatedToPsicologo(pacienteId, usuarioId);
        
            case 'clinica':
                // Verifica se o paciente está associado à clínica
                if (await Agendamentos.isPacienteAssociatedToClinica(pacienteId, clinicaId)) {
                    return true;
                }
                // Além disso, verifica se o psicólogo (usuario_id do agendamento) está associado à clínica
                return await Agendamentos.isUserAssociatedToClinica(usuarioId, clinicaId);

            default:
                return false;
        }
    }

    static async criarAgendamento(req, res) {
        try {
            const agendamento = {
                paciente_id: req.body.paciente_id,
                usuario_id: req.body.usuario_id,
                data_hora_inicio: req.body.data_hora_inicio,
                status: req.body.status,
                notas_agendamento: req.body.notas_agendamento,
                consultorio_id: req.body.consultorio_id,
                data_hora_fim: req.body.data_hora_fim,
                historico: req.body.historico,
                tipo_sessao: req.body.tipo_sessao,
                recorrencia: req.body.recorrencia,
            };

            // Verifique a permissão antes de inserir o agendamento
            if (!(await AgendamentoController.checkPermission(req, agendamento.paciente_id, req.user))) {
                return res.status(403).json({ message: 'Permissão negada.' });
            }
            const result = await Agendamentos.inserirAgendamento(agendamento);
            
            const evolutions = new Evolutions();
            const evolution = {
                usuario_id: req.body.usuario_id,
                paciente_id: req.body.paciente_id,
                agendamento_id: result.agendamento_id
            }
            await evolutions.simpleCreateForUserIdAndPatientId(evolution);
            if (result.success) {
                res.status(201).send({ message: result.message });
            } else {
                res.status(400).send({ message: result.message });
            }

        } catch (error) {
            console.error('Erro ao criar agendamento:', error);
            res.status(500).send({ message: 'Erro interno do servidor' });
        }
    }
    static async listarAgendamentos(req, res) {
        try {
            const agendamentos = await Agendamentos.listarTodos();
            const agendamentosPermitidos = [];
    
            for (let agendamento of agendamentos) {
                if (await AgendamentoController.checkPermission(req, agendamento.paciente_id, req.user)) {
                    agendamentosPermitidos.push(agendamento);
                }
            }
    
            res.json(agendamentosPermitidos);
        } catch (error) {
            console.error('Erro ao listar agendamentos:', error);
            res.status(500).send({ message: 'Erro interno do servidor' });
        }
    }    
    
    static async obterAgendamentoPorId(req, res) {
        try {
            const { id } = req.params;
            const agendamento = await Agendamentos.buscarPorId(id);
    
            if (!agendamento) {
                return res.status(404).send({ message: 'Agendamento não encontrado.' });
            }
    
            // Verifique a permissão antes de retornar o agendamento
            if (!(await AgendamentoController.checkPermission(req, agendamento.paciente_id, req.user))) {
                return res.status(403).json({ message: 'Permissão negada.' });
            }
    
            res.json(agendamento);
        } catch (error) {
            console.error('Erro ao obter agendamento:', error);
            res.status(500).send({ message: 'Erro interno do servidor' });
        }
    }

    static async atualizarAgendamento(req, res) {
        const { id } = req.params;
        const { data_hora_inicio, data_hora_fim, status, notas_agendamento, tipo_sessao, recorrencia } = req.body;
    
        try {
            const agendamento = await Agendamentos.buscarPorId(id);
    
            if (!agendamento) {
                return res.status(404).send({ message: 'Agendamento não encontrado.' });
            }
    
            if (!(await AgendamentoController.checkPermission(req, agendamento.paciente_id, req.user))) {
                return res.status(403).json({ message: 'Permissão negada.' });
            }
    
            await Agendamentos.atualizarAgendamento(id, { data_hora_inicio, data_hora_fim, status, notas_agendamento, tipo_sessao, recorrencia });
            res.status(200).json({ message: 'Agendamento atualizado com sucesso.' });
        } catch (error) {
            console.error('Erro ao atualizar agendamento:', error);
            res.status(500).send({ message: 'Erro interno do servidor' });
        }
    }
    
    static async deletarAgendamento(req, res) {
        const { id } = req.params;
    
        try {
            const agendamento = await Agendamentos.buscarPorId(id);
    
            if (!agendamento) {
                return res.status(404).send({ message: 'Agendamento não encontrado.' });
            }
    
            if (!(await AgendamentoController.checkPermission(req, agendamento.paciente_id, req.user))) {
                return res.status(403).json({ message: 'Permissão negada.' });
            }
    
            await Agendamentos.deletarAgendamento(id);
            res.status(200).json({ message: 'Agendamento deletado com sucesso.' });
        } catch (error) {
            console.error('Erro ao deletar agendamento:', error);
            res.status(500).send({ message: 'Erro interno do servidor' });
        }
    }

    static async getNextAppointment(req,res){
        try {
            const { paciente_id } = req.params;
            const result = await Agendamentos.getNextAppointmentByPatientId(paciente_id);

            if (!result) {
                return res.status(404).send({ message: 'Agendamento não encontrado.' });
            }

            if (!(await AgendamentoController.checkPermission(req, paciente_id, req.user))) {
                return res.status(403).json({ message: 'Permissão negada.' });
            }

            res.json(result);
        } catch (error) {
            res.status(500).send({ message: 'Erro interno do servidor' });
        }
    }
    static async getAppointmentsByOffice(req,res){
        try {
            const { consultorio_id } = req.params;
            const result = await Agendamentos.getAppointmentsByOfficeId(consultorio_id);
            
            res.json(result);
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: 'Erro interno do servidor' });
        }
    }
    static async getAppointmentsGroupedByOfficeByClinicId(req,res){
        try {
            const clinicId = req.clinicaId;
            const appointments = await Agendamentos.getAppointmentsByClinicId(clinicId);

            const result = [];
            const appointmentsByOffice = {};

            appointments.forEach(appointment => {
                if (!appointmentsByOffice[appointment.consultorio_id]) {
                    appointmentsByOffice[appointment.consultorio_id] = [];
                }
                appointmentsByOffice[appointment.consultorio_id].push(appointment);
            });

            for (const consultorioId in appointmentsByOffice) {
                result.push(appointmentsByOffice[consultorioId]);
            }

            
            res.json(result);
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: 'Erro interno do servidor' });
        }
    }

    static async getAppointmentsGroupedByPatientByClinicId(req,res){
        try {
            const clinicId = req.clinicaId;
            const appointments = await Agendamentos.getAppointmentsByClinicId(clinicId);

            const result = [];
            const appointmentsByPatient = {};

            appointments.forEach(appointment => {
                if (!appointmentsByPatient[appointment.paciente_id]) {
                    appointmentsByPatient[appointment.paciente_id] = [];
                }
                appointmentsByPatient[appointment.paciente_id].push(appointment);
            });

            for (const pacienteId in appointmentsByPatient) {
                result.push(appointmentsByPatient[pacienteId]);
            }

            
            res.json(result);
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: 'Erro interno do servidor' });
        }
    }

    static async getAppointmentsByUserId(req,res){
        try {
            const userId = req.user;
            const appointments = await Agendamentos.getAppointmentsByUserId(userId);

            res.json(appointments);
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: 'Erro interno do servidor' })
        }
    }

    static async getAllNextAppointmentsByClinicId(req,res){
        try {
            const clinicId = req.clinicaId;
            const nextAppointments = await Agendamentos.getNextAppointmentByClinicId(clinicId);

            res.json(nextAppointments);
        } catch (error) {
            
        }
    }

    static async createRecurrentSchedule(req,res){
        try {
            const {
                paciente_id,
                usuario_id,
                data_hora_inicio,
                status,
                consultorio_id,
                data_hora_fim,
                tipo_sessao,
                recorrencia,
                weekInterval
            } =  req.body;
            
            await Agendamentos.createWithRecurrency({paciente_id,usuario_id,data_hora_inicio,status,consultorio_id,data_hora_fim,tipo_sessao,recorrencia,weekInterval});
            
            res.status(201).send('Appointments created successfully');          

        } catch (error) {
            console.error('Erro ao criar agendamento:', error);
            res.status(500).send({ message: 'Erro interno do servidor' });
        }
    }
}

module.exports = AgendamentoController;
