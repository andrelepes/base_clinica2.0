const { verify } = require('jsonwebtoken');

module.exports = async function ensureAuthenticated(request, response, next) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ msg: 'Token não fornecido. Autorização negada.' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const { sub } = verify(token, process.env.JWT_SECRET_KEY);
    console.log(sub);
    // Decodificar as informações do usuário e o tipo de usuário
    req.user = decoded.user.usuario_id;
    req.tipousuario = decoded.user.tipousuario;
    req.clinicaId = decoded.user.clinica_id;

    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token inválido.' });
  }
}
