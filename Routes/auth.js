const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { JWT_SECRET } = require('../config');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
// Signup
router.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const user = new User({ name, email, password, role });
    await user.save();
    res.status(201).send({ message: 'User created successfully' });
  } catch (err) {
    res.status(400).send({ error: 'User creation failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
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

router.post('/book', authenticate, async (req, res) => {
    const { providerId, date } = req.body;
  
    try {
      // Check if the time slot is available
      const existingAppointment = await Appointment.findOne({ providerId, date });
      if (existingAppointment) {
        return res.status(400).send({ error: 'Time slot unavailable' });
      }
  
      // Create the appointment
      const appointment = new Appointment({
        patientId: req.user.id,
        providerId,
        date,
        status: 'pending'
      });
      await appointment.save();
  
      res.status(201).send({ message: 'Appointment booked successfully', appointment });
    } catch (err) {
      res.status(500).send({ error: 'Booking failed' });
    }
  });
  router.get('/provider', authenticate, async (req, res) => {
    if (req.user.role !== 'provider') {
      return res.status(403).send({ error: 'Access forbidden' });
    }
  
    try {
      const appointments = await Appointment.find({ providerId: req.user.id })
        .populate('patientId', 'name email') // Fetch patient details
        .sort('date');
      res.send(appointments);
    } catch (err) {
      res.status(500).send({ error: 'Failed to fetch appointments' });
    }
  });
  router.get('/provider', authenticate, async (req, res) => {
    if (req.user.role !== 'provider') {
      return res.status(403).send({ error: 'Access forbidden' });
    }
  
    try {
      const appointments = await Appointment.find({ providerId: req.user.id })
        .populate('patientId', 'name email') // Fetch patient details
        .sort('date');
      res.send(appointments);
    } catch (err) {
      res.status(500).send({ error: 'Failed to fetch appointments' });
    }
  });
  const Joi = require('joi');


  // Joi Schema for Signup
  const signupSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('patient', 'provider').required()
  });
  
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
