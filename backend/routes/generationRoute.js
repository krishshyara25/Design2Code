const express = require('express');
const router = express.Router();
const generationController = require('../controllers/generationController');

router.post('/', generationController.generateCode);

module.exports = router;
