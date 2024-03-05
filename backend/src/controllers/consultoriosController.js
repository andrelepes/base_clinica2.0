const Consultorios = require('../models/Consultorios'); 

class ConsultorioController {
    static async checkPermission(req, consultorioId) {
        const tipousuario = req.tipousuario;
        const clinicaId = req.clinicaId;
        const usuarioId = req.user;
 
        // Lógica para 'clinica'
        if (tipousuario === 'clinica' && clinicaId === req.body.clinica_id) {
            return true;
        }

        // Lógica para 'psicologo'
        if (tipousuario === 'psicologo' && usuarioId === req.body.usuario_id) {
            return true;
        }

        // Lógica para 'psicologo_vinculado' e 'secretario_vinculado' (somente leitura)
        if ((tipousuario === 'psicologo_vinculado' || tipousuario === 'secretario_vinculado') && req.method === 'GET') {
            // Verifica se o consultorioId está associado à mesma clínica do usuário
            const isAuthorized = await Consultorios.isConsultorioAssociatedToClinica(consultorioId, clinicaId);
            return isAuthorized;
        }

        return false;
    }

    static async inserirConsultorio(req, res) {
        if (!await ConsultorioController.checkPermission(req)) {
            return res.status(403).json({ message: 'Permissão negada.' });
        }
       
        // Lógica para inserir um consultório
        const resultado = await Consultorios.inserirConsultorio(req.body);
        if (resultado.success) {
            res.status(201).send({ message: resultado.message });
        } else {
            res.status(500).send({ message: resultado.message });
        }
    }

    static async listarConsultorios(req, res) {
        if (!await ConsultorioController.checkPermission(req)) {
            return res.status(403).json({ message: 'Permissão negada.' });
        }

        try {
            const consultorios = await Consultorios.listarConsultorios();
            res.status(200).send(consultorios);
        } catch (error) {
            res.status(500).send({ message: 'Erro ao listar consultórios' });
        }
    }

    static async buscarPorId(req, res) {
        if (!await ConsultorioController.checkPermission(req, req.params.consultorio_id)) {
            return res.status(403).json({ message: 'Permissão negada.' });
        }

        try {
            const consultorio = await Consultorios.buscarPorId(req.params.consultorio_id);
            if (!consultorio) {
                return res.status(404).send({ message: 'Consultório não encontrado' });
            }
            res.status(200).send(consultorio);
        } catch (error) {
            res.status(500).send({ message: 'Erro ao buscar consultório' });
        }
    }

static async atualizarConsultorio(req, res) {
    if (!await ConsultorioController.checkPermission(req, req.params.consultorio_id)) {
        return res.status(403).json({ message: 'Permissão negada.' });
    }

    try {
        const resultado = await Consultorios.atualizarConsultorio(req.params.consultorio_id, req.body);
        res.status(200).send({ message: 'Consultório atualizado com sucesso!' });
    } catch (error) {
        res.status(500).send({ message: 'Erro ao atualizar consultório' });
    }
}

static async deletarConsultorio(req, res) {
    if (!await ConsultorioController.checkPermission(req, req.params.consultorio_id)) {
        return res.status(403).json({ message: 'Permissão negada.' });
    }
    try {
        await Consultorios.deletarConsultorio(req.params.consultorio_id);
        res.status(200).send({ message: 'Consultório deletado com sucesso!' });
    } catch (error) {
        res.status(500).send({ message: 'Erro ao deletar consultório' });
    }
}

    static async getConsultoriosByClinica(req,res){
        const clinicaId = req.clinicaId;;
        try {
            const consultorios = await Consultorios.getConsultorioByClinicaId(clinicaId);
            res.status(200).send(consultorios);
        } catch (error) {
            res.status(500).send({ message: 'Erro ao listar consultórios' });
        }
    }

}
module.exports = ConsultorioController;
