const express = require('express');
const router  = express.Router();
const { registerUser, loginUser, getUserByEmail } = require('../controllers/auth.controller');
const auth = require('../middleware/auth.middleware');

router.post('/register', registerUser);
router.post('/login',    loginUser);
router.get('/user-by-email/:email', auth, getUserByEmail);

module.exports = router;
