const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  
  // Vitals
  vitals: {
    height: { type: Number }, // in cm
    weight: { type: Number }, // in kg
    bloodPressure: { 
      systolic: { type: Number },
      diastolic: { type: Number }
    },
    heartRate: { type: Number }, // in bpm
    bodyTemperature: { type: Number }, // in °C
  },

  // Medical History
  medicalHistory: [{
    condition: { type: String }, // e.g., "Diabetes", "Hypertension"
    dateDiagnosed: { type: Date },
    notes: { type: String }
  }],

  // Role
  role: { type: String, enum: ['patient'], default: 'patient' }
});

// Password encryption (same as in User model)
PatientSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('Patient', PatientSchema);

  // {
  //   "_id": "unique_patient_id",
  //   "name": "John Doe",
  //   "dob": "1985-06-15",
  //   "contact": {
  //     "phone": "123-456-7890",
  //     "email": "johndoe@example.com"
  //   },
  //   "address": "123 Main St, Springfield",
  //   "metrics": {
  //     "height": 170,
  //     "weight": 70,
  //     "blood_pressure": "120/80",
  //     "heart_rate": 72
  //   },
  //   "provider_id": "unique_provider_id"
  // }
  