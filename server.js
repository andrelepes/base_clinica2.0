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

// Rota de teste
app.get('/test', (req, res) => {
    res.send('Test route');
});

// Importando as rotas
const pacientesRoutes = require('./pacientesRoutes');
const psicologosRoutes = require('./psicologosRoutes');
const agendamentosRoutes = require('./agendamentosRoutes');
const cursosRoutes = require('./cursosRoutes');
const usuariosRoutes = require('./usuariosRoutes');
const prontuariosRoutes = require('./prontuariosRoutes');
const clinicasRoutes = require('./clinicasRoutes'); // Importando as rotas de clínicas

// Definindo as rotas
app.use('/api/pacientes', authMiddleware, pacientesRoutes);
app.use('/api/psicologos', authMiddleware, psicologosRoutes);
app.use('/api/agendamentos', authMiddleware, agendamentosRoutes);
app.use('/api/cursos', authMiddleware, cursosRoutes); 
app.use('/api/usuarios', usuariosRoutes); // Sem middleware de autenticação
app.use('/api', authMiddleware, prontuariosRoutes); // Com middleware de autenticação
app.use('/api/clinicas', authMiddleware, clinicasRoutes); // Com middleware de autenticação

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
