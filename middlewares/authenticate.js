const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

// Middleware to authenticate users
const authenticate = (req, res, next) => {
  const token = req.headers.authorization; // Get the token from the Authorization header

  if (!token) {
    return res.status(401).send({ error: 'Access denied. No token provided.' });
  }

  try {
    // Verify and decode the JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach decoded token data (like user ID, role) to the request
    next(); // Move to the next middleware or route handler
  } catch (err) {
    res.status(400).send({ error: 'Invalid or expired token' });
  }
};

module.exports = authenticate;
