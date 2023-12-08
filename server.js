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
// Middleware para definir o cabeçalho Content-Type para UTF-8
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
});
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
const consultoriosRoutes = require('./backend/routes/consultoriosRoutes'); 
const disponibilidadeRoutes = require('./backend/routes/disponibilidadeRoutes'); 



// Definindo as rotas
app.use('/api/pacientes', authMiddleware, pacientesRoutes);
app.use('/api/agendamentos', authMiddleware, agendamentosRoutes);
app.use('/api/cursos', authMiddleware, cursosRoutes); 
app.use('/api/usuarios', usuariosRoutes); // Sem middleware de autenticação
app.use('/api/prontuarios', authMiddleware, prontuariosRoutes); 
app.use('/api/clinicas', authMiddleware, clinicasRoutes); 
app.use('/api/autorizacoes', authMiddleware, autorizacoesRoutes);
app.use('/api/consultorios', authMiddleware, consultoriosRoutes);
app.use('/api/disponibilidade', authMiddleware, disponibilidadeRoutes);
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
