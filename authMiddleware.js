const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Permitir a rota para criar uma nova clínica sem autenticação
  if (req.path === '/clinicas' && req.method === 'POST') {
    return next();
  }

  // Adicionar exceção para a rota de registro de usuários
  if (req.path === '/api/usuarios/registrar' && req.method === 'POST') {
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
    console.log('Token decodificado:', decoded);
    console.log('usuario_id no token:', decoded.user.usuario_id);
    console.log('clinica_id no token:', decoded.user.clinica_id);
    console.log('tipousuario no token:', decoded.user.tipousuario);
    
    // Decodificar as informações do usuário e o tipo de usuário
    req.user = decoded.user.usuario_id;
    req.tipousuario = decoded.user.tipousuario;
    req.clinicaId = decoded.user.clinica_id;

  
    next();
  } catch (err) {
    console.log('Erro ao verificar o token:', err);  // Adicionado para depuração
    res.status(401).json({ msg: 'Token inválido.' });
  }
};
