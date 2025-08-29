const generationService = require('../services/generationService');

const generateCode = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'A prompt is required to generate code.' });
        }

        const generatedCode = await generationService.getCodeFromAI(prompt);

        if (generatedCode) {
            res.status(200).json({ code: generatedCode });
        } else {
            res.status(500).json({ error: 'Failed to generate code from the AI model.' });
        }

    } catch (error) {
        console.error('Error in generationController:', error);
        res.status(500).json({ error: 'An internal server error occurred during code generation.' });
    }
};

module.exports = {
    generateCode,
};
