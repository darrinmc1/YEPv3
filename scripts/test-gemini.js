const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error('❌ CRITICAL: GOOGLE_GEMINI_API_KEY is missing from .env.local');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function listModels() {
    console.log('Checking available models for this API key...');
    try {
        // Note: The Node SDK for v0.24.1 exposes a specific way to list models if available,
        // but often it's not directly exposed on the client instance in older versions or some wrappers.
        // However, we can try a direct fetch or just try to instantiate a model.
        // Actually, the error message literally said "Call ListModels".
        // Yet, the SDK `genAI` instance doesn't have `listModels`. 
        // It's usually a static method or on a model manager. 
        // In @google/generative-ai, it is NOT exposed directly on the `GoogleGenerativeAI` class.

        // So we will try a different approach: just print the key details we found and failed models.
        // But wait, the previous log confirmed the key is loaded.

        // We will try a raw fetch if SDK doesn't support it easily.
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            console.log('✅ Found available models:');
            data.models.forEach(m => console.log(` - ${m.name} (${m.supportedGenerationMethods})`));
        } else {
            console.error('❌ No models found or error listing models:', data);
        }

    } catch (error) {
        console.error('❌ Error listing models:', error);
    }
}

listModels();
