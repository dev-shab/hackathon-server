const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const dotenv=require("dotenv")
const patientRoutes = require('./routes/patientRoutes');
const providerRoutes = require('./routes/providerRoutes');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
 
 dotenv.config();
const app = express();
app.use(helmet());
app.use(cors()); // Enable CORS

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('Database connection error:', err));

// Routes
// app.use('/auth', require('./routes/auth'));
// app.use('/auth', require('./routes/patientRoutes'));
// app.use('/appointment', require('./routes/routes'));
app.use('/api/auth', authRoutes); // Auth routes for registration and login
app.use('/api/patient', patientRoutes); // Patient-related routes
app.use('/api/provider', providerRoutes);

// Start server
app.listen(8090, () => console.log('Server running on port 8090'));
