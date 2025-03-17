const express = require('express');
const jwt = require('jsonwebtoken');
const Appointment = require('../models/appointments');

const router = express.Router();

const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json('Authorization required');

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json('Invalid token');
    req.providerId = decoded.id;
    next();
  });
};



router.get('/getAppointments',authenticate, async (req, res) => {
    if (req.user.role !== 'provider') {
      return res.status(403).send({ error: 'Access forbidden' });
    }
  
    try {
      const appointments = await Appointment.find({ providerId: req.user.id })
        .populate('patientId', 'name email') 
        .sort('date');
      res.send(appointments);
    } catch (err) {
      res.status(500).send({ error: 'Failed to fetch appointments' });
    }
  });
module.exports = router;
