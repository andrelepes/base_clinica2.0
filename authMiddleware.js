const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    let token = req.header('x-auth-token');
    console.log("Token recebido:", token);  // Adicionado para depuração

    if (!token) {
        console.log("Token não fornecido.");  // Adicionado para depuração
        return res.status(401).json({ msg: 'Token não fornecido. Autorização negada.' });
    }

    // Remover o prefixo "Bearer " se presente
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log("Token decodificado:", decoded);  // Adicionado para depuração

        // Decodificar as informações do usuário e tipo
        req.user = decoded.user;
        req.userType = decoded.userType;  // Novo: Tipo de usuário
        req.clinicaId = decoded.clinicaId; // Novo: Clínica ID

        next();
    } catch (err) {
        console.log("Erro ao verificar o token:", err);  // Adicionado para depuração
        res.status(401).json({ msg: 'Token inválido.' });
    }
};
