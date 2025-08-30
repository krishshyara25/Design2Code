const express = require('express');
const multer = require('multer');
const { generateCodeFromImage } = require('../controllers/imageToCode');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } 
});
router.post('/image-to-code', upload.single('image'), generateCodeFromImage);

module.exports = router;
