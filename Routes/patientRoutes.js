const express = require('express');
const jwt = require('jsonwebtoken');
const Appointment = require('../models/appointments');
const Patient = require('../models/patient');
const Joi = require('joi');
const { vitalsSchema } = require('../Joi/validate');
const { medicalHistorySchema } = require('../Joi/validate');

const router = express.Router();



const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');  // Extract token from the Authorization header
  
  if (!token) {
    return res.status(401).send('Access Denied: No token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using your secret
    req.user = decoded;  // Attach the decoded token (user information) to req.user
    next();  // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(403).send('Invalid or expired token');
  }
};



// Book an appointment
router.post('/bookAppointment', authenticate, async (req, res) => {
  const { providerId, date } = req.body;
console.log("I am here========>",req.user)
  try {
    const appointment = new Appointment({
    patientId: req.user.id,
    providerId: providerId,
      date,
    });
    await appointment.save();
    res.status(201).json({ message: 'Appointment booked successfully' });
  } catch (err) {
    res.status(500).json({error:err,message:'Server error'});
  }
});
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
  



router.get('/vitals', authenticate, async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id);
    if (!patient) return res.status(404).send('Patient not found');
    res.send(patient.vitals);
  } catch (error) {
    res.status(500).send({error:error,message:'Internal Server Error'});
  }
});

router.get('/medical-history', authenticate, async (req, res) => {
  try {
    const patient = await Patient.findById(req.user._id);
    if (!patient) return res.status(404).send('Patient not found');
    res.send(patient.medicalHistory);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

router.put('/vitals', authenticate, async (req, res) => {
    const { error } = vitalsSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    console.log("patient=======>",req.user)

    try {
      const patient = await Patient.findById(req.user.id);
      console.log("patient=======>111",patient)
      if (!patient) return res.status(404).send('Patient not found');
      patient.vitals = req.body;
      await patient.save();
      res.send('Vitals updated successfully');
    } catch (error) {
        res.status(500).send({error:error,message:'Internal Server Error'});
    }
  });
  
  router.put('/medical-history', authenticate, async (req, res) => {
    const { error } = medicalHistorySchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    try {
      const patient = await Patient.findById(req.user._id);
      if (!patient) return res.status(404).send('Patient not found');
      patient.medicalHistory.push(req.body);
      await patient.save();
      res.send('Medical history updated successfully');
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  });
  
  

module.exports = router;
