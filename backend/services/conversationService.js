const { v4: uuidv4 } = require('uuid');

const sessions = {};

const dialogueTree = {
    'start': {
        question: "Hello! I'm here to help you design the perfect website. What kind of website are you looking to build today?",
        options: ["E-commerce", "Educational", "Luxury Product", "Portfolio"],
        next: (answer) => 'style'
    },
    'style': {
        question: "Great choice! What feeling or style should the website convey?",
        options: ["Modern & Minimalist", "Playful & Creative", "Elegant & Sophisticated", "Bold & Energetic"],
        next: (answer) => 'audience'
    },
    'audience': {
        question: "Understood. Who is the target audience for this website? (e.g., 'Young professionals', 'Students', 'High-end consumers')",
        isFreeText: true,
        next: (answer) => 'color_suggestion'
    },
    'color_suggestion': {
        generateNextStage: (history) => {
            const style = history.style.answer;
            let palettes = {};
            if (style.includes("Modern")) {
                palettes = {
                    question: "Based on the 'Modern & Minimalist' style, which color palette do you prefer?",
                    options: ["Monochromatic Grays with a single accent color (e.g., blue)", "Black, White, and Gold", "Cool Blues and Off-Whites"]
                };
            } else if (style.includes("Playful")) {
                 palettes = {
                    question: "For a 'Playful & Creative' vibe, which of these palettes excites you?",
                    options: ["Bright Pastels (Coral, Mint, Lavender)", "Vibrant Primary Colors (Red, Yellow, Blue)", "Earthy Tones with a pop of Orange"]
                };
            } else if (style.includes("Elegant")) {
                 palettes = {
                    question: "For an 'Elegant & Sophisticated' look, which palette resonates most?",
                    options: ["Deep Jewel Tones (Emerald, Sapphire, Ruby)", "Cream, Beige, and Soft Gold", "Charcoal Gray, Silver, and a touch of Plum"]
                };
            } else { 
                 palettes = {
                    question: "To feel 'Bold & Energetic', which color scheme should we use?",
                    options: ["High-Contrast Black and Yellow", "Electric Blue and Hot Pink", "Deep Red, Orange, and Black"]
                };
            }
            return { nextStage: 'select_color', ...palettes };
        }
    },
    'select_color': {
        next: (answer) => 'template_suggestion'
    },
    'template_suggestion': {
        generateNextStage: (history) => {
            const category = history.start.answer;
            let templates = {};
            if (category === "E-commerce") {
                templates = {
                    question: "Here are a few layout concepts for your E-commerce site. Which one fits best?",
                    options: [
                        "Template 1: A large hero image with a 'Shop Now' button, followed by a grid of best-selling products.",
                        "Template 2: A minimalist design with a focus on high-quality product photography and lots of white space.",
                        "Template 3: A dynamic layout with a sidebar for categories and filters, and a main area for product listings.",
                        "Template 4: A content-driven approach with blog posts and lookbooks integrated with product links."
                    ]
                };
            } else { 
                 templates = {
                    question: `Perfect. Now for the layout of your ${category} website. Which of these concepts do you prefer?`,
                    options: [
                        "Template A: A full-screen background video on the homepage with centered text and a call-to-action button.",
                        "Template B: A clean, grid-based layout to showcase projects or articles.",
                        "Template C: A single-page scrolling site with distinct sections for About, Services, and Contact.",
                        "Template D: An asymmetrical layout that feels artistic and unique."
                    ]
                };
            }
             return { nextStage: 'select_template', ...templates };
        }
    },
    'select_template': {
        next: (answer) => 'end'
    },
    'end': {
        isEndOfConversation: true,
        generateFinalPrompt: (history) => {
            console.log("Generating final prompt from history:", history);
            return `
                Generate a complete, single-file HTML website with inline CSS and JavaScript. The website must be responsive.
                ---
                **Core Requirements:**
                - **Website Category:** ${history.start.answer}
                - **Target Audience:** ${history.audience.answer}
                - **Desired Style/Vibe:** ${history.style.answer}

                **Design Specifications:**
                - **Color Palette:** ${history.select_color.answer}
                - **Layout Template:** Based on the user's choice: "${history.select_template.answer}"

                **Instructions:**
                - Interpret the chosen layout template creatively and build a full webpage.
                - Ensure the color palette is applied tastefully throughout the design.
                - The final code should be production-ready, well-formatted, and contained within a single HTML file.
            `;
        }
    }
};

function processMessage(sessionId, userAnswer) {
    let session = sessions[sessionId];

    if (!session) {
        session = {
            sessionId: sessionId,
            currentStage: 'start',
            history: {}
        };
        sessions[sessionId] = session;
    } else {
        const currentStageInfo = dialogueTree[session.currentStage];
        if (!currentStageInfo) {
            
            delete sessions[sessionId]; 
            return { error: "An error occurred, please start over." };
        }

        session.history[session.currentStage] = {
            question: currentStageInfo.question, 
        };

        const nextStageKey = currentStageInfo.next(userAnswer);
        session.currentStage = nextStageKey;
    }

    let newStageInfo = dialogueTree[session.currentStage];

    if (newStageInfo.generateNextStage) {
        const dynamicStage = newStageInfo.generateNextStage(session.history);
        session.currentStage = dynamicStage.nextStage;
        
       dialogueTree[session.currentStage].question = dynamicStage.question;

        return {
            sessionId: session.sessionId,
            question: dynamicStage.question,
            options: dynamicStage.options,
            isFreeText: false,
            isComplete: false,
        };
    }

    if (newStageInfo.isEndOfConversation) {
        const finalPrompt = newStageInfo.generateFinalPrompt(session.history);
        delete sessions[sessionId];
        return {
            sessionId: session.sessionId,
            question: "Thank you! I have all the information I need. I'm now generating your website design. Here is the final prompt we constructed:",
            isComplete: true,
            finalPrompt: finalPrompt
        };
    }

    return {
        sessionId: session.sessionId,
        question: newStageInfo.question,
        options: newStageInfo.options || [],
        isFreeText: newStageInfo.isFreeText || false,
        isComplete: false,
    };
}

module.exports = {
    processMessage
};

