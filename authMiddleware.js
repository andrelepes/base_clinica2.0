const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Allow the route for creating a new clinic without authentication
  if (req.path === '/clinicas' && req.method === 'POST') {
    return next();
  }

  let token = req.header('x-auth-token');
  console.log('Token received:', token);  // Added for debugging

  if (!token) {
    console.log('Token not provided.');  // Added for debugging
    return res.status(401).json({ msg: 'Token not provided. Authorization denied.' });
  }

  // Remove the 'Bearer ' prefix if present
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log('Token decoded:', decoded);  // Added for debugging

    // Decode the user information and role
    req.user = decoded.user;
    req.tipoUsuario = decoded.tipoUsuario; 
    req.clinicaId = decoded.clinicaId; // Clinic ID

    next();
  } catch (err) {
    console.log('Error verifying token:', err);  // Added for debugging
    res.status(401).json({ msg: 'Invalid token.' });
  }
};
