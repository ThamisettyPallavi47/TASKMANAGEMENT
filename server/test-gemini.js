// require('dotenv').config();
// const { GoogleGenerativeAI } = require('@google/generative-ai');

// async function testGeminiAPI() {
//     console.log('=== Testing Gemini API ===\n');
//     console.log('API Key:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 15) + '...' : 'NOT FOUND');

//     if (!process.env.GEMINI_API_KEY) {
//         console.error('ERROR: GEMINI_API_KEY not found in .env file');
//         process.exit(1);
//     }

//     try {
//         const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//         console.log('✓ GoogleGenerativeAI instance created\n');

//         // Use gemini-2.5-flash model (matches working Postman configuration)
//         console.log('Attempting to use model: gemini-2.5-flash');
//         const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
//         console.log('✓ Model instance created\n');

//         console.log('Sending test message...');
//         const result = await model.generateContent("Say hello in exactly one short sentence.");
//         const response = await result.response;
//         const text = response.text();

//         console.log('\n✅ SUCCESS! Gemini API is working perfectly!\n');
//         console.log('AI Response:', text);
//         console.log('\n✓ API Key is VALID');
//         console.log('✓ Network connection is working');
//         console.log('✓ Model is accessible\n');

//     } catch (error) {
//         console.error('\n❌ FAILED: Gemini API test failed\n');
//         console.error('Error Details:');
//         console.error('  - Name:', error.name);
//         console.error('  - Message:', error.message);

//         if (error.status) {
//             console.error('  - HTTP Status:', error.status);
//         }

//         console.error('\n');

//         if (error.status === 400) {
//             console.error('⚠️  400 Bad Request - API key might be invalid or restricted');
//             console.error('   Solution: Generate a new API key at https://aistudio.google.com/apikey');
//         } else if (error.status === 404) {
//             console.error('⚠️  404 Not Found - Model unavailable');
//             console.error('   The model "gemini-pro" might not be available in your region');
//             console.error('   or your API key might not have access to it.');
//         } else if (error.message && (error.message.includes('API_KEY') || error.message.includes('API key'))) {
//             console.error('⚠️  API Key Error');
//             console.error('   Please verify your API key at: https://aistudio.google.com/apikey');
//         } else if (error.message && error.message.includes('quota')) {
//             console.error('⚠️  Quota Exceeded');
//             console.error('   Your API quota has been exceeded.');
//         } else if (error.message && error.message.includes('fetch')) {
//             console.error('⚠️  Network Error');
//             console.error('   Cannot connect to Google AI services.');
//             console.error('   Check your internet connection or firewall settings.');
//         }

//         console.error('\nFull error for debugging:');
//         console.error(error);

//         process.exit(1);
//     }
// }

// console.log('Starting Gemini API test...\n');
// testGeminiAPI();


// const fetch = require("node-fetch");

// const response = await fetch(
//     `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//     {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//             contents: [{ parts: [{ text: message }] }]
//         })
//     }
// );

// const data = await response.json();

// console.log("🔥 RAW GEMINI RESPONSE:", JSON.stringify(data, null, 2));

// const reply =
//     data?.candidates?.[0]?.content?.parts?.[0]?.text;

// if (!reply) {
//     return res.status(500).json({ error: "No reply", data });
// }

// res.json({ reply });



/**
 * Standalone Gemini API test file
 * Run using: node test-gemini.js
 */

require("dotenv").config();
// const fetch = require("node-fetch"); // Native fetch available in Node.js v18+

// --------------------
// SYSTEM PROMPT (same as chatbot)
// --------------------
const SYSTEM_PROMPT = `
You are an AI assistant for a Student Task Management System website.

The website allows students to:
- Create, update, and delete tasks
- Track pending, completed, and overdue tasks
- View analytics and productivity insights
- Manage study schedules

Your role:
- Answer questions related to this website only
- Help users understand features and productivity
- Keep answers short, clear, and student-friendly
- Avoid generic or unrelated responses
`;

// --------------------
// Test message (change this freely)
// --------------------
const USER_MESSAGE = "How can I add a new task?";

// --------------------
// Gemini API call
// --------------------
async function testGemini() {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is missing in .env file");
        }

        console.log("🔑 Gemini API key loaded:", true);
        console.log("📤 Sending test message to Gemini...\n");

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: "user",
                            parts: [
                                { text: SYSTEM_PROMPT },
                                { text: `User question: ${USER_MESSAGE}` }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        console.log("🔥 RAW GEMINI RESPONSE:");
        console.log(JSON.stringify(data, null, 2));

        const reply =
            data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!reply) {
            console.error("\n❌ Gemini returned no usable reply");
            return;
        }

        console.log("\n✅ FINAL AI REPLY:");
        console.log(reply);

    } catch (error) {
        console.error("\n❌ Error testing Gemini API:");
        console.error(error.message);
    }
}

// --------------------
// Run test
// --------------------
testGemini();
