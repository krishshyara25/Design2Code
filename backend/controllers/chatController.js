
const conversationService = require('../services/conversationService');

const handleChatSession = (req, res) => {
    try {
        const { sessionId, answer } = req.body;

        if (!sessionId) {
            return res.status(400).json({ error: 'Session ID is required.' });
        }

        const response = conversationService.processMessage(sessionId, answer);

        res.status(200).json(response);

    } catch (error) {
        console.error('Error in chatController:', error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
};

module.exports = {
    handleChatSession,
};
