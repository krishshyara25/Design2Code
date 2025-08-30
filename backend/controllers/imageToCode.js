const imageService = require('../services/imageService');

async function generateCodeFromImage(req, res) {
  if (!req.file) {
    console.error('No image file uploaded');
    return res.status(400).json({ error: 'No image file was uploaded.' });
  }

  try {
    const imageBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;

    console.log('Processing image:', { filename: req.file.originalname, mimeType, size: req.file.size });

    const generatedCode = await imageService.getCodeFromImageAI(imageBuffer, mimeType);

    if (generatedCode) {
      console.log('Code generated successfully');
      res.status(200).json({ code: generatedCode });
    } else {
      console.error('No code returned from imageService');
      res.status(500).json({ error: 'Failed to generate code from the image.' });
    }
  } catch (error) {
    console.error('Error in image generation controller:', error.message, error.stack);
    res.status(500).json({ error: error.message || 'An internal server error occurred.' });
  }
}

module.exports = {
  generateCodeFromImage,
};