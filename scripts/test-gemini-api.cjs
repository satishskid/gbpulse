#!/usr/bin/env node

/**
 * Test Gemini API Key Validity
 * Quick script to verify if the configured API key works
 */

const { GoogleGenerativeAI } = require("@google/genai");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

console.log('🧪 Testing Gemini API Key Validity...');
console.log('==========================================');

const apiKey = process.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    console.error('❌ Error: VITE_GEMINI_API_KEY not found in environment variables');
    console.log('\n💡 Solution: Make sure your .env file contains:');
    console.log('VITE_GEMINI_API_KEY=your_actual_api_key_here');
    process.exit(1);
}

console.log(`🔑 API Key found: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`);
console.log('🔍 Testing API connection...\n');

async function testGeminiAPI() {
    try {
        // Initialize the Gemini client
        const genAI = new GoogleGenerativeAI({
            apiKey: apiKey
        });

        // Test with a simple prompt
        console.log('📡 Making test API call...');
        
        const result = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'Hello! Please respond with "API test successful" to confirm the connection is working.'
        });

        const response = result.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (response) {
            console.log('✅ SUCCESS: API key is valid and working!');
            console.log(`📝 Response: ${response.trim()}`);
            console.log('\n🎉 Your Gemini API is ready to use!');
            
            // Test specific to your newsletter generation
            console.log('\n🧪 Testing newsletter generation format...');
            const newsletterTest = await genAI.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: 'Generate a simple JSON with: {"test": "newsletter format working", "status": "success"}'
            });
            
            const newsletterResponse = newsletterTest.candidates?.[0]?.content?.parts?.[0]?.text;
            console.log(`📋 Newsletter test: ${newsletterResponse}`);
            
        } else {
            console.log('⚠️  API responded but no content received');
            console.log('Raw response:', result);
        }

    } catch (error) {
        console.error('❌ ERROR: API key test failed');
        console.error('Details:', error.message);
        
        if (error.message.includes('API key not valid')) {
            console.log('\n💡 Solutions:');
            console.log('1. Check if your API key is correct');
            console.log('2. Verify the key is enabled in Google AI Studio');
            console.log('3. Make sure billing is set up if required');
            console.log('4. Try generating a new API key');
        }
        
        process.exit(1);
    }
}

testGeminiAPI();
