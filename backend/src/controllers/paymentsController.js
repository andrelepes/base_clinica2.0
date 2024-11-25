const { Payment } = require('mercadopago');
const { v4: uuidV4 } = require('uuid');
const { mercadoClient } = require('../config/mercadopago');
const Pacientes = require('../models/Pacientes');
const Agendamentos = require('../models/Agendamentos');
const PaymentsModel = require('../models/Payments');
const siteUrl = process.env.SITE_URL;
const apiUrl = process.env.API_URL;

class PaymentsController {
  async createPayment(req, res) {
    try {
      const { patient_id } = req.params;
      const patient = await Pacientes.buscarPorId(patient_id);
      const clinicId = req.clinicaId;

      if (!patient) {
        res.status(404).json({ message: 'Patient Not Found' });
      }

      const clinicInfo = await new PaymentsModel().getMonthlyFeeByClinicId(
        clinicId
      );

      const now = new Date();

      const dayToPay = clinicInfo.expires_in_day;

      let monthToPay;

      let yearToPay;

      if (now.getDate() < 10) {
        monthToPay = now.getMonth();
        yearToPay = now.getFullYear();
      } else {
        if (now.getMonth() + 1 > 11) {
          monthToPay = 0;
          yearToPay = now.getFullYear() + 1;
        } else {
          monthToPay = now.getMonth() + 1;
          yearToPay = now.getFullYear();
        }
      }

      const expiresIn = new Date(`${monthToPay + 1}/${dayToPay}/${yearToPay}`);

      const psicologo = await Agendamentos.getNextPsychologistIdByPatientId(
        patient.paciente_id
      );

      if (!clinicInfo) {
        res.status(404).json({ message: 'Monthly Fee Not Found' });
      }

      const monthly_fee = clinicInfo.monthly_fee;

      const paymentCreate = new Payment(mercadoClient);

      const payment_id = uuidV4();

      const patientNameSplited = patient.nome_paciente.split(' ');

      const paymentCreated = await paymentCreate.create({
        body: {
          additional_info: {
            items: [
              {
                id: payment_id,
                title: `Consulta de ${patient.nome_paciente}`,
                description: `Consulta de ${patient.nome_paciente} pela Base Clínica`,
                quantity: 1,
                unit_price: monthly_fee,
                category_id: 'consultas',
                type: 'consultas',
              },
            ],
            payer: {
              first_name: patientNameSplited[0],
              last_name: patientNameSplited
                .slice(1, patientNameSplited.length)
                .join(' '),
            },
          },
          transaction_amount: monthly_fee,
          date_of_expiration: expiresIn,
          description: `Consulta Base Clínica do paciente ${patient.nome_paciente}`,
          payment_method_id: 'pix',
          payer: {
            email: patient.email_paciente,
            // identification: {
            //   type: 'CPF',
            //   number: patient.cpf_paciente.replace(/\.|-/g, ''),
            // },
          },
        },
      });

      const newPayment = {
        payment_id,
        psicologo_id: psicologo.usuario_id,
        expiresIn,
        mercado_id: paymentCreated.id,
        patient_name: patient.nome_paciente,
        amount: paymentCreated.transaction_amount,
        status: paymentCreated.status,
        created_at: paymentCreated.date_created,
        updated_at: paymentCreated.date_last_updated,
        qr_code:
          paymentCreated.point_of_interaction.transaction_data.qr_code_base64,
        pix_code: paymentCreated.point_of_interaction.transaction_data.qr_code,
        pix_url:
          paymentCreated.point_of_interaction.transaction_data.ticket_url,
      };
      await new PaymentsModel().createPayment(
        patient.clinica_id,
        patient.paciente_id,
        newPayment
      );

      res.status(200).json(newPayment);
    } catch (error) {
      console.log(error);
      res.status(500).send('Erro interno do servidor');
    }
  }

  async searchPayments(req, res) {
    try {
      const payment = new Payment(mercadoClient);

      const results = await payment.search({});
      res.json(results);
    } catch (error) {
      console.log(error);
      res.status(500).send('Erro interno do servidor');
    }
  }
  async searchPaymentsByYear(req, res) {
    try {
      const payments = new PaymentsModel();

      const results = await payments.findByYear(req.clinicaId);
      res.json(results);
    } catch (error) {
      console.log(error);
      res.status(500).send('Erro interno do servidor');
    }
  }
}

module.exports = PaymentsController;
