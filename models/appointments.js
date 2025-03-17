const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'patient', required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'provider', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'canceled'], default: 'pending' }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
