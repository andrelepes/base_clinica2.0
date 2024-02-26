const { verify } = require('jsonwebtoken');

module.exports = async function ensureAuthenticated(request, response, next) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response
      .status(401)
      .json({ msg: 'Token não fornecido. Autorização negada.' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const { user } = verify(token, process.env.JWT_SECRET_KEY);
    // Decodificar as informações do usuário e o tipo de usuário
    request.user = user.usuario_id;
    request.tipousuario = user.tipousuario;
    request.clinicaId = user.clinica_id;

    next();
  } catch (err) {
    response.status(401).json({ msg: 'Token inválido.' });
  }
}
