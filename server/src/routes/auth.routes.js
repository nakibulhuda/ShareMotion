// server/src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const User = require('../models/user.model'); // adjust your export

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // TODO: hash password, validate input, save new User
    res.status(201).json({ message: 'Registration endpoint hit', data: { name, email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
