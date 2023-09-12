const Clinica = require('../models/Clinica');
const Usuarios = require('../models/Usuarios');  // Importe o modelo Usuarios


exports.listLinkedPsychologists = async (req, res) => {
    try {
        const psychologists = await Clinica.listLinkedPsychologists(req.params.id);
        res.status(200).json(psychologists);
    } catch (err) {
        res.status(500).json({ erro: 'Ocorreu um erro ao listar os psicólogos vinculados. Tente novamente.' });
    }
};

exports.listLinkedSecretaries = async (req, res) => {
    try {
        const secretaries = await Clinica.listLinkedSecretaries(req.params.id);
        res.status(200).json(secretaries);
    } catch (err) {
        res.status(500).json({ erro: 'Ocorreu um erro ao listar os secretários vinculados. Tente novamente.' });
    }
};

exports.addLinkedPsychologist = async (req, res) => {
    try {
      const { clinicaId } = req.params;
      const { nome_usuario, email_usuario } = req.body;
  
      // Verifique se o e-mail já está registrado
      if (await Usuarios.emailJaRegistrado(email_usuario)) {
        return res.status(400).json({ erro: 'E-mail já registrado.' });
      }
  
      // Deixe o campo da senha vazio ou defina um valor padrão
      const senhaPlaceholder = null;
  
      const resultado = await Usuarios.inserirUsuarioVinculado({
        nome_usuario,
        email_usuario,
        senha: senhaPlaceholder,  // Usar o valor placeholder para a senha
        tipousuario: 'psicologo_vinculado',
        clinica_id: clinicaId,
        status_usuario: 'aguardando confirmação'  // Definir status_usuario como "aguardando confirmação"
      });
  
      if (resultado.success) {
        res.status(201).json({ message: 'Psicólogo vinculado adicionado com sucesso!' });
      } else {
        res.status(500).json({ erro: 'Erro ao adicionar psicólogo vinculado.' });
      }
    } catch (error) {
      console.error('Erro ao adicionar psicólogo vinculado:', error);
      res.status(500).json({ erro: 'Ocorreu um erro ao adicionar o psicólogo vinculado.' });
    }
  };
  
module.exports = exports;