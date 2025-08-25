const express = require('express');
const router  = express.Router();
const { createRide, getRides, getRideById, updateRideStatus } = require('../controllers/ride.controller');
const auth    = require('../middleware/auth.middleware');

router.post('/',      auth, createRide);
router.get('/',       getRides);
router.get('/:id',    getRideById);
router.patch('/:id',  auth, updateRideStatus);


module.exports = router;
