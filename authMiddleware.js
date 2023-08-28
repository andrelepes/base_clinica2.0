const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    console.log(`Entrou no middleware de autenticação. Rota: ${req.path}, Método: ${req.method}`);  // Nova mensagem de depuração

    // Permitir a rota de criação de nova clínica sem autenticação
    if (req.path === '/api/clinicas' && req.method === 'POST') {
        console.log("Rota de criação de nova clínica. Passando sem autenticação.");  // Nova mensagem de depuração
        return next();
    }

    let token = req.header('x-auth-token');
    console.log("Token recebido:", token);  // Já existente

    if (!token) {
        console.log("Token não fornecido.");  // Já existente
        return res.status(401).json({ msg: 'Token não fornecido. Autorização negada.' });
    }

    // Remover o prefixo "Bearer " se presente
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log("Token decodificado:", decoded);  // Já existente

        // Decodificar as informações do usuário e tipo
        req.user = decoded.user;
        req.userType = decoded.userType;  // Novo: Tipo de usuário
        req.clinicaId = decoded.clinicaId; // Novo: Clínica ID

        next();
    } catch (err) {
        console.log("Erro ao verificar o token:", err);  // Já existente
        res.status(401).json({ msg: 'Token inválido.' });
    }
};
