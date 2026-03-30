import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFileSync } from 'fs';

const envFile = readFileSync('.env.local', 'utf8');
const match = envFile.match(/GOOGLE_GEMINI_API_KEY=(.*)/);
const apiKey = match ? match[1].trim() : '';

console.log('API Key starts with:', apiKey.substring(0, 10));

const ai = new GoogleGenerativeAI(apiKey);
const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });

try {
    const r = await model.generateContent('Hi');
    console.log('AI Reply:', r.response.text());
} catch (error) {
    console.error('BIG ERROR', error.message);
}
