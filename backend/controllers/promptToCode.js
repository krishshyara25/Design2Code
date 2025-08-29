// const { generateChatResponse } = require('../services/geminiService');

// /**
//  * @desc Handles the incoming chat request, communicates with the AI service,
//  * and sends back the generated response.
//  * @param {object} req - Express request object
//  * @param {object} res - Express response object
//  * @param {function} next - Express next middleware function
//  */
// const handleDesignChat = async (req, res, next) => {
//   try {

//     const { contents, currentCode, changeRequest } = req.body;

//     if (!contents || !Array.isArray(contents)) {
//       res.status(400); 
//       throw new Error('Conversation history ("contents") is required and must be an array.');
//     }

//     const aiResponse = await generateChatResponse(contents, currentCode, changeRequest);
//     res.status(200).json({
//       success: true,
//       data: aiResponse,
//     });
//   } catch (error) {
//     console.error('Error in handleDesignChat:', error.message);
//     next(error);
//   }
// };

// module.exports = {
//   handleDesignChat,
// };
