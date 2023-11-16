const Pacientes = require('../models/Pacientes');
const Usuarios = require('../models/Usuarios');

class PacientesController {
  
    static async criarPaciente(req, res) {
        try {
            const { nome_paciente, email_paciente, telefone_paciente } = req.body;
            const usuario_id = req.user;
            const clinica_id = req.clinicaId;
            const tipousuario = req.tipousuario; 
    
            // Verifique se usuario_id existe
            if (!usuario_id) {
                return res.status(400).json({ success: false, message: 'Informações de usuário ausentes.' });
            }
    
            // Se o usuário for do tipo "psicologo", permita que clinica_id seja null
            if (tipousuario !== 'psicologo' && !clinica_id) {
                return res.status(400).json({ success: false, message: 'Informações de clínica ausentes.' });
            }
                
            // Verificar se o e-mail já está registrado
            const pacienteExistente = await Pacientes.emailJaRegistrado(email_paciente);
            if (pacienteExistente) {
                return res.status(400).json({ success: false, message: 'E-mail já registrado.' });
            }
      
            // Inserir o novo paciente
            const paciente = {
                nome_paciente,
                email_paciente,
                telefone_paciente,
                usuario_id,
                clinica_id
            };
            await Pacientes.inserirPaciente(paciente);
            res.status(201).json({ success: true, message: 'Paciente criado com sucesso!' });
         
        } catch (error) {
            console.error('Erro ao criar paciente:', error);
            res.status(500).json({ success: false, message: 'Erro ao criar paciente. Por favor, tente novamente.' });
        }
    }
    
  
// Atualizar informações de um paciente
static async atualizarPaciente(req, res) {
    try {
        const { paciente_id } = req.params;
        const { nome_paciente, data_nascimento_paciente, telefone_paciente, email_paciente, cep_paciente, endereco_paciente, diagnostico, historico_medico, status_paciente, cpf_paciente, ...resto } = req.body;
        
        if (resto.paciente_id || resto.clinica_id) {
            return res.status(400).json({ success: false, message: 'Não é permitido atualizar paciente_id ou clinica_id.' });
        }
        console.log("paciente_id e clinica_id não estão presentes no corpo da solicitação.");

        const clinica_id = req.clinicaId;
        const tipousuario = req.tipousuario;
        const usuario_id = req.user; // Extraia o usuario_id do token

if (tipousuario === 'secretario_vinculado') {
            delete resto.diagnostico;
            delete resto.historico_medico;
        }
        await Pacientes.atualizarPaciente(paciente_id, nome_paciente, data_nascimento_paciente, telefone_paciente, email_paciente, cep_paciente, endereco_paciente, diagnostico, historico_medico, status_paciente, cpf_paciente, tipousuario, clinica_id, usuario_id);
        res.status(200).json({ success: true, message: 'Paciente atualizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao atualizar paciente.', error });
    }
}
// Filtrar pacientes
static async filtrarPacientes(req, res) {
    try {
        const { nome, status } = req.query; 
        const usuario_id = req.user;
        const clinica_id = req.clinicaId;
        const tipousuario = req.tipousuario;

        const pacientes = await Pacientes.filtrarPacientes(nome, status, tipousuario, clinica_id, usuario_id);
        res.status(200).json({ success: true, data: pacientes });
    } catch (error) {
        console.error('Erro ao filtrar pacientes:', error.message);
        res.status(500).json({ success: false, message: 'Erro ao filtrar pacientes.', error: error.message });
    }
}

static async listarPacientes(req, res) {
    try {
      const usuario_id = req.user;
      const clinica_id = req.clinicaId;
      const tipousuario = req.tipousuario; 

      const pacientes = await Pacientes.listarPacientes(tipousuario, clinica_id, usuario_id);
      res.status(200).json({ success: true, data: pacientes });
    } catch (error) {
      console.error('Erro ao listar pacientes:', error.message);
      res.status(500).json({ success: false, message: 'Erro ao listar pacientes.', error: error.message });
    }
}


// Obter informações de um paciente específico
static async obterPaciente(req, res) {
    try {
      const { paciente_id } = req.params;
      const paciente = await Pacientes.buscarPorId(paciente_id); // Supondo que haja um método buscarPorId no modelo Pacientes
      if (!paciente) {
        return res.status(404).json({ success: false, message: 'Paciente não encontrado.' });
      }
      res.status(200).json({ success: true, data: paciente });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erro ao obter informações do paciente.', error });
    }
}
static async listarPacientesPaginados(req, res) {
    try {
      const usuario_id = req.user;
      const clinica_id = req.clinicaId;
      const tipousuario = req.tipousuario; 
  
      // Recupere o parâmetro de página da solicitação
      const page = parseInt(req.query.page) || 1;
  
      const pacientes = await Pacientes.listarPacientesPaginados(tipousuario, clinica_id, usuario_id, page);
      res.status(200).json({ success: true, data: pacientes });
    } catch (error) {
      console.error('Erro ao listar pacientes:', error.message);
      res.status(500).json({ success: false, message: 'Erro ao listar pacientes.', error: error.message });
    }
  }
  
 // Método para marcar paciente como inativo
static async marcarComoInativo(req, res) {
    try {
        const { paciente_id } = req.params;
        const clinica_id = req.clinicaId;
        const usuario_id = req.user; 
        const tipousuario = req.tipousuario; 

        await Pacientes.marcarComoInativo(paciente_id, clinica_id, usuario_id, tipousuario);
        res.status(200).json({ success: true, message: 'Paciente marcado como inativo com sucesso!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao marcar paciente como inativo.', error });
    }
}

// Método para marcar paciente como ativo
static async marcarComoAtivo(req, res) {
    try {
        const { paciente_id } = req.params;
        const clinica_id = req.clinicaId;
        const tipousuario = req.tipousuario; 

        await Pacientes.marcarComoAtivo(paciente_id, clinica_id, tipousuario);
        res.status(200).json({ success: true, message: 'Paciente reativado com sucesso!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao reativar paciente.', error });
    }
}

}

module.exports = PacientesController;
