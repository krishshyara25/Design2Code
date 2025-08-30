const imageService = require('../services/imageService');

async function generateCodeFromImage(req, res) {
    if (!req.file) {
        return res.status(400).json({ error: 'No image file was uploaded.' });
    }

    try {
        const imageBuffer = req.file.buffer;
        const mimeType = req.file.mimetype;

        const generatedCode = await imageService.getCodeFromImageAI(imageBuffer, mimeType);

        if (generatedCode) {
            res.status(200).json({ code: generatedCode });
        } else {
            res.status(500).json({ error: 'Failed to generate code from the image.' });
        }

    } catch (error) {
        console.error('Error in image generation controller:', error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
}

module.exports = {
    generateCodeFromImage,
};