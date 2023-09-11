const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Permitir a rota para criar uma nova clínica sem autenticação
  if (req.path === '/clinicas' && req.method === 'POST') {
    return next();
  }

  let token = req.header('x-auth-token');
  console.log('Token recebido:', token);  // Adicionado para depuração

  if (!token) {
    console.log('Token não fornecido.');  // Adicionado para depuração
    return res.status(401).json({ msg: 'Token não fornecido. Autorização negada.' });
  }

  // Remover o prefixo 'Bearer ' se presente
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log('Token decodificado:', decoded);  // Adicionado para depuração

    // Decodificar as informações do usuário e o tipo de usuário
    req.user = decoded.usuario_id;
    req.tipoUsuario = decoded.tipousuario;
    req.clinicaId = decoded.clinica_id; // Atualize para o novo nome da coluna
  
    next();
  } catch (err) {
    console.log('Erro ao verificar o token:', err);  // Adicionado para depuração
    res.status(401).json({ msg: 'Token inválido.' });
  }
};
