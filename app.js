const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const dotenv=require("dotenv")
const patientRoutes = require('./Routes/patientRoutes');
const providerRoutes = require('./Routes/providerRoutes');
const authRoutes = require('./Routes/authRoutes');
const cors = require('cors');
 
 dotenv.config();
const app = express();
app.use(helmet());
app.use(cors()); 

app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('Database connection error:', err));


app.use('/api/auth', authRoutes); 
app.use('/api/patient', patientRoutes); 
app.use('/api/provider', providerRoutes);

app.listen(8090, () => console.log('Server running on port 8090'));
