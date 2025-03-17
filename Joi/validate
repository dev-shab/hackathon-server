const Joi = require('joi');



const vitalsSchema = Joi.object({
  height: Joi.number().required(),
  weight: Joi.number().required(),
  bloodPressure: Joi.object({
    systolic: Joi.number().required(),
    diastolic: Joi.number().required()
  }).required(),
  heartRate: Joi.number().required(),
  bodyTemperature: Joi.number().required(),
});

const medicalHistorySchema = Joi.object({
  condition: Joi.string().required(),
  dateDiagnosed: Joi.date().required(),
  notes: Joi.string().optional()
});

module.exports = { vitalsSchema, medicalHistorySchema };
