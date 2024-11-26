const Usuarios = require('../models/Usuarios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../database/database');
const { sendMail } = require('../utils/mailService')
const { resolve } = require('path')
require('dotenv').config();

// Middleware para autorização baseada em tipo de usuário
class UserController {
 
  static async register(req, res) {
    try {
      console.log("Início do método de registro");  // Log 1
      const { nome_usuario, email_usuario, senha, tipousuario, clinica_id } = req.body;
  
      console.log("Validando campos obrigatórios");  // Log 2
      if (!nome_usuario || !email_usuario || !senha || !tipousuario) {
        return res.status(400).json({ message: 'Campos obrigatórios faltando' });
      }
  
      console.log("Verificando se o e-mail já existe");  // Log 3
      const usuarioExistente = await db.oneOrNone('SELECT * FROM usuarios WHERE email_usuario = $1', [email_usuario]);
      if (usuarioExistente) {
        return res.status(400).json({ message: 'E-mail já registrado' });
      }
  
      console.log("Criptografando a senha");  // Log 4
      const salt = await bcrypt.genSalt(10);
      const senhaCriptografada = await bcrypt.hash(senha, salt);
  
      // Use a função inserirUsuario para inserir o novo usuário
      console.log("Inserindo novo usuário");  // Log 6
      const resultado = await Usuarios.inserirUsuario(nome_usuario, email_usuario, senhaCriptografada, tipousuario, null);

      if (resultado.success) {
        // Busque o usuário recém-criado para obter o ID
        const usuario = await db.oneOrNone('SELECT * FROM usuarios WHERE email_usuario = $1', [email_usuario]);

        let clinicaIdToUse = null;

        // Se o tipo de usuário é "clinica", use o usuario_id como clinica_id
        if (tipousuario === 'clinica') {
          clinicaIdToUse = usuario.usuario_id;

          // Atualize o clinica_id do usuário original
          await db.none('UPDATE usuarios SET clinica_id = $1 WHERE usuario_id = $2', [clinicaIdToUse, usuario.usuario_id]);
        }

        console.log("Usuário inserido com sucesso");  // Log 7
  
        const payload = {
          user: {
            usuario_id: usuario.usuario_id,
            nome_usuario: nome_usuario,
            tipousuario: tipousuario,
            clinica_id: clinicaIdToUse
          }
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
  
        res.json({ message: resultado.message, token: token });
      } else {
        console.log("Erro ao inserir usuário");  // Log 8
        res.status(500).json({ message: resultado.message });
      }
    } catch (error) {
      console.error(error);
      console.error("Erro no servidor:", error);  // Log 9
      res.status(500).send('Erro no servidor');
    }
  }
  static async login(req, res) {
    const { email_usuario, senha } = req.body;

    try {
        const usuario = await db.oneOrNone('SELECT * FROM usuarios WHERE email_usuario = $1', [email_usuario]);
        if (!usuario) {
            return res.status(400).json({ message: 'Usuário não encontrado' });
        }
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(400).json({ message: 'Senha inválida' });
        }
        const payload = {
            user: {
                usuario_id: usuario.usuario_id,
                tipousuario: usuario.tipousuario,
                clinica_id: usuario.clinica_id           
            }
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '100h' });

        res.json({ message: 'Login realizado com sucesso', token: token, nome: usuario.nome_usuario });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro no servidor');
    }
  }

  static async forgotPassword(req, res) {
    const { email_usuario } = req.body;

    try {
        const usuario = await db.oneOrNone('SELECT * FROM usuarios WHERE email_usuario = $1', [email_usuario]);
        if (!usuario) {
            return res.status(400).json({ message: 'Usuário não encontrado' });
        }

        // Gere um token de redefinição de senha
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiration = Date.now() + 3600000; 

        // Atualize o usuário no banco de dados com o token e a data de expiração
        await db.none('UPDATE usuarios SET resetToken = $1, resetTokenExpiration = $2 WHERE usuario_id = $3', [resetToken, resetTokenExpiration, usuario.usuario_id]);

        // Envie o token por e-mail para o usuário
        await sendEmail(email_usuario, 'Recuperação de Senha', `Seu token é: ${resetToken}`);

        res.json({ message: 'E-mail de recuperação enviado!' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro no servidor');
    }
  }
  static async getUserById(req, res) {
    try {
      const id = req.params.id;
      const user = await Usuarios.buscarPorId(id);
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      res.json({user});
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro no servidor');
    }
  }
  
  static async updateProfile(req, res) {
    // Lógica de atualização de perfil aqui
  }

  static async getAssociatedAppointments(req, res) {
    // Lógica para obter agendamentos associados ao usuário aqui
  }

  static async getAssociatedRecords(req, res) {
    // Lógica para obter prontuários associados ao usuário aqui
  }

  static async addLinkedPsychologist(req, res) {
    try {
      const { nome_usuario, email_usuario, clinicaId } = req.body;
      const resultado = await Usuarios.addLinkedPsychologist({
        nome_usuario,
        email_usuario,
        tipousuario: 'psicologo_vinculado',
        clinica_id: clinicaId,
        status_usuario: 'aguardando confirmacao'
      });
      if (resultado.success) {

        const templatePath = resolve(__dirname, '..', 'views', 'emails', 'firstAccessMail.hbs')

        const variables = {
          name: nome_usuario,
          link: `${process.env.FIRST_ACCESS_MAIL_URL}${resultado.firstAccess}`
        }
        
        await sendMail({
          to: email_usuario, 
          subject: 'Primeiro Acesso - Base Clínica', 
          variables, 
          path: templatePath
        })

        res.status(201).json({ message: 'Psicólogo vinculado adicionado com sucesso!' });
      } else {
        res.status(500).json({ erro: 'Erro ao adicionar psicólogo vinculado.' });
      }
    } catch (error) {
      console.error('Erro ao adicionar psicólogo vinculado:', error);
      res.status(500).json({ erro: 'Ocorreu um erro ao adicionar o psicólogo vinculado.' });
    }
  }  
  static async getLinkedPsychologists(req, res) {
    console.log("Função getLinkedPsychologists chamada");  // Log 1
    try {
      const { clinicaId } = req.params;
      const psychologists = await db.manyOrNone('SELECT * FROM usuarios WHERE clinica_id = $1 AND tipousuario = $2', [clinicaId, 'psicologo_vinculado']);
      res.status(200).json(psychologists);
      console.log("Operação bem-sucedida");  // Log 2
    } catch (error) {
      console.log("Erro na função getLinkedPsychologists:", error);  // Log 3
      res.status(500).json({ error: 'Erro ao buscar psicólogos vinculados' });
    }
  }
  static async updateStatus(req, res) {
    try {
      const { usuario_id } = req.params;
      const { novoStatus } = req.body;
      const resultado = await Usuarios.atualizarStatusUsuario(usuario_id, novoStatus);
      if (resultado.success) {
        res.status(200).json({ message: resultado.message });
      } else {
        res.status(500).json({ message: resultado.message });
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      res.status(500).send('Erro no servidor');
    }
  }
  // Método para adicionar um secretário vinculado
static async addLinkedSecretary(req, res) {
  try {
    const { nome_usuario, email_usuario, clinicaId } = req.body;
    const resultado = await Usuarios.addLinkedSecretary({
      nome_usuario,
      email_usuario,
      tipousuario: 'secretario_vinculado',
      clinica_id: clinicaId,
      status_usuario: 'aguardando confirmacao'
    });
    if (resultado.success) {

      const templatePath = resolve(__dirname, '..', 'views', 'emails', 'firstAccessMail.hbs')

      const variables = {
        name: nome_usuario,
        link: `${process.env.FIRST_ACCESS_MAIL_URL}${resultado.firstAccess}`
      }
      
      await sendMail({
        to: email_usuario, 
        subject: 'Primeiro Acesso - Base Clínica', 
        variables, 
        path: templatePath
      })


      res.status(201).json({ message: 'Secretário vinculado adicionado com sucesso!' });
    } else {
      res.status(500).json({ erro: 'Erro ao adicionar secretário vinculado.' });
    }
  } catch (error) {
    console.error('Erro ao adicionar secretário vinculado:', error);
    res.status(500).json({ erro: 'Ocorreu um erro ao adicionar o secretário vinculado.' });
  }
}

// Método para obter secretários vinculados
static async getLinkedSecretaries(req, res) {
  try {
    const { clinicaId } = req.params;
    const secretaries = await db.manyOrNone('SELECT * FROM usuarios WHERE clinica_id = $1 AND tipousuario = $2', [clinicaId, 'secretario_vinculado']);
    res.status(200).json(secretaries);
  } catch (error) {
    console.error('Erro ao buscar secretários vinculados:', error);
    res.status(500).json({ error: 'Erro ao buscar secretários vinculados' });
  }
};

  static async getFirstAccessInfo(req,res){
    try{
      const {firstAccessToken} = req.params;
      const user = await Usuarios.getUserByFirstAccessToken(firstAccessToken);
      res.status(200).json(user);
    }catch(error){
      res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
  }

  static async createFromFirstAccess(req, res) {
    try {
      const { nome_usuario, email_auxiliar, senha } = req.body;
      const { firstAccessToken } = req.params;

      if (!nome_usuario || !email_auxiliar || !senha) {
        return res
          .status(400)
          .json({ message: 'Campos obrigatórios faltando' });
      }

      const hasToken = await Usuarios.getUserByFirstAccessToken(
        firstAccessToken
      );
      if (!hasToken) {
        return res.status(400).json({ message: 'Usuário já registrado' });
      }

      const salt = await bcrypt.genSalt(10);
      const senhaCriptografada = await bcrypt.hash(senha, salt);

      const resultado = await Usuarios.firstAccess(
        nome_usuario,
        email_auxiliar,
        senhaCriptografada,
        firstAccessToken
      );

      if (resultado.user) {
        // Busque o usuário recém-criado para obter o ID

        const payload = {
          user: resultado.user,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
          expiresIn: '1h',
        });

        res.json({ message: resultado.message, token: token });
      } else {
        res.status(500).json({ message: resultado.message });
      }
    } catch (error) {
      res.status(500).send('Erro no servidor');
    }
  }
  static async getAllPsychologistsFromClinic(req,res){
    try{
      const clinica_id = req.clinicaId;
      const psychologists = await Usuarios.getAllPsychologistsByClinicId(clinica_id);
      res.status(200).json(psychologists);
    }catch(error){
      res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
  }
  static async getPsychologistsHours(req,res){
    try{
      const clinica_id = req.clinicaId;
      const psychologists = await Usuarios.getPsychologistsHoursByClinicId(clinica_id);
      const additionalData = await Usuarios.getAdditionalDataByPsychologist(clinica_id);


      const result = [];
      const additionalDataByPsychologist = {};

      additionalData.forEach(appointment => {
          if (!additionalDataByPsychologist[appointment.usuario_id]) {
              additionalDataByPsychologist[appointment.usuario_id] = [];
          }
          additionalDataByPsychologist[appointment.usuario_id].push(appointment);
      });

      for (const usuarioId in additionalDataByPsychologist) {
          result.push(additionalDataByPsychologist[usuarioId]);
      }

      res.status(200).json({data:psychologists, additional_data: result});
    }catch(error){
      res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
  }
  static async getPsychologistsHoursById(req,res){
    try{
      const user_id = req.user;
      const hours = await Usuarios.getPsychologistHoursById(user_id);

      res.status(200).json(
        hours
      );
    }catch(error){
      console.log(error);
      res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
  }
  static async updateUserByUserId(req,res){
    try {
      const user_id = req.params.usuario_id;
      const {nome_usuario, email_usuario, usuario_id} = req.body
      await Usuarios.updateUserById({user_id, user:{nome_usuario,email_usuario, usuario_id}});

      res.status(200);
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async updateUserInformation(req,res){
    try {
      const user_id = req.params.usuario_id;
      const tipousuario = req.tipousuario;
      await Usuarios.updateUserInformationById(user_id, req.body, tipousuario);

      res.status(200).send();
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async deleteUser(req,res){
    try {
      const user_id = req.params.usuario_id;
      await Usuarios.deleteUserById(user_id);
      res.status(200).send({ message: 'Usuário deletado com sucesso!' });;
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
module.exports = UserController;