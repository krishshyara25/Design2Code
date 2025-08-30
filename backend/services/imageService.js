const https = require('https');

function bufferToBase64(buffer) {
    return buffer.toString('base64');
}


async function getCodeFromImageAI(imageBuffer, mimeType) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error("FATAL ERROR: GEMINI_API_KEY is not set in your .env file.");
        return "Server configuration error: The API key is missing.";
    }

    const imageBase64 = bufferToBase64(imageBuffer);

    const unifiedPrompt = `
        You are an expert frontend web developer. Your task is to analyze the provided image of a website design and convert it into a single, pixel-perfect, responsive HTML file.

        **Instructions:**
        1.  **Analyze the Layout:** Identify all elements (headers, footers, buttons, cards, text, images) and their positions.
        2.  **Extract Styling:** Determine the color palette, fonts (or suggest suitable web-safe fonts if unknown), spacing, borders, and shadows.
        3.  **Generate HTML:** Write clean, semantic HTML5 for the structure.
        4.  **Generate CSS:** Write all CSS within a single <style> tag in the <head> of the HTML document. Use modern CSS practices like Flexbox or Grid for layout.
        5.  **Responsiveness:** Ensure the final code is fully responsive and looks good on both desktop and mobile screens. Use media queries where necessary.
        6.  **Placeholders:** For images in the design, use appropriate placeholder images from a service like 'https://placehold.co/'. For text, use the text from the image.

        **Output Requirements:**
        -   The response must be **only the pure HTML code**.
        -   Do not include any explanations, comments, or markdown formatting (like \`\`\`html).
        -   The final output must be a valid HTML document starting with \`<!DOCTYPE html>\` and ending with \`</html>\`.
    `;

    const payload = JSON.stringify({
        contents: [
            {
                role: "user",
                parts: [
                    { text: unifiedPrompt },
                    {
                        inlineData: {
                            mimeType: mimeType,
                            data: imageBase64
                        }
                    }
                ]
            }
        ],
        generationConfig: {
            temperature: 0.2, 
            topK: 1,
            topP: 1,
            maxOutputTokens: 8192,
            responseMimeType: "text/plain",
        }
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
        console.log("Sending image to Gemini Vision API...");
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        const responseBody = JSON.parse(data);
                        if (responseBody.candidates && responseBody.candidates[0].content.parts[0].text) {
                            console.log("Success! Code has been generated from the image.");
                            resolve(responseBody.candidates[0].content.parts[0].text);
                        } else {
                            console.error('Image prompt was likely blocked or response is empty:', data);
                            reject(new Error("The AI returned an empty response. The image might be unsupported or the prompt was blocked."));
                        }
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    console.error(`Image API request failed with status code ${res.statusCode}: ${data}`);
                    reject(new Error(`Image API request failed with status code ${res.statusCode}`));
                }
            });
        });
        req.on('error', reject);
        req.write(payload);
        req.end();
    });
}

module.exports = {
    getCodeFromImageAI,
};
