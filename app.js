const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { MONGO_URI } = require('./config');
const helmet = require('helmet');

app.use(helmet()); // Secure the app by adding Helmet middleware

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('Database connection error:', err));

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/appointment', require('./routes/appointment'));

// Start server
app.listen(3000, () => console.log('Server running on port 3000'));
