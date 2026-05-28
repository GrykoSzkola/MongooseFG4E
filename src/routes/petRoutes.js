const express = require('express');
const router = express.Router();
const { 
  getDashboard, 
  feedPet, 
  playPet, 
  sleepPet 
} = require('../controllers/petController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

router.use(ensureAuthenticated);

router.get('/dashboard', getDashboard);
router.post('/feed', feedPet);
router.post('/play', playPet);
router.post('/sleep', sleepPet);

module.exports = router;