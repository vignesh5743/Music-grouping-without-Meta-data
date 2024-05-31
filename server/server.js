const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
// Middleware
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/MusicUser', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// When successfully connected
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

// When connection throws an error
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// MongoDB Schema
const signUpSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const SignUp = mongoose.model('SignUp', signUpSchema);

// Routes
app.post('/api/signup', (req, res) => {
  const { username, email, password } = req.body;

  const newUser = new SignUp({
    username,
    email,
    password,
  });

  newUser.save() // Using promise instead of callback
    .then(() => {
      res.status(200).send('User saved successfully');
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error saving user');
    });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
