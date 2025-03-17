// models/Patient.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  
  vitals: {
    height: { type: Number }, 
    weight: { type: Number }, 
    bloodPressure: { 
      systolic: { type: Number },
      diastolic: { type: Number }
    },
    heartRate: { type: Number }, 
    bodyTemperature: { type: Number }, 
  },

  
  medicalHistory: [{
    condition: { type: String }, 
    dateDiagnosed: { type: Date },
    notes: { type: String }
  }],

  role: { type: String, enum: ['patient'], default: 'patient' }
});

PatientSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('Patient', PatientSchema);
