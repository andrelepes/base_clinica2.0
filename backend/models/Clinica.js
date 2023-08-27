const mongoose = require('mongoose');

const ClinicaSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    tipoUsuario: {
        type: String,
        enum: ['Clinica', 'PsicologoAutonomo', 'PsicologoVinculado', 'SecretarioVinculado'],
        required: true
    },
    cpfCnpj: {
        type: String,
        required: true
    },
    telefone: {
        type: String,
        required: true
    },
    cep: {
        type: String,
        required: true
    },
    endereco: {
        type: String,
        required: true
    },
    psicologosVinculados: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    }],
    secretariosVinculados: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    }]
    // Outros campos relevantes
});

module.exports = mongoose.model('Clinica', ClinicaSchema);
