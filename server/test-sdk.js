require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testSdk() {
    console.log('--- Testing Gemini SDK ---');
    console.log('SDK Version:', require('@google/generative-ai/package.json').version);

    if (!process.env.GEMINI_API_KEY) {
        console.error('❌ Missing GEMINI_API_KEY');
        return;
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // List of models to try
    const modelsToTry = [
        "gemini-2.5-flash", // The requested one
        "gemini-1.5-flash", // Fallback 1
        "gemini-pro"        // Fallback 2
    ];

    for (const modelName of modelsToTry) {
        console.log(`\n👉 Testing model: "${modelName}"...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello, are you there?");
            const response = await result.response;
            const text = response.text();
            console.log(`✅ SUCCESS with ${modelName}!`);
            console.log(`   Response: "${text}"`);
            return; // Exit on first success
        } catch (error) {
            console.error(`❌ FAILED with ${modelName}`);
            console.error(`   Error: ${error.message}`);
            // console.error(JSON.stringify(error, null, 2));
        }
    }
}

testSdk();
