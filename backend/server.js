require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authMiddleware = require('./authMiddleware'); // Importando o middleware de autenticação

// Importando a conexão com o banco de dados
const db = require('./database');
const app = express();

// Middleware para CORS
app.use(cors()); 

// Use o bodyParser.json() aqui para que ele seja aplicado a todas as rotas
app.use(bodyParser.json());

// Importando as rotas
const pacientesRoutes = require('./backend/routes/pacientesRoutes');
const agendamentosRoutes = require('./backend/routes/agendamentosRoutes');
const cursosRoutes = require('./backend/routes/cursosRoutes');
const usuariosRoutes = require('./backend/routes/usuariosRoutes');
const prontuariosRoutes = require('./backend/routes/prontuariosRoutes');
const clinicasRoutes = require('./backend/routes/clinicasRoutes');
const autorizacoesRoutes = require('./backend/routes/autorizacoesRoutes');

// Definindo as rotas
app.use('/api/pacientes', authMiddleware, pacientesRoutes);
app.use('/api/agendamentos', authMiddleware, agendamentosRoutes);
app.use('/api/cursos', authMiddleware, cursosRoutes); 
app.use('/api/usuarios', usuariosRoutes); // Sem middleware de autenticação
app.use('/api/prontuarios', authMiddleware, prontuariosRoutes); 
app.use('/api/clinicas', clinicasRoutes); 
app.use('/api/autorizacoes', autorizacoesRoutes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
