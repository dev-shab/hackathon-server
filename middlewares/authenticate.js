const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization; 

  if (!token) {
    return res.status(401).send({ error: 'Access denied. No token provided.' });
  }

  try {
    
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; 
    next(); 
  } catch (err) {
    res.status(400).send({ error: 'Invalid or expired token' });
  }
};

module.exports = authenticate;
