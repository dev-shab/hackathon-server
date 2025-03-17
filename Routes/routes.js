const express = require('express');
const jwt = require('jsonwebtoken');
const Appointment = require('../models/Appointment');
const router = express.Router();

// Middleware to verify JWT
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send({ error: 'Access denied' });

  try {
    const decoded = jwt.verify(token, require('../config').JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send({ error: 'Invalid token' });
  }
};

// Book an appointment
router.post('/book', authenticate, async (req, res) => {
  const { providerId, date } = req.body;
  try {
    const appointment = new Appointment({ patientId: req.user.id, providerId, date });
    await appointment.save();
    res.status(201).send({ message: 'Appointment booked successfully' });
  } catch (err) {
    res.status(400).send({ error: 'Booking failed' });
  }
});

// Get provider's appointments
router.get('/provider', authenticate, async (req, res) => {
  if (req.user.role !== 'provider') return res.status(403).send({ error: 'Access forbidden' });

  try {
    const appointments = await Appointment.find({ providerId: req.user.id }).populate('patientId');
    res.send(appointments);
  } catch (err) {
    res.status(500).send({ error: 'Failed to fetch appointments' });
  }
});

// Joi schema for updating appointment status
const updateAppointmentSchema = Joi.object({
    appointmentId: Joi.string().required(),
    status: Joi.string().valid('pending', 'confirmed', 'canceled').required()
  });
  
  // Update Appointment Status API
  router.patch('/update', authenticate, async (req, res) => {
    const { error } = updateAppointmentSchema.validate(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });
  
    const { appointmentId, status } = req.body;
  
    if (req.user.role !== 'provider') {
      return res.status(403).send({ error: 'Access forbidden' });
    }
  
    try {
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment || appointment.providerId.toString() !== req.user.id) {
        return res.status(404).send({ error: 'Appointment not found' });
      }
  
      appointment.status = status;
      await appointment.save();
      res.send({ message: 'Appointment updated successfully', appointment });
    } catch (err) {
      res.status(500).send({ error: 'Failed to update appointment' });
    }
  });
  
  const Appointment = require('../models/Appointment');

// Joi schema for booking an appointment
const bookAppointmentSchema = Joi.object({
  providerId: Joi.string().required(),
  date: Joi.date().required() // ISO date format
});

// Book Appointment API
router.post('/book', authenticate, async (req, res) => {
  const { error } = bookAppointmentSchema.validate(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });

  const { providerId, date } = req.body;

  try {
    const existingAppointment = await Appointment.findOne({ providerId, date });
    if (existingAppointment) {
      return res.status(400).send({ error: 'Time slot unavailable' });
    }

    const appointment = new Appointment({
      patientId: req.user.id,
      providerId,
      date,
      status: 'pending'
    });

    await appointment.save();
    res.status(201).send({ message: 'Appointment booked successfully', appointment });
  } catch (err) {
    res.status(500).send({ error: 'Failed to book appointment' });
  }
});
// Joi schema for login
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  });
  
  // Login API
  router.post('/login', async (req, res) => {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });
  
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).send({ error: 'User not found' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).send({ error: 'Invalid credentials' });
  
      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
      res.send({ token });
    } catch (err) {
      res.status(500).send({ error: 'Login failed' });
    }
  });
  
  const Joi = require('joi');
const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_SECRET } = require('../config');

// Joi schema for signup
const signupSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('patient', 'provider').required()
});

// Signup API
router.post('/signup', async (req, res) => {
  const { error } = signupSchema.validate(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });

  const { name, email, password, role } = req.body;
  try {
    const user = new User({ name, email, password, role });
    await user.save();
    res.status(201).send({ message: 'User created successfully' });
  } catch (err) {
    res.status(400).send({ error: 'User creation failed' });
  }
});

module.exports = router;
