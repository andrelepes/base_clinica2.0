const ClinicMessages = require('../models/ClinicMessages');

class ClinicMessagesController {
  async getAllMessagesByUserId(req, res) {
    try {
      const clinicMessages = new ClinicMessages();
      const userId = req.user;
      const messages = await clinicMessages.getMessagesById(userId);
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllMessagesByClinicId(req, res) {
    try {
      const clinicMessages = new ClinicMessages();
      const clinicId = req.clinicaId;
      const messages = await clinicMessages.getMessagesByClinicId(clinicId);
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createMessage(req, res) {
    try {
      const clinicMessages = new ClinicMessages();
      const { subject, message, usuario_id } = req.body;
      const data = { subject, message };
      const clinicId = req.clinicaId;
      await clinicMessages.create(clinicId, data, usuario_id);

      res.status(201).json({ message: 'Mensagem criada com sucesso.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateMessageById(req, res) {
    try {
      const clinicMessages = new ClinicMessages();
      const { subject, message, usuario_id } = req.body;
      const data = { subject, message, usuario_id: usuario_id ? usuario_id : null };
      const messageId = req.params.messageId;
      await clinicMessages.update(messageId, data);

      res.status(200).json({ message: 'Mensagem atualizada com sucesso.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async deleteMessageById(req, res) {
    try {
      const clinicMessages = new ClinicMessages();
      const messageId = req.params.messageId;
      await clinicMessages.delete(messageId);

      res.status(200).json({ message: 'Mensagem deletada com sucesso.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ClinicMessagesController;
