const express = require('express');
const multer = require('multer');
const { generateCodeFromImage } = require('../controllers/imageToCode');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpeg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PNG and JPEG images are allowed'), false);
    }
  },
});

router.post('/image-to-code', upload.single('image'), generateCodeFromImage);

module.exports = router;