const https = require('https');

function bufferToBase64(buffer) {
  return buffer.toString('base64');
}

async function getCodeFromImageAI(imageBuffer, mimeType) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('FATAL ERROR: GEMINI_API_KEY is not set in .env file');
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Error</title>
  <style>
    body {
      margin: 0;
      font-family: 'Arial', sans-serif;
      background: linear-gradient(135deg, #1e3a8a, #6b21a8);
      color: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .container {
      text-align: center;
      padding: 2rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 1rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(10px);
      max-width: 600px;
      width: 90%;
    }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      color: #ffffff;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }
    p {
      font-size: 1.2rem;
      margin-bottom: 1.5rem;
      color: #e2e8f0;
    }
    button {
      padding: 0.75rem 1.5rem;
      background: linear-gradient(45deg, #3b82f6, #8b5cf6);
      color: white;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 1rem;
      font-weight: bold;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    @media (max-width: 640px) {
      h1 { font-size: 2rem; }
      p { font-size: 1rem; }
      .container { padding: 1.5rem; }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Error</h1>
    <p>API key is missing. Please configure the server.</p>
    <button>Try Again</button>
  </div>
</body>
</html>`;
  }

  const imageBase64 = bufferToBase64(imageBuffer);

  const unifiedPrompt = `
    You are an expert frontend web developer. Your task is to analyze the provided image of a website design and convert it into a single, pixel-perfect, responsive HTML file with modern, eye-catching CSS styling.

    **Instructions:**
    1. **Analyze the Layout**: Identify all elements (headers, footers, buttons, cards, text, images) and their positions. Use semantic HTML5 elements (e.g., <header>, <section>, <article>).
    2. **Extract Styling**: Determine the color palette (use vibrant colors, gradients where appropriate), fonts (use web-safe fonts like 'Arial', 'Helvetica', or Google Fonts like 'Roboto', 'Poppins'), spacing, borders, shadows, and animations (e.g., hover effects, transitions).
    3. **Generate HTML**: Write clean, semantic HTML5 for the structure.
    4. **Generate CSS**: Write modern CSS within a single <style> tag in the <head>. Use Flexbox or Grid for layout, include subtle animations (e.g., hover effects, fade-ins), and apply visually appealing styles like gradients, glassmorphism, or neumorphism. Ensure the design is polished and professional.
    5. **Responsiveness**: Ensure the code is fully responsive for desktop and mobile using media queries (e.g., for max-width: 640px, 768px, 1024px). Adjust font sizes, padding, and layouts for smaller screens.
    6. **Placeholders**: For images, use placeholders from 'https://placehold.co/' with appropriate sizes. For text, use the text visible in the image or reasonable placeholders if text is unclear.
    7. **Visual Appeal**: Incorporate modern design trends like smooth gradients, subtle shadows, rounded corners, and interactive elements (e.g., buttons with hover animations). Ensure the design is visually cohesive and professional.

    **Output Requirements:**
    - Return only the pure HTML code with embedded CSS in a <style> tag.
    - Do not include explanations, comments, or markdown formatting (e.g., \`\`\`html).
    - The output must be a valid HTML document starting with \`<!DOCTYPE html>\` and ending with \`</html>\`.
  `;

  const payload = JSON.stringify({
    contents: [
      {
        role: 'user',
        parts: [
          { text: unifiedPrompt },
          {
            inlineData: {
              mimeType: mimeType,
              data: imageBase64,
            },
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.2,
      topK: 1,
      topP: 1,
      maxOutputTokens: 8192,
      responseMimeType: 'text/plain',
    },
  });

  const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': payload.length,
    },
  };

  return new Promise((resolve, reject) => {
    console.log('Sending image to Gemini Vision API...');
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        console.log('API response status:', res.statusCode);
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const responseBody = JSON.parse(data);
            console.log('API response body:', JSON.stringify(responseBody, null, 2));
            if (responseBody.candidates && responseBody.candidates[0].content.parts[0].text) {
              console.log('Success! Code generated from image');
              resolve(responseBody.candidates[0].content.parts[0].text);
            } else {
              console.error('Empty or invalid response from API:', data);
              reject(new Error('The AI returned an empty or invalid response. The image might be unsupported or the prompt was blocked.'));
            }
          } catch (e) {
            console.error('Error parsing API response:', e.message, data);
            reject(e);
          }
        } else {
          console.error(`API request failed with status ${res.statusCode}: ${data}`);
          reject(new Error(`API request failed with status ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error('API request error:', error.message);
      reject(error);
    });

    req.write(payload);
    req.end();
  }).catch((error) => {
    console.error('Promise rejection:', error.message);
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Error Generating Code</title>
  <style>
    body {
      margin: 0;
      font-family: 'Arial', sans-serif;
      background: linear-gradient(135deg, #1e3a8a, #6b21a8);
      color: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .container {
      text-align: center;
      padding: 2rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 1rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(10px);
      max-width: 600px;
      width: 90%;
    }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      color: #ffffff;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }
    p {
      font-size: 1.2rem;
      margin-bottom: 1.5rem;
      color: #e2e8f0;
    }
    button {
      padding: 0.75rem 1.5rem;
      background: linear-gradient(45deg, #3b82f6, #8b5cf6);
      color: white;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 1rem;
      font-weight: bold;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    @media (max-width: 640px) {
      h1 { font-size: 2rem; }
      p { font-size: 1rem; }
      .container { padding: 1.5rem; }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Error</h1>
    <p>Failed to generate code: ${error.message}</p>
    <button>Try Again</button>
  </div>
</body>
</html>`;
  });
}

module.exports = {
  getCodeFromImageAI,
};