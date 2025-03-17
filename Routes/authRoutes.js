const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const Patient = require('../models/patient');
const Provider = require('../models/users');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password, dateOfBirth, gender, role } = req.body;

  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    dateOfBirth: Joi.date().required(),
    gender: Joi.string().valid('male', 'female', 'other').required(),
    role: Joi.string().valid('patient', 'provider').required(),
  });

  const { error } = schema.validate({ name, email, password, dateOfBirth, gender, role });
  if (error) return res.status(400).json(error.details[0].message);

  try {
    let user;
    if (role === 'patient') {
      user = await Patient.findOne({ email });
    } else {
      user = await Provider.findOne({ email });
    }

    if (user) return res.status(400).json('User already exists');


    if (role === 'patient') {
      user = new Patient({ name, email, password: password, dateOfBirth, gender });
    } else {
      user = new Provider({ name, email, password: password,role:role });
    }

    await user.save();
    res.status(201).json({user_id:user.id, message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({message:err,error:'Server error'});
  }
});

// Login a patient or provider
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('patient', 'provider').required(),
  });

  const { error } = schema.validate({ email, password, role });
  if (error) return res.status(400).json(error.details[0].message);

  try {
    let user;
    if (role === 'patient') {
      user = await Patient.findOne({ email });
    } else {
      user = await Provider.findOne({ email });
    }

    if (!user) return res.status(400).json('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json('Invalid credentials');

    const token = jwt.sign({ id: user._id, role:role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json('Server error');
  }
});

module.exports = router;
