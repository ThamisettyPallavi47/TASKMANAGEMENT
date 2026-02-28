


const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
console.log("🔥 CHAT ROUTE FILE LOADED (UPDATED VERSION)");


const router = express.Router();


/**
 * Initialize Gemini using API key from environment variables
 * Make sure GEMINI_API_KEY is loaded in server.js using dotenv
 */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
    try {
        const { message } = req.body;
        console.log('[CHAT API] Received message:', message);
        console.log("🔥 CHAT ROUTE HIT");


        // Validate input
        if (!message || typeof message !== 'string' || message.trim() === '') {
            console.log('[CHAT API] Invalid message');
            return res.status(400).json({
                error: 'Valid message is required',
                reply: 'Please enter a valid message.'
            });
        }

        // Validate API key
        if (!process.env.GEMINI_API_KEY) {
            console.error('[CHAT API] GEMINI_API_KEY missing');
            return res.status(500).json({
                error: 'Configuration error',
                reply: 'Server is not configured with a Gemini API key.'
            });
        }

        console.log('[CHAT API] Calling Gemini API...');

        // Initialize model (Gemini 2.5 Flash) with System Instruction
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction: `You are the StudiIn Assistant. You only answer questions about the StudiIn Task Management platform. 
            
            Platform Features & UI:
            - **Dashboard:** View task statistics (Total, In Progress, Pending, Completed), work progress charts, and a calendar.
            - **My Tasks:** View a list of all assigned tasks.
            - **Add Task:** Click the "+ Add New Task" button in the sidebar to open the form. Fields include Title, Description, Type (Personal/Admin), Start Date, and Deadline.
            - **Progress:** Visualizes task completion status.
            - **Analytics:** detailed charts of productivity.
            - **Settings:** Manage user profile.

            Rules:
            1. If a user asks "How do I add a task?", explain: "Click the '+ Add New Task' button in the sidebar, then fill out the form with the task details."
            2. If a user asks about external software (e.g., "How do I use Excel?"), politely reply: "I can only assist with the StudiIn Task Management platform."
            3. Keep answers concise, student-friendly, and specific to THIS website's UI.`,
            generationConfig: {
                temperature: 0.7
            }
        });

        // Generate response
        const result = await model.generateContent(message);
        const response = await result.response;

        // SAFELY extract text (Gemini 2.5 compatible)
        const reply =
            response?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!reply) {
            console.error('[CHAT API] Invalid Gemini response:', response);
            return res.status(500).json({
                error: 'Failed to get AI response',
                reply: 'AI did not return a valid response.'
            });
        }

        console.log('[CHAT API] Gemini response length:', reply.length);

        // Send reply to frontend
        res.json({ reply });

    } catch (error) {
        console.error('[CHAT API] Unexpected error:', error);
        res.status(500).json({
            error: 'Failed to get AI response',
            reply: 'Something went wrong while contacting the AI service.'
        });
    }
});

module.exports = router;

