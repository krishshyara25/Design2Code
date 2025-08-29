
const https = require('https');

const SYSTEM_PROMPT = `You are a world-class AI web design assistant called "Design2Code". Your goal is to help a user design a website by having a conversation.
- Start by asking them to choose a category (e.g., E-commerce, Portfolio, Blog).
- Based on their choice, ask specific follow-up questions to understand their needs (e.g., target audience, required sections, style preferences).
- Once you have enough information, suggest 2-3 suitable color palettes.
- After they choose a color palette, generate the complete HTML code in a single file using Tailwind CSS for styling.
- When the user asks for changes, you MUST take the provided HTML code and their change request, and return the FULL updated HTML code. Do not just describe the change.`;


const generateChatResponse = async (contents, currentCode, changeRequest) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in the environment variables.');
  }

  if (currentCode && changeRequest) {
    contents.push({
      role: 'user',
      parts: [{
        text: `Here is the current HTML code I am working with. Please apply the following change and return the full, updated HTML code. Do not omit any part of the code.\n\nChange Request: "${changeRequest}"\n\n\`\`\`html\n${currentCode}\n\`\`\``
      }]
    });
  }

  const payload = JSON.stringify({
    contents: contents,
    systemInstruction: {
      parts: [{ text: SYSTEM_PROMPT }],
    },
    generationConfig: {
        temperature: 0.7, // Controls randomness. Lower is more predictable.
        topK: 1,
        topP: 1,
        maxOutputTokens: 8192, // Increased token limit for code generation
    },
  });

  const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': payload.length,
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const responseBody = JSON.parse(data);
            const textResponse = responseBody.candidates[0].content.parts[0].text;
            resolve(textResponse);
          } catch (e) {
            reject(new Error('Failed to parse Gemini API response.'));
          }
        } else {
          reject(new Error(`API request failed with status code ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(payload);
    req.end();
  });
};

module.exports = {
  generateChatResponse,
};
